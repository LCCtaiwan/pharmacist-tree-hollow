# Art Direction: 藥師樹洞

最後更新：2026-05-09
策略決策者：使用者（產品擁有者）
執行者：Codex

---

## 1. 視覺定位一句話

> **「一座小小的水彩世界，藥師走進去，把今天放下。」**

藥師樹洞不是 SaaS 後台、不是醫療工具、不是夜店。它是一張**手繪水彩生態圖**，使用者把心情投進中央那棵樹的樹洞，旁邊是一間小小的木造藥局。整個畫面安靜、暖、稍微有點可愛，但不幼稚。

---

## 2. 視覺參考

| 參考來源 | 借用什麼 |
|---|---|
| **DESERTOPIA 荒漠樂園**（手機遊戲） | 整片水彩生態構圖、奶油黃綠暖調、滿版小元素散佈、可愛但不幼稚的比例 |
| **解憂雜貨店**（東野圭吾） | 投信 / 樹洞收信的儀式感、夜晚的小店燈光、紙條質感 |
| **吉卜力背景畫**（如《魔女宅急便》田園段） | 水彩紙質紋理、手繪不規則邊緣、柔和光線 |

**關鍵字**：水彩、紙質、手繪、奶油色、生態圖、小動物、藥草園、樹洞、木造小屋、療癒

**反例（不要做成這樣）**：
- 深夜暗綠霓虹感（電玩風）
- 純向量扁平 SaaS 風（Linear / Notion 那種冷感）
- 醫療診所感（白底藍邊、紅十字、藥丸圖示）
- 過度童趣（Q 版大頭、卡通眼睛、粉紫紫色系）

---

## 3. 色彩 Token

取代現行 `styles.css` 的暗綠+琥珀黃配色。

```css
:root {
  /* Background */
  --paper:        #f5ead0;  /* 奶油米白，主底，紙質感 */
  --paper-warm:   #efe0b8;  /* 暖一階，卡片底 */
  --paper-shadow: #e3d2a1;  /* 紙陰影 */

  /* Foliage (生態圖主綠系) */
  --moss:         #9bb874;  /* 苔蘚綠，主要植物 */
  --moss-deep:    #6e8a55;  /* 深綠，樹冠陰影 */
  --sage-pale:    #c8d8a8;  /* 淺綠，背景植物 */

  /* Earth & Wood */
  --terracotta:   #c97a4a;  /* 陶土橘，主要點綴 / 強調 */
  --wood:         #a37452;  /* 木造小屋 */
  --wood-light:   #c89a72;  /* 淺木 */

  /* Sky & Water */
  --sky-mist:     #b8cdd4;  /* 霧藍，遠山 / 水 */
  --dusk-pink:    #e5b8a1;  /* 黃昏粉，光暈 */

  /* Text */
  --ink:          #3a2c1e;  /* 主文字，墨褐色，不用純黑 */
  --ink-soft:     #6a5a44;  /* 次要文字 */

  /* States */
  --crisis-warm:  #b85c3c;  /* 危機色，暖紅，不刺眼 */
  --highlight:    #f0c66d;  /* 點綴金（少量用，比現在收斂） */
}
```

**關鍵原則**：
- 拒絕純黑、純白、深暗綠
- 所有色都要帶一點黃 / 暖偏移，不能是冷灰調
- 對比度要夠（WCAG AA）但邊界要柔（border-radius 大、邊線透明度低）

---

## 4. 字體

- **標題**：`"Noto Serif TC", "Source Han Serif TC", serif`（思源宋體繁中）→ 像信件、像書本
- **內文**：`"Noto Sans TC", "PingFang TC", system-ui, sans-serif`，但保持柔和（line-height 1.7+）
- **強調 / 標誌**：可以考慮用一個手寫體（如 `"Klee One"` 或 `"Yuji Mai"` 從 Google Fonts），用於招牌、信件落款
- **拒絕**：等寬字、過於現代的 grotesque（Inter、SF Mono 那類）

---

## 5. 場景動畫策略

**核心原則：水彩美術不需要動很多。一切動效要慢、要少、要像呼吸。**

### 主場景：水彩生態圖（靜態 + 微動）

- 單一張水彩插畫做為背景，覆蓋上半螢幕（手機直式約 60% viewport）
- 構圖中央：**一棵大樹，樹幹中段有一個樹洞**
- 樹的右側：**一間小小的木造藥局**（一扇黃光小窗、屋頂、煙囪可選）
- 周圍散佈：藥草園（薄荷、洋甘菊、薰衣草、鼠尾草小叢）、小石頭、野花
- 動物：1-2 隻睡著的貓、1 隻貓頭鷹（夜班意象）、幾隻蝴蝶或小鹿（遠景）
- 天空：奶油黃漸層到淡淡夕陽粉
- **整張圖是一張 PNG**，不是用 CSS 拼出來的

### 微動效（CSS / 簡單 SVG）

只做這四個：
1. **樹葉輕搖**：整棵樹用一個 transform: rotate(0.5deg) 8s ease-in-out infinite
2. **小窗黃光呼吸**：opacity 0.85 → 1 → 0.85，6 秒一循環
3. **蝴蝶 / 小光點漂浮**：絕對定位 SVG，alternate ease-in-out 9 秒
4. **投信動畫**：使用者送出時，一張紙條從輸入框飄向樹洞 → 縮小 → 樹洞短暫亮一下（這是唯一的「事件」動畫）

**不要做的**：
- 雨滴下落
- 星星閃爍
- 多層 parallax
- 任何超過 1 秒的循環抖動

---

## 6. 圖片資產清單（給 Codex 生圖用）

**生成方式（首選）**：使用 **Codex CLI 內建圖片生成能力**（image-2 / 後續版本）。Codex 透過自身登入直接呼叫，**不需要另外申請 OpenAI API key、不需要 OPENAI_API_KEY 環境變數**。

**生成方式（fallback）**：若 Codex 內建路徑不可用，可退回 `scripts/generate-art.ts` 走 OpenAI Images API + OPENAI_API_KEY。已寫好但屬備援。

所有圖（共 22 張）生成後請存到 `apps/web-pwa/public/art/`。

### 必生（MVP 核心）

| 檔名 | 尺寸 | 用途 | Prompt 種子 |
|---|---|---|---|
| `scene-main.png` | 1024×1536（直） | 主場景背景 | watercolor illustration, soft cream yellow paper texture, a large round-canopy tree with a visible hollow in the trunk in the center, a tiny wooden cottage pharmacy on the right with a glowing yellow window, surrounded by gentle herbs like mint, lavender, chamomile, sage in small clusters, a few sleeping cats, an owl on a branch, butterflies in distance, soft pastel sky with hint of dusk pink, hand-drawn imperfect edges, no text, no people, no medication bottles or pills, gentle and calming mood |
| `scene-crisis.png` | 1024×1536 | 危機模式變體 | same composition as main scene but at deep twilight, more muted tones, the cottage window glowing more warmly, a single soft moonlight, suggesting safety and quiet presence, no crisis imagery |
| `letter-paper.png` | 512×512（透明背景） | 投信動畫紙條 | a small piece of cream-colored handwritten letter paper, slightly crumpled corner, watercolor style, transparent background, no text |

### 心情小插圖（7 張，作為回覆卡角落點綴）

統一風格：300×300 透明背景 PNG，單一物件，水彩。

| 心情 | 圖像 |
|---|---|
| 累 | a small sleeping cat curled up on a folded apron |
| 委屈 | a single cloud with a tiny soft tear, watercolor pastel |
| 煩 | a tangled ball of yarn with a small kitten paw |
| 空 | an empty teacup with a single rising steam wisp |
| 緊繃 | a tightly closed bud of a chamomile flower |
| 想哭 | a small puddle reflecting moonlight |
| 還可以 | a small green sprout pushing through cracked earth |

### 療癒卡背景（5 張）

對應 `packages/content/src/index.ts` 的 `healingCards` 五張：
- 邊界 → a stone garden with a single curved path
- 交班 → two hands gently passing a small lantern
- 小燈 → a single firefly resting on a leaf
- 節制 → a half-filled teapot
- 深呼吸 → a wide-open window with curtains lifting in breeze

400×600 直式，水彩，每張左下角留白給卡名。

### 星象卡（7 張）

對應 `astroCards` 的七張行星象徵：
- 土星 → 環狀星體，沙色與鏽橘
- 月亮 → 半月，霧藍與奶白
- 水星 → 帶風的小星
- 火星 → 暖紅，但柔
- 木星 → 大圓，奶油黃帶光
- 金星 → 粉色，柔和
- 羅喉 → 霧色，神秘但不黑暗

400×600 直式，水彩，深夜柔和星空背景，行星佔中間。

### 費用

- **首選路徑（Codex CLI 內建 image-2）**：依 Codex 訂閱方案計算，使用者已有 ChatGPT 登入，不需另外計費。
- **Fallback 路徑（OpenAI Images API）**：22 張一次性約 $0.92，留 2× buffer 估 $2 以內。需要使用者自備 OPENAI_API_KEY。

---

## 7. 重要約束（生成 prompt 必加）

每個 prompt 都要在尾端附加：

```
NEGATIVE: no medical pills, no medicine bottles, no syringes, no white lab coats, no red cross, no hospital signage, no realistic faces, no text or letters in the image, no chibi cartoon big eyes, no neon, no dark gloomy mood
STYLE: watercolor on rough paper, soft hand-drawn lines, gentle desaturation, slight paper grain, painterly imperfect edges
```

---

## 8. 實作順序（給 Codex）

1. ✅ 已完成：`styles.css` 水彩 color tokens、`WatercolorScene.tsx` 結構、`scripts/generate-art.ts` fallback 腳本
2. ✅ 已完成：第 10 節 R1-R11 場景反應系統實作
3. **目前階段**：Codex 用內建 image-2 依本文件第 6 節清單逐張生成 22 張圖，落地到 `apps/web-pwa/public/art/`
4. 視覺驗收（375px 手機）→ 監督者依實際 `scene-main.png` 校正第 10.2 節座標 CSS 變數
5. UI 微調：mood chip 圖示視覺平衡、卡片紙質、按鈕質感

---

## 9. 驗收標準

UI 重構完成後，要符合：

- [ ] 首次打開的第一印象不像「醫療 App」、「SaaS 後台」、「電玩」
- [ ] 整體色調以奶油黃 + 苔蘚綠 + 陶土橘為主，無深暗背景
- [ ] 主場景是水彩生態圖（單一 PNG），不是 CSS 拼貼
- [ ] 文案完全是「藥師」，沒有任何「醫護」殘留
- [ ] 手機 375px 視覺驗證通過
- [ ] **第 10 節 R1-R11 場景反應全部實作且可從 UI 操作觸發**
- [ ] 場景反應在 crisis mode 下被正確抑制（只保留投信/回信閉環）

---

## 10. Scene Reactivity Spec（場景反應系統）

**原則**：場景不是裝飾，是世界對使用者動作的回應。每個按鈕、每個狀態變化都要在水彩世界裡有具體視覺回饋。

### 10.1 WatercolorScene Props 介面

```tsx
import type { MoodTag, FollowupAction } from "@pharmacist-tree-hollow/shared";

export type SceneState = "idle" | "writing" | "thinking" | "depositing" | "responding";

export interface WatercolorSceneProps {
  mood: MoodTag;
  state: SceneState;
  activePanel: FollowupAction | null;   // "song" | "card" | "astro" | null
  microActive: boolean;                 // 喘口氣進行中
  savedCount: number;                   // 累積收下的紙條數（display 上限 8）
  crisis: boolean;
}
```

### 10.2 場景座標（CSS 變數，暫定值，待實圖再微調）

寫進 `styles.css` 的 `:root`：

```css
--scene-hollow-x: 32%;       /* 樹洞水平位置（中央偏左） */
--scene-hollow-y: 56%;       /* 樹洞垂直位置 */
--scene-window-x: 72%;       /* 木屋窗戶 */
--scene-window-y: 48%;
--scene-tree-base-x: 30%;    /* 樹下空地（卡片放置點） */
--scene-tree-base-y: 78%;
--scene-sky-x: 50%;          /* 天空中央（星星散開區） */
--scene-sky-y: 18%;
--scene-shelf-x: 88%;        /* 右下小架子（累積便籤） */
--scene-shelf-y: 82%;
--scene-mood-x: 14%;         /* 左下 mood 生物落點 */
--scene-mood-y: 70%;
```

座標都用 `%` 是因為主場景圖在不同手機高度需要 cover/contain，百分比比 px 抗變形。

### 10.3 反應對應表（R1–R11）

#### R1. Mood 顯影
- **觸發**：`mood` prop 變化
- **DOM**：`<img class="scene-mood-pet" src={`/art/mood-${mood}.png`} alt="" />`，定位於 `(--scene-mood-x, --scene-mood-y)`
- **動畫**：mood 切換時 crossfade `opacity 0→0.85`，`transition: opacity 400ms ease-out`
- **抑制**：`crisis === true` 時 `display: none`

#### R2. Writing — 樹洞醒著
- **觸發**：`state === "writing"`
- **DOM**：`<div class="scene-hollow-glow scene-hollow-glow-soft" />`，定位於 hollow 座標，圓形 radial gradient 60×60px，色 `var(--highlight)` 透明度 0.2
- **動畫**：`@keyframes hollowSoft`，`opacity 0.18 → 0.42 → 0.18`，`5s ease-in-out infinite`
- **抑制**：crisis 停

#### R3. Depositing — 投信飛入
- **觸發**：`state === "depositing"`
- **DOM**：`<img class="scene-letter-deposit" src="/art/letter-paper.png" />`
- **動畫**：`@keyframes letterDeposit`，800ms ease-in 結束。從輸入框上方 `(45%, 90%)` → hollow 座標，同時 `scale(1) → scale(0.4)`、`rotate(0deg) → rotate(-15deg)`、`opacity 1 → 0.6`
- **持續**：使用者送出後保持 600ms，由 App.tsx 控制 timer 後切到 thinking
- **抑制**：crisis 仍要做（這是核心隱喻）

#### R4. Thinking — 脈動光
- **觸發**：`state === "thinking"`
- **DOM**：同 R2 但 class 改 `.scene-hollow-glow-thinking`，size 80×80px、色更亮
- **動畫**：`opacity 0.5 → 0.85 → 0.5`，`1.6s ease-in-out infinite`
- **抑制**：crisis 仍可顯示（弱化版，opacity 上限 0.4）

#### R5. Responding — 回信飛出
- **觸發**：`state === "responding"`（response 剛抵達後 600ms 短態）
- **DOM**：`<img class="scene-letter-return" src="/art/letter-paper.png" />`
- **動畫**：`@keyframes letterReturn`，600ms ease-out。從 hollow 座標 → `(50%, 102%)` 場景下緣外，`scale(0.4) → scale(1)`、`opacity 0.6 → 1 → 0`
- **抑制**：crisis 仍要做

#### R6. Saved Shelf — 累積便籤
- **觸發**：`savedCount > 0`
- **DOM**：`<div class="scene-saved-shelf">` 內含 `Math.min(savedCount, 8)` 個 `<i class="scene-saved-note" />`
- **位置**：shelf 座標附近，水平錯落 6px、垂直錯落 4px、每個 `rotate` 在 -8°~+8° 之間（用 `nth-child` CSS 寫死）
- **動畫**：新增的便籤從 `opacity 0 translateY(8px)` 淡入 600ms
- **抑制**：crisis 隱藏

#### R7. Song Panel — 木屋窗光與音符
- **觸發**：`activePanel === "song"`
- **DOM**：
  ```tsx
  <div class="scene-window-music">
    <div class="scene-window-glow-strong" />
    <svg class="scene-music-note scene-music-note-1">...</svg>
    <svg class="scene-music-note scene-music-note-2">...</svg>
    <svg class="scene-music-note scene-music-note-3">...</svg>
  </div>
  ```
- **位置**：window 座標
- **動畫**：
  - `.scene-window-glow-strong`：opacity 0→1，400ms ease-out
  - 音符：從 window 座標往上飄 60px，`opacity 0 → 1 → 0`，1.8s ease-in-out infinite，三顆延遲 `0ms / 600ms / 1200ms`
- **抑制**：crisis 隱藏

#### R8. Card Panel — 樹下紙籤
- **觸發**：`activePanel === "card"`
- **DOM**：`<img class="scene-tree-card" src="/art/letter-paper.png" />`
- **位置**：tree-base 座標，`rotate(-12deg)`
- **動畫**：淡入 400ms + 輕微 sway（`rotate -12deg → -10deg → -12deg`，4s ease-in-out infinite）
- **抑制**：crisis 隱藏

#### R9. Astro Panel — 天空星光
- **觸發**：`activePanel === "astro"`
- **DOM**：`<div class="scene-stars">` 內含 5 個 `<i class="scene-star" />`，每個是 `var(--sky-mist)` 顏色的 8×8 px 五角星 clip-path
- **位置**：sky 座標散開（用 nth-child 給五個固定偏移）
- **動畫**：依序淡入 `200ms` 間隔，到位後 `twinkle`：`opacity 0.6 → 1 → 0.6`，3s ease-in-out infinite
- **抑制**：crisis 隱藏

#### R10. Breathing — 整場景呼吸
- **觸發**：`microActive === true`
- **DOM**：根 `.scene-watercolor` 加 class `scene-watercolor-breathing`
- **動畫**：`transform: scale(1) → scale(1.012) → scale(1)`，10s ease-in-out infinite（5 秒吸 + 5 秒吐）
- **不要動透明度，只動 scale**，避免閃爍
- **抑制**：crisis 不啟用

#### R11. Crisis 抑制總則
- **觸發**：`crisis === true`
- **規則**：
  - 場景圖換成 `/art/scene-crisis.png`
  - R1, R2, R6, R7, R8, R9, R10 全部 hide
  - R3, R5 仍要做（投信/回信閉環是核心隱喻）
  - R4 弱化（opacity 上限 0.4）

### 10.4 App.tsx 狀態接線

App.tsx 需要計算並傳入 `state`、`activePanel`、`microActive`、`savedCount`、`crisis`：

```tsx
const [submitTick, setSubmitTick] = useState(0);
const [isDepositing, setIsDepositing] = useState(false);
const [isResponding, setIsResponding] = useState(false);

function submit() {
  const trimmed = input.trim();
  setIsDepositing(true);
  setIsResponding(false);
  setResponse(null);
  setActivePanel(null);

  // depositing 600ms → thinking 260ms → responding 600ms → 收尾
  window.setTimeout(() => {
    setIsDepositing(false);
    setIsThinking(true);
    window.setTimeout(() => {
      setIsThinking(false);
      const result = buildResponse(trimmed || `今天覺得${mood}`, mood);
      setResponse(result);
      setIsResponding(true);
      window.setTimeout(() => setIsResponding(false), 600);
    }, 260);
  }, 600);
}

const sceneState: SceneState =
  isDepositing ? "depositing" :
  isThinking ? "thinking" :
  isResponding ? "responding" :
  input.trim().length > 0 ? "writing" :
  "idle";
```

`microActive` 從 ResponseCard 上傳（透過新增 callback prop `onMicroChange(active: boolean)`，當使用者開始/結束 micro tool 時觸發）。

`savedCount = saved.length`。

`crisis = response?.riskLevel === "crisis"`。

### 10.5 禁止
- ❌ 不要把場景圖切多層（單張 PNG + 純 CSS overlay 即可）
- ❌ 不要在 mood 變化時觸發 sceneState 變化
- ❌ 不要做 parallax / 視差
- ❌ 不要在 hollow / window 上加大型 motion，整體要安靜
- ❌ 不要新增任何 art asset（生圖清單已定）
- ❌ 不要動 `packages/ai-safety`、`packages/content` 邏輯
- ❌ 不要動 `ResponseCard.tsx` 既有功能，除了加 `onMicroChange` callback prop

---

## 11. 場景反應驗收清單

每條都要可在 dev server 上手動觸發確認：

- [ ] R1 Mood 顯影：點不同 mood → 對應小生物淡入切換
- [ ] R2 Writing：textarea 開始打字 → 樹洞發出柔光
- [ ] R3 Depositing：點送出 → 紙條飛入樹洞（不超過 1 秒）
- [ ] R4 Thinking：投信後 → 樹洞穩定脈動光
- [ ] R5 Responding：回覆出現瞬間 → 紙條從樹洞飛出向下
- [ ] R6 Shelf：點「收下回信」→ 右下角累積便籤
- [ ] R7 Song：點「收音機」→ 木屋窗強光 + 三顆音符上飄
- [ ] R8 Card：點「紙籤盒」→ 樹下出現紙籤
- [ ] R9 Astro：點「窗邊星光」→ 天空浮出五顆星
- [ ] R10 Breathing：點「小燈」開始 micro tool → 整場景緩慢縮放呼吸
- [ ] R11 Crisis：輸入「我不想活了」→ 場景換暮色版、上述反應停掉、僅保留投信/回信
