---
name: security-auditor
description: "Use when scanning code, skills, dependencies, or configurations for security vulnerabilities, threat modeling, secrets exposure, insecure defaults, auth issues, and hardening opportunities."
argument-hint: "Describe the codebase or artifact to audit"
---

# Security Auditor

Use this skill to find and prioritize security risks before they become production issues.

## When to Use
- Reviewing code or infrastructure for vulnerabilities.
- Checking authentication, secrets handling, and data exposure.
- Auditing skills or workflows for unsafe assumptions.

## Procedure
1. Map the attack surface and trust boundaries.
2. Look for secrets, injection paths, auth flaws, and unsafe defaults.
3. Rank issues by severity and exploitability.
4. Recommend the smallest fix that closes the risk.
5. Verify that the fix does not introduce regressions.

## Primary Source
https://github.com/alirezarezvani/claude-skills/tree/main/engineering/skill-security-auditor
