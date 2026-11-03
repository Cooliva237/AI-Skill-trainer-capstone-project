import { mkdir, cp, access, writeFile, rename } from 'node:fs/promises';
const target = new URL('../public/pose/', import.meta.url);
await mkdir(target, { recursive: true });
await cp(new URL('../node_modules/@mediapipe/tasks-vision/wasm/', import.meta.url), new URL('wasm/', target), { recursive: true });
const model = new URL('pose_landmarker_lite.task', target);
try { await access(model); }
catch {
  const url = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
  const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new Error(`Pose model download failed: ${response.status}. Check your connection and rerun npm run setup:pose.`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 1000000) throw new Error('Pose model download was incomplete.');
  const temp = new URL('pose_landmarker_lite.task.tmp', target);
  await writeFile(temp, bytes); await rename(temp, model);
}
console.log('Pose model and matching WASM runtime are ready in public/pose.');
