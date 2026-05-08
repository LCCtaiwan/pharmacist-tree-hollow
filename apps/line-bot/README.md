# LINE Bot App

Second-phase daily companion entry for 藥師樹洞.

## Responsibility

- Receive LINE webhook events.
- Verify LINE signature.
- Convert LINE messages into internal conversation inputs.
- Call backend/AI orchestration.
- Return short text responses with quick replies.

## MVP Commands

- `樹洞`
- `誇誇我`
- `今日療癒`
- `點歌`
- `抽牌`
- `喘口氣`

## First Implementation Target

After the Web App MVP is stable, build a text-only webhook that can run locally and be tested with mocked LINE payloads before connecting to a real LINE channel.
