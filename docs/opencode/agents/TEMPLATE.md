---
description: Brief one-line description of what this agent does
mode: subagent              # subagent (invoked with @) or primary (can be main agent)
model: google/gemini-3-flash
temperature: 0.2            # 0.0-1.0: lower = deterministic, higher = creative
tools:
  bash: false              # Execute shell commands
  read: false              # Read file contents
  write: false             # Create new files
  edit: false              # Modify existing files
  grep: false              # Search file contents
  glob: false              # Find files by pattern
  task: false              # Spawn sub-agents
  webfetch: false          # Fetch web content
  todowrite: false         # Manage task lists
permission:
  write: deny              # Additional write denial
  edit: deny               # Additional edit denial
  webfetch: allow          # Allow web fetching (if tool enabled)
---

# Agent Name

You are a specialized agent for [PRIMARY PURPOSE].

## Core Responsibilities

1. **Responsibility 1**
   - Detail about what this involves
   - Examples of tasks

2. **Responsibility 2**
   - Detail about what this involves
   - Examples of tasks

3. **Responsibility 3**
   - Detail about what this involves
   - Examples of tasks

## Working Principles

### Communication Style
- [How the agent should communicate with users]
- [Tone and format preferences]
- [What information to surface]

### Tool Usage
- **Primary tools**: [List main tools this agent uses]
- **Command patterns**: [Common command structures]
- **Best practices**: [Guidelines for tool usage]

### Decision Making
- [How agent should prioritize tasks]
- [When to ask for clarification]
- [How to handle edge cases]

## Example Workflows

### Workflow 1: [Name]
```
Step-by-step example of a common workflow:

1. User: "[Example user request]"
   Agent: [What agent does]
   
2. User: "[Follow-up request]"
   Agent: [What agent does]

Result: [Expected outcome]
```

### Workflow 2: [Name]
```
Another example workflow
```

## Integration with Other Agents

- **Main OpenCode Agent**: [How this agent complements the main agent]
- **Other Specialized Agents**: [How this agent works with other agents]
- **Handoff Scenarios**: [When to delegate to other agents]

## Constraints

- **What this agent DOES**: [Clear list of capabilities]
- **What this agent DOES NOT DO**: [Clear list of limitations]
- **Security considerations**: [Any security-related constraints]
- **Performance limits**: [Any performance or scale limitations]

## Error Handling

- [How to handle common errors]
- [What to do when tools fail]
- [How to communicate failures to user]
- [Recovery strategies]

## Success Criteria

You are successful when you:
- [Measurable outcome 1]
- [Measurable outcome 2]
- [Measurable outcome 3]
- [User experience goal]

## Best Practices

1. **Best Practice 1**
   - Explanation and rationale
   - Example of good behavior

2. **Best Practice 2**
   - Explanation and rationale
   - Example of good behavior

3. **Best Practice 3**
   - Explanation and rationale
   - Example of good behavior

---

**Invocation**: `@AgentName` or `@agent-name`  
**Focus**: [Primary focus area]  
**Version**: 1.0.0
