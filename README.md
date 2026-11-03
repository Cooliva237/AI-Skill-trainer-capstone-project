# AI Skill Trainer

A practice path for real-world skills. The current path is the bench press.

Supports Firebase Authentication and Cloud Firestore for accounts, profiles,
lesson progress and bench press summaries. With no configuration it runs in a
clearly labeled local demo mode. See [the camera and Firebase setup guide](docs/CAMERA_AND_FIREBASE_SETUP.md).

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Other commands

```bash
npm run lint
npm run build
```

## Where things live

- `app/` — pages (landing, login, dashboard, skills, skill tree, lesson, progress)
- `components/` — shared UI
- `data/` — skill list and bench press lesson text
- `lib/auth.ts` — legacy local demo sign-in (test accounts only)
- `lib/progress.ts` — lesson progression rules and local demo storage
- `lib/firebase/` — Firebase setup, cloud progress and practice storage
- `firestore.rules` — user ownership and data validation rules
- `types/` — `Skill`, `Lesson`, and `UserProgress`

## Bench press pose practice

This version adds a browser-based bench press practice lab with camera or recorded
video input, joint overlays, full-cycle rep counting and saved summaries.
Use **Test camera** to check camera access before loading the pose model.
Open Gym & Fitness → Open practice lab after logging in.

Run `npm install` then `npm run dev`; the startup script prepares the pose model
and WASM files automatically. See [the integration and testing guide](docs/BENCH_PRESS_INTEGRATION.md)
for Chromebook steps, limitations, source attribution and a file-by-file map.

Run `npm test` for the counting/storage tests. Practice does not auto-complete lessons.
To connect Firebase, copy `.env.example` to `.env.local`, enter your web app's
configuration, enable Email/Password Authentication, create Firestore and publish
`firestore.rules`. Restart the app. Your project has not been configured or deployed
by this ZIP. Legacy local accounts and saved data are not automatically migrated.

`npm run test:rules` runs the included security-rule tests against a disposable
local emulator (requires Java 21+). It does not connect to a production project.
