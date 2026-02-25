---
name: server-status
description: Confirm whether the Docker stack or standalone dev servers are running for EcommForAll.
license: MIT
compatibility: opencode
---

## When to use me

- You need to verify if the dev environment is up before starting work (builds, tests, UI tests).
- You're troubleshooting server-related issues (backend, frontend, database) and need to know which process is responsible.

## What I do

- The project can run in two modes: a single Docker stack that hosts backend, frontend, and database containers, or individual commands (Maven, Vite, npm) when Docker isn't running.
- I inspect Docker first, then fall back to the specific server you asked about, and finally ask you to start anything that is off.

## Workflow

### 1. Check Docker

- Run `docker ps` or `docker compose ps` in the repo root to see if the containers are running; this is the preferred mode because it covers backend, frontend, and database in one shot.
- If Docker is active and the relevant containers exist, report that the stack is up and skip the lower-level checks.

### 2. Check the requested server

- If Docker is not running or not hosting the service you care about, determine which server the user referenced (e.g., Maven for backend, `npm run dev`/Vite for frontend, or another custom command).
- Verify that process is running (e.g., by checking a terminal output, running `ps`/`pgrep`, or looking at open ports); confirm the service is responsive before proceeding.

### 3. Ask for a start if nothing is running

- If neither Docker nor the requested standalone server is running, tell the user exactly which command they should run (e.g., "Please start the Docker stack" or "Run `cd frontend && npm run dev`").
- Flag that no server is currently available and that work cannot proceed until something is started.
