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
appropriate. ATX headings may have zero to three leading spaces, while a
four-space indented line is code and does not start a section. Prose outside a
matching section does not count. All six checks
must pass for the default release gate to pass, so a score of 83 remains
`needs-work`.

Section detection ignores ATX headings inside backtick and tilde fenced code
blocks, so a sample skill embedded in a required section cannot supply missing
sections. Fence openers may use three or more markers and up to three leading
spaces. A fence closes only with the same marker and at least as many markers as
its opener, following Markdown fence semantics. Genuine level 2–6 headings with
up to three leading spaces outside fences remain eligible.
