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
