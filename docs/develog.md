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
- MVP app: one-screen tree hollow input, healthcare-oriented mock response, embedded 30-second micro tool, song/card/astro panels and local saved items。
- Copy direction updated: user-facing MVP copy now targets 醫護人員 broadly, with 藥師 pressure kept as one supported scenario instead of the whole product frame。
- Response interaction upgraded: compact post-submit layout, rotating concrete praise notes, progressive aftercare drawer, auto-scrolling song/card/astro panels and stronger crisis-first mobile flow。
- Focused response revision: post-submit header is removed, optional aftercare content renders in one shared response surface so the user can focus on one thing at a time。
- Full-screen cultivation prototype: first screen now uses the CSS night counter as a full-viewport scene, moves identity into the in-scene `醫護樹洞` sign, hides the composer after a reply, and presents aftercare as object/NPC-style choices inside the response surface。
- Crisis flow: suppresses normal followups and reduces decorative visual prominence。
- Medical boundary flow: avoids patient-specific advice and points back to SOP/senior/team resources。

## Rejected Outputs

- None yet。

## Current Checkpoint

M1 Web App MVP implemented locally, but UI 美術方向被使用者退回。即將進行 2026-05-09 pivot：藥師定位回歸 + 水彩生態圖重設計。

## Recommended Next Step（2026-05-09 之後）

執行 [docs/art-direction.md](art-direction.md) 規劃：

1. Codex 把所有 `醫護` 殘留文字改回藥師（包含 docs、source、HTML title、shop sign、aria-label、respond.ts 中一處 praise 文案）。
2. Codex 撰寫 `scripts/generate-art.ts` 圖片生成腳本（OpenAI Images API），預設 dry-run 印 prompt。
3. 使用者執行生成腳本，把資產落地到 `apps/web-pwa/public/art/`。
4. Codex 重構 `styles.css` color tokens、`NightPharmacyScene.tsx` → `WatercolorScene.tsx` 改用 PNG 資產。
5. Codex 執行 `npm test` 與 `npm run build` 驗證。
6. 監督者人工檢查 375px 行動裝置視覺。

## Verification Status

pass: 2026-05-10 UI flow fix passed `npm test`, `npm run build`, and Playwright checks at 1280x720 and 390x844. Verified first screen no longer overlays controls on the background image, followup options are visible immediately, and clicking `紙籤盒` scrolls the panel into view without manual scrolling.

pass: 2026-05-10 first-screen background revision passed `npm test`, `npm run build`, and 390x844 screenshot inspection. Scene height is 523px on 844px mobile viewport, composer starts below the scene, and the idle hint card is hidden.

pass: 2026-05-10 scene-object entry flow passed `npm test`, `npm run build`, and Playwright 390x844 inspection. Verified `.scene-bg` loaded at 1024x1536 with `object-fit: contain`, first screen has no composer, and clicking `點樹洞：累了` shows and focuses the note textarea.

pass: AGENTS, SDD, concept options, MVP spec, game concept, product plan and worktree skeleton were inspected for product scope, safety boundaries, MVP order and internal consistency.

pass: UI and art direction was added to MVP spec and game concept with explicit mobile, crisis, asset and generated-art inspection criteria.

pass: `npm test` passed with 13 tests across safety, content and response behavior。

pass: `npm run build` passed for the Web PWA。

pass: 375px visual screenshot check passed for first screen, normal response, progressive aftercare drawer and crisis response。

revise -> pass: 375px full-screen prototype initially overlapped the reply card with the input composer and showed a form-like chip scrollbar. Revised by hiding the composer after submit, adding a `再投一張紙條` reset action, removing the page header, moving product identity into the scene sign, and fixing the mood chip layout。
