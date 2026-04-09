# Comprehensive Analysis: Brute Force Build Guide (v1.0)

This document extracts all specified details from the 145-page `Build Guide Club 1.pdf`, acting as a verification checklist for the project's implementation.

## 1. Project Identity & Strategy (Pages 1-4)
*   **Features:** Centralized club management serving one club (Brute Force). Eliminates fragmented WhatsApp/Drive systems.
*   **Target Users:** 
    *   **Visitor:** View public pages (homepage, team, events, challenges, projects, gallery, leaderboard, blog). Prompted to sign in for interactions.
    *   **Student (Member):** Register for events, submit challenge solutions, like projects, dashboard, earn badges, streak tracking.
    *   **Admin:** Full CRUD access, review/grade submissions, platform analytics.
*   **Design Focus:** Accounts for 25% of hackathon scoring. Emphasizes Blade Runner 2049 aesthetic (see Section 6/Appendix).

## 2. System Architecture & Tech Stack (Pages 4-15)
*   **Architecture:** 3-layer approach (Next.js client, Next.js API/Server Actions, Supabase DB/Auth/Realtime).
*   **Data Fetching:** 4 allowed methods: Server Component direct fetches, Server Actions (mutations), TanStack Query + Supabase Client, API routes (webhooks).
*   **Realtime Subscriptions:** 4 channels required: Global leaderboard, Challenge leaderboard, User notifications, Announcements.
*   **Dependencies:** Next.js 14, React 18, Tailwind CSS, Framer Motion, Supabase SSR/JS, shadcn/ui, Radix UI, Lucide React, TanStack Query, React Hook Form, Zod, Tiptap, DOMPurify, React Three Fiber, jsPDF + html2canvas.

## 3. Data Model & Database Requirements (Pages 16-41)
*   **Database:** PostgreSQL (Supabase) with RLS enforced on all tables.
*   **Tables Specified:**
    *   `profiles`: Created via trigger on auth. Includes `total_score`, `current_streak`.
    *   `team_members`: Manual admin CRUD, tracking roles, batch year, alumni status.
    *   `events` & `event_registrations`: Track registrations, timestamps, categories.
    *   `challenges` & `submissions`: Submissions require GitHub URL; Admins set `score` and `time_bonus`.
    *   `projects` & `project_likes`: Feature flags, tech stack tracking, like counters.
    *   `gallery_albums` & `gallery_images`: Ordered albums tied to events.
    *   `notifications` & `announcements`: Alerts and ticker messages.
    *   `badges` & `user_badges`: Gamification system (e.g., First Submission, Legend).
    *   `blog_posts`, `certificates`, `admin_audit_log`.
*   **Triggers:** Auto-create profile, update event registration count, update project likes count, update user total score (most critical).

## 4. Auth & Security (Pages 42-45)
*   **Auth Flow:** Email/password via Supabase Auth + Trigger. OAuth deferred.
*   **Security Requirements:** DOMPurify strict config (no scripts/iframes), PKCE flow for CSRF, parameterized queries, RLS on every table.

## 5. Design System Requirements (Pages 45-57, Updated Pages 143-145)
*   **Theme Update (Blade Runner 2049 Hologram):** The original color palette (Navy/Red) was overridden. 
*   **Color Palette:**
    *   `void` (#0A0514): Deepest layer background.
    *   `glass` (#140A29): Cards/surfaces at 40% opacity with `backdrop-blur-md`.
    *   `glass-border` (#2D1B4E): Thin resting borders.
    *   `hologram` (#E6007E): Primary CTAs, key highlights.
    *   `glitch` (#00F0FF): Hover effects, links.
    *   `light` (#F2F0FF): Primary text.
    *   `shadow` (#A39BBA): Muted text/captions.
    *   `success` (#00FF88), `warning` (#FFB000), `error` (#FF3366).
*   **Typography:** Space Grotesk 700 (Display), Space Grotesk 600/700 (Headings), Inter 400/500 (Body), JetBrains Mono 400/500 (Data/Code/Stats).
*   **Animations:** AuroraBackground (60s linear infinite), Aceternity Spotlight beam. Hover cards lift (shadow-xl) and glow. "Breathing room" layout spacing.

## 6. Route Map & UI Specifications (Pages 58-71)
*   **Homepage (`/`):**
    *   **Hero:** Void background, Aurora + Spotlight, 3D Club Pulse viz. Buttons: "Join Brute Force" (Hologram CTA), "Explore".
    *   **Stats Bar:** Counting animations (JetBrains Mono).
    *   **Carousels:** Upcoming Events (with countdown), Active Challenges (with difficulty badges), Our Projects (Featured).
    *   **Other:** Top 5 Leaderboard, Announcements Ticker (marquee), Footer.
*   **Navbar:** Glass card style (`bg-[#140A29]/40 backdrop-blur-md`). Notification bell with red unread count badge.
*   **Team (`/team`):** Filters for Role, Batch, Domain. Alumni toggle. Click card -> modal with full details.
*   **Events (`/events` & `/events/[id]`):** Upcoming/Past tabs. Cards have 16:9 banner, live countdown timer (Days:Hours:Mins:Secs). Register button logic changes based on auth state.
*   **Challenges (`/challenges` & `/challenges/[id]/submit`):** Difficulty badges mapped to theme status colors (Easy=Success, Medium=Warning, Hard=Error). Submission requires GitHub URL. Duplicate check warning (60s debounce).
*   **Projects (`/projects` & `/projects/[id]`):** Searchable by title and tech stack. Likes counter with optimistic UI updates. Screenshots carousel.
*   **Gallery (`/gallery` & `/gallery/[albumId]`):** Masonry grid, lazy loaded. Lightbox with keyboard navigation.
*   **Leaderboard (`/leaderboard`):** Real-time client component. Rank badges (Newbie, Contributor, Expert, Legend). Top 3 highlighted with special styling.
*   **Admin Routes (`/admin/*`):** Requires admin role check. Includes audit log viewer, rich text editors (Tiptap), image uploads.

## 7. Operational & Specific Features (Pages 126-145)
*   **Gamification/Badges:** "First Submission", "First Win", "Challenge Veteran", "Event Regular", "Legend".
*   **Certificates:** html2canvas + jsPDF to render/download certificates for attended events.
*   **File Upload Limits:** Avatars (2MB), others (5MB). JPG, PNG, WebP only.
*   **Environment Variables:** Safe variables prefixed `NEXT_PUBLIC_`, `SUPABASE_SERVICE_ROLE_KEY` is server-only.
