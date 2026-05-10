# Concept Options: 藥師樹洞

## Decision Summary

「藥師樹洞」可以做成 LINE Bot、Web App、舒壓小遊戲，或混合型產品。若目標是最快讓藥師用起來，LINE Bot 最快；若目標是驗收時有完整視覺與產品感，Web App 最好；若目標是做出療癒記憶點，遊戲化空間最好。

建議採用：

```text
Phase 1: Web App MVP
Phase 2: LINE Bot companion
Phase 3: Low-pressure healing game layer
```

原因：Web App 最適合展示「藥師樹洞」完整世界觀、情緒功能、收藏、點歌、抽牌與療癒互動；LINE Bot 再作為日常短入口；遊戲化則作為留存與品牌特色，不一開始壓到核心開發。

## Option A: LINE Bot First

### What It Is

使用者在 LINE 輸入心情、工作事件或指令，Bot 回覆同理、誇誇、金句、點歌或抽牌。

### Strengths

- 最貼近日常使用情境。
- 開發量小。
- 不需要使用者下載 App 或開網站。
- 適合輪班空檔與短回合舒壓。

### Weaknesses

- 視覺療癒感有限。
- 不容易展示完整產品體驗。
- 日記、收藏、回顧與遊戲化較難做得漂亮。

### Best For

- 快速驗證文案、AI 回覆品質、藥師是否願意使用。

### MVP Scope

- LINE webhook。
- 6 個指令：樹洞、誇誇我、今日療癒、點歌、抽牌、喘口氣。
- Safety layer。
- 基礎後台或 log review。

## Option B: Web App First

### What It Is

一個手機優先的 Web App。首頁就是「樹洞」互動，不做行銷 landing page。使用者可以：

- 對樹洞說一句話。
- 收到 AI 療癒回覆。
- 抽一張療癒牌。
- 根據心情點歌。
- 收藏誇誇與金句。
- 看自己的心情小樹慢慢長大。

### Strengths

- 驗收時最完整。
- 能做視覺療癒、動畫、收藏、日記。
- 適合建立品牌感。
- 比 LINE 更容易做遊戲化。

### Weaknesses

- 使用者需要打開網址。
- 若沒有 LINE 推播，回訪需要額外設計。
- 首版開發量比純 LINE Bot 大。

### Best For

- 想先做出能 demo、能截圖、能使用的完整產品。

### MVP Scope

- 手機優先 Web App。
- 樹洞聊天區。
- 心情選擇器。
- 誇誇卡片。
- 今日療癒籤。
- 點歌推薦。
- 抽牌。
- 收藏與本機儲存。
- Safety layer mock or real。

## Option C: Healing Game First

### What It Is

一個低壓、無輸贏的療癒小遊戲。玩家是下班後的藥師，走進一個小樹洞，把今天的壓力變成可放下的葉子、星光或紙袋。每次完成一個舒壓互動，小樹會長出一點點新的枝葉。

### Strengths

- 記憶點強。
- 很適合「療癒」主題。
- 可做出差異化，不只是聊天機器人。
- 能把誇誇、抽牌、點歌變成可視化互動。

### Weaknesses

- 開發量最高。
- 若核心療癒文案沒做好，遊戲會變成裝飾。
- 需要美術、音效與互動節奏設計。

### Best For

- 想做比工具更有情感記憶點的作品。

### MVP Scope

- 單一場景：深夜值班櫃檯或醫院側門旁的一棵樹。
- 點擊樹洞輸入心情。
- 生成一片葉子或星光代表被放下的壓力。
- 抽一張療癒牌。
- 播放一段輕音效或推薦歌曲。
- 小樹根據收藏數成長。

## Option D: Hybrid Product

### What It Is

Web App 做完整體驗，LINE Bot 做日常入口。使用者可在 LINE 說一句話，也可進 Web App 看日記、收藏和小樹。

### Strengths

- 兼具使用便利與完整體驗。
- 可先 demo Web，再接 LINE。
- 長期最符合產品願景。

### Weaknesses

- 需要切清楚兩端責任。
- 需要統一帳號或匿名 session 策略。

### Best For

- 正式產品路線。

## Scoring Matrix

分數 1-5，5 代表較好。

| Criteria | LINE Bot | Web App | Healing Game | Hybrid |
|---|---:|---:|---:|---:|
| 開發速度 | 5 | 4 | 2 | 3 |
| 驗收展示效果 | 2 | 5 | 5 | 5 |
| 日常使用便利 | 5 | 3 | 3 | 5 |
| 療癒視覺感 | 2 | 4 | 5 | 5 |
| AI 功能整合 | 4 | 5 | 4 | 5 |
| 風險控制 | 4 | 4 | 3 | 4 |
| 長期延展 | 3 | 4 | 4 | 5 |

## Recommended Route

### Build First: Web App MVP

理由：

- 你回來驗收時，可以直接看完整體驗。
- Web App 可同時容納聊天、療癒牌、點歌、收藏與小樹成長。
- 不需要先申請 LINE Channel 就能開發。
- 之後接 LINE Bot 時，核心 AI、安全與內容模組可以重用。

### Keep LINE Bot Ready

LINE Bot 不刪掉，作為第二階段。

### Keep Game Layer Small

遊戲化只做低壓、無排名、無任務壓力的「小樹成長」。不要做會讓藥師覺得又多一個責任的打卡系統。

## Product North Star

```text
藥師打開藥師樹洞後，30 秒內覺得：
我剛剛那個很累的瞬間，有被懂一點。
```
