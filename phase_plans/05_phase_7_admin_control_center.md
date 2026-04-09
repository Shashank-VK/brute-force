# Workflow Plan: Phase 7 - The Admin Control Center

This document outlines the strict, step-by-step execution plan for building the secure mission control of Brute Force.

**Rule of Engagement:** This is a plan. No execution will occur until all phases are brainstormed and manual prerequisites are met.

## Objective
Provide Club Leads with a secure, role-guarded interface to manage all platform content (Events, Challenges, Team, Projects, Gallery), grade submissions, manage users, and view platform analytics.

---

## Step 1: Secure Routing & Layout (Agent Action)
The agent will build `app/(protected)/admin/layout.tsx`.

1. **Role Guard Middleware:**
   - The Next.js `middleware.ts` (configured in Phase 2) intercepts requests to `/admin/*`.
   - It queries the user's `role` from the session/profile. If `role !== 'ADMIN'`, it redirects them to the homepage or login.
2. **The Admin Sidebar Layout:**
   - A persistent left sidebar with navigation links: Dashboard, Users, Team, Events, Challenges, Submissions, Projects, Gallery, Audit Logs.
   - The layout uses `void` (#0B0C10) background with active links highlighted in `warning` (#FFB703) to differentiate the admin panel from the public site's `hologram` theme.

---

## Step 2: Data Management (CRUD) Tables (Agent Action)
The agent will build `app/(protected)/admin/[resource]/page.tsx` for each module.

1. **Standard Data Tables:**
   - Implement `shadcn/ui` Data Tables with sorting, filtering, and pagination.
   - **Users:** Promote to admin, ban account, reset password.
   - **Team:** Add/Edit/Remove members, set designations, toggle `is_alumni`.
   - **Events & Challenges:** Create/Edit/Publish/Unpublish. Use a rich text editor for descriptions.
   - **Projects:** Feature/Archive.
   - **Gallery:** Bulk upload images to albums.

---

## Step 3: Submission Grading Interface (Agent Action)
The agent will build `app/(protected)/admin/submissions/page.tsx` and the review modal.

1. **The Split-Pane Review (User Decision: Option A):**
   - Build a highly efficient grading UI.
   - **Left Pane:** An `iframe` loading the student's `live_url` (if applicable) or a large preview area.
   - **Right Pane:** The grading form containing the `github_url` link, a dropdown to adjust the `points_awarded`, a text area for feedback, and "Approve" / "Reject" buttons.
2. **Triggering the Leaderboard:**
   - When an Admin clicks "Approve", the `status` updates to `APPROVED`, firing the Postgres Trigger (Phase 2) to instantly update the user's `total_score` and `streak`, which in turn updates the real-time leaderboard (Phase 6).

---

## Step 4: Platform Analytics Dashboard (Agent Action)
The agent will build `app/(protected)/admin/page.tsx`.

1. **Recharts Integration (User Decision: Option A):**
   - Install `recharts`.
   - Build line charts tracking "Signups over Time" and "Submissions over Time" using `hologram` (#E63946) and `glitch` (#00E5FF) strokes on a `glass-border` (#1F232B) grid.
2. **Quick Stats:**
   - Display total active users, total events hosted, total submissions pending grading, and total platform visits (if tracked).
3. **Audit Log Viewer:**
   - Render a read-only table displaying the `audit_logs` tracking which Admin performed what action (e.g., "Admin X approved Submission Y").

---
**End of Phase 7 Plan.**