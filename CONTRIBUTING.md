# Contributing to skill-spec-lint

Thank you for your interest in contributing to skill-spec-lint! This document outlines the guidelines for contributing to this project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Issues

Before creating a new issue, please check the existing issues to avoid duplicates. When reporting a bug, please include:

- A clear and descriptive title
- A detailed description of the problem
- Steps to reproduce the issue
- Expected and actual behavior
- Environment details (Node.js version, OS, etc.)

### Submitting Pull Requests

When submitting a pull request, please ensure:

1. Your code follows the existing style and conventions
2. All tests pass
3. The code is well-documented
4. Your changes are focused and atomic
5. You have added or updated tests as appropriate

### Security Guidelines

When contributing to skill-spec-lint, please follow these security guidelines:

1. **Dependency Updates**: Keep dependencies up to date. Regularly review and update dependencies to address security vulnerabilities.

2. **Secret Handling**: Never commit secrets or sensitive information to the repository. Use environment variables or configuration files that are excluded from version control.

3. **Input Validation**: All inputs should be validated to prevent injection attacks or unexpected behavior.

4. **Code Reviews**: All changes must go through a code review process before merging.

5. **Security Testing**: Run security scans and tests as part of the CI pipeline.

## Development Setup

To set up the development environment:

1. Fork the repository
2. Clone your fork
3. Install dependencies with `npm install`
4. Run tests with `npm test`

## Code Style

We follow standard JavaScript/Node.js conventions. Please ensure your code is well-formatted and follows the existing style.

## Testing

All contributions should include tests. We use Jest for testing. Please ensure that:

1. Tests are added for new features
2. Existing tests continue to pass
3. Test coverage is maintained or improved

## Documentation

Documentation should be updated to reflect any changes to the API or behavior. This includes README updates, inline comments, and any new documentation files.

## Release Process

Releases are managed through GitHub Actions. When a release is created, the following steps are performed:

1. Version bump in package.json
2. Generation of CHANGELOG.md
3. Creation of a Git tag
4. Publishing to npm

## Questions?

If you have any questions, feel free to open an issue or contact the maintainers.