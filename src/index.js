import { readFileSync } from "node:fs";

export const rules = [
  [
    "trigger",
    "Declare when to use the skill",
    [
      "use when",
      "trigger",
      "when to use"
    ]
  ],
  [
    "inputs",
    "List required inputs or tools",
    [
      "input",
      "required",
      "tool"
    ]
  ],
  [
    "side-effects",
    "State side-effect boundaries",
    [
      "side effect",
      "side-effect",
      "write",
      "external"
    ]
  ],
  [
    "approval",
    "Describe approval requirements",
    [
      "approval",
      "ask before",
      "confirm"
    ]
  ],
  [
    "examples",
    "Include at least one example",
    [
      "example"
    ]
  ],
  [
    "verification",
    "Explain validation or verification",
    [
      "verify",
      "verification",
      "validate",
      "test"
    ]
  ]
];

export function auditText(text, options = {}) {
  const normalized = String(text || "").toLowerCase();
  const findings = rules.map(([id, message, terms]) => {
    const matched = terms.some((term) => normalized.includes(term));
    return {
      id,
      message,
      passed: matched,
      severity: matched ? "ok" : "warn",
    };
  });
  const passed = findings.filter((finding) => finding.passed).length;
  const score = Math.round((passed / findings.length) * 100);
  return {
    tool: "skill-spec-lint",
    score,
    passed,
    total: findings.length,
    status: score >= (options.threshold ?? 80) ? "pass" : "needs-work",
    findings,
  };
}

export function auditFile(path, options = {}) {
  return auditText(readFileSync(path, "utf8"), options);
}

export function formatMarkdown(result) {
  const lines = [
    "# Skill Spec Lint Report",
    "",
    `Status: ${result.status}`,
    `Score: ${result.score}/100 (${result.passed}/${result.total} checks)`,
    "",
    "## Findings",
  ];
  for (const finding of result.findings) {
    const mark = finding.passed ? "PASS" : "WARN";
    lines.push(`- ${mark} ${finding.id}: ${finding.message}`);
  }
  return lines.join("\n") + "\n";
}
