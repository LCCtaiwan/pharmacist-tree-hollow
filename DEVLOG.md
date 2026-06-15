# 開發日誌

## 2026-06-15 · Production deploy 修正：API safety 改 local lib

**完成：** Push 後 Vercel production 第一次部署 Ready，但 `/api/respond` smoke test 回 `FUNCTION_INVOCATION_FAILED`。Logs 顯示 runtime 無法解析 `@pharmacist-tree-hollow/ai-safety/src/index.ts` workspace TS export；改為新增 `api/_lib/safety.ts` 作為 API 專用輕量 classifier，`api/respond.ts` 改 import local `./_lib/safety.js`。
**決策：** Vercel serverless function 不直接 import workspace package 的 TS source export；API runtime 用本地 `_lib` 模組，避免部署後 ESM resolution 失敗。
**驗證：** `npx vitest run api/_lib/__tests__/respond-handler.test.ts` pass；`npx tsc -p api/tsconfig.json --noEmit` pass；`npm test` pass（15 files / 64 tests）；`npm run build` pass；production smoke tests returned `source: "safety"` for crisis and medical-boundary inputs after redeploy.

---

## 2026-06-15 · 進度 review 後整理：API safety 補強 + 文件對齊 v0.6

**完成：** review repo 現況，確認 Web App 已到 v0.6 + AI 回信切片 A/B/C + Lenormand 36 張；新增 `/api/respond` server-side safety pre-check，危機、醫療邊界、個資輸入直接回 static safety letter，不呼叫 Gemini；同步 `README.md`、`docs/develog.md`、`docs/MVP_SPEC.md`，移除過期 mood chip/櫃檯/醫護擴大敘述。
**決策：** safety 不能只靠前端；direct API request 也必須先過 `classifySafety`。LINE Bot 仍維持第二階段，尚未實作。
**驗證：** `npx vitest run api/_lib/__tests__/respond-handler.test.ts` pass；`npx tsc -p api/tsconfig.json --noEmit` pass；`npm test` pass（15 files / 64 tests）；`npm run build` pass。

---

## 2026-05-10 · v0.1→v0.4 上線：水彩 pivot + NPC hub + 紙質設計系統

**完成：** 藥師定位回歸（撤回前一輪「醫護」擴大），全文清掉醫護殘留；水彩美術 pivot：依 DESERTOPIA + 解憂雜貨店 風格，22 張資產（2 場景 + letter + 7 
**決策：** 產品定位回歸藥師專屬（撤回醫護擴大）
**Commits：** cda97d3 feat(design): 紙質藥師樹洞 — 統一設計系統, 560fc4a fix(ux): 拿掉場景 mood-pet 浮水印疊圖, 1a99b53 feat(hub): NPC=站點 — 7 個物件各自獨立功能 (v0.3), 6160ab1 fix(ux): 拿掉點選 mood 後的冗餘 chip 排，mood-pet 補 multiply 解白底, aa986e0 feat(ux): NPC 點擊互動取代 mood chip — 場景物件即選單, f462252 fix(ui): 提升 composer 卡片邊界、aftercare 按鈕 affordance、回信自動捲動, 867c635 feat: vercel deploy config + PWA manifest, 986bf9b feat: 藥師定位回歸 + 水彩美術 pivot

---

## 2026-05-10 · v0.4 polish：手寫信、紙條物件、水彩光暈 hotspot

**完成：** Scene hotspot 邊框太突兀 → 改 radial-gradient 水彩光暈（無邊框、邊緣 fade 進紙底；樹洞回信標籤更明確：加「樹洞回信」印章 + 「今晚替你記一筆」→「誇誇你」+ 「再被看見一點」→「再誇我一句」（呼應 A
**決策：** Scene hotspot 採水彩光暈（無邊框）vs 蓋章（有邊框）— 用戶選光暈，更融入水彩世界
**Commits：** e3184f6 fix(art): grass-quote 加 mix-blend-mode multiply 消除棋盤格透明假底, cd5ce91 feat(letter): ResponseCard 重構為手寫信，移除 aftercare drawer, 4d6ffeb feat(art): 草地紙條視覺錨點 — 讀一句站點對應實體物件, ea303b7 fix(ui): 小窩 hotspot 座標對齊睡貓位置 (17%,81%) → (20%,76%), 9271cb2 fix(copy): 對話 + 誇誇 標籤更明確，呼應 AGENTS.md 品牌承諾, af8b22e fix(ui): scene-hotspot 改水彩光暈，去掉突兀邊框, cda97d3 feat(design): 紙質藥師樹洞 — 統一設計系統, 560fc4a fix(ux): 拿掉場景 mood-pet 浮水印疊圖, 1a99b53 feat(hub): NPC=站點 — 7 個物件各自獨立功能 (v0.3), 6160ab1 fix(ux): 拿掉點選 mood 後的冗餘 chip 排，mood-pet 補 multiply 解白底, aa986e0 feat(ux): NPC 點擊互動取代 mood chip — 場景物件即選單, f462252 fix(ui): 提升 composer 卡片邊界、aftercare 按鈕 affordance、回信自動捲動, 867c635 feat: vercel deploy config + PWA manifest, 986bf9b feat: 藥師定位回歸 + 水彩美術 pivot

---

## 2026-05-10 · v0.4 持續 polish：NPC 動畫、座標微調、櫃檯隱喻清除、CJK 排版

**完成：** Scene hotspot 引導動畫加強（scale 0.94→1.14、translateY -4px、drop-sh；移除「先點一個物件」hint label
**決策：** NPC 物件名稱完全隱藏（Option A）— 只留動作章配 sequential pulse 引導，視覺最乾淨
**Commits：** bc667bb fix: 替換「櫃檯」隱喻 + saved-shelf 只在 entry 顯示, b7a77f0 fix(copy): 草地 quote 站 tag「今晚櫃檯抄一句」→「紙條上寫著」對齊草地紙條隱喻, 178e75f fix(typography): 信件中文排版優化 — text-wrap pretty + 段落間距 20px + 誇誇前加空心點分隔, e9b052c fix(ui): quote station 不再觸發 scene-tree-card，避免跟 grass-quote 雙紙條, 1a7a118 fix(ui): 說一說再上移到 55% 對齊樹洞中央、讀一句下移到 80% 對齊紙條 PNG, 0480fd5 fix(ui): 說一說上移到樹洞中心 65%、grass-quote 大幅淡化（opacity 0.55 + blur + saturate 0.75）, 834d299 fix(ui): hotspot 三點對齊 — 樹洞下移到 72%、花草/草地上移到 80%/72%, 616deb1 fix(ui): 完全隱藏 NPC 物件名（試 Option A），只留動作章, 844e5ba fix(motion): NPC pulse cycle 3.6s → 5.4s，stagger 重算為 0.77s/格, d9bfd19 fix(motion): 大幅加強 NPC pulse — scale 0.94→1.14 + translateY -4px + drop-shadow halo 16px, 6d7c080 feat(motion): NPC sequential breath pulse + 移除底部 hint + 修樹洞/枝頭座標, d1dd0ce fix(ui): 花草 vs 草地 hotspot 拉開距離 — 花草移左到 38%/90%，草地+紙條移右到 76%, e3184f6 fix(art): grass-quote 加 mix-blend-mode multiply 消除棋盤格透明假底, cd5ce91 feat(letter): ResponseCard 重構為手寫信，移除 aftercare drawer, 4d6ffeb feat(art): 草地紙條視覺錨點 — 讀一句站點對應實體物件, ea303b7 fix(ui): 小窩 hotspot 座標對齊睡貓位置 (17%,81%) → (20%,76%), 9271cb2 fix(copy): 對話 + 誇誇 標籤更明確，呼應 AGENTS.md 品牌承諾, af8b22e fix(ui): scene-hotspot 改水彩光暈，去掉突兀邊框, cda97d3 feat(design): 紙質藥師樹洞 — 統一設計系統, 560fc4a fix(ux): 拿掉場景 mood-pet 浮水印疊圖, 1a99b53 feat(hub): NPC=站點 — 7 個物件各自獨立功能 (v0.3), 6160ab1 fix(ux): 拿掉點選 mood 後的冗餘 chip 排，mood-pet 補 multiply 解白底, aa986e0 feat(ux): NPC 點擊互動取代 mood chip — 場景物件即選單, f462252 fix(ui): 提升 composer 卡片邊界、aftercare 按鈕 affordance、回信自動捲動, 867c635 feat: vercel deploy config + PWA manifest, 986bf9b feat: 藥師定位回歸 + 水彩美術 pivot

---

## 2026-05-11 · v0.4 上線：100 句金句 + branch main + Vercel production 切換

**完成：** grass-quote PNG 只在 entry view 顯示（commit 291aae2）— 修「信件殘留在屋頂」；加 <meta name="color-scheme" content="light">（commit 5553f4a）
**決策：** 草地金句來源分配：書摘 20（13 位作者）+ 國外影劇 20 + 國內影劇 10 + 自寫補強 20 = 共 100 句
**Commits：** f598e93 feat(content): 草地金句擴充 30 → 100 句（v0.4 完整）+ App.test 更新, 5553f4a fix(meta): 加 color-scheme: light 防瀏覽器 dark mode 強制反白卡片, 291aae2 fix(ui): grass-quote PNG 只在 entry 顯示，避免 station 模式漂在屋頂位置

---

## 2026-05-11 · v0.4 上線穩定運行；Google Cloud project 因 n8n 被駭遭停用（與本專案無關）

**完成：** v0.4 production 穩定運行 https://pharmacist-tree-hollow.vercel.a；本次對話沒有新的專案 commit（時間用在診斷與處理 Google Cloud 停權事件）
**決策：** 藥師樹洞 v0.4 production 為里程碑收尾，下一個目標仍是 v0.5 archetype（不變）
**Commits：** f598e93 feat(content): 草地金句擴充 30 → 100 句（v0.4 完整）+ App.test 更新, 5553f4a fix(meta): 加 color-scheme: light 防瀏覽器 dark mode 強制反白卡片, 291aae2 fix(ui): grass-quote PNG 只在 entry 顯示，避免 station 模式漂在屋頂位置

---

## 2026-05-11 · v0.5 規劃：開頭動畫 + 小屋 A/B + LOFI BGM

**完成：** 讀完 DEVLOG.md 確認 v0.4 production 穩定（100 句金句、Vercel）；盤點 BGM 現況：MVP_SPEC.md 規範不嵌入播放器、art-direction.md 有 scene-wind
**決策：** BGM 選 LOFI（非古典），Pixabay 關鍵字 lofi piano night rain / cozy lofi piano
**Commits：** f598e93 feat(content): 草地金句擴充 30 → 100 句（v0.4 完整）+ App.test 更新, 5553f4a fix(meta): 加 color-scheme: light 防瀏覽器 dark mode 強制反白卡片, 291aae2 fix(ui): grass-quote PNG 只在 entry 顯示，避免 station 模式漂在屋頂位置

---

## 2026-05-11 · v0.5 切片 ① 完成 + 時序加長 + 字體統一 + 桌面兩側水彩底

**完成：** 切片 ① splash + H 組三句引言實作完成（Codex 撰寫、本地 commit b7ed74f）；反思題擴充 10→40 題並清掉 6 處櫃檯隱喻殘字（commit 4fa6a5a，上輪準備好的）
**決策：** 時序選 C 沉浸版 9.1s：splash 1.8s + intro 5.3s（每句清晰窗 ~1100ms）+ 留白 0.6s + scene reveal 1
**Commits：** 2d1f0dd feat(ui): 全站襯線字體 + 桌面拓寬 600px + 模糊水彩兩側底圖, 0779c1b feat(intro): C 沉浸時序（4.5s → 9.1s）+ 水彩墨點過場, 4fa6a5a content(reflection): 擴充 10→40 題 + 清掉「櫃檯」隱喻殘字, b7ed74f feat(intro): splash 動畫 + H 組三句開頭引言 + skip 邏輯, f598e93 feat(content): 草地金句擴充 30 → 100 句（v0.4 完整）+ App.test 更新, 5553f4a fix(meta): 加 color-scheme: light 防瀏覽器 dark mode 強制反白卡片, 291aae2 fix(ui): grass-quote PNG 只在 entry 顯示，避免 station 模式漂在屋頂位置

---

## 2026-05-11 · 站點卡片 UI 極簡紙質重設 + 呼吸站視覺重分層

**完成：** 切片 ① 站點關閉按鈕「回到底圖」→「看看別處」（commit 7680669）；站點卡片 A 方案極簡紙質重設：拿掉橘紅波浪底線、按鈕統一藥丸圓角、tag 灰褐化、內文改無襯線（commit b53f
**決策：** 站點卡片問題拆解：波浪底線、按鈕風格不統一、橘紅 terracotta 用太重、字體全 serif 太正式
**Commits：** b53f872 feat(ui): 站點卡片極簡紙質重設 + 呼吸站視覺重分層, 23a65f1 feat(astro): 塔羅牌風卡片 UI + 純 fade 動畫, cffb61d feat(art): 補齊 7 張水彩 astro PNG（gpt-image-1 生成）, 7680669 fix(copy): 站點關閉按鈕「回到底圖」→「看看別處」, 2d1f0dd feat(ui): 全站襯線字體 + 桌面拓寬 600px + 模糊水彩兩側底圖, 0779c1b feat(intro): C 沉浸時序（4.5s → 9.1s）+ 水彩墨點過場, 4fa6a5a content(reflection): 擴充 10→40 題 + 清掉「櫃檯」隱喻殘字, b7ed74f feat(intro): splash 動畫 + H 組三句開頭引言 + skip 邏輯, f598e93 feat(content): 草地金句擴充 30 → 100 句（v0.4 完整）+ App.test 更新, 5553f4a fix(meta): 加 color-scheme: light 防瀏覽器 dark mode 強制反白卡片, 291aae2 fix(ui): grass-quote PNG 只在 entry 顯示，避免 station 模式漂在屋頂位置

---

## 2026-05-12 · astro v0.5 healing 整合 + 抽三張 + 呼吸站場景中立化

**完成：** 嘗試 fork 23a65f1+cffb61d 到 experiment 分支發現衝突 → 改用實地調查策略；發現 23a65f1 不只塔羅 UI、還夾帶 A 方案的 station-close/tag/actions CSS 改
**決策：** tarot UI 採 A 純圖像主場：圖大、文字最少；三站差異化原則：枝頭=文字、花草=動作、星光=圖像
**Commits：** 3da2691 fix(breathing): 拿掉 microTool title 顯示（場景中立化）, 7534244 feat(astro): v0.5 整合 healing 卡片 → astroCards + 抽三張只剩 spread, 724aaa7 feat(astro): tarot 卡片 A 方案純圖像主場（拆解與枝頭/呼吸的重複感）

---

## 2026-05-12 · 樹洞 AI 回信切片 A 完成（Vercel Function + Gemini 2.5 Flash）

**完成：** brainstorm 樹洞下一步功能方向：選 archetype 角色化「小屋主人」+ AI 動態接住+誇誇；確立四種 mode：hold_and_praise / praise_only / hold_only / crisis
**決策：** archetype 採「小屋主人」=敘事位置（不擬人、不出現臉）；信末固定「燈還亮著」由前端加
**Commits：** 0fd0e4c feat(api): safety thresholds + retry + e2e 測試腳本（切片 A Task 7）, f3f30bc chore(api): .env.example 文檔化 GEMINI_API_KEY, 14e9ef2 feat(api): /api/respond handler — Gemini → JSON（無 rate limit、無 safety）, 9c059af feat(api): Gemini 2.5 Flash client wrapper + responseSchema 強制 JSON, 03d97f0 feat(api): v2 system prompt 模組（小屋主人 archetype + 4 mode）, 268867f feat(api): AILetterResponse schema + validator（切片 A）, b2faebb fix(letter): 信件極簡化 — 拿掉 tinyAction/gentleQuestion/healingTip/再誇按鈕, 6c9c29c chore(api): 加 @google/genai SDK + api/ tsconfig（切片 A 準備）, b2e92d5 plan: 樹洞 AI 切片 A 實作計畫 + after_shift 模板去重複, 55107d3 fix(letter): 信件字體 標楷體 → 思源黑體（現代質感）, e64d21a docs(spec): 樹洞 AI 回信 v2 設計規格（brainstorm 產出）, b0f03ff chore: simplify — 清除 v0.5 重構後的死碼, 3da2691 fix(breathing): 拿掉 microTool title 顯示（場景中立化）, 7534244 feat(astro): v0.5 整合 healing 卡片 → astroCards + 抽三張只剩 spread, 724aaa7 feat(astro): tarot 卡片 A 方案純圖像主場（拆解與枝頭/呼吸的重複感）

---

## 2026-05-12 · 切片 A 上 production 通過 + 切片 B 計畫完成

**完成：** Vercel 環境變數設定完成（CLI vercel env add）：GEMINI_API_KEY × Product；Push 切片 A 11 commits 到 origin/main（commit 0fd0e4c）
**決策：** Vercel Node ESM 規則：本地 tsx/vitest 用 ESM bundler 自動補 .js、production runtime 需手動寫 .
**Commits：** ee8c750 plan: 樹洞 AI 切片 B（前端串接 + ai-safety + fallback）, 0188a79 fix(api): import paths 加 .js extension（Vercel Node ESM 解析需要）, 0fd0e4c feat(api): safety thresholds + retry + e2e 測試腳本（切片 A Task 7）, f3f30bc chore(api): .env.example 文檔化 GEMINI_API_KEY, 14e9ef2 feat(api): /api/respond handler — Gemini → JSON（無 rate limit、無 safety）, 9c059af feat(api): Gemini 2.5 Flash client wrapper + responseSchema 強制 JSON, 03d97f0 feat(api): v2 system prompt 模組（小屋主人 archetype + 4 mode）, 268867f feat(api): AILetterResponse schema + validator（切片 A）, b2faebb fix(letter): 信件極簡化 — 拿掉 tinyAction/gentleQuestion/healingTip/再誇按鈕, 6c9c29c chore(api): 加 @google/genai SDK + api/ tsconfig（切片 A 準備）, b2e92d5 plan: 樹洞 AI 切片 A 實作計畫 + after_shift 模板去重複, 55107d3 fix(letter): 信件字體 標楷體 → 思源黑體（現代質感）, e64d21a docs(spec): 樹洞 AI 回信 v2 設計規格（brainstorm 產出）, b0f03ff chore: simplify — 清除 v0.5 重構後的死碼, 3da2691 fix(breathing): 拿掉 microTool title 顯示（場景中立化）, 7534244 feat(astro): v0.5 整合 healing 卡片 → astroCards + 抽三張只剩 spread, 724aaa7 feat(astro): tarot 卡片 A 方案純圖像主場（拆解與枝頭/呼吸的重複感）

---

## 2026-05-12 · 切片 B 完成 — 前端串接 AI + ai-safety + fallback + Crisis 卡

**完成：** 切片 B Task 1：AILetterResponse 搬 packages/shared（commit 7c3815；切片 B Task 2：letter-adapter（static→AI shape）+ 5 unit tests（co
**決策：** 雙重 crisis 保險已驗證：classifySafety 攔下「撐不下去」regex 命中、不打 API；AI 自判 mode=crisis 兜底（前端 r
**Commits：** b092a2b feat(app): submit() async → /api/respond + ai-safety crisis 雙重保險, 8da0808 feat(letter): ResponseCard 接 AILetterResponse + AI 揭露文案, 964f01f feat(crisis): CrisisCard 元件 — 1925/1995/1980 專業資源, d3a6ea1 feat(letter): requestAILetter client — fetch /api/respond + fallback, fc61af1 feat(letter): static → AILetterResponse adapter（fallback 與 AI 統一 shape）, 7c38151 refactor(shared): AILetterResponse 搬遷到 packages/shared（前端共用準備）, ee8c750 plan: 樹洞 AI 切片 B（前端串接 + ai-safety + fallback）, 0188a79 fix(api): import paths 加 .js extension（Vercel Node ESM 解析需要）, 0fd0e4c feat(api): safety thresholds + retry + e2e 測試腳本（切片 A Task 7）, f3f30bc chore(api): .env.example 文檔化 GEMINI_API_KEY, 14e9ef2 feat(api): /api/respond handler — Gemini → JSON（無 rate limit、無 safety）, 9c059af feat(api): Gemini 2.5 Flash client wrapper + responseSchema 強制 JSON, 03d97f0 feat(api): v2 system prompt 模組（小屋主人 archetype + 4 mode）, 268867f feat(api): AILetterResponse schema + validator（切片 A）, b2faebb fix(letter): 信件極簡化 — 拿掉 tinyAction/gentleQuestion/healingTip/再誇按鈕, 6c9c29c chore(api): 加 @google/genai SDK + api/ tsconfig（切片 A 準備）, b2e92d5 plan: 樹洞 AI 切片 A 實作計畫 + after_shift 模板去重複, 55107d3 fix(letter): 信件字體 標楷體 → 思源黑體（現代質感）, e64d21a docs(spec): 樹洞 AI 回信 v2 設計規格（brainstorm 產出）, b0f03ff chore: simplify — 清除 v0.5 重構後的死碼, 3da2691 fix(breathing): 拿掉 microTool title 顯示（場景中立化）, 7534244 feat(astro): v0.5 整合 healing 卡片 → astroCards + 抽三張只剩 spread, 724aaa7 feat(astro): tarot 卡片 A 方案純圖像主場（拆解與枝頭/呼吸的重複感）

---

## 2026-05-13 · 切片 C 完成 — 三層 rate limit + 揭露精修 + production 驗收 429

**完成：** Vercel Marketplace Upstash for Redis 建立 + 連到 pharmacist-tree；vercel env pull .env.local 拉 KV_REST_API_URL / KV_REST_API_T
**決策：** Vercel KV 改 Marketplace Upstash for Redis（不是 Vercel 自己的 KV）、env vars 仍是 KV_REST_
**Commits：** d5a5a9f feat(letter): 揭露文案只在首次信件顯示（localStorage 記憶）, eaf4df5 feat(limit): 前端接 429 → RateLimitedError + 「這裡比較滿」訊息, 52c713a feat(api): respond handler 整合 IP rate-limit + budget cutoff, 7db472a feat(api): budget hard cutoff（env BUDGET_HARD_CUTOFF_DATE）, 177aba0 feat(api): IP rate-limit Vercel KV wrapper（5/IP/天、fail-open）

---

## 2026-05-19 · v0.5 重新定位：站點詩意化 + 金句去藥師化 + 主場景換 Ghibli storybook 夜晚版

**完成：** 7 站標籤改詩意 4 字：樹洞私語/意義拾荒/宇宙的悄悄話/情緒考古/意識降落/文字微光/頻率擁抱（Watercolor；金句池去藥師化：移除 ~48 句醫療職場相關（藥師/處方/夜班/醫療職場劇）；新增 quotes-literary.ts
**決策：** Lenormand 36 卡系統採全面去藥師化（option 3）；抽牌不打 AI，顯示 prompt-template 讓使用者貼到 ChatGPT/Clau
**Commits：** —

---

## 2026-05-19 · v0.5 收尾：CSS chip + 座標對位、殘餘醫療詞清理、commit & push a8ee169

**完成：** CSS hotspot chip 樣式：水彩光暈 → 紙質卡片（cream linear-gradient + 細邊 +；7 個 hotspot 座標反覆迭代對位新夜晚場景：宇宙的悄悄話 77/21（月亮下方）、意義拾荒 24/48（貓頭鷹下
**決策：** chip 風格：cream 紙質卡 + 軟陰影 + 小粉紅圓點 accent（對齊 reference 紙條風）
**Commits：** a8ee169 feat: v0.5 重新定位 — 站點詩意化 + 金句去藥師化 + Lenormand 36 + Ghibli 夜晚場景

---

## 2026-05-19 · v0.6 站點 UI 重設計：夜空玻璃卡（reflection + vent 完成、其他 5 站待推）

**完成：** 巡查現況：reflection / breathing / quote / vent / astro 五個站點截圖，定位；確立新設計語言「夜空玻璃卡」：rgba(22,16,36,0.78) + backdrop-filter blur(22
**決策：** 重設計方向選 A 夜空玻璃卡（vs B 保留 cream 修字重、C 極簡白卡），因為跟新夜晚場景融為一體、不再 cream-on-cream
**Commits：** a8ee169 feat: v0.5 重新定位 — 站點詩意化 + 金句去藥師化 + Lenormand 36 + Ghibli 夜晚場景

---

## 2026-05-19 · 站點 7 改名 + 金句池去藥師化 + Lenormand 36 張系統取代行星卡

**完成：** 站點 7 個全面改名：宇宙的悄悄話(astro)/意義拾荒(reflection)/樹洞私語(vent)/情緒考古(sa；金句池全面去藥師化：移除 ~48 句醫療/職場相關（含 Grey's Anatomy/ER/麻醉風暴等醫療劇出處）+ 新
**決策：** 卡牌系統選 Lenormand 36 張完整傳統系統（捨棄保留行星 13、捨棄混合方案）
**Commits：** 76a6df1 feat(astro): add question input flow + fix mobile 3-col layout, 23e7cce feat: v0.6 站點 UI 重設計（夜空玻璃卡）+ Lenormand 27 張卡面, a8ee169 feat: v0.5 重新定位 — 站點詩意化 + 金句去藥師化 + Lenormand 36 + Ghibli 夜晚場景

---

## 2026-05-19 · v0.6 玻璃卡 UI 推廣完成（7 站 + ResponseCard）+ commit 23e7cce

**完成：** 推廣玻璃卡到剩餘 5 站：quote（blockquote 暖金 bar + 暖白字）、astro（Lenormand ；ResponseCard（letter-card）轉玻璃信：拿掉 -0.3deg 旋轉 + 全部 dashed bord
**決策：** Letter (ResponseCard) 沿用 station 系列 glass design language，不另外開「紙信」變體；簽名「── 燈還亮著」
**Commits：** 76a6df1 feat(astro): add question input flow + fix mobile 3-col layout, 23e7cce feat: v0.6 站點 UI 重設計（夜空玻璃卡）+ Lenormand 27 張卡面, a8ee169 feat: v0.5 重新定位 — 站點詩意化 + 金句去藥師化 + Lenormand 36 + Ghibli 夜晚場景

---

## 2026-05-19 · 清掉 GitHub Dependabot 6 個漏洞警告（npm audit fix + 5 個 dismiss）

**完成：** 盤點 6 個 Dependabot 漏洞：1 high (minimatch ReDoS)、4 moderate (un；風險評估：build-time 工具為主、production runtime 攻擊面小（無 WS server、無惡意
**決策：** 選最安全做法（A npm overrides / B 純 audit fix / C 全 dismiss）的混合：先 audit fix 修能修的、剩下 5 個
**Commits：** dad12e6 chore(deps): npm audit fix — 修 smol-toml moderate 漏洞, 76a6df1 feat(astro): add question input flow + fix mobile 3-col layout, 23e7cce feat: v0.6 站點 UI 重設計（夜空玻璃卡）+ Lenormand 27 張卡面, a8ee169 feat: v0.5 重新定位 — 站點詩意化 + 金句去藥師化 + Lenormand 36 + Ghibli 夜晚場景

---

## 2026-05-19 · Lenormand 36/36 卡面確認完成 + 驗收保留 astro question 輸入流程

**完成：** 進度確認：Lenormand 36/36 卡面在 commit 76a6df1 已 push，前一個 Codex age；目視 spot-check 兩張新卡（lenormand-32-moon.png + lenormand-36-cros
**決策：** Astro question 輸入流程保留現狀不動（vs 抽掉回「邊抽邊」）— v0.5 時用戶曾拒絕、但 Codex 在 v0.6 加進來、實測體驗 OK 後
**Commits：** dad12e6 chore(deps): npm audit fix — 修 smol-toml moderate 漏洞, 76a6df1 feat(astro): add question input flow + fix mobile 3-col layout, 23e7cce feat: v0.6 站點 UI 重設計（夜空玻璃卡）+ Lenormand 27 張卡面, a8ee169 feat: v0.5 重新定位 — 站點詩意化 + 金句去藥師化 + Lenormand 36 + Ghibli 夜晚場景

---
