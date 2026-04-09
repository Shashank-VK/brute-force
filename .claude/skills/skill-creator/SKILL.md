---
name: skill-creator
description: "Use when creating, refining, packaging, or debugging custom skills, prompts, instructions, agents, tool rules, folder layouts, and skill frontmatter. Use for reusable workflows, discovery keywords, and skill iteration."
argument-hint: "Describe the skill or customization to create or refine"
---

# Skill Creator

Use this skill to turn a repeatable workflow into a reusable skill with strong discovery and clear procedures.

## When to Use
- Building a new skill from a workflow.
- Refining an existing skill's description, structure, or frontmatter.
- Troubleshooting why a skill is not being discovered or loaded.

## Procedure
1. Identify the repeated workflow and its decision points.
2. Write a keyword-rich description that matches the intended trigger phrases.
3. Keep the skill self-contained and move deep details into referenced files when needed.
4. Validate the folder name, `name` field, and frontmatter syntax.
5. Iterate after use based on what was ambiguous or brittle.

## Primary Source
https://github.com/anthropics/skills/tree/main/skills/skill-creator
