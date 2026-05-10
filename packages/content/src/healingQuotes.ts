import type { HealingQuote } from "@pharmacist-tree-hollow/shared";
import { geminiQuotes } from "./quotes-gemini";
import { codexQuotes } from "./quotes-codex";

/**
 * 草地金句池 — 100 句
 * - 基礎 30 句（v0.3）：自寫 original-001~020 + 公領域 public-001~010
 * - Gemini 補強 40 句（v0.4）：書摘 book-001~020 + 自寫 original-021~040
 * - Codex 補強 30 句（v0.4）：影劇 tv-001~017 + tv-cht-001~010 + movie-001~003
 */
const baseQuotes: HealingQuote[] = [
  {
    "id": "original-001",
    text: "今晚不是你不夠好，是今天責任太多。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-002",
    text: "把處方箋上的交互作用看過三遍的你，已經盡力守護了陌生人的平安。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-003",
    text: "缺藥的壓力不該由你承擔，你只是遞送溫暖的橋樑，不是製藥廠。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-004",
    text: "面對無理的客訴，那是他的情緒風暴，並非你的專業瑕疵。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-005",
    text: "夜班的燈火雖然孤獨，但每一顆藥丸都因為你的仔細，有了平安的溫度。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-006",
    text: "PGY 的考核總會過去，那些重複的報告，都是在打磨你未來堅定的專業。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-007",
    text: "審核處方時的沈默，是你對生命最溫柔的敬畏。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-008",
    text: "與護理部溝通的委屈，就留在更衣室吧，今晚你只屬於你自己。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-009",
    text: "下班後腦袋裡轉動的藥名，請讓它們隨著深呼吸，慢慢沈澱。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-010",
    text: "沒人看見的覆核，是這座城市深夜裡最安靜的英雄行為。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-011",
    text: "社區藥局的寒暄雖然瑣碎，但你遞出的不只是藥，還有孤單老人的依靠。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-012",
    text: "忙碌時忘記喝的那口水，下班後記得補回來，別忘了你也是需要被照顧的。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-013",
    text: "劑量換算的疲憊，是因為你比誰都在乎那個「萬一」。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-014",
    text: "窗外天色變暗時，藥局的白光依然亮著，辛苦了，照亮鄰里的藥師。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-015",
    text: "面對醫師的筆誤，你的勇於詢問，阻止了一場可能發生的遺憾。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-016",
    text: "今天的你已經做了無數正確的決定，剩下的就交給睡眠來療癒。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-017",
    text: "實習生的生疏總讓你操心，但也讓你想起當初那個懷抱熱情的自己。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-018",
    text: "藥袋上的叮嚀，是你寫給病人的微型情書，願他們平安。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-019",
    text: "被催促的時刻，請記得：正確永遠比快速更值得被尊重。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "original-020",
    text: "卸下白袍後，你不需要是專業的藥師，只要當個快樂的平凡人。",
    source: "original",
    language: "zh-Hant"
  },
  {
    "id": "public-001",
    text: "傷口是光進入你內心的地方。",
    source: "public-domain",
    attribution: "魯米",
    language: "zh-Hant"
  },
  {
    "id": "public-002",
    text: "知其雄，守其雌，為天下谿。",
    source: "public-domain",
    attribution: "老子",
    language: "zh-Hant"
  },
  {
    "id": "public-003",
    text: "休息之隸屬於工作，正如眼瞼之隸屬於眼睛。",
    source: "public-domain",
    attribution: "泰戈爾",
    language: "zh-Hant"
  },
  {
    "id": "public-004",
    text: "我們將會休息，我們將會聽到天使的聲音。",
    source: "public-domain",
    attribution: "契訶夫",
    language: "zh-Hant"
  },
  {
    "id": "public-005",
    text: "工作就是肉眼可見的愛。",
    source: "public-domain",
    attribution: "紀伯倫",
    language: "zh-Hant"
  },
  {
    "id": "public-006",
    text: "路漫漫其修遠兮，吾將上下而求索。",
    source: "public-domain",
    attribution: "屈原",
    language: "zh-Hant"
  },
  {
    "id": "public-007",
    text: "生活中唯一的幸福就是，不斷前進。",
    source: "public-domain",
    attribution: "契訶夫",
    language: "zh-Hant"
  },
  {
    "id": "public-008",
    text: "友誼總是美妙的責任，從來不是機會。",
    source: "public-domain",
    attribution: "紀伯倫",
    language: "zh-Hant"
  },
  {
    "id": "public-009",
    text: "大道至簡，衍化至繁。",
    source: "public-domain",
    attribution: "老子",
    language: "zh-Hant"
  },
  {
    "id": "public-010",
    text: "埋在土裡的根，使樹枝產生果實，卻不要求回報。",
    source: "public-domain",
    attribution: "泰戈爾",
    language: "zh-Hant"
  }
];

export const healingQuotes: HealingQuote[] = [...baseQuotes, ...geminiQuotes, ...codexQuotes];
