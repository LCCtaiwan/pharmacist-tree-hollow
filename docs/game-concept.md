# Game Concept: 醫護樹洞

## Concept

一個低壓、無輸贏、無排行榜的療癒 Web 小遊戲。玩家不是要破關，而是把一天工作中承接的壓力放進樹洞，讓壓力慢慢變成葉子、星光或小紙袋，掛在自己的療癒小樹上。

## Design Goal

醫護人員打開後，不需要學規則、不需要競爭、不需要完成任務，只要做一個很小的互動就能得到被理解的感覺。

## Core Loop

```text
輸入今天想放下的事
-> AI 回覆同理與誇誇
-> 產生一片葉子或星光
-> 可抽一張療癒牌或點一首歌
-> 小樹留下今天的痕跡
```

## Setting

夜晚的值班櫃檯或醫院側門旁，有一棵安靜的樹。樹洞裡會收下今天沒有地方放的情緒。場景要有醫護身份線索，但不能像醫療後台或考試平台。

Visual motifs:

- 樹洞。
- 暖色窗光。
- 紙條或小紙袋形狀的 token。
- 星光。
- 白袍掛在椅背。
- 安靜的工作台或值班櫃檯遠景。

Avoid:

- 逼真的病人、處方或病歷。
- 醫療恐慌視覺。
- 遊戲任務壓力。
- 過度可愛到不尊重職業壓力。

## Mechanics

### 1. 放進樹洞

User types one sentence. The sentence is transformed into an anonymous visual token.

Token types:

- 葉子: tired but stable.
- 星光: sadness or loneliness.
- 小紙袋: work pressure.
- 水滴: crying or grief.
- 小燈: recovered enough to continue.

### 2. 小樹成長

The tree grows based on saved reflections, not streaks.

Rules:

- No daily streak pressure.
- No punishment for absence.
- Growth is subtle.
- User can reset or clear saved data.

### 3. 療癒牌

Card deck can be custom instead of traditional tarot.

Example cards:

- 節制: 今天不用把所有人的期待都接住。
- 邊界: 有些責任需要 SOP 和團隊一起承擔。
- 深呼吸: 先讓身體知道現在不是急診鈴響。
- 小燈: 你已經做了足夠多的確認。
- 交班: 有些重量可以交出去，不必整晚背著。

### 4. 心情點歌

Song recommendation appears as a small radio near the tree.

Rules:

- No lyrics.
- One song at a time.
- Reason must connect to mood.

### 5. 喘口氣

30-second grounding animation:

- Light expands and contracts.
- Text changes every few seconds.
- User can stop anytime.

## Game Modes

### MVP Mode

- Single CSS-built late-night healthcare counter tree hollow scene.
- Tree hollow text input.
- Response card.
- Visual token generation.
- Card draw.
- Song pick.
- Local save.
- No Phaser.
- No full game loop.
- No quests, streaks, scores, rankings or pressure mechanics.
- No runtime generated art.

MVP game layer is only a visual and emotional layer. It gives the user a sense that pressure has been placed somewhere outside the body, but it must not become a task system.

### Later Mode

- Seasonal backgrounds.
- More card art.
- Personal tree gallery.
- LINE Bot sends user back to the tree.
- Anonymous group forest showing aggregate mood, not personal messages.

## Technical Route

For MVP:

- React + Vite.
- CSS/HTML illustration and CSS animation first.
- No Phaser unless mechanics become more complex.
- Keep visual token state local and non-identifying.
- Use simple symbolic visuals for healing cards and astro reflection cards.

For more game-like version:

- Phaser if we need sprites, scene transitions, particles and asset pipeline.
- Keep AI and safety logic outside the game engine.

## Acceptance Criteria

- The first interaction is usable within 30 seconds.
- The scene feels calm, not childish or clinical.
- The scene reads as late-night healthcare counter tree hollow, not a generic forest.
- Visual tokens do not expose the user's original text.
- No failure state.
- No streak, ranking or pressure loop.
- Crisis and medical boundary still override game flow.
- Crisis screens reduce decorative scene elements and prioritize immediate support text.

## Stage Gate

Before integrating generated art or sprites:

- Check route/path readability if a map exists.
- Check HUD-safe space.
- Check subject identity as 醫護樹洞.
- Check no watermarks or copied copyrighted assets.
- Check no embedded text contamination.
- Check no patient, prescription, chart or identifiable workplace imagery.
- Check the art is not medical panic imagery and not overly childish.
- Check mobile crop remains clear.
- Reject assets that are confusing, cropped, text-contaminated or off-theme.
