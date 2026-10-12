# DailySpark — Engineering Explainer

**Candidate:** Hemant Mehta  
**Role:** Full Stack Engineer · Build Task  
**Company:** Kenpath Labs  
**Project:** DailySpark (Micro-Learning & Daily Reward Web App)

---

## 1. What I Built

I built **DailySpark**, a mobile-first, low-bandwidth daily challenge web application that invites users to complete a quick 2-minute task each day, learn practical everyday micro-skills, and earn transparent, honest rewards.

### The Core Loop
1. **Open & Engage:** The user is greeted with their current level, 7-day streak status, and a prominent 1-tap call-to-action for today's challenge.
2. **Execute (2-minute challenge):** The user answers 5 multiple-choice questions focusing on digital safety (e.g. avoiding SMS PIN phishing), personal finance basics (emergency savings), polite workplace communication, and mobile data optimization.
3. **Instant Feedback & Reward:** Every answer provides immediate visual affirmation (emerald green vs. coral rose) along with a synthesized audio chime and a 1-sentence plain-English explanation.
4. **Earn & Retain:** Upon finishing, users receive points (10 pts per correct answer), milestone bonuses (e.g. +20 pts on a 3-day streak), unlock achievement badges, and see their streak advance.
5. **Return Visit State:** Once completed, the challenge locks to prevent duplicate point-farming, displaying a live countdown timer until midnight and offering an optional "Practice Mode" for learning review.

---

## 2. Design & Technical Choices Made

I specifically tailored every architectural decision to the **three core constraints** of Kenpath Labs' users:

### Constraint 1: Modest Android Phones & Metered Mobile Data
- **Micro Bundle Footprint:** Total first-load JavaScript is **~105 kB** (with the main page chunk under 18 kB). I avoided bloated UI component libraries and heavy animation engines (such as Framer Motion) that choke low-tier mobile processors.
- **Zero-Bandwidth Audio (Web Audio API):** Instead of forcing users to download `.mp3` or `.wav` sound files over their mobile data, I synthesized audio tones (chimes, clicks, fanfare) directly in the browser via the HTML5 `AudioContext` and oscillators. This provides immediate, delightful tactile feedback at **0 KB network cost**.
- **Touch-First Accessibility:** Modest smartphones often have smaller, less sensitive touchscreens. All interactive buttons have minimum touch targets of **52px to 56px**, high-contrast labels, and thumb-friendly bottom-anchored actions.
- **Intermittent Network Resilience:** Progress and ledger state are saved immediately to `localStorage`. If a user loses cell reception mid-quiz, their progress is not lost, and the app continues to operate offline smoothly.

### Constraint 2: English as a Second Language (ESL)
- **Plain, Direct Language:** Questions and UI micro-copy avoid idioms, cultural references, or confusing double negatives (e.g. *"Hang up immediately and never share your PIN"* instead of *"Decline to disclose authorization parameters"*).
- **High Visual Affordances:** Rather than relying purely on text, states are communicated through distinct, universally recognizable visual cues:
  - Emerald Green + Checkmark = Correct / Earned
  - Coral Rose + X = Incorrect
  - Amber Gold = Points & Earnings
  - Flame Orange = Streaks
- **1-Sentence Micro-Explanations:** Each question provides an instant takeaway sentence so users always feel they gained genuine value, even if they answered incorrectly.

### Constraint 3: Honest Rewards Worth Real Money
- **Clear Conversion Rate:** In-app points are directly mapped to an understandable currency baseline (`100 Points = $0.10 USD / ₹10 simulated`).
- **Anti-Farming & Cadence Protection:** Once a challenge is completed for a calendar day, the reward engine rejects duplicate point awards (`alreadyCompletedToday: true`). The user can still practice, but cannot inflate their balance.
- **Audit Ledger:** Every point earned is logged as an immutable transaction item in an activity history drawer, establishing trust and clarity.
- **Reviewer Sandbox Tooling:** Because testing streak increments normally requires waiting 24 to 48 hours, I added a discreet **"Kenpath Reviewer Sandbox"** in the UI with a 1-click button to simulate *"Last Completed = Yesterday"*. This allows evaluators to verify streak progression immediately.

---

## 3. What I Intentionally Left Out (Scope Discipline)

Given the 4 to 6-hour scope and the principle that *"a small idea done well beats a big one half done"*, I made deliberate trade-offs:

1. **Direct Fiat Payment Integration (M-Pesa / UPI / Stripe Payouts):**
   - *Why left out:* Real-money payouts require legal compliance, KYC, banking API credentials, and webhook infrastructure.
   - *What was done instead:* Implemented an honest points ledger, a minimum cashout threshold indicator (500 pts = $0.50), and an architectural specification modal explaining how this connects to production payment rails.

2. **Server-Side Authentication & Database Sync:**
   - *Why left out:* Adding user registration (email/SMS OTP) creates onboarding friction for a quick evaluation demo and takes away time from perfecting the core reward feeling.
   - *What was done instead:* Built a localized state machine with versioned `localStorage`, pure TypeScript reward engine functions, and an automated Vitest test suite.

3. **Dynamic AI-Generated Questions:**
   - *Why left out:* Real-time LLM API calls add latency, introduce token costs, and risk serving hallucinations or overly complex English to ESL users.
   - *What was done instead:* Curated a high-quality, practical question set vetted specifically for digital literacy and financial safety.

---

## 4. Production Architecture Roadmap (Next Steps for Kenpath)

If transitioning DailySpark to high-scale production serving millions of daily earners, I would implement:

```
[Mobile Client (PWA)]
        │  (HMAC signed payload with device nonce)
        ▼
[Cloudflare Edge / API Gateway] ── (Rate-limiting, Cloudflare Turnstile anti-bot)
        │
[Node.js / Go Reward Service]
        │
        ├── Answers validated against server-stored hashes (Client cannot tamper score)
        ├── Atomic check: `SELECT 1 FROM daily_completions WHERE user_id = $1 AND date = CURRENT_DATE FOR UPDATE`
        │
        ▼
[PostgreSQL Database]
  ├── users (id, phone_number, kyc_status, current_streak)
  ├── point_ledger (id, user_id, amount, balance_after, reason, idempotency_key)
  └── daily_completions (user_id, quiz_date, score, completed_at)
        │
        ▼
[Payout Worker (Celery / BullMQ)]
  └── Dispatches automated micro-payouts to M-Pesa / UPI / Mobile Airtime when threshold met
```

---

## 5. AI Coding Tool Disclosure

As encouraged in the build prompt, here is a transparent disclosure of how AI tools were utilized during this build:

- **Where AI was used:**
  - Generating initial TypeScript interface boilerplate for the domain models (`Question`, `Badge`, `UserRewardState`).
  - Drafting initial question prompts around financial literacy and digital safety.
  - Suggesting formula boundaries for Vitest unit test cases (e.g. boundary conditions for streak reset vs. consecutive day increments).
- **Where Human Engineering & Review was applied:**
  - Architectural structuring and separation of concerns (`rewardEngine.ts` as pure functions isolated from React state).
  - Web Audio API sound synthesis implementation to eliminate all audio asset network overhead.
  - ESL language audit: simplifying question prompts and rewriting options to ensure plain, respectful English.
  - Edge-case testing: identifying and resolving multi-badge trigger conditions when a user crosses both a streak milestone and a point milestone simultaneously.
  - Mobile ergonomics: calibrating 56px touch target heights, CSS tap-bounce feedback, and responsive viewport bounds.
