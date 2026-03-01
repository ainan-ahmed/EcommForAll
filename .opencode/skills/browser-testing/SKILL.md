---
name: browser-testing
description: Test the EcommForAll UI using chrome-devtools-mcp tools. Use this when asked to test the UI or after making frontend code edits.
license: MIT
compatibility: opencode
---

## What I do

Use `chrome-devtools-mcp` tools to interactively test the EcommForAll frontend in a live Chrome browser. I navigate pages, interact with UI elements, capture screenshots, inspect console errors, and report findings.

## When to use me

- User explicitly asks to test something in the UI
- After making frontend code edits (small changes — test without asking; large/sweeping changes — ask user first)

## Workflow

### 1. Ensure the dev server is running

Before testing, check if the frontend dev server is up. If not, note it and ask the user to start it:

```
cd frontend && npm run dev
```

Default URL: `http://localhost:5173`

### 2. Navigate to the target page

Use `navigate_page` to open the relevant page.

### 3. Interact and observe

- Use `click`, `fill`, `fill_form`, `hover`, `press_key` for interactions
- Use `wait_for` after actions that trigger async updates
- Use `get_console_message` / `list_console_messages` to check for JS errors
- Use `list_network_requests` to verify API calls succeeded

### 4. Take screenshots

- Use `take_screenshot` before and after key interactions
- Capture the final state to show the user

### 5. Report findings

Always return a structured report:

```
## UI Test Report

**Page tested:** <url>
**What was tested:** <description>

### Results
- [ ] <check 1> — PASS / FAIL
- [ ] <check 2> — PASS / FAIL

### Console errors
<none | list errors>

### Network issues
<none | list failed requests>

### Screenshots
<attach / describe screenshots taken>

### Summary
<pass/fail overall, any issues found>
```

## Decision rule for post-edit testing

| Edit size | Action |
|-----------|--------|
| Small (1-3 files, cosmetic or isolated logic) | Test automatically without asking |
| Large (multiple domains, new features, auth flows, routing changes) | Ask user: "This was a large edit — do you want me to test the UI now?" |

## Constraints

- Always test against `http://localhost:5173` (Vite dev server) unless user specifies otherwise
- Do not assume the server is running — check first or navigate and verify the page loads
- If login is required for the tested flow, note this and ask the user for credentials if not already in context
- Keep screenshots focused on the changed/tested area
