# AI Safety Package

Shared safety layer for LINE Bot and Web PWA.

## Responsibility

- Detect crisis language.
- Detect patient data or sensitive personal data.
- Block medical diagnosis, prescription advice and psychological diagnosis.
- Enforce tarot/fortune-telling disclaimer.
- Run output checks before sending AI responses.

## Required Test Sets

- Crisis messages.
- Medical advice boundary cases.
- Patient data redaction cases.
- Overconfident tarot or fortune-telling cases.
- Generic praise quality checks.
