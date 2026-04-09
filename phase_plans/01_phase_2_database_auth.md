# Workflow Plan: Phase 2 - Foundation & Infrastructure

This document outlines the strict, step-by-step execution plan for setting up the Supabase database, authentication, and Next.js routing architecture for Brute Force.

**Rule of Engagement:** This is a plan. No execution will occur until the manual prerequisites (Docker & Supabase initialization) are completed.

## Objective
Set up the complete backend infrastructure so the application has working authentication, a protected route structure, and a fully configured database with Row Level Security (RLS) and PostgreSQL Triggers.

---

## Step 1: Manual Prerequisites (User Action Required)
Before any code is executed by the agent, the user must manually complete the following:
1. Ensure **Docker Desktop** is installed and running (engine is green).
2. Ensure the Supabase CLI is initialized (`npx supabase init`).
3. Run `npx supabase start` in the terminal to spin up the local PostgreSQL containers.
4. Provide the local `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (output by the start command) to the agent.

---

## Step 2: Database Schema & Migrations (Agent Action)
Once the local database is running, the agent will create a new SQL migration file (`supabase/migrations/00001_initial_schema.sql`) containing:

### 1. Core Tables
- `profiles` (id, full_name, avatar_url, role, total_score, streak_count, github_url)
- `team_members` (profile_id, designation, batch, skills array, is_alumni)
- `events` (title, description, start_time, end_time, location, status, category, registered_count)
- `event_registrations` (event_id, user_id)
- `challenges` (title, description, difficulty, points_awarded, deadline, status)
- `submissions` (challenge_id, user_id, github_url, live_url, status)
- `projects` (title, description, tech_stack array, repo_url, live_url, likes_count)
- `gallery_albums` & `gallery_images`
- `blogs` (title, content, author_id, published_at)
- `achievements` (user_id, badge_name, earned_at)

### 2. PostgreSQL Triggers (From the Build Bible)
- **Trigger 1:** Auto-create `profiles` row when a user signs up in `auth.users`.
- **Trigger 2:** Auto-increment/decrement `registered_count` on the `events` table when `event_registrations` change.
- **Trigger 3:** Auto-increment `likes_count` on `projects`.
- **Trigger 4:** Auto-add `points_awarded` to `profiles.total_score` when a `submission` is marked as `APPROVED` by an admin.

### 3. Row Level Security (RLS)
- Apply Option A (Default Club Model).
- Visitors: Read-only access to published events, projects, gallery, blogs, challenges, and the leaderboard.
- Members: Read public data + Insert submissions + Update own profile.
- Admins: Full CRUD across all tables.

---

## Step 3: Type Generation (Agent Action)
The agent will run the Supabase CLI command to introspect the local database and generate strict TypeScript types:
`npx supabase gen types typescript --local > types/supabase.ts`

---

## Step 4: Next.js App Router Setup (Agent Action)
The agent will configure the `app/` directory according to the Build Bible:

1. **Route Groups:**
   - `(public)`: `/`, `/events`, `/challenges`, `/projects`, `/team`, `/gallery`, `/leaderboard`, `/blog`.
   - `(auth)`: `/login`, `/signup`.
   - `(protected)`: `/dashboard`, `/admin`.

2. **Supabase SSR Configuration:**
   - Install `@supabase/ssr` and `@supabase/supabase-js`.
   - Create `lib/supabase/server.ts` and `lib/supabase/client.ts` utilities for managing cookies and server-side fetching.

3. **Middleware:**
   - Create `middleware.ts` at the project root.
   - Logic: Refresh auth tokens on every request. Redirect unauthenticated users trying to access `/dashboard` or `/admin` back to `/login`. Block non-admin users from accessing `/admin`.

---

## Step 5: Authentication Pages (Agent Action)
The agent will build the UI for the login and signup flows:
- Utilize the Phase 1 Design System (Blade Runner 2049 theme: Void backgrounds, Glass cards, Hologram buttons).
- Implement Email/Password signup forms using `react-hook-form` and `zod` for validation.
- Implement "Sign in with GitHub/Google" OAuth buttons.

---
**End of Phase 2 Plan.**