# Camera and Firebase setup — Chromebook

This version includes a separate camera test and Firebase-ready code. It has NOT
created, connected or deployed a Firebase project for your team.

## 1. Open the updated project

Copy `AI_Skill_Trainer_Firebase.zip` from Downloads into Linux files. Stop the old
server with Ctrl+C. Extract into a new folder so your existing project stays intact:

```bash
cd ~
unzip AI_Skill_Trainer_Firebase.zip -d AI_Skill_Trainer_Firebase
cd ~/AI_Skill_Trainer_Firebase/ios-capstone-project-main
npm install
npm run dev
```

Use Node 22 or 24. The first startup downloads the pose model and prepares its
matching WASM runtime. Open the Local address printed in Terminal, usually
http://localhost:3000. Keep Terminal running.

With no .env.local configuration, a banner says Local demo mode. This lets you
test the camera before creating Firebase. Use test passwords in local demo mode.

## 2. Get the camera working first

1. Log in to the app, then open Gym & Fitness → Open practice lab.
2. Select Camera as the video source.
3. Click **Test camera**. This does not load the pose model or count repetitions.
4. Click Allow in Chrome's camera permission prompt. You should see a live preview.
5. Click Stop camera test, select the visible arm, check the setup acknowledgment,
   then click Start practice. The camera preview appears before pose tracking loads.

If the camera does not open:

- Confirm that the Chromebook Camera app can show video, then close it.
- Open any physical camera shutter or camera switch.
- Chromebook Settings → Privacy and security → Privacy controls → enable Camera access.
- In Chrome, use the controls beside the address bar → Site settings → Camera → Allow.
  You can also open `chrome://settings/content/camera` and check the selected camera
  and whether localhost is blocked. Reload the app after changing permissions.
- Close Camera, Meet, Zoom and other tabs/apps using the camera.
- Use localhost on this Chromebook or HTTPS on a hosted website. An HTTP address
  such as `http://192.168...` on another device will not provide normal camera access.
- For a school-managed restriction, ask the administrator to enable camera access.

If Test camera works but Start practice fails, the camera is not the failing part.
Stop the server with Ctrl+C and run:

```bash
npm run setup:pose
npm run dev
```

Watch the startup status and error text. The model and runtime must be available
under `public/pose`. Do not delete that folder while the server is running.
If the preview is visible but no reps count, show the selected shoulder, elbow,
wrist and hip in a level side view. Start extended, lower, then press back up.
Do not force a movement to satisfy the counter. Counting is experimental and does
not verify safe technique. A recorded side-view video is also supported.

## 3. Create your team's Firebase project

1. Open https://console.firebase.google.com/ and sign in with the Google account
   that will own your team's project.
2. Create a project or select your existing capstone project.
3. In Project settings → General → Your apps, register a Web app using the `</>` icon.
4. Name it AI Skill Trainer. Find the Firebase configuration object for that web app.
5. Keep the `apiKey`, `authDomain`, `projectId`, and `appId` values available for step 6.

These are web app configuration values. Do not use a service-account JSON file,
private key, Google password, or Admin SDK credential in this app or in chat.
The web configuration identifies the project; Authentication and security rules
control access to users' data.

## 4. Enable Authentication

1. Open Authentication → Get started (if shown).
2. Open Sign-in method / Sign-in providers.
3. Enable **Email/Password**, then save. Email link sign-in is not needed.
4. In Authentication → Settings → Authorized domains, add `localhost` for local
   development if it is absent. Later add the deployed website's hostname.

Firebase Authentication will handle account credentials. The application does not
write passwords into Firestore. Local demo accounts are separate: create a new
Firebase account after enabling Firebase mode. Old local progress and practice
history remain in that browser and are not automatically transferred.

## 5. Create and secure Firestore

1. Open Firestore Database → Create database.
2. Choose Standard edition and the `(default)` database for this integration.
3. Select the database location deliberately; use a region appropriate for your team.
4. Choose production/locked mode, then create the database.
5. Open the Rules tab.
6. Open the included `firestore.rules` in your code editor. Copy the ENTIRE file
   into the Rules editor, replacing the starter rules, then click Publish.

Do not replace these rules with `allow read, write: if true`. The included rules
allow access only when the authenticated UID matches the user in the document path
and validate the fields that can be saved. Other collections are denied by default.
They protect ownership and data shape; they do not prove that client-reported
repetitions or lesson completion represent actual physical performance.

You do not need to manually create user documents. The app creates them as users
sign in, complete lessons and save practice sessions.

## 6. Connect your local app

Stop the development server with Ctrl+C. In the project folder, run:

```bash
cp .env.example .env.local
nano .env.local
```

Replace the placeholders with the matching values from your Firebase web config:

```dotenv
NEXT_PUBLIC_DATA_MODE=firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-apiKey-value
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-authDomain-value
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-projectId-value
NEXT_PUBLIC_FIREBASE_APP_ID=your-appId-value
```

Paste values only: no JavaScript object braces, commas, or `const firebaseConfig`.
In nano, save with Ctrl+O, Enter, and exit with Ctrl+X. Then run:

```bash
npm run dev
```

Open the app and confirm the banner says Firebase mode. If it still says Local
demo mode, check the spelling of `NEXT_PUBLIC_DATA_MODE=firebase` and restart the
server. Missing Firebase values show a setup error; the app does not silently
switch to local storage after a Firebase error.

`.env.local` is ignored by Git. Commit `.env.example`, the source, rules and lockfile.
Share project access with teammates through Firebase's normal project permissions.

## 7. Verify the connection

1. Create a new account through your app's Sign up page.
2. In Firebase Authentication → Users, confirm the new account exists.
3. Complete lesson 1. Wait for Saving to Firebase to finish.
4. In Firestore → Data, open `users/<your UID>/progress/gym`. You should see
   `bench-01` in `completedLessonIds` and the computed progress fields.
5. Complete a counted practice session, click Finish session, then Save practice.
   The button should say Saved to Firebase only after the write is acknowledged.
6. Check `users/<your UID>/benchSessions/<session ID>` for its summary.
7. Sign out and sign in again to confirm progress returns. Test in a second
   browser profile or device against the same Firebase project. A localhost URL
   on one computer is not a hosted URL for another computer.
8. Use a second account and confirm it starts with its own empty progress/history.

Lesson text remains version-controlled in `data/gymLessons.ts`. User accounts,
profiles, progress and practice results use Firebase. Camera frames and recordings
stay on the user's device; there is no video upload or Cloud Storage dependency.

## 8. Database versus website hosting

After these steps your data lives in Firebase, but `npm run dev` still serves the
website from your Chromebook. To share a public URL, you also need hosting.

Firebase App Hosting supports Next.js and can deploy from your GitHub repository.
It requires the Blaze billing plan. Before choosing it, review billing with your
team. Point its app root at the directory containing package.json; configure the
same NEXT_PUBLIC_* values at build time, and add the final hostname to Auth's
authorized domains. The pose assets must be generated during the deployment build.
No website has been published and no billing has been enabled by this ZIP.

## Verification included with this update

- `npm test`: 23 unit tests passed (pose counting, local summaries, cloud data decoding).
- `npm run lint`: passed.
- `npm run build`: production build and TypeScript checks passed.
- `npm run test:rules`: six rule tests included, but not executed successfully here;
  the emulator requires Java 21+, and this environment only supplies Java 17.
- No live Firebase project credentials were supplied, so real sign-up, cloud writes
  and cross-device synchronization are not yet verified against your project.
- Browser/camera testing was previously blocked by this environment's browser
  restrictions. The camera diagnostic changes need testing on your Chromebook.

The rule tests use only the disposable `demo-ai-skill-trainer` emulator project.
Install Java 21+ on the machine used for those tests; Java is not required simply
to run this web app or connect it to your real Firebase project.

## Official references

- Firebase web setup: https://firebase.google.com/docs/web/setup
- Email/password Authentication: https://firebase.google.com/docs/auth/web/password-auth
- Firestore setup: https://firebase.google.com/docs/firestore/quickstart
- Firestore rules: https://firebase.google.com/docs/firestore/security/rules-conditions
- Firebase App Hosting: https://firebase.google.com/docs/app-hosting/get-started
- Chromebook camera controls: https://support.google.com/chromebook/answer/13128177
- Chrome camera permissions: https://support.google.com/chrome/answer/2693767
