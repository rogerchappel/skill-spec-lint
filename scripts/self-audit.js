#!/usr/bin/env node
import { auditFile } from "../src/index.js";

const result = auditFile("SKILL.md");
if (result.status !== "pass") {
  console.error(
    `SKILL.md self-audit failed: ${result.score}/100 (${result.passed}/${result.total} checks)`,
  );
  for (const finding of result.findings.filter((finding) => !finding.passed)) {
    console.error(`- ${finding.id}: ${finding.message}`);
  }
  process.exit(1);
}

console.log(
  `SKILL.md self-audit passed: ${result.score}/100 (${result.passed}/${result.total} checks)`,
);
