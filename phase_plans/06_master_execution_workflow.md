# Master Execution Workflow: Brute Force Build

This document outlines **HOW** the AI agent will execute the code generation process now that all phases have been brainstormed and documented.

## The Rule of Execution
The agent will execute exactly **one phase at a time**. 
1. The agent reads the corresponding plan document in `phase_plans/`.
2. The agent writes the necessary code (SQL, TSX, CSS).
3. The agent runs `npm run build` or local tests to verify the code compiles without Type errors.
4. The agent reports completion of the phase to the user.
5. The user reviews the browser (`localhost:3000`) and provides feedback.
6. Only after user approval does the agent move to the next phase.

---

## The Execution Order

### **Manual Prerequisites (USER ACTION REQUIRED FIRST)**
1. Open Docker Desktop and ensure the engine is running (Green Icon).
2. Open terminal in `C:/Users/shash/Desktop/club`.
3. Run `npx supabase start`.
4. Copy the `API URL` and `anon key` from the output.
5. Create a `.env.local` file at the root of the project:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_api_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
6. Reply to the agent: `"Manual setup complete. Execute Phase 2."`

---

### **Execution Phase 2: Database & Auth Infrastructure (AGENT ACTION)**
- **Target:** `phase_plans/01_phase_2_database_auth.md`
- **Output:** `supabase/migrations/00001_initial_schema.sql`, `types/supabase.ts`, `middleware.ts`, `lib/supabase/*.ts`, `app/(auth)/login/page.tsx`.
- **Validation:** Ensure `npx supabase db push` or local migration applies cleanly and types compile.

### **Execution Phase 4: Core Public Displays (AGENT ACTION)**
- **Target:** `phase_plans/02_phase_4_core_public_displays.md`
- **Output:** `app/(public)/page.tsx` (Hero + 3D Robo Loader + Aurora + GooeyText), `app/(public)/team/page.tsx` (Bento Grid), `app/(public)/gallery/page.tsx` (Masonry Storage), `app/(public)/blog/page.tsx`.
- **Validation:** Ensure the 3D model loads efficiently and the Bento Grid correctly sizes the Club Leads.

### **Execution Phase 5: The Competitive Engine (AGENT ACTION)**
- **Target:** `phase_plans/03_phase_5_competitive_engine.md`
- **Output:** `app/(public)/events/page.tsx`, `app/(public)/challenges/page.tsx`, Challenge Submission Forms.
- **Validation:** Ensure strict Regex validation on GitHub URLs and duplicate prevention on submissions.

### **Execution Phase 6: Leaderboard & Dashboard (AGENT ACTION)**
- **Target:** `phase_plans/04_phase_6_leaderboard_dashboard.md`
- **Output:** `app/(public)/leaderboard/page.tsx` (WebSockets), `app/(protected)/dashboard/page.tsx` (Heatmap & Streaks).
- **Validation:** Ensure real-time subscription connects without errors and Heatmap renders 52 weeks correctly.

### **Execution Phase 7: Admin Control Center (AGENT ACTION)**
- **Target:** `phase_plans/05_phase_7_admin_control_center.md`
- **Output:** `app/(protected)/admin/layout.tsx` (Sidebar), `app/(protected)/admin/[resource]/page.tsx` (CRUD Tables, Split-Pane Review, Recharts Dashboard).
- **Validation:** Ensure role guard strictly bounces `MEMBER` roles back to the homepage.

---

### **Final Polish & Handoff (PHASE 8)**
- Full responsive sweep (mobile view testing).
- Deployment instructions for Vercel + Supabase Cloud.
- Generation of the final `README.md` for the Hackathon judges.

---
**End of Master Execution Workflow.**