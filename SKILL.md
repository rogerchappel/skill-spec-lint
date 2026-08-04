# Skill Spec Lint

## Trigger
Use this skill when reviewing or preparing an agent skill before installation,
sharing, or release. Do not use it as a semantic safety review; it checks the
presence of documented release-readiness sections.

## Inputs
- A local markdown file to audit.
- Permission to read that file.

## Side effects
The skill reads local files and prints a report. It must not push, publish, send messages, open pull requests, or change external systems.

## Approval
Ask before editing the audited file. Ask before running any command that installs packages, contacts a network service, or writes outside the current project.

## Workflow
1. Run `skill-spec-lint <file>`.
2. Review warning findings.
3. Recommend the smallest useful documentation changes.
4. Re-run the audit after edits.

## Examples
Audit the shipped passing fixture in human-readable and machine-readable forms:

```sh
npm run smoke
npm run smoke:json
```

For a direct invocation against another skill, run
`skill-spec-lint path/to/SKILL.md --json`; exit status 0 means all six sections
passed, while status 2 means the report contains release-readiness gaps.

## Verification
Run `npm test`, `npm run check`, `npm run self:audit`, both smoke commands, and
`npm run package:smoke`. Confirm that the self-audit reports 100/100 with status
`pass`, then include the exact command results in the handoff.
