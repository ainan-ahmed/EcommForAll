# OpenCode Agents Registry

This directory contains custom OpenCode agents for this project. Each agent is specialized for specific tasks and can be invoked using the `@` mention syntax.

## Directory Structure

```
.opencode/
├── agents/                 # Agent configs only
│   └── <agent-name>.md      # Agent configuration (REQUIRED)
docs/opencode/agents/        # Documentation only (not loaded as agents)
├── README.md                # This file - agents registry
├── QUICKSTART.md            # Quick reference
└── TEMPLATE.md              # Template for creating new agents
```

## Available Agents

### 1. GitHub Agent

**Invocation**: `@github-agent`  
**Type**: Subagent  
**Focus**: Pull Request Management & GitHub Operations

**Capabilities**:
- Create and manage pull requests
- Review code changes and provide feedback
- Check CI/CD status and merge readiness
- Manage PR comments, labels, and reviewers
- Execute GitHub CLI operations

**Location**: `.opencode/agents/github-agent.md`  
**Documentation**: This document

**Quick Examples**:
```
@github-agent create a PR for my current branch
@github-agent review PR #123 and check if it's ready to merge
@github-agent what's the CI status of all my open PRs?
```

---

## Creating New Agents

### Step 1: Create Agent Configuration File

Create `.opencode/agents/<agent-name>.md` with YAML frontmatter and instructions:

```markdown
---
description: Brief description of what this agent does
mode: subagent          # or "primary"
model: google/gemini-3-flash
temperature: 0.2        # 0.0 (deterministic) to 1.0 (creative)
tools:
  bash: true           # Enable/disable specific tools
  read: true
  write: false
  edit: false
  grep: true
  glob: true
  task: false
  webfetch: true
permission:
  write: deny           # Additional permission controls
  edit: deny
---

# Agent Name

You are a specialized agent for [purpose].

## Core Responsibilities

[List main tasks this agent handles]

## Working Principles

[Guidelines for how the agent should work]

## Best Practices

[Best practices and examples]
```

### Step 2: (Optional) Add Documentation

Keep documentation in `docs/opencode/agents/` so it is not loaded as an agent.

### Step 3: Register Agent (Update This File)

Add your new agent to the "Available Agents" section above.

### Step 4: Test Agent

```bash
# Restart OpenCode to load new agent
# Test invocation
@AgentName help me with [task]
```

## Agent Configuration Reference

### Frontmatter Options

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `description` | string | Brief agent description | "Reviews code for quality" |
| `mode` | string | `subagent` or `primary` | `subagent` |
| `model` | string | AI model to use | `anthropic/claude-sonnet-4-20250514` |
| `temperature` | number | 0.0 to 1.0, controls randomness | `0.2` |
| `tools` | object | Enable/disable tools | `{bash: true, write: false}` |
| `permission` | object | Additional permissions | `{write: deny, edit: deny}` |

### Available Tools

| Tool | Purpose | Common Use Cases |
|------|---------|------------------|
| `bash` | Execute shell commands | Run CLI tools, git operations |
| `read` | Read file contents | Analyze code, review files |
| `write` | Create new files | Generate code, create configs |
| `edit` | Modify existing files | Refactor code, fix bugs |
| `grep` | Search file contents | Find patterns, search code |
| `glob` | Find files by pattern | Locate files, explore structure |
| `task` | Spawn sub-agents | Delegate complex tasks |
| `webfetch` | Fetch web content | Get documentation, research |
| `todowrite` | Manage task lists | Track progress, plan work |

### Agent Modes

**Subagent** (`mode: subagent`):
- Invoked with `@mention`
- Works alongside main agent
- Specialized for specific tasks
- Cannot be primary session agent
- Best for: focused tools, specific domains

**Primary** (`mode: primary`):
- Can be main agent for sessions
- Can be invoked with `@mention`
- Handles broad range of tasks
- Best for: alternative main agents, specialized workflows

## Agent Naming Conventions

### Directory Names
- Use lowercase with hyphens: `github`, `code-reviewer`, `test-runner`
- Be descriptive but concise
- Match the agent's primary function

### Invocation Names
OpenCode automatically creates invocation names from:
1. **Directory name**: `.opencode/agents/github/` → `@github`
2. **Filename**: `.opencode/agents/security.md` → `@security`

**Tips**:
- Short names are easier to type: `@gh` vs `@github-operations`
- Use descriptive names: `@reviewer` vs `@agent1`
- Avoid conflicts with OpenCode built-ins

### File Organization

**Required**:
- `agent.md` - Agent configuration (OpenCode reads this)

**Recommended**:
- `README.md` - Comprehensive documentation
- `.gitignore` - Ignore temporary/sensitive files

**Optional**:
- `examples/` - Example workflows and use cases
- `prompts/` - Additional prompt templates
- `scripts/` - Helper scripts for the agent
- `tests/` - Test cases for agent behavior
- `config/` - Additional configuration files

## Best Practices

### Agent Design
1. **Single Responsibility**: Each agent should have a clear, focused purpose
2. **Clear Boundaries**: Define what the agent does and doesn't do
3. **Tool Permissions**: Only enable tools the agent needs
4. **Documentation**: Comprehensive README for user guidance
5. **Examples**: Provide real-world usage examples

### Configuration
1. **Appropriate Model**: Use faster models for simple tasks, powerful models for complex ones
2. **Temperature Control**: Lower for deterministic tasks (0.1-0.2), higher for creative tasks (0.5-0.7)
3. **Security**: Deny write/edit permissions for read-only agents
4. **Tool Minimization**: Disable unused tools to prevent unintended behavior

### Documentation
1. **Quick Start**: Show common commands first
2. **Examples**: Include real workflow examples
3. **Troubleshooting**: Document common issues
4. **Integration**: Explain how agent works with main agent

### Maintenance
1. **Version Control**: Commit agent configs to git
2. **Changelog**: Document changes in README
3. **Testing**: Verify agent behavior after changes
4. **Updates**: Keep model versions current

## Example Agent Structures

### Simple Agent (Minimal)
```
.opencode/agents/linter/
└── agent.md
```

### Standard Agent (Recommended)
```
.opencode/agents/github/
├── agent.md
└── README.md
```

### Complex Agent (Full-featured)
```
.opencode/agents/test-runner/
├── agent.md
├── README.md
├── examples/
│   ├── unit-tests.md
│   └── integration-tests.md
└── prompts/
    └── test-analysis.txt
```

## Agent Ideas

Potential agents you might want to create:

- **Code Reviewer** - Review PRs and provide feedback
- **Test Runner** - Execute and analyze test results
- **Documentation Writer** - Generate and update docs
- **Security Auditor** - Scan for security issues
- **Performance Analyzer** - Profile and optimize code
- **Database Manager** - Handle migrations and queries
- **API Tester** - Test API endpoints
- **Deployment Agent** - Manage deployments
- **Refactor Assistant** - Help with code refactoring
- **Bug Tracker** - Integrate with issue trackers

## Troubleshooting

### Agent Not Found
**Problem**: `@AgentName` doesn't work

**Solutions**:
1. Check file exists: `ls .opencode/agents/<name>/agent.md`
2. Verify YAML frontmatter is valid
3. Restart OpenCode
4. Check directory structure matches conventions

### Agent Behaves Unexpectedly
**Problem**: Agent does things it shouldn't

**Solutions**:
1. Review tool permissions in `agent.md`
2. Check `permission` section for denials
3. Clarify instructions in agent body
4. Adjust temperature setting
5. Test with explicit instructions

### Agent Conflicts
**Problem**: Multiple agents have similar names

**Solutions**:
1. Use unique directory names
2. Rename conflicting agents
3. Use full name: `@github-reviewer` vs `@github`
4. Document which agent to use when

## Resources

- **OpenCode Agents Documentation**: https://opencode.ai/docs/agents
- **Agent Configuration Schema**: https://opencode.ai/config.json
- **Example Agents**: https://github.com/anomalyco/opencode/tree/main/examples/agents
- **Community Agents**: https://github.com/topics/opencode-agent

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-15 | Initial registry with GitHub agent |

---

**Registry Location**: `docs/opencode/agents/README.md`
**Project**: EcommForAll  
**Maintained by**: Project team
