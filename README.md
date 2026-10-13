# AI Skill Trainer

A practice path for real-world skills. The current path is the bench press.

Accounts and lesson progress are stored in the browser with `localStorage`.

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
- `lib/auth.ts` — account sign-in
- `lib/progress.ts` — saved lesson progress
- `types/` — `Skill`, `Lesson`, and `UserProgress`
