# Development Log

## Current Project Goal

建立「藥師樹洞」的第一版產品規劃與開發骨架。產品目標是讓藥師能透過 Web App 與後續 LINE Bot 快速得到舒壓、同理、具體誇誇、療癒內容、點歌與娛樂型抽牌。

## 2026-05-09 Pivot — 定位回歸 + 視覺重設計

決策來源：使用者，2026-05-09 監督檢查時下達。

- **定位回歸**：取消「醫護樹洞」擴大方向，產品定位回到原本的「藥師樹洞」。所有「醫護」、「醫護人員」、「醫護情境」相關文案改回藥師專屬。理由：原始 SDD/AGENTS/MVP_SPEC 都鎖藥師情境，前一版自行擴大未經授權，且擴大後內容變得泛用、失去藥師情境感。
- **視覺重設計**：拒絕現行「深夜暗綠+琥珀黃 CSS 拼貼場景」，改採 **DESERTOPIA + 解憂雜貨店** 風格的水彩生態圖。新策略文件見 [docs/art-direction.md](art-direction.md)。
- **美術生成**：Codex 撰寫圖片生成腳本（OpenAI Images API）作為 fallback。
- **2026-05-09 update**：改採 **Codex CLI 內建 image-2** 為首選，由 Codex 直接生成 22 張資產，使用者不需另外申請 OPENAI_API_KEY。`scripts/generate-art.ts` 改為備援腳本。

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
- 語氣要貼近藥師情境，避免泛用雞湯。

## Completed Work

- 2026-06-15: Reviewed current repo progress and reconciled the active checkpoint. Current `main` is at Web App v0.6 plus AI reply slices A/B/C: Gemini-backed `/api/respond`, frontend fallback, crisis card, one-letter-per-day soft limit, IP rate limit, budget cutoff, station-based scene UI, and 36-card Lenormand prompt flow. Added server-side safety pre-check to `/api/respond` so direct API calls with crisis, patient-specific medical requests, or identifiable data return static safety letters without calling Gemini.
- 2026-05-12: Integrated reply healing tips into `astroCards`, removed legacy healing card data/art (5 PNGs), and replaced the astro station single-card draw with a three-card past/present/next spread. Per A 方案 minimalism: removed per-card reflective lines, healingTip, position prompts, and combined reading — astro is now image-only ("看圖、感受。不必對應字面解釋。"). Differentiates the three reflective stations: 枝頭=文字、花草=動作、星光=圖像.
- 2026-05-10: Fixed Web PWA interaction flow after deployed UI feedback: separated watercolor scene from the input controls, made normal followup choices visible immediately after a response, changed followups into full-width action rows with explanatory text, and auto-scrolls to response/focus panels.
- 2026-05-10 revision: First screen still showed too little of the watercolor background, so the scene was enlarged and the mood controls were compressed into a single horizontal row.
- 2026-05-10 entry flow revision: First screen now shows the full watercolor scene with clickable object hotspots. The note composer renders only after the user clicks a scene object.
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
- MVP app: station-based tree hollow scene, AI-assisted response with static fallback, embedded 30-second micro tool, song/quote/Lenormand stations and local saved items。
- Copy direction corrected: user-facing MVP copy targets 藥師 specifically, not broad 醫護。
- Response interaction upgraded: compact post-submit layout, rotating concrete praise notes, progressive aftercare drawer, auto-scrolling song/card/astro panels and stronger crisis-first mobile flow。
- Focused response revision: post-submit header is removed, optional aftercare content renders in one shared response surface so the user can focus on one thing at a time。
- Full-screen scene prototype: first screen now uses object/NPC-style choices as station entry points, hides the composer until the user selects 樹洞私語, and keeps product identity as `藥師樹洞`。
- Crisis flow: suppresses normal followups and reduces decorative visual prominence。
- Medical boundary flow: avoids patient-specific advice and points back to SOP/senior/team resources。

## Rejected Outputs

- None yet。

## Current Checkpoint

Web App v0.6 is implemented on `main` and builds locally. The current app uses a watercolor/night scene with seven stations, AI-assisted tree-hollow letters, first-run disclosure, local daily limit, server IP rate limit, crisis resources, and Lenormand 36-card visual draw with external prompt template. LINE Bot remains second-phase only and has not been implemented beyond README planning.

## Recommended Next Step

1. Run a fresh mobile visual QA pass for the v0.6 station UI and crisis flow.
2. Decide whether the next product slice is invite pilot instrumentation or LINE Bot M2.
3. If preparing pilot: finalize privacy wording before adding anonymous event collection.
4. If starting LINE Bot: implement a thin text-only webhook that reuses `/api/respond` behavior and mocked LINE payload tests.

## Verification Status

pass: 2026-06-15 repo review passed `npx vitest run api/respond.test.ts`, `npx tsc -p api/tsconfig.json --noEmit`, `npm test`, and `npm run build`. The new API safety tests verify crisis, medical-boundary, and privacy inputs do not call Gemini.

pass: 2026-05-12 astro v0.5 passed `npx tsc -p tsconfig.json --noEmit`, `npm run build`, and `npm test`. Vitest now excludes `.claude/**` temporary worktrees so tests run only against the project source.

pass: 2026-05-10 UI flow fix passed `npm test`, `npm run build`, and Playwright checks at 1280x720 and 390x844. Verified first screen no longer overlays controls on the background image, followup options are visible immediately, and clicking `紙籤盒` scrolls the panel into view without manual scrolling.

pass: 2026-05-10 first-screen background revision passed `npm test`, `npm run build`, and 390x844 screenshot inspection. Scene height is 523px on 844px mobile viewport, composer starts below the scene, and the idle hint card is hidden.

pass: 2026-05-10 scene-object entry flow passed `npm test`, `npm run build`, and Playwright 390x844 inspection. Verified `.scene-bg` loaded at 1024x1536 with `object-fit: contain`, first screen has no composer, and clicking `點樹洞：累了` shows and focuses the note textarea.

pass: AGENTS, SDD, concept options, MVP spec, game concept, product plan and worktree skeleton were inspected for product scope, safety boundaries, MVP order and internal consistency.

pass: UI and art direction was added to MVP spec and game concept with explicit mobile, crisis, asset and generated-art inspection criteria.

pass: `npm test` passed with 13 tests across safety, content and response behavior。

pass: `npm run build` passed for the Web PWA。

pass: 375px visual screenshot check passed for first screen, normal response, progressive aftercare drawer and crisis response。

revise -> pass: 375px full-screen prototype initially overlapped the reply card with the input composer and showed a form-like chip scrollbar. Revised by hiding the composer after submit, adding a `再投一張紙條` reset action, removing the page header, moving product identity into the scene sign, and fixing the mood chip layout。
