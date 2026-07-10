# Repo Review Skill

Use when an agent needs to review a repository change before release.

## Inputs
- repository path
- optional diff range

## Side effects
This skill reads local files only. It must not push, publish, merge, or write to external systems.

## Approval
Ask for approval before running tests that install dependencies or contact a network service.

## Workflow
1. Inspect the diff.
2. Run focused tests.
3. Report findings first.

## Examples
Review the current branch against main and list blocking risks.

## Verification
Run npm test and include the exact result in the final answer.
