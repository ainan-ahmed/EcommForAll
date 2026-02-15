# Quick Start: OpenCode Agents

## Current Structure ✅

```
.opencode/
└── agents/
    └── github-agent.md        # Agent configuration (OpenCode reads this)
docs/opencode/agents/
├── README.md
├── TEMPLATE.md
└── QUICKSTART.md
```

## Using the GitHub Agent

```
@github-agent create a PR for my current branch
@github-agent review PR #123
```

## Creating a New Agent

### Quick Method

1. **Copy template**:

```bash
   cp docs/opencode/agents/TEMPLATE.md .opencode/agents/<agent-name>.md
   ```

1. **Edit configuration**: Update frontmatter in `<agent-name>.md`

2. **Write instructions**: Add agent behavior in markdown body

3. **Register agent**: Add entry to `docs/opencode/agents/README.md`

4. **Test**: Restart OpenCode and invoke with `@agent-name`

### Detailed Method

See `docs/opencode/agents/README.md` → "Creating New Agents" section

## Agent Directory Best Practices

### ✅ Good Structure (Recommended)

```
.opencode/agents/
├── github-agent.md              # Agent 1
├── code-reviewer.md             # Agent 2
└── test-runner.md               # Agent 3

docs/opencode/agents/
├── README.md
├── TEMPLATE.md
└── QUICKSTART.md
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

- **Clear separation**: Agent configs and docs live in different folders
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

- Directory name: `.opencode/agents/github-agent/` → `@github`
- Readable name: Use in commands like `@github-agent` (OpenCode maps it)

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

1. **Try the GitHub agent**: `@github-agent help me understand what you can do`
2. **Read the registry**: Check `docs/opencode/agents/README.md`
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

- **Main Registry**: `docs/opencode/agents/README.md`
- **GitHub Agent**: `.opencode/agents/github-agent/README.md`
- **Template**: `.opencode/agents/TEMPLATE.md`
- **OpenCode Docs**: <https://opencode.ai/docs/agents>

---

**Updated**: 2026-02-15  
**Version**: 2.0.0 (Refactored structure)
