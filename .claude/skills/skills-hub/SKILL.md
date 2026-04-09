---
name: skills-hub
description: "Use when you need to integrate, choose, or chain specialized skills for skill creation, frontend design, MCP servers, webapp testing, spreadsheet/document generation, Claude API integrations, deep research, YouTube transcript analysis, RAG architecture, database design, or security audits. Use when the task spans multiple of these domains or the best skill is unclear."
argument-hint: "Describe the task and any target skills"
---

# Skills Hub

Use this skill as the routing layer for the stable and community skills listed in [the skills index](./references/skills-index.md). It does not replace the underlying skills. It chooses the right one or chains several together in a safe order.

For the actual selection rules, use [the routing map](./references/routing-map.md).

## When to Use
- The request touches more than one specialty.
- You need to decide whether to use skill creation, frontend design, MCP, testing, docs, research, data, or security skills.
- The user asks to integrate, compare, reuse, or combine multiple skills.

## Included Skill Families
- Anthropic stable skills: skill creator, frontend design, MCP builder, webapp testing, XLSX, DOCX, Claude API.
- Community and engineering skills: deep research, YouTube transcript, RAG architect, database designer, security auditor.

## Installed Local Wrappers
- `skill-creator`
- `frontend-design`
- `mcp-builder`
- `webapp-testing`
- `xlsx`
- `docx`
- `claude-api`
- `deep-research`
- `youtube-transcript`
- `rag-architect`
- `database-designer`
- `security-auditor`

## Routing Procedure
1. Identify the primary deliverable.
2. Pick the first skill that directly produces that deliverable.
3. Add a research skill first if the request depends on external facts, APIs, or unknown source material.
4. Add a validation skill after implementation when the artifact can be tested, reviewed, or audited.
5. Add security review when the work touches code, dependencies, credentials, or model-facing interfaces.

## Decision Guide
- Skill writing or refinement -> skill creator.
- UI, layout, design systems, or polished frontend work -> frontend design.
- Model Context Protocol server work -> MCP builder.
- Browser-based app verification -> webapp testing.
- Complex spreadsheet generation or editing -> XLSX.
- Professional document formatting -> DOCX.
- Claude API integration across languages -> Claude API.
- Broad technical research -> deep research.
- Video transcript extraction and analysis -> YouTube transcript.
- Retrieval-Augmented Generation systems -> RAG architect.
- Database schemas and migrations -> database designer.
- Security review of code or skills -> security auditor.

## Completion Criteria
- The chosen skill or skill chain is explicit.
- The final artifact matches the requested domain.
- Any validation, testing, or review step has been run when applicable.
- The response names any follow-up skill that should be used next.
