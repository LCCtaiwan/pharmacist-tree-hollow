import type { LenormandCard } from "@pharmacist-tree-hollow/shared";

/**
 * Lenormand 36 張完整卡牌系統
 * 抽完 3 張不打 AI，產生 prompt template 供使用者貼到外部 AI 解讀
 * 卡面 PNG 路徑：/art/lenormand/{id}.png（切片 B 由 Codex 生圖補上）
 * 在 PNG 就位前，UI 以 emoji 佔位
 */
export const lenormandCards: LenormandCard[] = [
  { id: "lenormand-01-rider",     number: 1,  nameZh: "騎士",   nameEn: "Rider",      emoji: "🐎", keywords: ["news", "arrival", "swift action"] },
  { id: "lenormand-02-clover",    number: 2,  nameZh: "苜蓿",   nameEn: "Clover",     emoji: "🍀", keywords: ["small luck", "brief joy", "hope"] },
  { id: "lenormand-03-ship",      number: 3,  nameZh: "船",     nameEn: "Ship",       emoji: "🚢", keywords: ["journey", "movement", "longing"] },
  { id: "lenormand-04-house",     number: 4,  nameZh: "房屋",   nameEn: "House",      emoji: "🏠", keywords: ["home", "stability", "family"] },
  { id: "lenormand-05-tree",      number: 5,  nameZh: "樹",     nameEn: "Tree",       emoji: "🌳", keywords: ["health", "growth", "roots"] },
  { id: "lenormand-06-clouds",    number: 6,  nameZh: "雲",     nameEn: "Clouds",     emoji: "☁️", keywords: ["confusion", "uncertainty", "doubt"] },
  { id: "lenormand-07-snake",     number: 7,  nameZh: "蛇",     nameEn: "Snake",      emoji: "🐍", keywords: ["complication", "detour", "rival"] },
  { id: "lenormand-08-coffin",    number: 8,  nameZh: "棺材",   nameEn: "Coffin",     emoji: "⚰️", keywords: ["ending", "transformation", "rest"] },
  { id: "lenormand-09-bouquet",   number: 9,  nameZh: "花束",   nameEn: "Bouquet",    emoji: "💐", keywords: ["gift", "charm", "gratitude"] },
  { id: "lenormand-10-scythe",    number: 10, nameZh: "鐮刀",   nameEn: "Scythe",     emoji: "🌾", keywords: ["sudden change", "cut", "harvest"] },
  { id: "lenormand-11-whip",      number: 11, nameZh: "鞭子",   nameEn: "Whip",       emoji: "〰️", keywords: ["conflict", "repetition", "friction"] },
  { id: "lenormand-12-birds",     number: 12, nameZh: "鳥",     nameEn: "Birds",      emoji: "🐦", keywords: ["chatter", "small worries", "conversation"] },
  { id: "lenormand-13-child",     number: 13, nameZh: "孩童",   nameEn: "Child",      emoji: "👶", keywords: ["new beginning", "innocence", "smallness"] },
  { id: "lenormand-14-fox",       number: 14, nameZh: "狐狸",   nameEn: "Fox",        emoji: "🦊", keywords: ["caution", "cleverness", "self-employment"] },
  { id: "lenormand-15-bear",      number: 15, nameZh: "熊",     nameEn: "Bear",       emoji: "🐻", keywords: ["power", "finance", "authority"] },
  { id: "lenormand-16-stars",     number: 16, nameZh: "星星",   nameEn: "Stars",      emoji: "✨", keywords: ["guidance", "inspiration", "clarity"] },
  { id: "lenormand-17-stork",     number: 17, nameZh: "鸛鳥",   nameEn: "Stork",      emoji: "🦢", keywords: ["change", "relocation", "renewal"] },
  { id: "lenormand-18-dog",       number: 18, nameZh: "狗",     nameEn: "Dog",        emoji: "🐕", keywords: ["friend", "loyalty", "support"] },
  { id: "lenormand-19-tower",     number: 19, nameZh: "高塔",   nameEn: "Tower",      emoji: "🗼", keywords: ["authority", "institution", "solitude"] },
  { id: "lenormand-20-garden",    number: 20, nameZh: "花園",   nameEn: "Garden",     emoji: "🌷", keywords: ["public", "social", "network"] },
  { id: "lenormand-21-mountain",  number: 21, nameZh: "山",     nameEn: "Mountain",   emoji: "⛰️", keywords: ["obstacle", "blockage", "delay"] },
  { id: "lenormand-22-crossroad", number: 22, nameZh: "岔路",   nameEn: "Crossroad",  emoji: "🛤️", keywords: ["choice", "decision", "options"] },
  { id: "lenormand-23-mice",      number: 23, nameZh: "老鼠",   nameEn: "Mice",       emoji: "🐭", keywords: ["loss", "stress", "worry"] },
  { id: "lenormand-24-heart",     number: 24, nameZh: "心",     nameEn: "Heart",      emoji: "❤️", keywords: ["love", "affection", "joy"] },
  { id: "lenormand-25-ring",      number: 25, nameZh: "戒指",   nameEn: "Ring",       emoji: "💍", keywords: ["commitment", "agreement", "cycle"] },
  { id: "lenormand-26-book",      number: 26, nameZh: "書",     nameEn: "Book",       emoji: "📖", keywords: ["secret", "knowledge", "study"] },
  { id: "lenormand-27-letter",    number: 27, nameZh: "信",     nameEn: "Letter",     emoji: "✉️", keywords: ["message", "news", "document"] },
  { id: "lenormand-28-man",       number: 28, nameZh: "男人",   nameEn: "Man",        emoji: "🧑", keywords: ["male querent", "significant male"] },
  { id: "lenormand-29-woman",     number: 29, nameZh: "女人",   nameEn: "Woman",      emoji: "👩", keywords: ["female querent", "significant female"] },
  { id: "lenormand-30-lily",      number: 30, nameZh: "百合",   nameEn: "Lily",       emoji: "🌸", keywords: ["peace", "family", "harmony"] },
  { id: "lenormand-31-sun",       number: 31, nameZh: "太陽",   nameEn: "Sun",        emoji: "☀️", keywords: ["success", "vitality", "clarity"] },
  { id: "lenormand-32-moon",      number: 32, nameZh: "月亮",   nameEn: "Moon",       emoji: "🌙", keywords: ["emotion", "recognition", "intuition"] },
  { id: "lenormand-33-key",       number: 33, nameZh: "鑰匙",   nameEn: "Key",        emoji: "🗝️", keywords: ["certainty", "breakthrough", "importance"] },
  { id: "lenormand-34-fish",      number: 34, nameZh: "魚",     nameEn: "Fish",       emoji: "🐟", keywords: ["abundance", "finance", "flow"] },
  { id: "lenormand-35-anchor",    number: 35, nameZh: "錨",     nameEn: "Anchor",     emoji: "⚓", keywords: ["stability", "work", "security"] },
  { id: "lenormand-36-cross",     number: 36, nameZh: "十字",   nameEn: "Cross",      emoji: "✝️", keywords: ["burden", "fate", "faith"] }
];

/**
 * 抽出 3 張不重複的 Lenormand 卡，回傳順序 = 牌陣順序（左→中→右 = 1→2→3）
 */
export function drawLenormandSpread(): LenormandCard[] {
  const pool = [...lenormandCards];
  const picked: LenormandCard[] = [];
  for (let i = 0; i < 3 && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

/**
 * 把抽到的 3 張卡組成 stargazer 風格 Lenormand prompt template
 * 不打 AI，純文字產出，供使用者複製貼到外部 AI（ChatGPT/Claude/Gemini）
 */
export function buildLenormandPrompt(cards: LenormandCard[]): string {
  if (cards.length !== 3) {
    throw new Error("Lenormand linear spread requires exactly 3 cards");
  }
  const [c1, c2, c3] = cards;
  return [
    "I'd like to consult the Lenormand cards on the following question:",
    "",
    "Question: (no question entered)",
    "",
    "Spread: 3-card linear (left to right)",
    "",
    `1. ${c1.nameEn} (${c1.nameZh})`,
    `2. ${c2.nameEn} (${c2.nameZh})`,
    `3. ${c3.nameEn} (${c3.nameZh})`,
    "",
    "Please interpret this spread in the Lenormand tradition as a linear reading:",
    "",
    `  - Pair 1+2: ${c1.nameEn} + ${c2.nameEn}`,
    `  - Pair 2+3: ${c2.nameEn} + ${c3.nameEn}`,
    "  - Then read the three cards together as one connected sentence, and give the overall meaning.",
    "",
    "Please respond in Traditional Chinese (繁體中文)."
  ].join("\n");
}
