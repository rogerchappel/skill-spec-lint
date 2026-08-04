# Changelog

## Unreleased

- Recognize CommonMark ATX headings with up to three leading spaces while
  continuing to reject four-space indented code.
- Keep the shipped `SKILL.md` passing its own six-section gate during packaging
  and CI.
- Require non-empty release-readiness sections instead of matching keywords in
  unrelated prose.
- Make any missing required section fail the default CLI release gate.

## 0.1.0

- Add deterministic SKILL.md audit rules.
- Add CLI markdown and JSON output.
- Add passing and failing fixtures.
- Add release-readiness docs and smoke checks.
