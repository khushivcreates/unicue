# UniCue

> Sounds like unique. Built like it too.

AI assistant that turns scattered campus announcements (WhatsApp forwards, notice
boards, ERP portals, emails) into one clear, personalized, action-ready feed for
freshers. Built with Next.js 14 (App Router) + Tailwind CSS.

## Pages

- `/` — Landing / hero, problem, 4-step pipeline, full feature list
- `/onboarding` — Mock "forward a notice to our bot" onboarding flow + Squad Digest share
- `/dashboard` — Personalized feed: filter by branch/semester/hostel status, Explain-Like-a-Fresher mode, Hindi translation, countdown chips, verified/unverified badges
- `/jargon` — Jargon Decoder (instant local lookup + AI fallback for unknown terms)
- `/ask` — Ask UniCue: RAG-style chat grounded in the seeded notices, with sources cited
- `/tracker` — Auto Action-Tracker: checklist of everything you've flagged, with `.ics` calendar export and confetti on completion

## Data

All notices are seeded/mock data in `data/notices.json` (16 realistic campus notices —
mixed verified/unverified, mixed urgency, mixed branch/semester/hostel targeting) and
`data/jargon.json` (12 common Indian-campus acronyms). No live WhatsApp/ERP/email
integration is wired up — the ingestion pipeline is simulated, as the brief specifies.

## AI chat (`/api/chat`)

One API route powers Ask UniCue, the Jargon Decoder's AI fallback, and the Hindi
translation toggle. It does simple keyword retrieval over `notices.json`, then:

- **If `ANTHROPIC_API_KEY` is set** (Vercel env var) → calls the real Claude API for a
  grounded answer.
- **If it isn't set** → falls back to a local, offline extractive answer built directly
  from the matched notices, so the demo always works even with zero configuration.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploying — step by step

See the deployment walkthrough the assistant gave you alongside this project for the
full GitHub + Vercel steps, exact commands, and where to add `ANTHROPIC_API_KEY`.

## Notes for judges

- "Bonus features we added" (Vibe Meter/streak, countdown chips, Explain-Like-a-Fresher,
  Squad Digest, Senior Tips, confetti, dark/light toggle) are explicitly labelled as new
  on the landing page — they weren't in the original pitch deck.
- Streak count and tracker items are stored in the browser's `localStorage`, per-visitor,
  so they persist across reloads without needing a database for the demo.
