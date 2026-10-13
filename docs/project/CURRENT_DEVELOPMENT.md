# Current Development

Today is in Sprint 4 (October 5 – October 18). The web application already exists in this repository. Do not create a second Next.js app.

The running path is:

Landing page → Login → Dashboard → Gym skill tree → Open lesson → Complete lesson → Unlock the next lesson → Save progress

Build and correct that path before pose estimation or an AI feedback API. The lesson pages must still work if pose estimation is absent.

## Already in the repository

- Next.js App Router, React, TypeScript, and Tailwind CSS
- `app/` routes for the landing page, login, signup, dashboard, skills, the gym tree, lessons, and progress
- `components/` for navigation, skill cards, the skill tree, and lessons
- `data/gymLessons.ts` for the bench-press lessons
- `types/` for `Skill`, `Lesson`, and `UserProgress`
- `lib/auth.ts` and `lib/progress.ts` for browser accounts and saved progress

Accounts and progress currently stay in `localStorage`. That is temporary.

## What to work on now

Sprint 4 backlog items are T0.7, U1.1, U1.4, U2.1, and T4.2. Epics E0, E1, E2, and E4 are also open during this sprint.

1. Keep the Next.js structure above. Extend it instead of replacing it.
2. Keep one shared layout and navigation between home, the skill tree, lessons, and progress.
3. Keep the dashboard focused on the current gym path and lesson progress.
4. Keep the gym skill tree visual, ordered, and limited to bench press.
5. Keep each lesson readable: objective, short instruction, tips, and mistakes.
6. Keep locked, available, and completed states on the tree.
7. Keep progress in the browser until a database is chosen.
8. Keep the bench-press lessons as the only skill content.

Piano and crocheting are not in this semester's build.

## Pose estimation

T4.2 asks for a basic prototype this sprint. Treat it as a separate experiment. Do not make lesson completion, unlocking, or saved progress depend on it. MediaPipe, or another pose library, can be evaluated after the lesson path is reliable.

## Backlog status

Do not change a backlog status because code exists. The PDF and `docs/overleaf/project_backlog.tex` still show the documented status. If the team agrees an item is done, update the backlog on purpose.
