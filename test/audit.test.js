import test from "node:test";
import assert from "node:assert/strict";
import { auditText, formatMarkdown } from "../src/index.js";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function fixture(name) {
  return readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8");
}

test("passing fixture clears the release threshold", () => {
  const text = fixture("sample-skill.md");
  const result = auditText(text);
  assert.equal(result.status, "pass");
  assert.equal(result.score, 100);
});

test("thin fixture reports actionable gaps", () => {
  const text = fixture("thin.md");
  const result = auditText(text);
  assert.equal(result.status, "needs-work");
  assert.ok(result.findings.some((finding) => !finding.passed));
});

test("markdown formatter includes score and findings", () => {
  const report = formatMarkdown(auditText(fixture("missing-approval.md")));
  assert.match(report, /Score:/);
  assert.match(report, /Findings/);
});

test("keywords outside required sections do not satisfy checks", () => {
  const result = auditText(fixture("keyword-prose.md"));
  assert.equal(result.status, "needs-work");
  assert.equal(result.score, 0);
  assert.equal(result.passed, 0);
});

test("headings inside backtick and tilde fences do not satisfy checks", () => {
  const result = auditText(`
## Trigger
Run this skill for release checks.

\`\`\`markdown
## Inputs
An input shown only in an example.
## Side effects
A side effect shown only in an example.
\`\`\`

~~~markdown
## Approval
An approval shown only in an example.
## Examples
An example nested inside the example.
## Verification
A verification shown only in an example.
~~~
`);

  assert.equal(result.status, "needs-work");
  assert.equal(result.passed, 1);
  assert.deepEqual(
    result.findings.filter((finding) => finding.passed).map((finding) => finding.id),
    ["trigger"],
  );
});

test("fences close only with a matching marker of sufficient length", () => {
  const result = auditText(`
    \`\`\`\`markdown
## Inputs
Still fenced because four-space indentation cannot open a fence.

\`\`\`\`markdown
## Inputs
Fenced input.
\`\`\`
## Side effects
Still fenced after a shorter closing sequence.
~~~~
## Approval
Still fenced after a different marker.
\`\`\`\`

~~~~~markdown
## Examples
Fenced example.
~~~~
## Verification
Still fenced after a shorter closing sequence.
~~~~~

## Trigger
Run this skill after the valid closures.
`);

  assert.equal(result.status, "needs-work");
  assert.equal(result.passed, 2);
  assert.deepEqual(
    result.findings.filter((finding) => finding.passed).map((finding) => finding.id),
    ["trigger", "inputs"],
  );
});

test("genuine level 2 through 6 headings remain eligible", () => {
  for (let level = 2; level <= 6; level += 1) {
    const result = auditText(`${"#".repeat(level)} Trigger\nContent\n`);
    assert.equal(
      result.findings.find((finding) => finding.id === "trigger")?.passed,
      true,
      `expected level ${level} heading to pass`,
    );
  }
});

test("ATX headings accept up to three leading spaces", () => {
  for (let spaces = 0; spaces <= 3; spaces += 1) {
    const result = auditText(`${" ".repeat(spaces)}## Trigger\nContent\n`);
    assert.equal(
      result.findings.find((finding) => finding.id === "trigger")?.passed,
      true,
      `expected ${spaces} leading spaces to be accepted`,
    );
  }
});

test("four-space indented headings remain code, not sections", () => {
  const result = auditText("    ## Trigger\n    Content\n");
  assert.equal(result.status, "needs-work");
  assert.equal(result.passed, 0);
});

test("one missing required section fails the default release gate", () => {
  const result = auditText(fixture("missing-approval.md"));
  assert.equal(result.status, "needs-work");
  assert.equal(result.score, 83);
  assert.equal(result.passed, 5);
  assert.equal(
    result.findings.find((finding) => finding.id === "approval")?.passed,
    false,
  );
});

test("CLI exits 2 when exactly one required section is missing", () => {
  const run = spawnSync(
    process.execPath,
    ["bin/cli.js", "fixtures/missing-approval.md", "--json"],
    { encoding: "utf8" },
  );
  assert.equal(run.status, 2);
  assert.equal(JSON.parse(run.stdout).status, "needs-work");
});
