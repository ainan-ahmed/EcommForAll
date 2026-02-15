# GitHub Agent

**Type**: Subagent  
**Invocation**: `@GithubAgent` or `@github`  
**Focus**: Pull Request Management & GitHub Operations

## Overview

The GitHub Agent is a specialized subagent that handles all GitHub-related operations including PR creation, code reviews, status checks, and repository management. It works alongside the main OpenCode agent to provide seamless GitHub workflow integration.

## Quick Start

### Basic Usage

Invoke the agent using the `@` mention:

```
@GithubAgent create a PR for my current branch
@github review PR #123
```

### Common Commands

| Action | Example |
|--------|---------|
| **Create PR** | `@github create a PR to main with a detailed description` |
| **Review PR** | `@github review PR #456 and provide feedback` |
| **Check Status** | `@github what's the CI status of PR #789?` |
| **Update PR** | `@github add label "bug" and assign @reviewer to PR #123` |
| **List PRs** | `@github show all my open PRs` |
| **Approve PR** | `@github approve PR #555 if everything looks good` |
| **Add Comment** | `@github comment on PR #666: "Great work!"` |

## Capabilities

### ✅ Pull Request Management
- Create PRs with comprehensive descriptions
- Update PR titles, descriptions, and metadata
- Add/remove labels, reviewers, assignees
- Manage PR milestones
- Merge PRs with safety checks

### ✅ Code Review
- Analyze PR diffs and changes
- Review code quality and patterns
- Check for potential issues
- Provide structured feedback
- Submit formal reviews (approve/comment/request changes)

### ✅ Status & CI/CD
- Check CI/CD pipeline status
- Monitor GitHub Actions workflows
- Verify all checks are passing
- Track merge readiness

### ✅ Comments & Discussions
- Read existing PR comments
- Add general comments
- Respond to review threads
- Resolve conversations

### ✅ Repository Operations
- Compare branches
- Check branch status and sync
- View repository metadata
- Manage repository settings

### ❌ Not Supported
- Code editing (use main agent)
- File creation/modification (use main agent)
- Local git operations beyond status checks

## Configuration

**Model**: `anthropic/claude-sonnet-4-20250514`  
**Temperature**: `0.2` (balanced consistency)  
**Mode**: `subagent`

### Enabled Tools
- `bash` - Execute gh CLI commands
- `read` - Read files for context
- `grep` - Search code content
- `glob` - Find files by pattern
- `webfetch` - Fetch GitHub documentation

### Disabled Tools
- `write` - File modification (use main agent)
- `edit` - Code editing (use main agent)
- `task` - Sub-agent spawning (works independently)

## Workflow Examples

### Example 1: Feature Development Flow

```
User: Implement user authentication feature
[Main agent writes code and commits]

User: @github create a PR for this feature
GitHub Agent:
  → Analyzes all commits since branch diverged
  → Reviews full diff from main branch
  → Checks branch is pushed to remote
  → Creates PR with comprehensive description including:
    - Feature summary
    - List of changes
    - Testing instructions
  → Returns PR URL

User: @github check if CI is passing
GitHub Agent:
  → Runs gh pr checks
  → Reports status of all CI/CD checks
  → Identifies any failing checks with details
```

### Example 2: Code Review Flow

```
User: @github review PR #789
GitHub Agent:
  → Fetches PR metadata (title, author, description)
  → Reviews all commits in the PR
  → Analyzes code diff
  → Checks CI/CD status
  → Reviews existing comments
  → Provides structured feedback on:
    - Code quality
    - Potential issues
    - Best practices
    - Security concerns

User: @github approve it if everything looks good
GitHub Agent:
  → Verifies all checks pass
  → Confirms no blocking issues
  → Submits approval review
```

### Example 3: PR Management Flow

```
User: @github show me all open PRs assigned to me
GitHub Agent:
  → Lists PRs with gh pr list --assignee @me
  → For each PR shows:
    - PR number and title
    - CI/CD status
    - Review status
    - Merge conflicts (if any)
  → Provides actionable summary

User: @github merge PR #555 if ready
GitHub Agent:
  → Checks CI/CD status (must pass)
  → Verifies required reviews (must be approved)
  → Checks for merge conflicts (must be clean)
  → Merges PR with appropriate strategy
  → Confirms merge success
```

## Integration with Main Agent

The GitHub agent is designed to complement the main OpenCode agent:

| Main Agent | GitHub Agent |
|------------|--------------|
| Write code | Create PRs |
| Edit files | Review code |
| Implement features | Check CI/CD |
| Refactor code | Manage PR metadata |
| Run tests locally | Monitor GitHub checks |
| Commit changes | Merge PRs |

**Example Coordination**:
```
1. User: "Add shopping cart feature"
   → Main agent implements feature

2. User: "commit the changes"  
   → Main agent creates commit

3. User: "@github create a PR"
   → GitHub agent analyzes and creates PR

4. Reviewer comments on PR
   → User: "fix the issues mentioned"
   → Main agent makes corrections

5. User: "@github check if ready to merge"
   → GitHub agent verifies and merges
```

## Best Practices

### Creating PRs
- Let main agent commit changes first
- Ensure branch is pushed to remote
- Provide context about the changes to help generate better descriptions
- Use descriptive branch names

### Reviewing PRs
- Review PRs by number: `@github review PR #123`
- Ask for specific checks: "are there security issues?"
- Request focused analysis: "check error handling patterns"

### Managing PRs
- Always check CI status before merging
- Verify required approvals are in place
- Ensure branch is up-to-date with base branch
- Review merge conflicts before attempting merge

### Communication
- Be specific with PR numbers and branch names
- Ask follow-up questions for clarification
- Use the agent for GitHub operations only
- Let main agent handle code modifications

## Prerequisites

### Required: GitHub CLI
The agent uses `gh` CLI for all GitHub operations.

**Install**:
```bash
# macOS
brew install gh

# Linux (Debian/Ubuntu)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Windows
winget install --id GitHub.cli
```

**Authenticate**:
```bash
gh auth login
```

**Verify**:
```bash
gh auth status
```

## Troubleshooting

### Agent Not Found
**Problem**: `@GithubAgent` doesn't invoke the agent

**Solutions**:
1. Verify file exists: `ls .opencode/agents/github/agent.md`
2. Check OpenCode recognizes the agent: restart OpenCode
3. Try alternative name: `@github`
4. Ensure YAML frontmatter is valid

### GitHub CLI Errors
**Problem**: `gh` commands fail with authentication errors

**Solutions**:
1. Check authentication: `gh auth status`
2. Re-authenticate: `gh auth login`
3. Verify repository access: `gh repo view`
4. Check you're in a git repository: `git status`

### Permission Denied
**Problem**: Agent tries to edit files or create tasks

**Solutions**:
1. Verify `agent.md` has `write: false` and `edit: false`
2. Check permissions section: `write: deny`, `edit: deny`
3. Restart OpenCode after configuration changes

### PR Creation Fails
**Problem**: PR creation fails with "branch not found"

**Solutions**:
1. Ensure branch is pushed: `git push -u origin <branch>`
2. Verify remote tracking: `git status`
3. Check branch name matches remote: `git branch -vv`

### CI Status Not Available
**Problem**: Cannot fetch CI/CD status

**Solutions**:
1. Ensure workflows are configured in `.github/workflows/`
2. Check workflow has run at least once
3. Verify permissions with: `gh pr checks <number>`

## Customization

### Modify Agent Behavior
Edit `.opencode/agents/github/agent.md`:

**Change Model**:
```yaml
model: anthropic/claude-haiku-4-20250514  # Faster, cheaper
```

**Adjust Temperature**:
```yaml
temperature: 0.1  # More deterministic
temperature: 0.5  # More creative responses
```

**Enable Additional Tools**:
```yaml
tools:
  task: true  # Allow spawning sub-agents
  write: true # Allow file creation (careful!)
```

**Add Custom Instructions**:
Add additional guidelines in the markdown body after frontmatter.

### Add Custom Workflows
Extend the agent's capabilities by adding custom workflow examples:

```markdown
## Custom Workflow: Auto-label PRs

When creating PRs, automatically add labels based on:
- File types changed (frontend/backend)
- Size of changes (small/medium/large)
- Affected domains (auth/payment/ui)
```

## Advanced Usage

### Batch Operations
```
@github for each open PR assigned to me, check CI status and report which are ready to merge
```

### Conditional Operations
```
@github merge PR #123 only if all checks pass and there are at least 2 approvals
```

### Cross-reference Analysis
```
@github compare the changes in PR #123 and PR #456 - are there any conflicts?
```

### Historical Analysis
```
@github show me all PRs merged last week and their review times
```

## Additional Resources

- **Agent Configuration**: `agent.md` (in this directory)
- **GitHub CLI Docs**: https://cli.github.com/manual/
- **OpenCode Agent Docs**: https://opencode.ai/docs/agents
- **GitHub PR Best Practices**: https://docs.github.com/en/pull-requests

## Support

For issues with:
- **Agent behavior**: Edit `agent.md` configuration
- **GitHub CLI**: Check `gh` documentation
- **OpenCode integration**: See OpenCode documentation
- **This repository**: Check project's main README

---

**Agent Path**: `.opencode/agents/github/agent.md`  
**Documentation**: `.opencode/agents/github/README.md`  
**Version**: 1.0.0  
**Last Updated**: 2026-02-15
