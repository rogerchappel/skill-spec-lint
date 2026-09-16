# Security Policy for skill-spec-lint

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in skill-spec-lint, please report it responsibly by following these steps:

1. **Do not open a public issue** on GitHub for the vulnerability
2. **Send an email** to security@skill-spec-lint.org with the subject "Vulnerability Report"
3. Include the following information in your report:
   - A clear description of the vulnerability
   - Steps to reproduce the vulnerability
   - The affected version(s)
   - Any potential impact or exploit scenarios
   - Any suggested fixes or mitigations

## Response Time

We aim to acknowledge all security vulnerability reports within 48 hours of receipt.

## Disclosure Process

1. **Initial Assessment**: We will acknowledge receipt of your report and perform an initial assessment
2. **Investigation**: We will investigate the vulnerability and determine its scope and impact
3. **Fix Development**: We will develop a fix for the vulnerability
4. **Coordination**: We will coordinate with you on the disclosure timeline
5. **Patch Release**: We will release a patch to address the vulnerability
6. **Public Disclosure**: We will publicly disclose the vulnerability and its fix

## Security Considerations

### Dependency Management

We regularly review and update our dependencies to address security vulnerabilities. We use automated tools to monitor for vulnerable dependencies.

### Input Validation

All inputs are validated to prevent injection attacks and ensure robustness.

### Secret Handling

We never commit secrets or sensitive information to the repository. All secrets are managed through secure configuration practices.

### Code Review

All code changes undergo a thorough code review process before merging.

## Security Testing

We perform regular security testing including:

- Static code analysis
- Dependency vulnerability scanning
- Manual security reviews
- Automated security checks in our CI pipeline

## Contact

For any security-related questions or concerns, please contact us at security@skill-spec-lint.org.

Last updated: 2026-09-16