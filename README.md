# 藥師樹洞

給藥師使用的舒壓、情緒整理與療癒陪伴產品。產品可以做成 Web App、LINE Bot 或低壓療癒小遊戲；目前推薦先做 **Web App MVP**，因為它最適合驗收完整體驗，也能把樹洞、誇誇、抽牌、點歌、收藏和小樹成長一次展示清楚。LINE Bot 作為第二階段的日常入口。

## Current Decision

- 產品型態：Web App first, LINE Bot second, healing game layer third。
- 核心體驗：樹洞傾聽、具體誇誇、每日療癒籤、心情點歌、娛樂型塔羅。
- AI 定位：陪伴與反思，不做醫療、心理或職場法律判斷。
- 第一版成功標準：使用者能在 30 秒內完成一次情緒抒發並收到低壓、具體、有藥師情境感的回應。

## Planning Docs

- [docs/concept-options.md](docs/concept-options.md): Web App、LINE Bot、遊戲化與混合方案比較。
- [docs/MVP_SPEC.md](docs/MVP_SPEC.md): Web App MVP 畫面、流程、驗收標準。
- [docs/game-concept.md](docs/game-concept.md): 低壓療癒遊戲方案。
- [docs/SDD.md](docs/SDD.md): 系統設計文件。
- [docs/product-plan.md](docs/product-plan.md): 產品規劃、功能優先級與對話範例。

## Worktree

```text
.
├── AGENTS.md
├── README.md
├── apps
│   ├── line-bot
│   └── web-pwa
├── docs
│   ├── SDD.md
│   ├── develog.md
│   └── product-plan.md
├── ops
├── packages
│   ├── ai-safety
│   ├── content
│   └── shared
├── prompts
└── tests
    ├── e2e
    └── safety
```

## Current Build

Web App MVP is implemented locally under `apps/web-pwa`.

Run:

```bash
npm install
npm run dev
```

Verify:

```bash
npm test
npm run build
```

Current MVP includes:

- 手機優先的水彩場景入口，七個物件站點對應樹洞、反思、歌曲、呼吸、金句、抽牌與收藏。
- Gemini-backed `/api/respond` AI 回信，前端有 fallback 靜態回覆。
- 藥師情境回信：先接住壓力，再做具體誇誇，不做診斷或專業判斷。
- 內嵌 30 秒 micro tools、心情歌曲、金句池與 Lenormand 36 張抽牌 prompt flow。
- 危機、醫療邊界、個資輸入的前端與 API 端 safety pre-check。
- Vercel KV IP rate limit、budget cutoff、本機每日一封軟限制與首次 AI 揭露。
- localStorage 收藏，不保存原始樹洞文字。

Next step: fresh mobile visual QA, then choose invite pilot instrumentation or LINE Bot M2.
