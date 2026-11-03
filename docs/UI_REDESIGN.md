# Skill Trainer: illustrated eight-lesson edition

This version updates the existing Next.js app to match the supplied cream, red, blue and yellow illustrated reference. Firebase configuration, account identity, security rules, camera/video code and pose-estimation behavior are unchanged. The displayed curriculum is now eight lessons; storage retains the original topic IDs for compatibility.

## What's new
- An original blue weight-plate character, warm cream backgrounds, bold ink outlines and tactile plate buttons.
- An eight-lesson winding path in two sections, with dotted connectors and illustrated completion feedback.
- Keyboard-accessible lesson previews; locked steps explain their prerequisite, completed steps remain reviewable. Escape closes a preview.
- Real milestones derived from existing completed-lesson IDs, with no new database fields or fake streaks.
- Revised home, landing, navigation and lesson-completion feedback. Shared styles refresh the login, progress and camera screens too.
- Responsive path layout and reduced-motion support.

## Install without losing your setup
1. Keep your old project folder as a backup. Download and extract this ZIP into a separate folder.
2. Copy your existing `.env.local` into the extracted `ios-capstone-project-main` folder. Never commit it.
3. In that folder, run `npm install`, then `npm run dev`.
4. Sign in with your existing Firebase account. Cloud progress uses the same document paths.
5. For local demo accounts, use the same browser and localhost port as before; browser storage is origin-specific.

Milestones mean lesson completion, not verified lifting skill. There is no leaderboard, invented exercise score, paid currency or punishment for missed days.

## Manual checks
- At desktop and mobile widths: navigation, long lesson titles and previews fit.
- Keyboard: Tab to a node, Enter opens its preview, Escape closes it.
- New account: only the first lesson starts; locked previews cannot mark lessons complete.
- Complete a lesson: wait for save confirmation, then return to the path and check the next unlock.
- Reload/sign out/sign in: saved progress and earned milestones agree.
- Verify the camera and video controls still work on your device. The tracker algorithm is unchanged.

## Verification for this delivery
The 33 automated tests pass, including every sequential legacy completion state, partial-credit preservation, new storage round trips, old bookmarks, local reload/reset, path unlocks and duplicate-completion regressions. Production compilation and TypeScript checks pass. Camera/video controls, pose counter, session storage, model setup, Firebase initialization and Firestore rules are byte-for-byte unchanged from the previous ZIP. Live browser visual/interaction QA remains unavailable because the managed preview service supplies unsupported flags to Next.js. Live Firebase and a physical camera were not tested in this pass.

## Eight lessons and old progress

| New step | Title | Original topics |
| --- | --- | --- |
| 1 | Before You Lift | 1 + 2 |
| 2 | The Setup | 3 + 4 |
| 3 | Find Your Grip | 5 |
| 4 | The Unrack | 6 |
| 5 | The Descent | 7 |
| 6 | Press & Lockout | 8 |
| 7 | Make the Next Set Better | 9 + 10 |
| 8 | Your Practice Check | 11 + 12 |

An existing account earns a combined step only when all its original topics were completed. For example, old lessons 1–3 become one completed new lesson plus partial credit toward The Setup. The partial topic remains stored, but the combined step stays unfinished until its remaining material is reviewed. Old 12/12 becomes new 8/8.

Storage continues using the original twelve topic IDs, expanding a new completed lesson into its source topics. Both local storage and Firestore use the same mapping. Existing rules remain valid. No bulk cloud migration, account recreation or rules publication is required. Existing lesson bookmarks resolve to the corresponding combined lesson. Keep your current `.env.local`, use the same Firebase project, and avoid simultaneously running old and new app versions while completing lessons.

The reference's tracing game, accuracy percentage, lives, shop, leaderboard and daily streak are not implemented or displayed as working features. Camera and device-video practice remain the actual practice tools. Device videos are not uploaded to Firebase; only chosen session summaries are saved.
