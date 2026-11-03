# Bench press practice integration

## What was added

Open Gym & Fitness → Bench Press → Open practice lab, or visit
`http://localhost:3000/practice/bench-press` after signing in.

This is a browser adaptation of the provided fitness-trainer-pose-estimation
repository's MediaPipe landmark → joint angle → state machine → repetition
approach. The original Flask/OpenCV server is not run by this application.
The supplied Python app captures the server's camera; this implementation
uses the visitor's browser camera, or a local recorded clip, instead.
The new bench press logic is TypeScript and is intentionally more restrictive
than counting a single transition between two angles. The supplied MIT notice
is retained at `docs/licenses/fitness-trainer-MIT.txt` (Yakup Zengin, 2024).

## Start on a Chromebook with Linux enabled

1. Extract this ZIP in Linux files. Open Terminal in its `ios-capstone-project-main` folder.
2. Use an installed supported Node.js version (Node 22 or 24 LTS is suitable).
3. Run `npm install`.
4. Run `npm run dev`.
5. Open http://localhost:3000 in Chrome and create a TEST account or log in.
6. Go to Gym & Fitness → Open practice lab.
7. Choose Camera or Recorded video. For a file, choose a side-view MP4/WebM
   that Chrome can play. MOV playback depends on its codec.
8. Select your anatomical left/right arm nearest the camera. The preview is not mirrored.
9. Read and check the setup acknowledgement, then click Start practice.
10. Allow camera access if prompted. Begin at the extended position, perform
    an unloaded practice cycle within your comfortable range, then finish.
11. Click Save practice. At least one counted rep is needed to save.

The predev/prebuild scripts automatically copy the exact installed MediaPipe
WASM runtime and download the versioned lite model into `public/pose/`.
Internet access is required for installation and the first model download.
Run `npm run setup:pose` to retry a failed setup. The generated folder is ignored
by Git and should be generated during a deployment build. There are no cloud
credentials or private keys in this addition.

Camera access requires localhost or HTTPS. On a hosted site, use HTTPS.
School-managed Chromebook camera permissions may need administrator changes.
If live camera access fails, try a recorded video first.

## User flow and lesson connection

- Authenticated users can open practice from the gym path or any unlocked lesson.
- Camera and selected-arm controls are fixed during the session and review so
  the saved source and side always match the measurement.
- Finishing, leaving the page, logging out, or hiding the tab releases the camera.
- Cancelling during startup cannot restart the camera when an async load completes.
- Uploaded clips stay in the browser and are played once at normal speed.
- Practice is optional. It does NOT auto-complete lessons or unlock the next one.
- Save stores only date, repetition count, elapsed seconds, selected side, source,
  exercise identifier and an idempotent session ID. No video or landmarks are stored.
- In local demo mode, the last 20 summaries are saved under
  `ast-bench-sessions:<email>` in localStorage. Clearing browser data removes them.
- In Firebase mode, summaries are saved under `users/<uid>/benchSessions/<id>`;
  the latest 20 are shown, while older cloud records remain stored. Firebase Auth
  handles accounts and Firestore stores lesson progress under the authenticated UID.
- See `CAMERA_AND_FIREBASE_SETUP.md` to configure your own Firebase project.
  The ZIP contains no project credentials. Old local accounts/data are not imported.

## What the tracker actually measures

MediaPipe supplies the pose landmarks. `readBenchPose` uses the selected shoulder,
elbow, wrist and hip, rejects low-confidence/out-of-frame landmarks, and scales
normalized x/y by video width/height before calculating a 2D elbow angle.
A level, approximately horizontal torso and a wrist above the shoulder are
required. These checks reject common unsuitable views but are NOT an exercise
classifier or proof that someone is performing a bench press.

The state machine requires:

1. Stable top angle >=155 degrees to arm the counter.
2. A descent below 147 degrees to start a movement timer.
3. Stable bottom angle <=100 degrees.
4. Return to a stable top angle >=155 degrees to count once.

Endpoints must persist for 180ms after smoothing. A movement must last at least
1 second and no more than 15 seconds. Invalid tracking immediately discards the
unfinished cycle; a timestamp gap over 500ms also requires a fresh top position.
Completed reps are retained. Holding the top, a partial descent, or starting at
the bottom cannot count as a full repetition. Thresholds are prototype tuning
parameters in `lib/pose/bench-press.ts`, not universal coaching targets.

Do not force a deeper movement or lock out harder just to satisfy a threshold.
The tracker cannot verify a bar touching the chest, load, grip, spotting,
shoulder-blade position, pain, or safe technique. It can miscount with occlusion,
poor light, a moving/tilted camera or other similar arm movements. No form score,
medical assessment, or skill mastery claim is produced.

## Files to understand

| File | Responsibility |
| --- | --- |
| `components/BenchPressPractice.tsx` | Camera/video lifecycle, model loading, overlay, UI, save/review |
| `lib/pose/bench-press.ts` | Landmark checks, geometry, smoothing and rep state machine |
| `lib/pose/sessions.ts` | Local demo summary persistence |
| `lib/firebase/data.ts` | Firestore progress transactions and practice summaries |
| `app/practice/bench-press/page.tsx` | Next.js route |
| `components/LessonView.tsx` | Optional practice link from unlocked lessons |
| `app/skills/gym/page.tsx` | Practice entry from the gym skill page |
| `scripts/setup-pose.mjs` | Prepare matching WASM files and the pose model |
| `tests/bench-press.test.ts` | Synthetic landmark and counter tests |
| `tests/bench-sessions.test.ts` | Persistence, isolation, deduplication, failure tests |

## Verification and real-world acceptance

Run `npm test`, `npm run lint`, and `npm run build`.
All 23 automated counting/geometry/storage/data tests and ESLint passed. The production
build and TypeScript check passed. Browser automation was attempted but blocked
by this environment’s browser process/socket restrictions, so live camera use,
recorded-video inference and visual browser behavior have NOT been verified here.
Synthetic tests validate the counting rules, not real-camera accuracy.
Six Firestore security-rule tests are included but could not run here because the
Firebase emulator requires Java 21 and the environment supplies Java 17. Run
`npm run test:rules` with Java 21+ before deployment. Live Firebase sign-in, saves
and cross-device synchronization still require your project configuration and testing.
Before presenting this as reliable exercise assessment, compare manually labeled
side-view bench press clips against counts across different bodies, lighting,
clothing, occlusion, speeds and devices. Include partial movements, standing
presses, tracking loss and a second person entering frame. Record false positives,
missed reps and performance before changing thresholds.

The supplied Next.js 16.4.0 build emitted a security advisory. Next.js and its
matching ESLint configuration were patched to 16.4.2, the Next.js fix version
reported by npm audit. Other existing application dependencies are retained.

## Official API reference

https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker/web_js

The model is the versioned MediaPipe pose_landmarker_lite float16/1 asset from
Google's mediapipe-models bucket. The installed `@mediapipe/tasks-vision` package
is pinned to 0.10.32; the setup script copies its matching WASM files locally.
Detection runs on the browser's main thread, throttled to about 15 frames/second
with the lite model and CPU delegate. Low-powered devices may run slower. A
worker-based inference pipeline is a future performance improvement.
