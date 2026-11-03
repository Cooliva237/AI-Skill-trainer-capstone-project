/** Browser adaptation of the supplied fitness trainer's angle/state-machine approach.
 * See docs/licenses/fitness-trainer-MIT.txt. Thresholds are prototype heuristics,
 * not a clinical or biomechanical validation of bench press technique.
 */
export type Landmark = { x: number; y: number; visibility?: number };
export type Side = 'left' | 'right';
export type Phase = 'setup' | 'ready' | 'lowering' | 'pressing';
export type Reading = { angle: number | null; valid: boolean; message: string };
export const SETTINGS = { top: 155, bottom: 100, visibility: 0.65, dwellMs: 180, minRepMs: 1000, maxRepMs: 15000, maxGapMs: 500 };
export const joints = { left: [11, 13, 15, 23], right: [12, 14, 16, 24] } as const;

export function angleAt(a: Landmark, b: Landmark, c: Landmark): number | null {
  const ux = a.x - b.x, uy = a.y - b.y, vx = c.x - b.x, vy = c.y - b.y;
  const length = Math.hypot(ux, uy) * Math.hypot(vx, vy);
  if (!Number.isFinite(length) || length < 1e-8) return null;
  return Math.acos(Math.max(-1, Math.min(1, (ux * vx + uy * vy) / length))) * 180 / Math.PI;
}

export function readBenchPose(points: Landmark[], side: Side, width: number, height: number): Reading {
  const indices = joints[side];
  const visible = indices.every(i => {
    const p = points[i];
    return p && Number.isFinite(p.x) && Number.isFinite(p.y) &&
      p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1 && (p.visibility ?? 0) >= SETTINGS.visibility;
  });
  if (!visible || width <= 0 || height <= 0) return { angle: null, valid: false, message: 'Keep the selected shoulder, elbow, wrist and hip visible.' };
  // Scale normalized x/y to pixels BEFORE measuring angles (avoids aspect-ratio distortion).
  const [shoulder, elbow, wrist, hip] = indices.map(i => ({ x: points[i].x * width, y: points[i].y * height }));
  const torso = Math.hypot(shoulder.x - hip.x, shoulder.y - hip.y);
  const angle = angleAt(shoulder, elbow, wrist);
  if (torso < width * 0.08 || angle === null) return { angle: null, valid: false, message: 'Move the camera closer and show your whole upper body.' };
  if (Math.abs(shoulder.y - hip.y) > torso * 0.5) return { angle, valid: false, message: 'Use a level side view with your torso lying along the bench.' };
  if (wrist.y > shoulder.y - torso * 0.08) return { angle, valid: false, message: 'Keep the pressing hand visible above your torso.' };
  return { angle, valid: true, message: 'Tracking selected arm.' };
}

export type Counter = {
  phase: Phase; reps: number; angle: number | null; candidate: 'top' | 'bottom' | null;
  candidateSince: number; lastAt: number | null; startedAt: number | null;
  lastRepSeconds: number | null; message: string;
};
export function newCounter(): Counter {
  return { phase: 'setup', reps: 0, angle: null, candidate: null, candidateSince: 0, lastAt: null, startedAt: null, lastRepSeconds: null, message: 'Start with the selected arm extended above your chest.' };
}
export function interruptCounter(state: Counter, message: string): Counter {
  return { ...newCounter(), reps: state.reps, lastRepSeconds: state.lastRepSeconds, message };
}
export function stepCounter(previous: Counter, reading: Reading, now: number): Counter {
  if (!reading.valid || reading.angle === null || !Number.isFinite(reading.angle) || !Number.isFinite(now)) {
    return interruptCounter(previous, reading.message);
  }
  let state = { ...previous };
  if (state.lastAt !== null && (now <= state.lastAt || now - state.lastAt > SETTINGS.maxGapMs)) {
    state = interruptCounter(state, 'Tracking interrupted. Start again at the top.');
  }
  if (state.startedAt !== null && now - state.startedAt > SETTINGS.maxRepMs) {
    state = interruptCounter(state, 'Movement timed out. Start again at the top.');
  }
  // Exponential smoothing reduces landmark jitter; stable endpoint dwell is also required.
  state.angle = state.angle === null ? reading.angle : state.angle * 0.5 + reading.angle * 0.5;
  state.lastAt = now;
  const zone = state.angle >= SETTINGS.top ? 'top' : state.angle <= SETTINGS.bottom ? 'bottom' : null;
  if (zone !== state.candidate) { state.candidate = zone; state.candidateSince = now; }
  const stable = zone !== null && now - state.candidateSince >= SETTINGS.dwellMs;
  if (state.phase === 'setup') {
    state.message = 'Extend your arm above your chest to set the starting position.';
    if (stable && zone === 'top') { state.phase = 'ready'; state.message = 'Starting position found. Lower with control.'; }
  } else if (state.phase === 'ready') {
    state.message = 'Lower with control to begin a repetition.';
    if (state.angle < SETTINGS.top - 8) { state.phase = 'lowering'; state.startedAt = now; }
  } else if (state.phase === 'lowering') {
    state.message = 'Lower with control. Stay within your comfortable range.';
    if (stable && zone === 'bottom') { state.phase = 'pressing'; state.message = 'Lowered position detected. Press back up.'; }
    else if (stable && zone === 'top') { state.phase = 'ready'; state.startedAt = null; state.message = 'Partial movement: no rep counted.'; }
  } else {
    state.message = 'Press back to the starting position.';
    if (stable && zone === 'top') {
      const duration = now - (state.startedAt ?? now);
      if (duration >= SETTINGS.minRepMs) {
        state.reps += 1; state.lastRepSeconds = Math.round(duration / 100) / 10;
        state.message = 'Rep counted. Stay controlled on the next repetition.';
      } else { state.message = 'Movement too fast to count reliably. Reset at the top.'; }
      state.phase = 'ready'; state.startedAt = null;
    }
  }
  return state;
}
