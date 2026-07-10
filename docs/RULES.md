# Audit Rules

`skill-spec-lint` checks for six release-readiness signals:

- trigger: when an agent should use the skill
- inputs: required files, tools, or context
- side-effects: what the skill may read or write
- approval: actions that require confirmation
- examples: concrete invocation or usage samples
- verification: how the agent proves the skill worked

The rules are deterministic keyword checks in V1 so results stay stable in CI.
