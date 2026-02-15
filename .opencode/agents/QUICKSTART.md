# Quick Start: OpenCode Agents

## Current Structure ✅

```
.opencode/
└── agents/
    ├── README.md              # Agent registry and documentation
    ├── TEMPLATE.md            # Template for creating new agents
    ├── .gitignore             # Ignore temporary/sensitive files
    └── github/                # GitHub agent (example)
        ├── agent.md           # Agent configuration (OpenCode reads this)
        └── README.md          # Agent documentation
```

## Using the GitHub Agent

```
@GithubAgent create a PR for my current branch
@github review PR #123
```

## Creating a New Agent

### Quick Method

1. **Copy template structure**:

```bash
   mkdir -p .opencode/agents/<agent-name>
   cp .opencode/agents/TEMPLATE.md .opencode/agents/<agent-name>/agent.md
   ```

1. **Edit configuration**: Update frontmatter in `agent.md`

2. **Write instructions**: Add agent behavior in markdown body

3. **Create documentation**: Add `README.md` in the agent directory

4. **Register agent**: Add entry to `.opencode/agents/README.md`

5. **Test**: Restart OpenCode and invoke with `@agent-name`

### Detailed Method

See `.opencode/agents/README.md` → "Creating New Agents" section

## Agent Directory Best Practices

### ✅ Good Structure (Recommended)

```
.opencode/agents/
├── README.md                    # Registry
├── TEMPLATE.md                  # Template
├── github/                      # Agent 1
│   ├── agent.md
│   └── README.md
├── code-reviewer/               # Agent 2
│   ├── agent.md
│   └── README.md
└── test-runner/                 # Agent 3
    ├── agent.md
    ├── README.md
    └── examples/                # Optional: examples
        ├── unit-tests.md
        └── integration-tests.md
```

### ❌ Old Structure (Avoid)

```
.opencode/agents/
├── github.md                    # Hard to manage with multiple agents
├── code-reviewer.md
├── test-runner.md
├── github-README.md
├── code-reviewer-README.md
└── test-runner-README.md
```

## Benefits of New Structure

### 🎯 Organization

- **Clear separation**: Each agent has its own directory
- **Scalable**: Easy to add new agents without clutter
- **Discoverable**: All agent files in one place

### 📁 Modularity

- **Self-contained**: Agent directory has everything related to it
- **Portable**: Copy entire directory to share/reuse agent
- **Versioned**: Track agent changes independently

### 🔧 Maintainability

- **Clear ownership**: Each agent directory is independent
- **Easy updates**: Modify agent without affecting others
- **Documentation**: Agent docs stay with agent config

### 🤝 Collaboration

- **Team-friendly**: Multiple people can work on different agents
- **Code review**: Changes are scoped to specific agents
- **Reusable**: Share agent directories across projects

## Agent Naming

### Invocation Names

- Directory name: `.opencode/agents/github/` → `@github`
- Readable name: Use in commands like `@GithubAgent` (OpenCode maps it)

### Conventions

- **Directories**: lowercase with hyphens (`github`, `code-reviewer`)
- **Invocation**: Short and memorable (`@github`, `@reviewer`)
- **Documentation**: Clear and descriptive

## Common Patterns

### Read-Only Agent

```yaml
tools:
  bash: true
  read: true
  grep: true
  glob: true
  write: false
  edit: false
permission:
  write: deny
  edit: deny
```

### Write-Enabled Agent

```yaml
tools:
  bash: true
  read: true
  write: true
  edit: true
permission:
  write: allow
  edit: allow
```

### Research Agent

```yaml
tools:
  read: true
  grep: true
  glob: true
  webfetch: true
  write: false
  edit: false
```

## Next Steps

1. **Try the GitHub agent**: `@github help me understand what you can do`
2. **Read the registry**: Check `.opencode/agents/README.md`
3. **Create your own agent**: Use `TEMPLATE.md` as starting point
4. **Share feedback**: Improve agents based on usage

## Troubleshooting

### Agent not found

```bash
# Check file exists
ls .opencode/agents/<name>/agent.md

# Restart OpenCode to reload agents
```

### Agent behaves wrong

```bash
# Review configuration
cat .opencode/agents/<name>/agent.md

# Check tool permissions
# Edit frontmatter if needed
```

### Multiple agents conflict

```bash
# Use unique directory names
# Document invocation names in README
```

## Resources

- **Main Registry**: `.opencode/agents/README.md`
- **GitHub Agent**: `.opencode/agents/github/README.md`
- **Template**: `.opencode/agents/TEMPLATE.md`
- **OpenCode Docs**: <https://opencode.ai/docs/agents>

---

**Updated**: 2026-02-15  
**Version**: 2.0.0 (Refactored structure)
