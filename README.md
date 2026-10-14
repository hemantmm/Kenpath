# DailySpark ⚡ — Learn, Play & Earn

> A lightweight, mobile-first daily challenge web application built for **Kenpath Labs**. Designed specifically for users on modest Android devices, low-bandwidth mobile data, and English as a Second Language (ESL), featuring transparent simulated reward mechanics.

[![Build & Tests](https://img.shields.io/badge/Vitest-13%20Passed-emerald.svg)](#testing)
[![Bundle Size](https://img.shields.io/badge/First%20Load%20JS-105%20kB%20uncompressed-blue.svg)](#performance--data-efficiency)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-indigo.svg)](#tech-stack)

---

## 📱 Live Demo & Setup

- **Target Experience:** Open directly on a mobile browser or Chrome DevTools Device Mode (e.g., Moto G4 / Pixel 5, 360x640px).

### Quick Start (Local Setup)

Clone the repository and run locally:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/dailyspark.git
cd dailyspark

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Automated Tests

```bash
# Run unit tests for streak calculations, rewards, levels, and duplicate prevention
npm test
```

### Production Build

```bash
npm run build
npm start
```

---

## 🎯 Designing for Kenpath Labs' Audience

Kenpath Labs highlighted three core realities about its users:

| Kenpath Audience Pillar | How DailySpark Solves It |
| :--- | :--- |
| **01. Modest Android Phones & Mobile Data** | **Lightweight bundle**: 105 kB uncompressed first-load JS (~32 kB gzipped transfer). Zero audio file downloads (sounds are synthesized client-side via the HTML5 Web Audio API at 0 KB network cost). Large touch targets (56px primary buttons, 58px quiz options). Local state preserved across reloads via `localStorage`. |
| **02. English as a Second Language (ESL)** | **Plain, direct English** with zero confusing idioms or double negatives. Clear visual hierarchy with intuitive color coding (Emerald = Correct, Coral = Incorrect, Amber = Points). Each question includes a concise 1-sentence "Why this matters" explanation. |
| **03. Transparent Simulated Rewards** | **Illustrative simulated reward model** (100 points ≈ $0.10 USD illustrative demo rate). Points have no real monetary value and payouts are not enabled in this prototype. Client-side duplicate prevention ensures 1 challenge completion per calendar day in the demo. |

---

## ✨ Key Features

1. **Daily 2-Minute Micro-Challenge:**
   - 5 practical questions covering digital safety (avoiding PIN scams), basic money management, polite workplace English, and mobile data saving.
   - Instant visual and synthesized audio feedback on each answer.
   - Progress bar with real-time question counter.

2. **Daily Streak Engine:**
   - Tracks consecutive days completed.
   - 7-day visual activity calendar with status dots.
   - Consecutive day detection (checks if last completion was yesterday).
   - Milestone bonuses at Day 3 (+20 pts) and Day 7 (+50 pts).

3. **Points & Level Progression:**
   - 10 points per correct answer (up to 50 base points per challenge).
   - 5 tiered levels: *Novice → Explorer → Achiever → Champion → Master*.
   - Dynamic progress bar showing points remaining until next tier.

4. **Milestone Badges:**
   - *First Spark* (First completion)
   - *Sharp Mind* (5/5 perfect score)
   - *On Fire* (3-day streak)
   - *Century Club* (100+ points)
   - *Week Warrior* (7-day streak)
   - *High Earner* (250+ points)

5. **Client-Side Duplicate Prevention & Daily Cadence:**
   - Once today's challenge is completed, the dashboard transitions to a **"Goal Achieved"** card.
   - Live countdown timer ticking down to midnight (when tomorrow's challenge unlocks).
   - **Practice Mode**: Users can review and replay questions anytime without earning duplicate rewards.

6. **Zero-Bandwidth Audio Synthesizer:**
   - Audio feedback (correct chime, soft incorrect tone, celebration fanfare) is generated programmatically using browser oscillators via Web Audio API.
   - Saves precious cellular data for users on metered plans.
   - Includes an instant mute/unmute toggle in the header.

7. **Reviewer / Evaluator Sandbox (Built-in Testing Toolbar):**
   - Contains a quick button to **"Set Last Day = Yesterday"** so hiring managers and evaluators can verify streak progression without waiting 24 hours.
   - 1-click **"Reset Demo State"** to test initial onboarding from scratch.

---
