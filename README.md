# DisciplineOS — Motivation & Discipline Tracking Web App

A production-grade full-stack discipline tracker. Non-negotiable task systems, streak logic, a dynamic 0–1000 discipline score, smart motivation messaging, weekly reflection, and analytics — minimal, serious UI with no gamification fluff.

## Stack
- **Frontend:** React + TypeScript + Vite + Tailwind CSS v4 + Framer Motion + Zustand + Recharts
- **Backend:** Node.js + TypeScript + Express
- **Database:** SQLite via `better-sqlite3` (drop-in swap to PostgreSQL — see note below)
- **Auth:** JWT + bcrypt password hashing

## Run Locally

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
Runs on **http://localhost:3001**. A SQLite file (`dev.db`) is created automatically on first run — no separate DB setup needed.

### 2. Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Runs on **http://localhost:5173** with `/api` proxied to the backend.

### 3. Open the app
Visit **http://localhost:5173**, create an account, and go. Four starter tasks are seeded automatically so the dashboard isn't empty on first login.

## Switching to PostgreSQL (production)
The schema is intentionally simple SQL in `backend/src/db.ts`. To move to Postgres:
1. `npm install pg` in `backend`
2. Replace the `better-sqlite3` calls in `db.ts` with a `pg` Pool, keeping the same table shapes (or reintroduce Prisma — a `schema.prisma` matching this structure is in the project history/notes if you want the ORM back; it was swapped to `better-sqlite3` only because this sandbox's network policy blocked Prisma's engine-binary CDN, not for any design reason).
3. Set `DATABASE_URL` in `.env` to your Postgres connection string.

## Project Structure
```
disciplineOS/
├── backend/
│   ├── src/
│   │   ├── routes/        # auth, tasks, analytics, reflections, settings
│   │   ├── db.ts          # SQLite schema + connection
│   │   ├── middleware.ts  # JWT auth guard, error handler
│   │   ├── utils.ts       # score calculation, streak logic, motivation engine
│   │   └── index.ts       # Express app entry
│   └── .env
└── frontend/
    └── src/
        ├── pages/          # Dashboard, Tasks, Analytics, Reflect, Settings, Auth
        ├── components/     # Layout/nav
        ├── store/          # Zustand global state
        ├── api/            # Axios client
        └── types/
```

## Core Logic

**Discipline Score (0–1000):**
- Task completion rate × 40%
- Streak length × 30% (caps at 30 days)
- Reflection quality/frequency × 30%

**Streak logic:** increments only when *all* non-negotiables are done for the day; resets on a missed day (see `analytics/streak` route) — comeback mode toggle in Settings is there for a softer variant if you want to build it out further.

**Smart motivation:** rule-based on current streak, today's completion rate, and score (see `getSmartMotivation` in `utils.ts`) — swap in an LLM call there if you want dynamic, personalized copy instead of the rule set.
