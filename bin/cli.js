#!/usr/bin/env node
import { auditFile, formatMarkdown } from "../src/index.js";

const args = process.argv.slice(2);
const help = `Usage: skill-spec-lint <SKILL.md> [--json]

Checks whether a skill spec has the sections agents need before reuse.

Arguments:
  <SKILL.md>  Exactly one skill specification to audit.
  --json      Emit JSON instead of a human-readable report.
  --help      Show this help (must be used alone).

Exit codes: 0 pass, 1 argument or read error, 2 needs work.`;

if (args.length === 1 && args[0] === "--help") {
  console.log(help);
  process.exit(0);
}

function fail(message) {
  console.error(`Error: ${message}\nRun "skill-spec-lint --help" for usage.`);
  process.exit(1);
}

const unknownOption = args.find((arg) => arg.startsWith("-") && arg !== "--json");
if (unknownOption) {
  fail(`Unknown option: "${unknownOption}"`);
}

const jsonCount = args.filter((arg) => arg === "--json").length;
if (jsonCount > 1) {
  fail('Option "--json" may only be specified once');
}

const files = args.filter((arg) => arg !== "--json");
if (files.length === 0) {
  fail("Missing required SKILL.md file");
}
if (files.length > 1) {
  fail("Expected exactly one SKILL.md file");
}

const json = jsonCount === 1;
const [file] = files;

try {
  const result = auditFile(file);
  console.log(json ? JSON.stringify(result, null, 2) : formatMarkdown(result));
  process.exit(result.status === "pass" ? 0 : 2);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
