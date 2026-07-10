# Skill Spec Lint

Lint agent skill specs for triggers, inputs, safety boundaries, examples, and verification.

The CLI scores a SKILL.md-like document against practical agent-readiness rules and returns actionable gaps.

## Quickstart

```sh
npm install
npm test
npm run smoke
node bin/cli.js fixtures/sample-skill.md --json
```

## Examples

Audit a local markdown file:

```sh
npx skill-spec-lint ./SKILL.md
```

Use JSON for another agent or CI harness:

```sh
node bin/cli.js fixtures/sample-skill.md --json
```

## Output

The CLI returns `pass` when the document clears the default threshold and `needs-work` when required release-readiness evidence is missing. Human-readable output is markdown; `--json` returns stable fields for automation.

## Safety

This project reads local markdown and writes only to stdout/stderr. It has no telemetry, no hidden network calls, and no external account actions.

## Limitations

- V1 uses deterministic term checks rather than semantic LLM review.
- It is a release gate and coaching aid, not a guarantee that a workflow is safe.
- Rules are intentionally conservative and may need project-specific tuning.

## Verification

```sh
npm test
npm run check
npm run smoke
```
