# Web Weave '26: Brute Force Architecture & Execution Workflow

Based on the official Web Weave '26 Problem Statement, this document defines the complete technical architecture and the step-by-step execution workflow. 

**Rule of Engagement:** We will brainstorm and plan each phase in detail. No code will be executed until the manual prerequisites (e.g., Docker, Supabase setup) are completed by the user.

## 1. Feature Scope Definition

### Core Modules Included
- **Auth & Profiles:** Email/Password + OAuth (GitHub/Google), Role-based access (Visitor, Member, Admin).
- **Team & Alumni:** Hierarchical display, role/skill filters, animated cards, Alumni toggle.
- **Events System:** Upcoming/Past tabs, countdowns, 1-click registration, Admin CRUD.
- **Challenges & Submissions:** Difficulty filters, GitHub/Live URL submissions, real-time grading.
- **Projects Showcase:** Tech stack filters, Like/Star system.
- **Media Gallery:** Masonry grid, albums, full-screen lightbox.
- **Leaderboards & Analytics:** Real-time global/event leaderboards, activity heatmaps.
- **Admin Panel:** Secure CRUD, user management, platform analytics, audit logs.

### Bonus Features Included
- Badges & Achievement System (First submission, win streaks).
- Streak / Activity System (Daily/weekly streaks).
- Dark Mode (Blade Runner 2049 "Neo-Noir Tech" theme).
- Blog / Technical Articles.
- Auto-Generated Certificates (PDF downloads for participation/winning).

### Explicitly Excluded (Per User Request)
- ❌ AI Project/Challenge Recommendations
- ❌ Email Notifications
- ❌ Push Notifications
- ❌ Progressive Web App (PWA)
- ❌ Multi-Language Support

---

## 2. Technical Architecture

### Tech Stack
- **Frontend:** Next.js 14 (App Router), React, TypeScript.
- **Styling:** Tailwind CSS, shadcn/ui, Framer Motion (for Blade Runner cinematic animations).
- **Backend/Database:** Supabase (PostgreSQL).
- **Authentication:** Supabase Auth (Email + OAuth).
- **File Storage:** Supabase Storage (for Gallery, Avatars, Event Banners).
- **State Management:** TanStack Query (React Query) for caching and optimistic UI.
- **Real-time:** Supabase Realtime (WebSockets for Leaderboard).

### Database Schema High-Level Design
1. `profiles`: Extends `auth.users`. Contains `role`, `total_score`, `streak_count`, `github_url`.
2. `team_members`: Links to profiles, adds `designation`, `batch`, `is_alumni`, `skills`.
3. `events`: `title`, `start_time`, `status`, `category`.
4. `event_registrations`: Links users to events.
5. `challenges`: `title`, `difficulty`, `points`, `deadline`.
6. `submissions`: `challenge_id`, `user_id`, `github_url`, `status` (Pending/Graded).
7. `projects`: `title`, `tech_stack`, `likes_count`.
8. `gallery_albums` & `gallery_images`: For media management.
9. `blogs`: `title`, `content`, `author_id`, `published_at`.
10. `achievements`: Earned badges and certificates.
11. `audit_logs`: Admin actions tracking.

---

## 3. The Step-by-Step Execution Workflow (The Phases)

We will execute the build in these strict, sequential phases. 

### Phase 1: Foundation & UI System (Completed)
- ✅ Next.js 14 Setup with TypeScript.
- ✅ Blade Runner 2049 Design Tokens (Crimson, Cyan, Asphalt).
- ✅ Reusable 3D & UI Components (Aurora, Spotlight, Marquee, Spline, Cards).

### Phase 2: Database & Auth Infrastructure (Next Up)
- Initialize Supabase locally.
- Write SQL migrations for all tables listed in the architecture.
- Set up Row Level Security (RLS) so only Admins can write to global tables.
- Build Database Triggers (e.g., automatically adding points to `profiles.total_score` when a submission is approved).
- Generate TypeScript types from the database schema.

### Phase 3: Authentication & Protected Routes
- Build Login / Signup pages.
- Integrate GitHub/Google OAuth.
- Set up Next.js Middleware to protect `/admin` and `/dashboard` routes.
- Build the User Profile setup flow.

### Phase 4: Core Public Displays (Team, Gallery, Blog)
- Build the Team/Alumni page with filters.
- Build the Media Gallery with Masonry layout and Lightbox.
- Build the Blog/Articles reading interface.
- Integrate the 3D Robo (Iron Man) into the Homepage Hero.

### Phase 5: The Competitive Engine (Events & Challenges)
- Build the Events timeline and registration flow.
- Build the Challenges board.
- Build the Submission form (GitHub + Live Link validation).

### Phase 6: Real-Time Leaderboard & User Dashboard
- Build the Real-Time Global Leaderboard using WebSockets.
- Build the User Dashboard (Activity Heatmap, Streaks, Badges).
- Implement PDF Certificate Generation (using `@react-pdf/renderer` or similar).

### Phase 7: The Admin Control Center
- Build the secure Admin layout.
- Build Data Tables for managing Users, Events, Challenges, Projects.
- Build the Submission Grading interface.
- Build the Platform Analytics dashboard.

### Phase 8: Polish & Deployment
- Final responsive design sweep.
- Performance optimization (lazy loading images).
- Deploy to Vercel and link Supabase Cloud.

---
*End of Architecture Document. We are currently preparing for Phase 2.*