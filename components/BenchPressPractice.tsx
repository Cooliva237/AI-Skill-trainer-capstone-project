'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PoseLandmarker } from '@mediapipe/tasks-vision';
import { RequireAuth } from '@/components/AuthGate';
import { useApp } from '@/components/AppProvider';
import { primaryButton, secondaryButton } from '@/components/styles';
import { interruptCounter, joints, newCounter, readBenchPose, stepCounter, type Counter, type Side } from '@/lib/pose/bench-press';
import { loadBenchSessions, saveBenchSession, type BenchSession } from '@/lib/pose/sessions';
import { loadCloudSessions, saveCloudSession } from '@/lib/firebase/data';
import { cloudError } from '@/lib/firebase/client';

export function BenchPressPractice() {
  return <RequireAuth><Practice /></RequireAuth>;
}
function Practice() {
  const { session, storageMode } = useApp();
  // Keyed on the account to release the camera and discard unsaved data on account changes.
  return session ? <Trainer key={session.uid ?? session.email} email={session.email} uid={session.uid} cloud={storageMode === 'firebase'} /> : null;
}
function Trainer({ email, uid, cloud }: { email: string; uid?: string; cloud: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<PoseLandmarker | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const frame = useRef(0);
  const generation = useRef(0);
  const active = useRef(false);
  const mounted = useRef(true);
  const saveLock = useRef(false);
  const objectUrl = useRef<string | null>(null);
  const counter = useRef(newCounter());
  const seconds = useRef(0);
  const sessionId = useRef('');
  const [view, setView] = useState<Counter>(newCounter);
  const [side, setSide] = useState<Side>('left');
  const [source, setSource] = useState<'camera' | 'video'>('camera');
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'idle' | 'loading' | 'preview' | 'running' | 'finished'>('idle');
  const [hasPreview, setHasPreview] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<BenchSession[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const busy = mode === 'loading' || mode === 'running' || mode === 'preview';

  const release = useCallback(() => {
    active.current = false;
    generation.current += 1;
    cancelAnimationFrame(frame.current);
    stream.current?.getTracks().forEach(track => { track.onended = null; track.stop(); });
    stream.current = null;
    if (video.current) { video.current.pause(); video.current.srcObject = null; video.current.removeAttribute('src'); video.current.load(); }
    engine.current?.close(); engine.current = null;
    if (objectUrl.current) { URL.revokeObjectURL(objectUrl.current); objectUrl.current = null; }
  }, []);
  const finish = useCallback(() => {
    release();
    setHasPreview(false);
    setView(counter.current); setElapsed(Math.round(seconds.current)); setMode('finished');
  }, [release]);
  useEffect(() => {
    let live = true;
    mounted.current = true;
    Promise.resolve().then(async () => {
      try {
        const sessions = cloud ? await loadCloudSessions(uid!) : loadBenchSessions(email);
        if (live) setHistory(sessions);
      } catch (cause) { if (live) setError(`Could not read practice history: ${cloudError(cause)}`); }
    });
    const hide = () => { if (document.hidden && active.current) finish(); };
    document.addEventListener('visibilitychange', hide);
    return () => { live = false; mounted.current = false; document.removeEventListener('visibilitychange', hide); release(); };
  }, [email, uid, cloud, finish, release]);

  async function start(cameraOnly = false) {
    if (busy || active.current || (source === 'video' && !file)) return;
    if (!window.isSecureContext || !crypto.randomUUID) {
      setError('Open this app at http://localhost:3000 on this Chromebook, or use an HTTPS website. Camera practice cannot start from an insecure network address.');
      return;
    }
    release();
    const token = generation.current;
    active.current = true;
    counter.current = newCounter(); seconds.current = 0;
    sessionId.current = crypto.randomUUID();
    setView(counter.current); setElapsed(0); setSaved(false); setError(''); setHasPreview(false); setMode('loading');
    setLoadingStage(source === 'camera' ? 'Waiting for camera permission. Check the browser prompt.' : 'Opening your video…');
    let localEngine: PoseLandmarker | null = null;
    let localStream: MediaStream | null = null;
    try {
      const el = video.current;
      if (!el) throw new Error('Video screen is unavailable. Reload the page.');
      if (source === 'camera') {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access requires localhost or an HTTPS website in a supported browser.');
        localStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 20 }, facingMode: 'user' } });
        if (generation.current !== token) { localStream.getTracks().forEach(t => t.stop()); return; }
        stream.current = localStream;
        localStream.getVideoTracks().forEach(t => { t.onended = () => { setError('Camera disconnected. Start a new session to retry.'); finish(); }; });
        el.srcObject = localStream;
      } else {
        objectUrl.current = URL.createObjectURL(file!); el.src = objectUrl.current;
      }
      await el.play();
      if (generation.current !== token) return;
      setHasPreview(true);
      if (cameraOnly) {
        setMode('preview');
        setView({ ...newCounter(), message: 'Camera is working. Stop this test, then start a practice session to enable pose tracking.' });
        return;
      }
      // Keep recorded clips at their beginning while the model loads.
      if (source === 'video') { el.pause(); el.currentTime = 0; }
      setLoadingStage('Video is ready. Loading the pose model…');
      const { FilesetResolver, PoseLandmarker } = await import('@mediapipe/tasks-vision');
      const fileset = await FilesetResolver.forVisionTasks('/pose/wasm');
      if (generation.current !== token) return;
      localEngine = await PoseLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: '/pose/pose_landmarker_lite.task', delegate: 'CPU' },
        runningMode: 'VIDEO', numPoses: 1,
        minPoseDetectionConfidence: 0.6, minPosePresenceConfidence: 0.6, minTrackingConfidence: 0.6,
      });
      if (generation.current !== token) { localEngine.close(); return; }
      engine.current = localEngine;
      if (source === 'video') await el.play();
      if (generation.current !== token) return;
      setMode('running');
      let lastVideoTime = -1, lastTick = -Infinity, lastDisplay = -Infinity;
      const startTime = performance.now();
      const tick = (now: number) => {
        if (generation.current !== token) return;
        try {
          if (el.readyState >= 2 && el.currentTime !== lastVideoTime && now - lastTick >= 65) {
            lastVideoTime = el.currentTime; lastTick = now;
            const result = localEngine!.detectForVideo(el, now);
            const points = result.landmarks[0] ?? [];
            const reading = readBenchPose(points, side, el.videoWidth, el.videoHeight);
            const timestamp = source === 'video' ? el.currentTime * 1000 : now;
            counter.current = stepCounter(counter.current, reading, timestamp);
            seconds.current = source === 'video' ? el.currentTime : (now - startTime) / 1000;
            const surface = canvas.current;
            if (surface) {
              surface.width = el.videoWidth; surface.height = el.videoHeight;
              const context = surface.getContext('2d');
              if (context) {
                context.clearRect(0, 0, surface.width, surface.height);
                const ids = joints[side];
                context.strokeStyle = reading.valid ? '#6ee7b7' : '#fbbf24';
                context.fillStyle = context.strokeStyle; context.lineWidth = 5;
                for (const [a, b] of [[ids[0], ids[1]], [ids[1], ids[2]], [ids[0], ids[3]]]) {
                  if ((points[a]?.visibility ?? 0) < 0.65 || (points[b]?.visibility ?? 0) < 0.65) continue;
                  context.beginPath(); context.moveTo(points[a].x * surface.width, points[a].y * surface.height);
                  context.lineTo(points[b].x * surface.width, points[b].y * surface.height); context.stroke();
                }
                for (const id of ids) {
                  if ((points[id]?.visibility ?? 0) < 0.65) continue;
                  context.beginPath(); context.arc(points[id].x * surface.width, points[id].y * surface.height, 7, 0, Math.PI * 2); context.fill();
                }
              }
            }
            if (now - lastDisplay >= 120) { setView({ ...counter.current }); setElapsed(Math.round(seconds.current)); lastDisplay = now; }
          }
          frame.current = requestAnimationFrame(tick);
        } catch {
          setError('Pose tracking stopped unexpectedly. Check the camera or video and start a new session.'); finish();
        }
      };
      frame.current = requestAnimationFrame(tick);
    } catch (cause) {
      if (generation.current !== token) return;
      release(); setHasPreview(false); setMode('idle');
      const name = cause instanceof Error ? cause.name : '';
      setError(name === 'NotAllowedError' ? 'Camera permission was denied. In Chrome, open the controls beside the address bar → Site settings → Camera → Allow. Also check Chromebook Settings → Privacy and security → Privacy controls → Camera access, then reload.' : name === 'NotFoundError' ? 'No camera was found. Connect one or choose a recorded video.' : name === 'NotReadableError' ? 'The camera could not be opened. Close Camera, Meet, Zoom or other apps using it, check the privacy shutter, then retry.' : cause instanceof Error ? `${cause.message} If Test camera works but practice does not, run npm run setup:pose in Terminal and retry.` : 'Could not start tracking. Please retry.');
    }
  }
  async function save() {
    if (saved || saveLock.current || mode !== 'finished' || view.reps < 1) return;
    saveLock.current = true; setSaving(true);
    try {
      const record: BenchSession = { id: sessionId.current, exercise: 'bench-press', date: new Date().toISOString(), reps: view.reps, seconds: elapsed, side, source };
      if (cloud) {
        await saveCloudSession(uid!, record);
        if (mounted.current) setHistory(items => [record, ...items.filter(item => item.id !== record.id)].slice(0, 20));
      } else {
        setHistory(saveBenchSession(email, record));
      }
      if (mounted.current) { setSaved(true); setError(''); }
    } catch (cause) { if (mounted.current) setError(`Practice was not saved: ${cloudError(cause)} Keep this screen open and retry.`); }
    finally { saveLock.current = false; if (mounted.current) setSaving(false); }
  }
  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <Link href="/skills/gym" className="text-sm font-semibold text-muted">← Bench press lessons</Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral">Gym & Fitness · Practice lab</p><h1 className="mt-2 font-display text-4xl md:text-5xl">Make every rep deliberate.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted">Bench press movement tracking with a side-view camera. Start with an unloaded practice movement.</p></div>
        <span className="rounded-full border border-line bg-raised px-4 py-2 text-xs font-semibold">Prototype · one visible arm</span>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.65fr_1fr]">
        <section className="overflow-hidden rounded-3xl bg-navy text-white" aria-label="Camera preview">
          <div className="flex justify-between px-5 py-4 text-xs"><span>{source === 'camera' ? 'LIVE CAMERA' : 'RECORDED VIDEO'}</span><span>{mode === 'running' ? '● TRACKING' : mode === 'preview' ? 'CAMERA TEST' : mode === 'loading' ? 'STARTING…' : 'CAMERA OFF'}</span></div>
          {mode === 'loading' && <p role="status" className="px-5 pb-3 text-sm">{loadingStage}</p>}
          <div className="relative min-h-64 bg-black/25">
            <video ref={video} muted playsInline className="block w-full" onEnded={finish} onError={() => { if (busy) { setError('This video could not be played. Try a browser-compatible MP4 or WebM file.'); finish(); } }} onSeeking={() => { counter.current = interruptCounter(counter.current, 'Video moved. Reset at the top.'); }} />
            <canvas ref={canvas} className={`pointer-events-none absolute inset-0 h-full w-full ${mode === 'running' ? '' : 'hidden'}`} aria-hidden="true" />
            {!hasPreview && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center"><span className="text-4xl" aria-hidden="true">◎</span><p className="font-display text-2xl">{mode === 'loading' ? 'Getting your tracker ready' : mode === 'finished' ? 'Practice finished' : 'Your practice space'}</p><p className="max-w-sm text-sm text-white/70">{mode === 'loading' ? loadingStage : 'Place a level camera beside the bench. Keep the near arm and hip in view.'}</p></div>}
          </div>
          <div className="px-5 py-5"><p className="text-xs uppercase tracking-widest text-white/60">Movement cue</p><p className="mt-2 text-lg" role="status">{view.message}</p></div>
        </section>
        <section className="space-y-4" aria-label="Practice controls">
          <div className="grid grid-cols-3 gap-3">
            {[['Reps', String(view.reps)], ['Elbow', view.angle === null ? '—' : `${Math.round(view.angle)}°`], ['Time', `${elapsed}s`]].map(([label, value]) => <div key={label} className="rounded-2xl border border-line bg-raised p-4"><p className="text-xs text-muted">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}
          </div>
          <div className="rounded-3xl border border-line bg-raised p-5">
            <h2 className="font-display text-xl">Set up your view</h2>
            <label className="mt-4 block text-sm font-semibold">Video source<select value={source} disabled={busy || mode === 'finished'} onChange={e => setSource(e.target.value as 'camera' | 'video')} className="mt-2 block w-full rounded-xl border border-line bg-paper p-3"><option value="camera">Camera</option><option value="video">Recorded video</option></select></label>
            {source === 'video' && <label className="mt-3 block text-sm">Choose a side-view clip<input type="file" accept="video/mp4,video/webm,video/quicktime" disabled={busy || mode === 'finished'} onChange={e => setFile(e.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm" /></label>}
            <label className="mt-4 block text-sm font-semibold">Arm nearest the camera<select value={side} disabled={busy || mode === 'finished'} onChange={e => setSide(e.target.value as Side)} className="mt-2 block w-full rounded-xl border border-line bg-paper p-3"><option value="left">My left arm</option><option value="right">My right arm</option></select></label>
            <div className="mt-5 flex flex-wrap gap-2">
              {mode === 'preview' ? <button className={secondaryButton} onClick={() => { release(); setHasPreview(false); setMode('idle'); setView(newCounter()); }}>Stop camera test</button> : busy ? <button className={secondaryButton} onClick={finish}>{mode === 'loading' ? 'Cancel' : 'Finish session'}</button> : mode === 'finished' ? <><button className={primaryButton} disabled={saving || saved || view.reps < 1} onClick={save}>{saving ? 'Saving…' : saved ? (cloud ? 'Saved to Firebase' : 'Saved on this device') : 'Save practice'}</button><button disabled={saving} className={secondaryButton} onClick={() => { counter.current = newCounter(); setView(counter.current); setElapsed(0); setMode('idle'); setSaved(false); setError(''); }}>New session</button></> : <><button className={primaryButton} disabled={source === 'video' && !file} onClick={() => start()}>Start practice</button>{source === 'camera' && <button className={secondaryButton} onClick={() => start(true)}>Test camera</button>}</>}
            </div>
          </div>
          {error && <p role="alert" className="rounded-2xl border border-coral bg-raised p-4 text-sm">{error}</p>}
        </section>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <article className="rounded-3xl border border-line bg-raised p-5"><h2 className="font-display text-xl">01 · Set the camera</h2><p className="mt-2 text-sm leading-6 text-muted">Place it level, beside the bench, with one person in frame. Show the shoulder, elbow, wrist and hip on the selected side.</p></article>
        <article className="rounded-3xl border border-line bg-raised p-5"><h2 className="font-display text-xl">02 · Complete a cycle</h2><p className="mt-2 text-sm leading-6 text-muted">Begin extended, lower, then press back up. Partial movements and lost tracking do not count. Do not change your safe range just to earn a rep.</p></article>
        <article className="rounded-3xl border border-line bg-raised p-5"><h2 className="font-display text-xl">03 · Review your practice</h2><p className="mt-2 text-sm leading-6 text-muted">This estimates arm movement, not safe technique. It cannot verify bar contact, grip, load or a spotter. Practice results do not automatically complete lessons.</p></article>
      </div>
      <section className="mt-8 rounded-3xl border border-line bg-raised p-6"><h2 className="font-display text-2xl">Recent practice</h2><p className="mt-1 text-sm text-muted">{cloud ? 'Your latest 20 sessions saved to Firebase. Reopen this page to refresh.' : 'Last 20 saved sessions for your account in this browser.'}</p>{history.length === 0 ? <p className="mt-5 text-sm">Your saved sessions will appear here.</p> : <ul className="mt-4 divide-y divide-line">{history.map(item => <li key={item.id} className="flex flex-wrap justify-between gap-2 py-4 text-sm"><span>{new Date(item.date).toLocaleString()} · {item.source === 'camera' ? 'Camera' : 'Video'}</span><span className="font-semibold">{item.reps} reps · {item.seconds}s · {item.side} arm</span></li>)}</ul>}</section>
    </div>
  );
}
