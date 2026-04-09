# Workflow Plan: Phase 5 - The Competitive Engine

This document outlines the strict, step-by-step execution plan for building the core competitive features of Brute Force: Events, Challenges, and Submissions.

**Rule of Engagement:** This is a plan. No execution will occur until all phases are brainstormed and manual prerequisites are met.

## Objective
Build the interactive, real-time systems that drive member engagement, adhering to the Web Weave requirements for event discovery, challenge listings, and secure submissions.

---

## Step 1: The Events System (Agent Action)
The agent will build `app/(public)/events/page.tsx` and `app/(public)/events/[id]/page.tsx`.

1. **Unified Events Listing:**
   - Implement a tabbed interface (Upcoming / Past) using the `shadcn/ui` Tabs component.
   - **Upcoming Events:** Cards displaying `title`, `banner_image`, `date_time`, `venue`, `category` badge, and `registered_count`.
   - **Past Events:** Cards highlighting results, winners, and a link to the `Gallery` album for that event.
2. **The Countdown Timer:**
   - Integrate the `NumberTicker` or a custom `CountdownTimer` component on Upcoming Event cards to tick down to `start_time` in real-time using `JetBrains Mono` font.
3. **One-Click Registration (User Decision: Option A):**
   - **Frictionless Flow:** A logged-in member clicks "Register". The button immediately transitions to a disabled state reading "Registered ✓" (using the `success` #00FF88 color). 
   - A `shadcn/ui` toast notification confirms the action.
   - Supabase handles the `INSERT` into `event_registrations` in the background, and the `registered_count` increments instantly via optimistic UI updates (TanStack Query).

---

## Step 2: The Challenge Board (Agent Action)
The agent will build `app/(public)/challenges/page.tsx`.

1. **Challenge Listing & Filters:**
   - Render a grid of active and past challenges.
   - Implement client-side filtering by `difficulty` (Easy/Medium/Hard) and `status` (Active/Closed).
   - Use the Phase 1 Badge system to color-code difficulty: Easy (`success` #00FF88), Medium (`warning` #FFB703), Hard (`error` #D90429).
2. **Challenge Detail Page (`[id]/page.tsx`):**
   - Render the rich text or markdown problem statement.
   - Display the `points_awarded` prominently using a glowing `hologram` (#E63946) accent.
   - Show the deadline countdown.

---

## Step 3: The Submission System (Agent Action)
The agent will build the submission form modal/page for active challenges.

1. **Submission Form:**
   - A form requiring two inputs: `GitHub Repo URL` and `Live Hosted URL`.
2. **URL Validation (User Decision: Deferred/Regex Baseline):**
   - **Baseline:** Implement strict Regex validation using `Zod` to ensure the inputs are valid `https://github.com/...` and valid web URLs.
   - *Note: Advanced API verification (checking if the repo is public/exists) is deferred for future consideration.*
3. **Duplicate Prevention:**
   - The Supabase database schema (Phase 2) enforces a unique constraint on `(challenge_id, user_id)`. The frontend will catch this error and prevent duplicate submissions, disabling the form if the user has already submitted.
4. **Submission History:**
   - The user's personal dashboard (built in Phase 6) will list their submission history, timestamps, and current grading `status` (Pending/Approved/Rejected).

---
**End of Phase 5 Plan.**