import test from "node:test";
import assert from "node:assert/strict";
import { assertInstalledBin, assertRequiredPackedFiles } from "../scripts/package-smoke.js";

test("package validation rejects a missing required packed file", () => {
  assert.throws(
    () => assertRequiredPackedFiles(["package.json", "bin/cli.js"], ["package.json", "bin/cli.js", "LICENSE"]),
    /missing required files: LICENSE/,
  );
});

test("package validation rejects an unusable installed bin", () => {
  assert.throws(
    () => assertInstalledBin({ status: 126, stderr: "permission denied" }, "--help"),
    /failed --help: permission denied/,
  );
});
