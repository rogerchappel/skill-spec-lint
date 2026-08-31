#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const requiredPackedFiles = ["LICENSE", "README.md", "bin/cli.js", "package.json", "src/index.js"];

export function assertRequiredPackedFiles(files, required = requiredPackedFiles) {
  const packed = new Set(files);
  const missing = required.filter((file) => !packed.has(file));
  if (missing.length) throw new Error(`Package tarball is missing required files: ${missing.join(", ")}`);
}

export function assertInstalledBin(result, label) {
  if (result.error || result.status !== 0) {
    const detail = result.error?.message || result.stderr?.trim() || `exit ${result.status}`;
    throw new Error(`Installed skill-spec-lint bin failed ${label}: ${detail}`);
  }
}

export function runPackageSmoke() {
const license = readFileSync("LICENSE", "utf8");
for (const text of [
  "Permission is hereby granted, free of charge, to any person obtaining a copy",
  "The above copyright notice and this permission notice shall be included in all",
  'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR',
  "OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE",
]) {
  if (!license.includes(text)) throw new Error(`LICENSE is missing canonical MIT text: ${text}`);
}

const sandbox = mkdtempSync(path.join(tmpdir(), "skill-spec-lint-package-"));
try {
  const packOutput = execFileSync("npm", ["pack", "--silent", "--json", "--pack-destination", sandbox], { encoding: "utf8" });
  const jsonStart = packOutput.indexOf("[\n  {");
  if (jsonStart < 0) throw new Error("npm pack did not return artifact metadata");
  const pack = JSON.parse(packOutput.slice(jsonStart));
  const metadata = pack[0];
  assertRequiredPackedFiles(metadata.files.map(({ path: file }) => file));

  const project = path.join(sandbox, "consumer");
  mkdirSync(project);
  writeFileSync(path.join(project, "package.json"), '{"private":true}\n');
  writeFileSync(path.join(project, "sample-skill.md"), readFileSync("fixtures/sample-skill.md"));
  execFileSync("npm", ["install", "--ignore-scripts", path.join(sandbox, metadata.filename)], { cwd: project, stdio: "pipe" });

  const bin = path.join(project, "node_modules", ".bin", "skill-spec-lint");
  const help = spawnSync(bin, ["--help"], { cwd: project, encoding: "utf8" });
  assertInstalledBin(help, "--help");
  if (!help.stdout.includes("Usage: skill-spec-lint")) throw new Error("Installed bin returned unexpected help output");

  const report = spawnSync(bin, ["sample-skill.md", "--json"], { cwd: project, encoding: "utf8" });
  assertInstalledBin(report, "fixture audit");
  if (JSON.parse(report.stdout).status !== "pass") throw new Error("Installed bin returned unexpected fixture status");
} finally {
  rmSync(sandbox, { recursive: true, force: true });
}

console.log("package smoke ok: tarball contents and installed bin verified");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    runPackageSmoke();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
