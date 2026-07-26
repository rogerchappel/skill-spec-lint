# Audit Rules

`skill-spec-lint` checks for six required release-readiness sections:

- trigger (`When to use` or `Trigger`): when an agent should use the skill
- inputs (`Inputs`): required files, tools, or context
- side-effects (`Side effects`): what the skill may read or write
- approval (`Approval`): actions that require confirmation
- examples (`Examples`): concrete invocation or usage samples
- verification (`Verification`): how the agent proves the skill worked

Each signal requires a matching level 2–6 Markdown heading with non-empty
content. Matching is case-insensitive and accepts singular headings where
appropriate. Prose outside a matching section does not count. All six checks
must pass for the default release gate to pass, so a score of 83 remains
`needs-work`.
