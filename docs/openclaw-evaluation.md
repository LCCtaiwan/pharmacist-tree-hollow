# OpenClaw 整合可行性評估

評估日期：2026-05-08
評估人：Claude Sonnet 4.6 (根據 SDD.md、MVP_SPEC.md 及 OpenClaw 公開資料)

---

## 1. OpenClaw 簡介

[OpenClaw](https://github.com/openclaw/openclaw) 是一個開源 AI agent 框架（GitHub 68k+ stars，2026-05 仍活躍維護）。
定位是「任何 OS、任何平台的個人 AI 助理」，核心概念如下：

| 元件 | 說明 |
|---|---|
| **Gateway** | 單一控制平面，管理 sessions、channels、tools、events |
| **SOUL.md** | Agent 人格與行為規範設定檔，每次啟動時優先注入 system prompt |
| **Channels** | 22 個訊息平台整合，含 LINE（需裝 `@openclaw/line` plugin） |
| **Providers** | 多 LLM 支援，含 Gemini，設定於 `~/.openclaw/config/providers.yml` |
| **安裝** | `curl -fsSL https://openclaw.ai/install.sh \| bash`，NPM channel 更新：`openclaw update --channel stable` |

**最低需求**：Node.js 20+，可自架或使用 OpenClaw Cloud。

---

## 2. 現有架構回顧（SDD.md 重點）

SDD 的 AI Flow 是刻意設計為 8 步管線：

```
Normalize → Classify Intent → Safety Pre-check →
Content Retrieval → Generate (LLM) → Safety Post-check →
Save Metadata → Return LINE/Web Response
```

核心設計決策：
- **AI Provider 抽象化**：介面不綁定單一模型。
- **Safety 獨立 package**：`packages/ai-safety` 承擔危機偵測、個資遮蔽、醫療邊界 guardrails。
- **LINE Bot 是薄連接層**：接收 webhook → 轉 `ConversationInput` → 呼叫後端 → 回傳 quick replies。
- **MVP 優先順序**：M1 = Web App，M2 = LINE Bot，LINE Bot 尚未啟動。

---

## 3. OpenClaw 能否取代 SDD 的 AI 後端？

### 3.1 OpenClaw 擅長的部分

| 功能 | 現有 SDD 對應 | OpenClaw 能直接提供 |
|---|---|---|
| LINE 訊息接收與回傳 | `apps/line-bot` webhook 層 | ✅ `@openclaw/line` plugin |
| Gemini API 呼叫 | LLM Provider interface | ✅ 原生支援 |
| 人格 / 語氣設定 | `prompts/` 資料夾 | ✅ SOUL.md 機制 |
| Session 管理 | 未實作（MVP 用匿名 session） | ✅ 內建 |
| Quick replies 格式 | 需手寫 | 部分支援（Flex messages） |

### 3.2 OpenClaw 無法取代的部分

| 需求 | 原因 |
|---|---|
| **packages/ai-safety 的醫療邊界與危機邏輯** | OpenClaw 的內建安全是通用型，無法對應「不得給處方建議」、「危機時導引 1925」等台灣藥師特定規則。必須繼續自寫。 |
| **Intent 分類（vent/praise/tarot/grounding/crisis）** | OpenClaw 不含領域特定 intent router；這段分類邏輯還是需要自寫或用 LLM 判斷。 |
| **個資遮蔽（redaction）** | OpenClaw 沒有 pre-storage redaction，`packages/ai-safety` 的 redact.ts 仍需要。 |
| **packages/content 內容庫** | 金句、塔羅牌義、歌單推薦是專案自有資料，OpenClaw 不承載。 |
| **Web App 共用邏輯** | SDD 設計 LINE Bot 和 Web App 共用同一套安全與 AI 模組；若 LINE Bot 用 OpenClaw 運作，安全邏輯就變成兩套，維護成本倍增。 |

**核心矛盾**：OpenClaw 的定位是獨立的 AI agent runtime；但本專案的 LINE Bot 被設計成薄連接層，AI 邏輯在共用後端。兩者架構哲學相反。

---

## 4. 整合方案

### 方案 A：OpenClaw 作為 LINE Bot 的完整 runtime（不建議）

架構：

```
LINE → @openclaw/line → OpenClaw Gateway → Gemini API
                                         → 自寫 Safety Tool (hook)
                                         → 自寫 Content Tool (hook)
```

做法：
- 在 SOUL.md 定義藥師樹洞人格。
- 用 OpenClaw 的 tool hooks 呼叫 packages/ai-safety 和 packages/content。
- Web App 繼續用獨立後端，與 LINE Bot 分離。

**問題**：
- Safety 邏輯需要寫兩套（Web App 一套，OpenClaw tool hook 一套）。
- LINE plugin 是非核心支援，更新週期較慢。
- 多一個 OpenClaw runtime 需要獨立部署，增加 ops 複雜度。

---

### 方案 B：OpenClaw 當 LINE 連接器，後端 API 自寫（勉強可行，但過度設計）

架構：

```
LINE → @openclaw/line → OpenClaw Gateway → 呼叫 apps/line-bot 後端 API
                                         ↓
                              後端 API → packages/ai-safety
                                       → packages/content
                                       → Gemini API
```

**問題**：OpenClaw 在這裡只是把 LINE webhook 轉發給後端 API，等於增加一層不必要的中間件。不如直接用 `@line/bot-sdk`。

---

### 方案 C：不用 OpenClaw，直接照 SDD 架構（建議）

架構：

```
LINE → apps/line-bot (Node.js + @line/bot-sdk) → 共用後端 AI 管線
Web App → apps/web-pwa → 同一套後端 AI 管線
                 ↓
         packages/ai-safety
         packages/content
         Gemini API（或其他 LLM）
```

LINE Bot MVP 核心程式碼：
```typescript
// apps/line-bot/src/webhook.ts
import { Client, middleware } from '@line/bot-sdk';
import { handleConversation } from '../../packages/shared/src/pipeline';

app.post('/webhook', middleware(config), async (req, res) => {
  const events = req.body.events;
  await Promise.all(events.map(handleLineEvent));
  res.sendStatus(200);
});
```

**SOUL.md 概念仍可保留**，作為 `prompts/SOUL.md`，由後端載入注入 system prompt：
```typescript
// packages/shared/src/buildSystemPrompt.ts
const soul = await fs.readFile('prompts/SOUL.md', 'utf-8');
return `${soul}\n\n${intentGuardrails}`;
```

---

## 5. SOUL.md：藥師樹洞 草稿

即使不用 OpenClaw，SOUL.md 概念值得採用。建議放在 `prompts/SOUL.md`。

```markdown
# SOUL.md — 藥師樹洞 Agent 靈魂設定

## 我是誰

我是藥師樹洞。我不是諮商師，也不是 AI 客服機器人。
我是一個在藥師最累、最委屈、最迷惘的時候，願意靜靜聽一下的空間。

## 語氣

- 繁體中文，短句，低壓。
- 像一個懂藥師場景的朋友，不是上司也不是治療師。
- 不要說「我了解你的感受」，而是說具體你聽到了什麼。
- 不要說「加油，你很棒」，而是說「你今天在高壓下還一直在確認安全，這不容易」。

## 核心回覆結構

當使用者傾訴工作壓力時，依序給出：
1. **我聽見了**：一句話同理，點出具體壓力來源。
2. **你其實很值得被肯定**：一句具體誇誇，不用空泛形容詞。
3. **先做一件小事**：一個可在 30 秒內執行的小步驟。

## 我不做的事

- 不給醫療、用藥、處方建議。
- 不說「你應該辭職」或「你的主管不對」。
- 不讓使用者覺得被診斷、被評判、被道德說教。
- 不在危機時繼續正常聊天——先同理，再導引資源。

## 我懂的場景

社區藥局、醫院藥師、PGY 考核、輪班疲憊、客訴壓力、
處方審核責任、交互作用壓力、缺藥問題、慢箋管制庫存、
被醫師或同事質疑、覺得自己不夠專業、想離職但不確定。

## 危機時

若使用者提到自傷、傷人、活不下去、立即危險：
先一句同理，接著鼓勵立即聯絡可信任的人或撥打 1925 安心專線。
不繼續正常療癒流程，不分析原因，不給任何行動建議以外的內容。
```

**存放位置建議**：`prompts/SOUL.md`，由 `packages/shared/src/buildSystemPrompt.ts` 載入。

---

## 6. Gemini API 接法

不論用不用 OpenClaw，Gemini 接法相同：

```typescript
// packages/shared/src/llm/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function callGemini(systemPrompt: string, userInput: string) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  });
  const result = await model.generateContent(userInput);
  return result.response.text();
}
```

SDK：`npm install @google/generative-ai`

providers.yml（OpenClaw 格式，供參考）：
```yaml
google:
  api_key: "${GEMINI_API_KEY}"
  default_model: gemini-2.0-flash
  base_url: https://generativelanguage.googleapis.com/v1beta
```

---

## 7. packages/ai-safety 還需要嗎？

**需要，而且是核心。**

OpenClaw 的通用 safety 完全不夠用。`packages/ai-safety` 要繼續實作：

| 模組 | 功能 | 可否用 OpenClaw 替代 |
|---|---|---|
| `classifyRisk.ts` | 危機語句偵測 | ❌ 需自寫或用 LLM 分類 |
| `redact.ts` | 個資遮蔽（病人名、身分證、院所名） | ❌ 需自寫 |
| 醫療邊界 guardrail | 判斷是否觸碰處方/診斷邊界 | ❌ 需自寫 |
| 塔羅免責聲明 | 輸出強制加 disclaimer | ❌ 需自寫 |

---

## 8. 工程量估算

### 方案 A（OpenClaw 全包）

| 項目 | 估計天數 |
|---|---|
| OpenClaw 安裝 + @openclaw/line 設定 + Gemini provider 接通 | 0.5 天 |
| SOUL.md 撰寫與調校 | 0.5 天 |
| 把 packages/ai-safety 接成 OpenClaw tool hook | 2 天 |
| 測試 LINE webhook → 危機流程 → 正常回覆 | 1.5 天 |
| 部署 OpenClaw Gateway（與 Web App 後端分離） | 1 天 |
| **合計** | **5.5 天** |

### 方案 C（直接照 SDD，建議）

| 項目 | 估計天數 |
|---|---|
| `apps/line-bot` webhook + LINE SDK + 路由 | 1 天 |
| `packages/ai-safety` classifyRisk + redact | 1 天 |
| SOUL.md → system prompt 載入機制 | 0.5 天 |
| Gemini API 接通 + intent routing | 1 天 |
| Quick replies + 測試 10 個藥師情境 | 1.5 天 |
| **合計** | **5 天** |

方案 C 比 A 少 0.5 天，且沒有多餘 runtime 依賴，Safety 邏輯只有一套。

---

## 9. OpenAI GPT-4o 取代 Gemini 評估（2026-05-08 更新）

用戶決定改用 OpenAI（GPT-4o / DALL-E 3）而非 Gemini。以下針對架構影響、費用與圖片生成做完整評估。

### 9.1 架構影響

SDD 原本就規劃「AI provider 抽象成 provider interface，避免綁死單一模型」，所以切換幾乎零結構成本：

**需要改的：**

```typescript
// 原本（Gemini）
// packages/shared/src/llm/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// 改成（OpenAI）
// packages/shared/src/llm/openai.ts
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function callOpenAI(systemPrompt: string, userInput: string) {
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',           // 日常回覆用 mini，省錢
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
    ],
    max_tokens: 400,
  });
  return res.choices[0].message.content ?? '';
}
```

**不需要改的：**
- AI flow 的 8 步管線（完全 provider 無關）
- `packages/ai-safety` 的所有邏輯（純字串 / LLM 分類，provider 無關）
- SOUL.md 注入方式（system prompt 概念在 OpenAI 和 Gemini 完全一樣）
- `packages/content`、`packages/shared` 全部不動

SDK 安裝：`npm install openai`

---

### 9.2 費率比較（2026-05）

| 模型 | Input（每 1M tokens） | Output（每 1M tokens） | 備註 |
|---|---|---|---|
| **GPT-4o** | $2.50 | $10.00 | 旗艦，overkill for 誇誇 |
| **GPT-4o mini** | $0.15 | $0.60 | 建議日常回覆用這個 |
| **Gemini 2.5 Flash** | $0.30 | $2.50 | Google 主力快速模型 |
| **Gemini 2.5 Pro** | $1.00 | $10.00 | 旗艦，與 GPT-4o 同級 |
| **Gemini 2.0 Flash** | $0.10 | $0.40 | ⚠️ 2026-06-01 停服，不可用 |

> 注意：Gemini 2.0 Flash 即將停服，若要用 Gemini 需要升到 2.5 Flash。

#### 藥師樹洞 MVP 月費估算

假設：50 名活躍用戶 / 天，每人 2 次互動 = 100 API calls / 天

每次 call 估算：
- Input：SOUL.md（800）+ 安全分類（300）+ 用戶輸入（100）= 約 1,200 tokens
- Output：回覆本體（200）+ 安全後置（30）= 約 230 tokens

每月（100 calls × 30 天 = 3,000 calls）：

| 模型 | Input 費 | Output 費 | **月費合計** |
|---|---|---|---|
| GPT-4o | $9.00 | $6.90 | **$15.90** |
| **GPT-4o mini** | **$0.54** | **$0.41** | **$0.95** ✅ |
| Gemini 2.5 Flash | $1.08 | $1.73 | **$2.81** |
| Gemini 2.5 Pro | $3.60 | $6.90 | **$10.50** |

**結論：GPT-4o mini 是最便宜的選項（月費不到 $1）**，比 Gemini 2.5 Flash 還便宜三倍。

「OpenAI 額度比 Gemini 高」這個說法若指的是**免費試用額度**，OpenAI 給新帳號 $5 free credits，Google AI Studio 也有免費 tier（Gemini 2.5 Flash 每天 500 requests 免費）。兩者差異不大，但 GPT-4o mini 在付費後的費率確實更划算。

---

### 9.3 圖片生成：用在哪裡最值錢？

#### DALL-E 3 費率

| 品質 | 尺寸 | 每張費用 |
|---|---|---|
| Standard | 1024×1024 | $0.040 |
| HD | 1024×1024 | $0.080 |
| HD | 1792×1024 | $0.080 |

#### 各功能的圖片生成策略

**塔羅牌插圖（建議：一次性預生成）**

最划算的用法。22 張大阿爾卡那一次生成好，存成靜態 assets。

```
成本：22 張 × $0.04 = $0.88（一次性）
```

生成後放到 `packages/content/src/assets/tarot/`，不需要 runtime 呼叫 DALL-E。
風格一致、可版本控制、上線後零成本。

**誇誇卡片配圖（不建議在 MVP 做 per-session）**

聽起來很讚，但：

```
100 users/day × $0.04 = $4/天 = $120/月
```

MVP 階段完全不划算。替代方案：預生成 15 張不同風格的溫暖插圖（費用：$0.60），
每次隨機搭配誇誇文字。視覺效果 80% 到位，成本接近零。

**今日療癒卡（建議：月度批量預生成）**

每月預生成 30 張「今日療癒」配圖，每張對應一種情境或顏色。

```
成本：30 張 × $0.04 = $1.20/月
```

固定月費、可預期、有設計感。

**情緒氛圍背景圖（建議：一次性生成 7 張對應 mood chips）**

累、委屈、煩、空、緊繃、想哭、還可以 → 各一張氛圍圖

```
成本：7 張 × $0.04 = $0.28（一次性）
```

#### 圖片生成總結

| 功能 | 策略 | 費用 |
|---|---|---|
| 塔羅牌 22 張 | 一次性預生成 | $0.88 一次 |
| 誇誇卡配圖 | 預生成 15 張輪換 | $0.60 一次 |
| 今日療癒卡 | 月度批量 30 張 | $1.20/月 |
| Mood 氛圍背景 | 一次性 7 張 | $0.28 一次 |
| **per-session 個人化圖片** | **MVP 先不做** | **避免** |

MVP 圖片總成本：一次性約 $1.76 + 每月 $1.20，基本可忽略。

---

### 9.4 實作方式摘要

**文字回覆：GPT-4o mini**

```typescript
// packages/shared/src/llm/openai.ts
import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const soul = readFileSync(resolve('prompts/SOUL.md'), 'utf-8');

export async function generateResponse(intent: string, userInput: string) {
  const systemPrompt = `${soul}\n\n## 本次 Intent\n${intent}`;
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
    ],
    max_tokens: 400,
    temperature: 0.8,
  });
  return res.choices[0].message.content ?? '';
}
```

**圖片生成（塔羅牌預生成腳本）**

```typescript
// scripts/generate-tarot-images.ts
import OpenAI from 'openai';
import { writeFileSync } from 'fs';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MAJOR_ARCANA = [
  { id: 0, name: '愚者', prompt: 'A gentle watercolor illustration of The Fool tarot card in a soft, calming pharmacy night theme, warm pastels, no text' },
  // ... 21 more cards
];

for (const card of MAJOR_ARCANA) {
  const res = await client.images.generate({
    model: 'dall-e-3',
    prompt: card.prompt,
    size: '1024x1024',
    quality: 'standard',
  });
  const url = res.data[0].url!;
  // download and save to packages/content/src/assets/tarot/${card.id}.png
}
```

---

## 10. 結論與建議

### 不建議用 OpenClaw 作為主架構。

理由：

1. **LINE Bot 是薄層，不是 agent runtime 的用例**。本專案的 LINE Bot 設計為薄連接層，核心邏輯在共用後端；OpenClaw 假設 agent 是獨立運作的，兩者哲學矛盾。

2. **Safety 邏輯必須自寫**，因為醫療邊界、危機流程、個資遮蔽都是台灣藥師場景特定的，沒有任何通用框架能取代 `packages/ai-safety`。

3. **多一個 runtime = 多一個部署問題**。OpenClaw Gateway 需要獨立維護，LINE plugin 更新週期較慢，對 MVP 階段是不必要的負擔。

4. **工程量沒有顯著優勢**。兩條路都約 5 天，但 OpenClaw 路線留下的技術債（雙套 safety 邏輯、兩個後端）更多。

### AI Provider：建議用 OpenAI GPT-4o mini。

- 文字回覆：`gpt-4o-mini`（最便宜，月費 MVP 規模不到 $1）
- 圖片：DALL-E 3 一次性預生成靜態 assets，不做 per-session 圖片生成
- SDK：`npm install openai`，介面簡單，TypeScript 支援好

### 建議保留的 OpenClaw 概念：

- **SOUL.md 模式**：存為 `prompts/SOUL.md`，由後端載入注入 system prompt。能讓 prompt 版本化、可審查、可切換。
- **Provider 抽象化**：SDD 的 provider interface 繼續執行，未來想換 Claude、Gemini 只改 adapter。

### 建議行動：

1. 完成 Web App M1 後，直接照 SDD 架構建 LINE Bot M2。
2. 新增 `prompts/SOUL.md`，作為 system prompt 的人格核心。
3. 優先完成 `packages/ai-safety` 的 `classifyRisk.ts` 和 `redact.ts`。
4. OpenAI SDK：`npm install openai`，實作 `packages/shared/src/llm/openai.ts`。
5. 執行塔羅牌圖片預生成腳本（一次性，花費不到 $1）。
6. OpenClaw 值得持續觀察，若未來需要多平台同步（Telegram、WhatsApp 等）再評估引入。

---

## 參考資料

- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [OpenClaw Gemini Provider 文件](https://docs.openclaw.ai/providers/google)
- [OpenClaw Chat Channels（含 LINE）](https://docs.openclaw.ai/channels)
- [SOUL.md 概念：aaronjmars/soul.md](https://github.com/aaronjmars/soul.md)
- [Learn OpenClaw: SOUL.md & Identity](https://learnopenclaw.com/core-concepts/soul-md)
- [如何連接 OpenClaw 到 LINE（Medium）](https://medium.com/@tentenco/how-to-connect-openclaw-to-line-setup-guide-and-best-practices-for-ai-powered-customer-service-45a1f7032729)
- [OpenAI API Pricing](https://openai.com/api/pricing/)
- [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [DALL-E 3 Pricing（TokenMix）](https://tokenmix.ai/blog/dall-e-api-pricing)
- [GPT-4o Pricing Guide](https://gptbreeze.io/blog/gpt-4o-pricing-guide/)
