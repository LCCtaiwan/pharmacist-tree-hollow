# Development Log

## Current Project Goal

建立「醫護樹洞」的第一版產品規劃與開發骨架。產品目標是讓醫護人員能透過 Web App 與後續 LINE Bot 快速得到舒壓、同理、具體誇誇、療癒內容、點歌與娛樂型抽牌。藥師仍是第一批重點情境，但文案不再只鎖定藥師。

## Stack Direction

- Web PWA: Vite React or Next.js, first phase。
- LINE Bot: Node.js TypeScript with LINE Messaging API, second phase。
- Backend: TypeScript API layer。
- Database: SQLite for local MVP, Postgres for production。
- AI: Provider abstraction, with safety pre-check and post-check。

## Important Project Rules

- 不做心理治療、醫療診斷或正式用藥建議。
- 不收集病人個資或處方資訊。
- 危機語句必須導向立即求助資源。
- 塔羅與算命只能作為娛樂與反思工具，不宣稱準確預測。
- 語氣要貼近醫護情境，避免泛用雞湯。

## Completed Work

- Created project-local `AGENTS.md`。
- Created `docs/SDD.md`。
- Created `docs/product-plan.md`。
- Created `docs/concept-options.md`。
- Created `docs/MVP_SPEC.md`。
- Created `docs/game-concept.md`。
- Created initial worktree directories for LINE Bot, Web PWA, packages, prompts, ops and tests。
- Added MVP UI and art direction: late-night healthcare counter tree hollow, CSS-first scene, subtle visual tokens and symbolic card/astro visuals。
- Initialized git repository。
- Implemented Web App MVP with Vite React TypeScript under `apps/web-pwa`。
- Implemented shared types, safety classifier/redaction and curated content packages。
- Added 50-song recommendation pool, 5 micro tools, 5 healing cards and 7 astro reflection cards。
- Added safety/content/response tests。

## Accepted Outputs

- Product direction: Web App first, LINE Bot second, healing game layer third。
- Core MVP: 樹洞、誇誇、今日療癒、點歌、抽牌、喘口氣。
- Safety stance: supportive wellness, not diagnosis or professional advice。
- UI direction: 深夜值班櫃檯 x 安靜樹洞 x 成人療癒感。
- Art strategy: CSS-first MVP visuals, no runtime image generation, generated assets only after inspection gate。
- MVP app: one-screen tree hollow input, healthcare-oriented mock response, embedded 30-second micro tool, song/card/astro panels and local saved items。
- Copy direction updated: user-facing MVP copy now targets 醫護人員 broadly, with 藥師 pressure kept as one supported scenario instead of the whole product frame。
- Response interaction upgraded: compact post-submit layout, rotating concrete praise notes, progressive aftercare drawer, auto-scrolling song/card/astro panels and stronger crisis-first mobile flow。
- Crisis flow: suppresses normal followups and reduces decorative visual prominence。
- Medical boundary flow: avoids patient-specific advice and points back to SOP/senior/team resources。

## Rejected Outputs

- None yet。

## Current Checkpoint

M1 Web App MVP implemented locally.

## Recommended Next Step

Prepare MVP for invite pilot:

1. Review app copy with 3-5 healthcare staff scenarios, including nurse, pharmacist, PGY/NPGY and night-shift examples。
2. Add anonymous event collection only after privacy wording is final。
3. Deploy Web PWA to a temporary Vercel/Netlify URL。
4. Run invite pilot with 20-50 users。
5. Collect anonymous ratings for 有被理解 and 有醫護感。

## Verification Status

pass: AGENTS, SDD, concept options, MVP spec, game concept, product plan and worktree skeleton were inspected for product scope, safety boundaries, MVP order and internal consistency.

pass: UI and art direction was added to MVP spec and game concept with explicit mobile, crisis, asset and generated-art inspection criteria.

pass: `npm test` passed with 13 tests across safety, content and response behavior。

pass: `npm run build` passed for the Web PWA。

pass: 375px visual screenshot check passed for first screen, normal response, progressive aftercare drawer and crisis response。
