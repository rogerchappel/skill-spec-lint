import { readFileSync } from "node:fs";

export const rules = [
  [
    "trigger",
    "Declare when to use the skill",
    [
      "trigger",
      "when to use",
      "when-to-use"
    ]
  ],
  [
    "inputs",
    "List required inputs or tools",
    [
      "input",
      "inputs"
    ]
  ],
  [
    "side-effects",
    "State side-effect boundaries",
    [
      "side effect",
      "side effects",
      "side-effect",
      "side-effects"
    ]
  ],
  [
    "approval",
    "Describe approval requirements",
    [
      "approval",
      "approvals"
    ]
  ],
  [
    "examples",
    "Include at least one example",
    [
      "example",
      "examples"
    ]
  ],
  [
    "verification",
    "Explain validation or verification",
    [
      "verification",
      "validation"
    ]
  ]
];

function sectionsByHeading(text) {
  const sections = new Map();
  let currentHeading;
  let fence;

  for (const line of String(text || "").split(/\r?\n/)) {
    if (fence) {
      const closingFence = line.match(/^ {0,3}(`+|~+)[ \t]*$/);
      if (
        closingFence
        && closingFence[1][0] === fence.marker
        && closingFence[1].length >= fence.length
      ) {
        fence = undefined;
      }
      continue;
    }

    const openingFence = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (
      openingFence
      && (openingFence[1][0] !== "`" || !openingFence[2].includes("`"))
    ) {
      fence = {
        marker: openingFence[1][0],
        length: openingFence[1].length,
      };
      continue;
    }

    const heading = line.match(/^#{2,6}\s+(.+?)\s*#*\s*$/);
    if (heading) {
      currentHeading = heading[1].trim().toLowerCase();
      if (!sections.has(currentHeading)) {
        sections.set(currentHeading, []);
      }
    } else if (currentHeading) {
      sections.get(currentHeading).push(line);
    }
  }

  return sections;
}

export function auditText(text, options = {}) {
  const sections = sectionsByHeading(text);
  const findings = rules.map(([id, message, headings]) => {
    const content = headings
      .filter((heading) => sections.has(heading))
      .flatMap((heading) => sections.get(heading))
      .join("\n")
      .trim();
    const matched = content.length > 0;
    return {
      id,
      message,
      passed: matched,
      severity: matched ? "ok" : "warn",
    };
  });
  const passed = findings.filter((finding) => finding.passed).length;
  const score = Math.round((passed / findings.length) * 100);
  const status = options.threshold === undefined
    ? passed === findings.length
    : score >= options.threshold;
  return {
    tool: "skill-spec-lint",
    score,
    passed,
    total: findings.length,
    status: status ? "pass" : "needs-work",
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
