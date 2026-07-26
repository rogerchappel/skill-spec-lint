# CI Gate Example

Run this project as a documentation gate before approving a skill package:

```sh
npm ci
npm test
node bin/cli.js ./SKILL.md --json
```

Treat `needs-work` (exit status 2) as a release review finding. It should block
public reuse until every required section contains content.
