---
name: mcp-builder
description: "Use when building or modernizing Model Context Protocol servers, tools, resources, prompts, transports, schemas, auth flows, and MCP integrations."
argument-hint: "Describe the MCP server or tool surface to build"
---

# MCP Builder

Use this skill to design and implement an MCP server with clear tool boundaries and predictable behavior.

## When to Use
- Creating a new MCP server.
- Defining tools, resources, prompts, or transports.
- Reviewing auth, schema design, or client integration patterns.

## Procedure
1. Define the server purpose and the smallest useful tool surface.
2. Design request and response schemas before implementation.
3. Implement the transport and handlers with consistent error handling.
4. Test the server from a client perspective.
5. Document usage and expected inputs.

## Primary Source
https://github.com/anthropics/skills/tree/main/skills/mcp-builder
