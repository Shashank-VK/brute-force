# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This repository contains the design system, components, and architectural instructions for **Brute Force** — a university tech club platform. 
The project follows a Blade Runner 2049 holographic/neon-through-fog aesthetic and uses Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Supabase, and Framer Motion.

## Core Architecture & Workflow

### Mandatory Engineering Workflow
1. **Pre-Flight Check:** Run `/grill-me` -> `write-a-prd` -> `prd-to-plan` before writing code.
2. **Build Loop:** Build one "Tracer Bullet" (vertical slice) at a time. Use `frontend-design` for all UI/UX.
3. **Self-Annealing Loop:** If a skill/script fails: Fix it -> Test it -> Update the `SKILL.md` with the new lesson.

### Subagents Workflow
- Subagents (`code-reviewer`, `qa`, `research`) are read-only reporters. All code changes happen in the parent agent.
- `code-reviewer`: Must pass before any feature is considered "Done."
- `qa`: Must generate and run Playwright/Vitest tests for all new logic.
- Run `code-reviewer` and `qa` in parallel (`run_in_background: true`) for independent files.

### Context Management
- Use `context-mode` at the start of every session to map the project.
- **The 60% Rule:** If context reaches 60% capacity (~120k tokens), you MUST summarize the current state into `.tmp/SESSION_MAP.md` and run `/clear`.

## Technical Standards
- **Language:** Strict TypeScript (.ts/.tsx). No `any`. No `.js` or `.jsx`.
- **Styling:** Tailwind CSS with professional design tokens. Mobile-first design.
- **State:** Modular and predictable.

## Security & Guardrails
- **Destructive Actions:** NEVER use `rm -rf` on system directories. NEVER hardcode API keys.
- **Security Scans (Shannon Rule):** Run a security scan on all new API endpoints or database schemas before shipping.
- **Git:** Never push directly to `main`; always suggest a feature branch.
- **Deliverables vs Intermediates:** Local files are only for processing (`.tmp/`). Deliverables live in cloud services.

## Design System (Brute Force)

### Theme: Blade Runner 2049 Hologram
- One unified theme across the entire app (public, member, and admin pages). Admin is differentiated by layout (sidebar), not color.
- **Vibe:** Light exists in darkness. Fog, not neon signs. Glow effects are soft, diffused, and low-opacity. One light source per area.

### Color Palette
- **Void:** `#0A0514` (Deepest layer, all page backgrounds)
- **Glass:** `#140A29` (Cards/surfaces at 40% opacity + `backdrop-blur-md`)
- **Glass Border:** `#2D1B4E` (Thin resting borders)
- **Hologram (Primary):** `#E6007E` (Primary CTAs, active states, key highlights)
- **Glitch (Secondary):** `#00F0FF` (Hover effects, links, interactive feedback)
- **Light:** `#F2F0FF` (Primary text, headings, body text)
- **Shadow:** `#A39BBA` (Muted text, captions)
- **Status:** Success `#00FF88` (Easy), Warning `#FFB000` (Medium), Error `#FF3366` (Hard)
*Note: Hologram (#E6007E) is NEVER used as body text. Glitch and Hologram NEVER touch directly.*

### Typography
- **Display/Hero:** Space Grotesk (700)
- **Headings (h1-h3):** Space Grotesk (600, 700)
- **Body:** Inter (400, 500)
- **Data/Stats/Code:** JetBrains Mono (400, 500)

### UI Systems
- **Glass Card System:** Frosted glass resting state. Hover state gets a cyan border and soft cyan glow. Active state gets a magenta border and magenta glow.
- **Button System:** Hover states radiate light outward (box-shadow glow) rather than changing background color.
- **Aurora Background:** 60s infinite linear animation, opacity 30%, blur-10px, used sparingly (Hero, Auth, Error pages).

## Available Components Bank
1. ClubPulse 3D/2D
2. GooeyText Morphing
3. SplineScene
4. Spotlight (Aceternity)
5. Spotlight (Ibelick)
6. Card (shadcn)
7. PhotoGallery
8. AuroraBackground
9. NumberTicker (Magic UI)
10. Marquee (Magic UI)
11. Timeline (Aceternity UI)
12. BentoGrid (Aceternity UI)
