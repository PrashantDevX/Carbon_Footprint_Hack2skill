# 🌍 EcoTrack — Carbon Footprint Intelligence

> An AI-powered, gamified carbon footprint tracker that turns everyday habits into an actionable sustainability journey.

[![Built with React](https://img.shields.io/badge/React-18-149eca)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting%20%7C%20Auth%20%7C%20Firestore-ffca28)](https://firebase.google.com)
[![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4)](https://ai.google.dev)

---

## 🎯 Chosen Vertical — Sustainable Tech (Climate / ESG)

EcoTrack equips **individuals** to understand, measure, and reduce their personal carbon
footprint. The persona is the *climate-curious everyday user* who wants to act but lacks
the data literacy to know **where** their impact actually comes from. The product's job is
to do that reasoning for them and coach them toward the highest-leverage changes.

---

## 🧠 Approach & Logic

EcoTrack is a **smart, context-aware assistant**: it turns raw lifestyle data into a
readable carbon profile and then makes *decisions on the user's behalf* about what to
recommend next.

| Layer | What it does |
|-------|--------------|
| **Categorization Engine** | Calculates emissions across five vectors — *Transport, Energy, Food, Shopping, Water* — using EPA/IPCC-derived factors (`src/lib/carbonFactors.ts`). |
| **Scoring Engine** | Translates bulky `kgCO₂e` values into an intuitive 0–100 score so users get instant, comparable feedback (`src/lib/carbonCalculator.ts`). |
| **AI Recommendation Layer** | **Google Gemini** receives the user's *actual* emission breakdown via context injection, so it targets the user's single biggest source instead of giving generic tips. A model-fallback chain keeps the assistant working even if a model is deprecated. |
| **Insights Engine** | A pure, deterministic engine (`src/lib/insights.ts`) reads the user's inputs and generates **ranked, quantified** recommendations — each only fires when the data shows a genuinely reducible source, sorted by estimated kgCO₂e saved. |
| **Gamification Layer** | Goals, achievements, and a relative-score leaderboard drive habit formation. |
| **Scanner Subsystem** | **Cloud Vision API** (via a Cloud Function) reads receipts, extracts items, and estimates their embedded carbon in real time. |

### Why this is "logical decision making based on user context"
The assistant never asks the user to diagnose themselves. It computes the **top emitting
category**, injects that into the Gemini system prompt behind the scenes, and tailors
advice (e.g. recommending an EV vs. hybrid based on the user's grid mix). The decision of
*what to coach* is made by the app, not the user.

---

## 🚀 How the Solution Works

1. **Auth & Onboarding** — Sign in with **Google** or **Guest (anonymous)**. Identity is
   re-synced from the provider on every login, so a Google account is never shown as a
   guest. A working account menu (header + Settings) handles sign-out.
2. **Dashboard** — Quick-action tiles for fast access, live score, stat cards, trend +
   category charts, and a personalized **Insights** panel.
3. **Calculator** — A friendly, tabbed slider interface (Transport / Energy / Food /
   Shopping / Water) with an instant live footprint snapshot.
4. **Receipt Scanning** — Upload **or photograph** a receipt; **Gemini Vision** reads the
   items, estimates each item's carbon, and the result is added to your log.
5. **AI Assistant** — Gemini chatbot with the user's live emission breakdown pre-loaded.
6. **Green Map** — A live Google Map (Places API) showing nearby transit, cycling,
   recycling, and refill spots, with a styled demo fallback when no key is set.
7. **Goals & Gamification** — Create/track reduction goals with progress bars, complete
   weekly challenges for points, and a community leaderboard with podium + "You" highlight.
8. **Theming** — One-click light/dark mode that respects OS preference and persists.

---

## 🏗️ Tech Stack & Architecture

- **Frontend:** React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion
- **State/Data:** Zustand (local) · TanStack Query (server cache)
- **Backend:** Firebase Auth · Cloud Firestore · Cloud Functions · Cloud Storage
- **AI / GCP:** Google Gemini · Cloud Vision API · Google Maps
- **Quality:** Vitest (unit) · Playwright (E2E) · ESLint + jsx-a11y · Prettier

**Separation of concerns:** `components/` (UI) · `pages/` (routes) · `hooks/` ·
`store/` · `contexts/` · `lib/` (API + pure logic) · `types/`.

---

## 🔐 Security & Configuration

- **Firebase App Check** (reCAPTCHA v3) guards backend endpoints against abuse. It is
  initialised defensively (`src/lib/appCheck.ts`) — it no-ops when no valid key is present
  so the app never breaks in dev or on misconfiguration.
- **Row-level Firestore Security Rules** (`firestore.rules`) enforce per-user ownership,
  immutable carbon logs, server-only leaderboard writes, and a default-deny fallback.
- **Hardened HTTP headers** in `firebase.json`: a strict **Content-Security-Policy**,
  `X-Content-Type-Options`, `Referrer-Policy`, and a scoped `Permissions-Policy`.
- **No secrets in the repo** — all keys come from environment variables (`.env.local`).

> ⚠️ **CSP note (important for deployment):** The CSP `script-src`/`connect-src` must allow
> `https://www.google.com`, `https://apis.google.com`, and `https://accounts.google.com`
> for **Google Sign-in + reCAPTCHA/App Check** to work. This is already configured in
> `firebase.json`. **The CSP only takes effect once `firebase deploy` is run** — an outdated
> deployed CSP is the usual cause of "can't log in" errors in the browser console.

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- A Firebase project (Auth, Firestore, Storage enabled)
- Firebase CLI: `npm install -g firebase-tools`

### Setup
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
#   → fill in your Firebase + Gemini + Maps keys

# 3. Run the dev server
npm run dev          # http://localhost:5173
```

### Enable the sign-in methods (one-time, in Firebase Console)
1. **Authentication → Sign-in method** → enable **Google** and **Anonymous**.
2. **Authentication → Settings → Authorized domains** → add your hosting domain
   (`<project>.web.app`) and `localhost`.

### Useful scripts
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run lint` | Lint with zero-warning policy |
| `npm run emulators` | Start Firebase emulators |
| `npm run deploy` | Build + deploy everything to Firebase |
| `npm run deploy:rules` | Deploy only Firestore/Storage rules |

---

## 🚢 Deployment

```bash
npm run build
firebase deploy            # hosting + rules + functions
# or just the site:
firebase deploy --only hosting
```

After deploying, **hard-refresh** the live site (Ctrl+Shift+R) so the browser picks up the
new CSP headers.

### Troubleshooting "I can't log in"
| Symptom in console | Cause | Fix |
|--------------------|-------|-----|
| `Loading the script 'https://www.google.com/recaptcha/api.js' violates … CSP` | Deployed CSP is stale / too strict | Run `firebase deploy --only hosting` to publish the CSP in `firebase.json` |
| `auth/unauthorized-domain` | Domain not whitelisted | Add the domain under **Auth → Settings → Authorized domains** |
| `auth/operation-not-allowed` | Provider disabled | Enable Google / Anonymous in **Auth → Sign-in method** |
| Popup closes instantly | Browser blocks popups | App auto-falls back to `signInWithRedirect` |

---

## 🧪 Testing

- **Unit:** `src/lib/carbonCalculator` is covered by Vitest (`tests/unit`) — validates score
  bounds, top-category detection, and zero-input handling.
- **E2E:** Playwright config (`npm run test:e2e`) for critical user flows.

---

## ♿ Accessibility

Targets **WCAG 2.1 AA**: a skip-link, semantic landmarks, `aria-live` error announcements,
`aria-busy` on async buttons, `aria-hidden` on decorative icons, a global
`:focus-visible` keyboard indicator, `role="radiogroup"` theme controls,
`prefers-reduced-motion` support, light **and dark** themes with accessible contrast, and
keyboard-navigable controls throughout. `eslint-plugin-jsx-a11y` enforces these in CI.

## 🎨 Theming

A `ThemeProvider` (`src/contexts/ThemeContext.tsx`) provides light/dark modes that:
- respect the OS `prefers-color-scheme` on first visit,
- persist the user's explicit choice in `localStorage`,
- expose a one-click toggle in the header and a full control panel in **Settings**.

---

## 📌 Assumptions Made

- Where the user doesn't provide granular data, we default to generalized **EPA/IPCC**
  emission factors.
- A heuristic fallback factor (`0.12`) is assigned to unrecognised receipt line items.
- Gamification drives retention — streaks reward small, repeated behavioural shifts.
- "EcoPoints" grow linearly so every reduction action rewards the user predictably.

---

## 📂 Project Structure

```
src/
├── components/    # Reusable UI (ui, charts, layout)
├── contexts/      # AuthContext (auth state + Firestore profile)
├── hooks/         # useCarbon, useNotifications
├── lib/           # firebase, gemini, appCheck, carbon engine, analytics
├── pages/         # Route components (Auth, Dashboard, Calculator, …)
├── store/         # Zustand stores
└── types/         # Shared TypeScript types
functions/         # Cloud Functions (receipt scan, scheduled reports)
firestore.rules    # Row-level security rules
firebase.json      # Hosting config + security headers (CSP)
```

---

Built for a Sustainable-Tech hackathon — focused on **code quality, security, efficiency,
testing, and accessibility**.
