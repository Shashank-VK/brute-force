# Workflow Plan: Phase 4 - Core Public Displays

This document outlines the strict, step-by-step execution plan for building the public-facing pages of Brute Force, including the Homepage Hero, Team Directory, Media Gallery, and Blog.

**Rule of Engagement:** This is a plan. No execution will occur until all phases are brainstormed and manual prerequisites are met.

## Objective
Build the highly visual, interactive, and responsive public pages using the Phase 1 Design System (Blade Runner 2049 / Iron Man aesthetics) and the Phase 2 Database/Auth infrastructure.

---

## Step 1: The Homepage & 3D Hero Integration (Agent Action)
The agent will build the `app/(public)/page.tsx` integrating the `3d_robo.txt` component.

1. **The Cinematic Loader (User Decision: Option B):**
   - Implement a high-tech glowing cyan spinner (`#00E5FF`) centered in the Hero section.
   - Use React `Suspense` and the `onLoad` event of the Spline component to ensure the spinner remains until the 3D Iron Man Robot is 100% loaded and interactive.
2. **The Aurora Fog:**
   - Place the `AuroraBackground` behind the text and 3D canvas, cycling through `void` (#0B0C10), `hologram` (#E63946), and `warning` (#FFB703) to create the atmospheric "fog" lighting the robot.
3. **The Tagline:**
   - Integrate `GooeyText` for the main tagline (e.g., "Build. Compete. Innovate. Deploy.") using `light` (#F4F6F8) text.
4. **Data Fetching:**
   - Fetch the Top 5 leaderboard entries, upcoming events, and featured projects from Supabase to populate the homepage preview sections.

---

## Step 2: The Team Directory (Agent Action)
The agent will build the `app/(public)/team/page.tsx` using the `bento-grid.tsx` component.

1. **The Hierarchy Grid (User Decision: Option B):**
   - Query the `team_members` and `profiles` tables.
   - Render a massive, single `BentoGrid` covering the entire page.
   - **Club Leads:** Rendered as large, 2-column wide cards with prominent `hologram` (#E63946) glowing borders on hover.
   - **Core Team & Members:** Rendered as standard, 1-column small cards with `glitch` (#00E5FF) glowing borders on hover.
2. **Filters & Toggles:**
   - Implement a skill/domain filter (e.g., Web, AI/ML, Design) using the `badge` component.
   - Implement an "Alumni" toggle switch to dynamically swap the grid data to past members.
3. **Interactivity:**
   - Each card will feature the `Spotlight (Ibelick)` mouse-following glow effect (Phase 1 component).

---

## Step 3: The Media Gallery (Agent Action)
The agent will build the `app/(public)/gallery/page.tsx` adhering to Web Weave requirements.

1. **Supabase Storage (User Decision: Option A):**
   - Create a public bucket in Supabase named `gallery_assets`.
   - Write the Supabase Storage fetch logic to pull album folders and image URLs.
2. **Masonry Layout:**
   - Implement a responsive Masonry grid (columns adjusting from 1 on mobile to 3/4 on desktop).
   - Use `next/image` for lazy loading and performance optimization.
3. **Lightbox Viewer:**
   - Implement a full-screen, immersive lightbox overlay (`void` background at 95% opacity) when an image is clicked.

---

## Step 4: The Blog / Technical Articles (Agent Action)
The agent will build the `app/(public)/blog/page.tsx` and individual post pages.

1. **Article Listing:**
   - Fetch published blogs from the `blogs` table.
   - Display them as Glass Cards with `warning` (#FFB703) accent borders.
2. **Markdown Rendering:**
   - Implement a markdown parser (e.g., `react-markdown` and `tailwindcss/typography`) to render the technical articles cleanly on the `app/(public)/blog/[slug]/page.tsx` route.

---
**End of Phase 4 Plan.**