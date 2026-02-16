# CI/CD Workflows

This document describes the automated GitHub Actions workflows configured for the EcommForAll project.

## Overview

The project uses GitHub Actions to automatically check code quality, formatting, and build status on every pull request. These workflows help maintain code consistency and catch issues early.

## Workflows

### 1. Backend Build Check (`maven.yml`)

**Purpose:** Validates that the backend builds successfully without compilation errors.

**Triggers:**
- Pull requests opened, updated, or reopened to `dev` or `main` branches

**What it does:**
- Sets up JDK 21 (Temurin distribution)
- Builds the backend with Maven (skips tests for faster feedback)
- Posts inline comments on Java files if compilation errors occur
- Uses reviewdog to provide detailed error feedback

**Command run:**
```bash
mvn -B package -DskipTests --file backend/pom.xml
```

**Workflow file:** `.github/workflows/maven.yml`

**Status:**
- ✅ **Pass** - Backend builds successfully
- ❌ **Fail** - Compilation errors detected
- 💬 **Comments** - Inline comments on error lines (via reviewdog)

---

### 2. Frontend Format & Lint Check (`frontend-format-check.yml`)

**Purpose:** Ensures frontend code follows consistent formatting and linting standards.

**Triggers:**
- Pull requests opened, updated, or reopened
- Only when `.ts`, `.tsx`, or `.css` files change in `frontend/`

**What it does:**
1. **Prettier Check:**
   - Validates code formatting (spacing, quotes, line width, etc.)
   - Checks `.ts`, `.tsx`, and `.css` files
   - Posts inline comments on lines with formatting issues

2. **ESLint Check:**
   - Validates code quality and best practices
   - Checks for unused variables, missing types, etc.
   - Posts inline comments on problematic code

**Commands run:**
```bash
npm run format:check  # Prettier
npm run lint          # ESLint
```

**Workflow file:** `.github/workflows/frontend-format-check.yml`

**Status:**
- ⚠️ **Warning** - Formatting or linting issues detected (doesn't block merge)
- ✅ **Pass** - All checks pass
- 💬 **Comments** - Inline comments on specific lines (via reviewdog)

---

### 3. OpenCode AI Assistant (`opencode.yml`)

**Purpose:** Enables AI-assisted code review and development via `/oc` commands.

**Triggers:**
- Comments on issues or PRs containing `/oc` or `/opencode` commands

**What it does:**
- Runs OpenCode AI assistant for automated code review
- Responds to developer requests in PR/issue comments
- Uses Google Gemini 3 Flash model

**Workflow file:** `.github/workflows/opencode.yml`

---

## Local Development Commands

Before pushing, developers can run these commands locally to catch issues early:

### Frontend

```bash
cd frontend

# Check formatting
npm run format:check

# Auto-fix formatting
npm run format

# Check linting
npm run lint

# Run all checks
npm run format:check && npm run lint
```

### Backend

```bash
# Build without tests (matches CI)
./backend/mvnw -B package -DskipTests --file backend/pom.xml

# Build with tests
./backend/mvnw -B package --file backend/pom.xml

# Run just tests
./backend/mvnw -B test --file backend/pom.xml
```

---

## Configuration Files

### Prettier Configuration (`frontend/.prettierrc`)

```json
{
    "semi": true,
    "tabWidth": 4,
    "printWidth": 100,
    "singleQuote": false,
    "trailingComma": "es5",
    "arrowParens": "always",
    "endOfLine": "lf"
}
```

**Style rules:**
- 4 spaces for indentation
- Double quotes for strings
- 100 character line width
- LF line endings
- Semicolons required
- Trailing commas in ES5-compatible locations

### ESLint Configuration

See `frontend/eslint.config.js` for linting rules.

---

## Workflow Behavior

### Option A: Non-Blocking Checks (Current)

**How it works:**
- Workflows run automatically on PRs
- Checks post inline comments on issues
- Check status shows as ✅ or ⚠️
- **Merging is NOT blocked** - developers can merge regardless of status
- Great for informational feedback without blocking development

**When to use:**
- Code quality issues (formatting, style)
- Non-critical warnings
- Flexible development workflow

### Option B: Required Checks (Optional)

**How to enable:**
1. Go to GitHub → Settings → Branches → Branch protection rules
2. Select `dev` and/or `main` branch
3. Enable "Require status checks to pass before merging"
4. Select: `Frontend Format & Lint Check` and `build`
5. Admins can still bypass if needed

**When to use:**
- Enforce code quality standards
- Prevent broken builds from merging
- More rigid development workflow

---

## Reviewdog Integration

Both workflows use **reviewdog** to post inline code comments.

**Benefits:**
- Comments appear directly on problematic lines
- Links to specific files and line numbers
- Better developer experience than reading logs
- Supports multiple tools (Prettier, ESLint, Maven)

**Example comment:**
```
🤖 prettier: Replace `'` with `"`

frontend/src/test-formatting.tsx:1:29
```

---

## Troubleshooting

### Workflow doesn't run

**Check:**
- Is the PR targeting `dev` or `main`?
- For frontend workflow: Did you change `.ts`, `.tsx`, or `.css` files?
- Are workflows enabled in repository settings?

### Checks fail locally but pass in CI (or vice versa)

**Possible causes:**
- Different Node.js or Java versions
- Cached dependencies (`npm ci` vs `npm install`)
- Different operating system (line endings)

**Fix:**
```bash
# Frontend: ensure clean install
rm -rf node_modules package-lock.json
npm install

# Backend: clear Maven cache
./backend/mvnw clean
```

### Prettier/ESLint conflicts

**Solution:**
Prettier handles formatting (spacing, quotes, etc.), ESLint handles code quality.
Run Prettier first, then ESLint:

```bash
npm run format
npm run lint
```

---

## Best Practices

### Before Submitting a PR

1. **Run checks locally:**
   ```bash
   # Frontend
   cd frontend && npm run format && npm run lint
   
   # Backend
   ./backend/mvnw -B package -DskipTests --file backend/pom.xml
   ```

2. **Review workflow comments:**
   - Check the "Checks" tab on your PR
   - Address inline comments from reviewdog
   - Push fixes to update the PR

3. **Keep PRs focused:**
   - Small, focused changes are easier to review
   - Workflows run faster on smaller diffs

### For Maintainers

1. **Review workflow results:**
   - Check both "Checks" and "Files changed" tabs
   - Look for patterns in formatting issues
   - Use comments as teaching moments

2. **Update configuration:**
   - Prettier/ESLint rules in `frontend/` config files
   - Maven settings in `backend/pom.xml`
   - Workflow triggers in `.github/workflows/*.yml`

3. **Monitor workflow performance:**
   - Average run time should be < 5 minutes
   - Cached dependencies speed up subsequent runs
   - Adjust triggers if workflows run too often

---

## Future Enhancements

Potential improvements to consider:

- [ ] Add automated tests to workflows
- [ ] Add code coverage reporting
- [ ] Add security scanning (Dependabot, Snyk)
- [ ] Add Docker image builds
- [ ] Add automatic deployment to staging
- [ ] Add backend formatting with Spotless or Checkstyle
- [ ] Add commit message linting (Conventional Commits)

---

## Related Documentation

- [AGENTS.md](../AGENTS.md) - Development commands and conventions
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [README.md](../README.md) - Project overview
- [frontend/.prettierrc](../frontend/.prettierrc) - Prettier config
- [frontend/eslint.config.js](../frontend/eslint.config.js) - ESLint config

---

**Last Updated:** February 2026
