import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const cli = new URL("../bin/cli.js", import.meta.url);
const fixture = (name) => new URL(`../fixtures/${name}`, import.meta.url).pathname;

function run(...args) {
  return spawnSync(process.execPath, [cli.pathname, ...args], {
    encoding: "utf8",
  });
}

test("human and JSON invocations preserve report exit behavior", () => {
  const human = run(fixture("sample-skill.md"));
  assert.equal(human.status, 0);
  assert.match(human.stdout, /^# Skill Spec Lint Report/m);
  assert.equal(human.stderr, "");

  const json = run(fixture("missing-approval.md"), "--json");
  assert.equal(json.status, 2);
  assert.equal(JSON.parse(json.stdout).status, "needs-work");
  assert.equal(json.stderr, "");
});

test("help is successful and documents the complete argument contract", () => {
  const result = run("--help");
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage: skill-spec-lint <SKILL\.md> \[--json\]/);
  assert.match(result.stdout, /Exit codes: 0 pass, 1 argument or read error, 2 needs work\./);
  assert.equal(result.stderr, "");
});

for (const [name, args, diagnostic] of [
  ["unknown option", [fixture("sample-skill.md"), "--jsoon"], 'Unknown option: "--jsoon"'],
  ["extra positional input", [fixture("thin.md"), fixture("sample-skill.md")], "Expected exactly one SKILL.md file"],
  ["missing file operand", ["--json"], "Missing required SKILL.md file"],
  ["unsupported option form", [fixture("sample-skill.md"), "--json=true"], 'Unknown option: "--json=true"'],
  ["duplicate JSON option", [fixture("sample-skill.md"), "--json", "--json"], 'Option "--json" may only be specified once'],
]) {
  test(`${name} fails without emitting an audit report`, () => {
    const result = run(...args);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.match(result.stderr, new RegExp(diagnostic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.doesNotMatch(result.stderr, /Skill Spec Audit|"status"/);
  });
}
