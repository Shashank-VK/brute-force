# Skills Routing Map

This file is the working map for choosing skills. Use the smallest skill set that solves the task, then stop.

## Default Rule
- If the task is a single specialty, use one skill.
- If the task spans multiple specialties, start with the skill that produces the main deliverable, then add support skills only when needed.
- If the task depends on external facts or unfamiliar APIs, research first.
- If the task changes code, data models, secrets, or auth, add security review before finishing.

## Primary Skill Map

| Task type | Start with | Add next if needed |
|---|---|---|
| Create or refine a skill, prompt, agent, or instruction file | `skill-creator` | `security-auditor` if the artifact handles sensitive data or tooling |
| Design a polished interface or frontend layout | `frontend-design` | `webapp-testing` to verify the UI in a browser |
| Build or modernize an MCP server | `mcp-builder` | `claude-api` if the server calls Claude; `security-auditor` if auth or secrets are involved |
| Verify a web application flow | `webapp-testing` | `frontend-design` if the UI needs redesign after failures |
| Generate or edit spreadsheets | `xlsx` | `security-auditor` if formulas or data handling could expose sensitive data |
| Generate or edit Word documents | `docx` | No default follow-up unless formatting or content quality needs review |
| Integrate Claude API in code | `claude-api` | `security-auditor` if prompts, keys, or auth are involved; `webapp-testing` if the integration drives a UI |
| Perform broad technical research | `deep-research` | The domain skill that applies to the findings |
| Analyze a YouTube transcript | `youtube-transcript` | `deep-research` if the transcript needs source verification or comparison |
| Design a RAG system | `rag-architect` | `deep-research` for source review; `security-auditor` for data/privacy concerns |
| Design a database schema or migrations | `database-designer` | `security-auditor` if the model includes sensitive data or access control decisions |
| Audit code, dependencies, skills, or prompts for risk | `security-auditor` | The relevant domain skill to fix the issue after the audit |

## Chaining Rules
1. Research before implementation when facts are uncertain.
2. Implementation before validation when the deliverable can be tested.
3. Security review after implementation when the work touches code, config, data, or credentials.
4. Do not chain unrelated skills just because they are available.
5. Stop once the task outcome is satisfied; do not run every skill by default.

## Practical Examples
- New custom skill: `skill-creator` first, then `security-auditor` if it handles credentials or external execution.
- New landing page: `frontend-design` first, then `webapp-testing`.
- API-backed browser workflow: `claude-api` or `mcp-builder` first, then `webapp-testing`, then `security-auditor` if auth is present.
- Researching a design choice: `deep-research` first, then the domain skill that consumes the findings.
- Database change request: `database-designer` first, then `security-auditor`.

## Stop Conditions
- The chosen skill is obvious and only one is needed.
- The output has been validated or reviewed where applicable.
- The remaining work would only repeat the same checks without changing the result.
