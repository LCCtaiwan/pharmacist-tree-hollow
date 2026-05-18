import type { HealingQuote } from "@pharmacist-tree-hollow/shared";
import { geminiQuotes } from "./quotes-gemini";
import { codexQuotes } from "./quotes-codex";
import { literaryQuotes } from "./quotes-literary";

/**
 * 文字微光 — 草地金句池
 * 全面去藥師化（2026-05-19）：移除醫療職場語境，改以文學/哲學/影劇/自寫小品為主
 */
const baseQuotes: HealingQuote[] = [
  {
    id: "original-001",
    text: "今晚不是你不夠好，是今天責任太多。",
    source: "original",
    language: "zh-Hant"
  },
  {
    id: "original-012",
    text: "忙碌時忘記喝的那口水，下班後記得補回來，別忘了你也是需要被照顧的。",
    source: "original",
    language: "zh-Hant"
  },
  {
    id: "original-016",
    text: "今天的你已經做了無數正確的決定，剩下的就交給睡眠來療癒。",
    source: "original",
    language: "zh-Hant"
  },
  {
    id: "original-019",
    text: "被催促的時刻，請記得：正確永遠比快速更值得被尊重。",
    source: "original",
    language: "zh-Hant"
  },
  {
    id: "public-001",
    text: "傷口是光進入你內心的地方。",
    source: "public-domain",
    attribution: "魯米",
    language: "zh-Hant"
  },
  {
    id: "public-002",
    text: "知其雄，守其雌，為天下谿。",
    source: "public-domain",
    attribution: "老子",
    language: "zh-Hant"
  },
  {
    id: "public-003",
    text: "休息之隸屬於工作，正如眼瞼之隸屬於眼睛。",
    source: "public-domain",
    attribution: "泰戈爾",
    language: "zh-Hant"
  },
  {
    id: "public-004",
    text: "我們將會休息，我們將會聽到天使的聲音。",
    source: "public-domain",
    attribution: "契訶夫",
    language: "zh-Hant"
  },
  {
    id: "public-005",
    text: "工作就是肉眼可見的愛。",
    source: "public-domain",
    attribution: "紀伯倫",
    language: "zh-Hant"
  },
  {
    id: "public-006",
    text: "路漫漫其修遠兮，吾將上下而求索。",
    source: "public-domain",
    attribution: "屈原",
    language: "zh-Hant"
  },
  {
    id: "public-007",
    text: "生活中唯一的幸福就是，不斷前進。",
    source: "public-domain",
    attribution: "契訶夫",
    language: "zh-Hant"
  },
  {
    id: "public-008",
    text: "友誼總是美妙的責任，從來不是機會。",
    source: "public-domain",
    attribution: "紀伯倫",
    language: "zh-Hant"
  },
  {
    id: "public-009",
    text: "大道至簡，衍化至繁。",
    source: "public-domain",
    attribution: "老子",
    language: "zh-Hant"
  },
  {
    id: "public-010",
    text: "埋在土裡的根，使樹枝產生果實，卻不要求回報。",
    source: "public-domain",
    attribution: "泰戈爾",
    language: "zh-Hant"
  }
];

export const healingQuotes: HealingQuote[] = [
  ...baseQuotes,
  ...geminiQuotes,
  ...codexQuotes,
  ...literaryQuotes
];
