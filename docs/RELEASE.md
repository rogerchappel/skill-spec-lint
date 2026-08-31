# Release Readiness

Classification: ship

## Verification Commands

From a clean source checkout, run the canonical pre-tag gate:

```sh
npm run release:check
```

This includes tests, source and CLI checks, plus creation, isolated installation,
and execution of the actual npm tarball. CI runs the same gate on every supported
Node.js version.

## Notes
- No package publish has been performed.
- No tag or GitHub Release has been created.
- Public repo and release-candidate PR are the handoff artifacts.
