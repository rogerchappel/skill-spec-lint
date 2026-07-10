# CI Gate Example

Run this project as a documentation gate before approving a skill package:

```sh
npm ci
npm test
node bin/cli.js ./SKILL.md --json
```

Treat `needs-work` as a release review finding. It should block public reuse
until the missing sections are fixed or deliberately waived in the PR.
