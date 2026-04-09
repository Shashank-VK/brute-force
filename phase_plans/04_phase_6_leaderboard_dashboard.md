# Workflow Plan: Phase 6 - Real-Time Leaderboard & User Dashboard

This document outlines the strict, step-by-step execution plan for building the gamification and personal analytics features of Brute Force.

**Rule of Engagement:** This is a plan. No execution will occur until all phases are brainstormed and manual prerequisites are met.

## Objective
Implement the highly engaging, competitive layers of the platform: a true real-time global leaderboard, rich personal profiles with activity heatmaps, and an achievement/streak system.

---

## Step 1: The Real-Time Leaderboard (Agent Action)
The agent will build `app/(public)/leaderboard/page.tsx`.

1. **Supabase Realtime WebSockets (User Decision: Option A):**
   - The frontend will subscribe to `INSERT` and `UPDATE` events on the `profiles` table filtering by `total_score`.
   - When a score changes (e.g., an Admin approves a submission), the Supabase real-time channel pushes the update to the client.
   - The leaderboard list automatically re-sorts itself with a smooth Framer Motion layout animation.
2. **Top 3 Podium UI:**
   - Render the top 3 users in a visual podium layout using the Blade Runner palette: Gold (`warning` #FFB703), Silver (`shadow` #8D99AE), and Bronze (`hologram` #E63946).
3. **Rank Badges:**
   - Assign dynamic badges based on score thresholds: Newbie, Contributor, Expert, Legend.

---

## Step 2: The Activity Heatmap & Logs (Agent Action)
The agent will build the data layer for tracking user engagement.

1. **Dedicated Activity Log Table (User Decision: Option A):**
   - Create a lightweight `activity_logs` table (id, user_id, action_type, created_at).
   - Create Postgres Triggers to insert a row into `activity_logs` automatically when a user logs in, registers for an event, or submits a challenge.
2. **GitHub-Style Heatmap UI:**
   - Render a 52-week grid on the user's dashboard (`app/(protected)/dashboard/page.tsx` or public profile).
   - Map activity counts to color intensities using the `glitch` (#00E5FF) cyan theme, mimicking the GitHub green squares but adhering to the Neo-Noir Tech vibe.

---

## Step 3: Badges & Streaks (Agent Action)
The agent will build the logic for the achievement system.

1. **Streak Calculation:**
   - Calculate the "Current Streak" and "Longest Streak" by analyzing consecutive days in the `activity_logs` table.
   - Display a fiery `warning` (#FFB703) icon with the streak number on the user profile.
2. **Achievement Badges:**
   - Query the `achievements` table.
   - Render earned badges (e.g., "First Submission," "Hackathon Winner") using frosted glass cards with holographic glow borders.

---

## Step 4: The Personal Dashboard (Agent Action)
The agent will build `app/(protected)/dashboard/page.tsx`.

1. **Overview Stats:**
   - Use the `NumberTicker` component (Phase 1) to animate total score, rank, and event attendance.
2. **Submission Status:**
   - List all pending and graded challenge submissions, showing the points earned and any feedback from the admins.
3. **Certificate Generation (Bonus Feature):**
   - Integrate `@react-pdf/renderer` to generate a downloadable PDF certificate for completed events or challenges.
   - The PDF template will use a `void` (#0B0C10) background with `hologram` (#E63946) borders and `light` text.

---
**End of Phase 6 Plan.**