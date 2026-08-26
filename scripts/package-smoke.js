#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const license = readFileSync("LICENSE", "utf8");
const requiredLicenseText = [
  "Permission is hereby granted, free of charge, to any person obtaining a copy",
  "The above copyright notice and this permission notice shall be included in all",
  'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR',
  "OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE",
];

for (const text of requiredLicenseText) {
  if (!license.includes(text)) {
    console.error(`LICENSE is missing canonical MIT text: ${text}`);
    process.exit(1);
  }
}

const pack = JSON.parse(execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
  encoding: "utf8",
}));
const files = new Set(pack[0]?.files?.map(({ path }) => path));
if (!files.has("LICENSE")) {
  console.error("Package tarball does not include LICENSE");
  process.exit(1);
}

console.log("package smoke ok: canonical MIT LICENSE included");
