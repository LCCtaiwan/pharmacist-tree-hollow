import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Lenormand 36 張水彩卡面生成
 *
 * Usage:
 *   npm run art:lenormand:dry           # dry-run，顯示所有 prompts 與預估成本
 *   npm run art:lenormand               # 真打 gpt-image-1 全 36 張（~$1.44）
 *   npm run art:lenormand:qa            # 只生 QA 子集：House / Sun / Ship / Heart 四張（~$0.16）
 *   npm run art:lenormand -- --only=4,7 # 只生指定編號（1-36）
 *
 * 需要 ops/.env 內的 OPENAI_API_KEY
 * 輸出路徑：apps/web-pwa/public/art/lenormand/lenormand-XX-name.png
 */

interface LenormandPrompt {
  filename: string;
  subject: string;
}

const cards: LenormandPrompt[] = [
  { filename: "lenormand-01-rider.png",     subject: "a horse with a quiet rider silhouette in motion, traveling across a dusty green meadow, sense of arriving news" },
  { filename: "lenormand-02-clover.png",    subject: "a small bunch of four-leaf clover with morning dewdrops, fresh spring green" },
  { filename: "lenormand-03-ship.png",      subject: "a small wooden sailing ship on calm sea, distant horizon, soft blue water" },
  { filename: "lenormand-04-house.png",     subject: "a small cozy cottage with chimney and warm glowing window, surrounded by gentle grass" },
  { filename: "lenormand-05-tree.png",      subject: "a single mature broad-canopy tree with gentle exposed roots, deep sage green leaves" },
  { filename: "lenormand-06-clouds.png",    subject: "layered drifting clouds, brighter on the right side, darker grey on the left, soft sky" },
  { filename: "lenormand-07-snake.png",     subject: "a coiled serpent resting on soft earth, calm composed pose, dusty olive scales, not menacing" },
  { filename: "lenormand-08-coffin.png",    subject: "a simple closed wooden box low to the ground with one wilting lily resting on top, muted brown tones" },
  { filename: "lenormand-09-bouquet.png",   subject: "a small bouquet of mixed wildflowers tied with a cream ribbon, soft pastel pink and yellow" },
  { filename: "lenormand-10-scythe.png",    subject: "a curved scythe blade resting on a small bundle of golden wheat, warm harvest tones" },
  { filename: "lenormand-11-whip.png",      subject: "two crossed slender willow branches with soft motion lines, dusty brown" },
  { filename: "lenormand-12-birds.png",     subject: "two small songbirds perched together on a thin branch, chatting, soft beige feathers" },
  { filename: "lenormand-13-child.png",     subject: "a small standing child silhouette in soft pastel clothing, back view, no facial features visible" },
  { filename: "lenormand-14-fox.png",       subject: "a quiet sitting fox with head turned alertly, warm orange rust fur, gentle posture" },
  { filename: "lenormand-15-bear.png",      subject: "a large sitting brown bear, upright and calm, sense of grounded power" },
  { filename: "lenormand-16-stars.png",     subject: "a cluster of seven stars in a soft constellation pattern, deep midnight blue background, gentle glow" },
  { filename: "lenormand-17-stork.png",     subject: "a tall long-legged white stork standing in shallow water, side view, slender elegant pose" },
  { filename: "lenormand-18-dog.png",       subject: "a friendly sitting dog facing forward, soft golden fur, loyal expression, no human" },
  { filename: "lenormand-19-tower.png",     subject: "a tall isolated stone tower against a soft pale sky, distant lonely composition" },
  { filename: "lenormand-20-garden.png",    subject: "a small enclosed garden with a stone path and clustered flowers, low garden wall in the background" },
  { filename: "lenormand-21-mountain.png",  subject: "a single tall mountain silhouette with soft mist around its base, muted slate blue" },
  { filename: "lenormand-22-crossroad.png", subject: "a forest path splitting into two directions, a fork in the road, soft earthy palette" },
  { filename: "lenormand-23-mice.png",      subject: "two small grey mice gnawing on the corner of a parchment, subtle worry" },
  { filename: "lenormand-24-heart.png",     subject: "a single simple heart shape, painterly imperfect edges, dusty rose color, centered on cream paper" },
  { filename: "lenormand-25-ring.png",      subject: "a single gold ring resting on cream parchment, soft warm light reflection" },
  { filename: "lenormand-26-book.png",      subject: "a single closed leather-bound book with a soft fabric ribbon bookmark, deep burgundy cover" },
  { filename: "lenormand-27-letter.png",    subject: "a folded paper envelope with a small red wax seal, gentle shadow, no text visible" },
  { filename: "lenormand-28-man.png",       subject: "a man's silhouette from waist up, side profile, dignified calm posture, no facial features visible, neutral clothing" },
  { filename: "lenormand-29-woman.png",     subject: "a woman's silhouette from waist up, side profile, gentle calm posture, no facial features visible, flowing clothing" },
  { filename: "lenormand-30-lily.png",      subject: "a single white lily flower with a long green stem and one leaf, soft elegant composition" },
  { filename: "lenormand-31-sun.png",       subject: "a radiant sun with soft wavy rays, warm golden yellow tone, gentle glow halo" },
  { filename: "lenormand-32-moon.png",      subject: "a soft crescent moon in a calm deep blue night sky with a few tiny scattered stars" },
  { filename: "lenormand-33-key.png",       subject: "a single vintage iron key with ornate bow head, resting horizontally, soft shadow" },
  { filename: "lenormand-34-fish.png",      subject: "a single koi-like fish swimming, side view, with subtle water ripples around it, soft orange and white scales" },
  { filename: "lenormand-35-anchor.png",    subject: "a single vintage iron anchor with a coiled rope at its base, weathered metal texture" },
  { filename: "lenormand-36-cross.png",     subject: "a single simple wooden cross planted in soft grass, weathered warm brown wood, calm meditative tone, NOT a red medical cross" }
];

const styleSuffix = `
STYLE: vertical Lenormand-style card, Studio Ghibli-inspired storybook watercolor illustration on warm cream paper with visible paper grain, single iconic subject centered in a small immersive scene, painterly imperfect edges with visible brushwork, warm golden-hour sunset lighting with soft pastel sky, lush detail without clutter, palette of warm cream, sage green, soft lavender, dusty rose, golden sunset, gentle sky blue, cozy cottage-core atmosphere, hand-drawn storybook mood, no text or letters anywhere, no playing card corners, no number labels, no ornate frame border
NEGATIVE: no text, no letters, no numbers, no playing card border, no medical symbols, no red cross, no realistic human faces, no anime chibi cartoon big eyes, no neon, no dark gloomy mood, no flat vector style, no overly desaturated muted palette, no multiple competing focal points`;

function fullPrompt(card: LenormandPrompt): string {
  return `${card.subject}\n${styleSuffix}`;
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(rootDir, "apps/web-pwa/public/art/lenormand");
const envPath = path.join(rootDir, "ops/.env");
const shouldExecute = process.argv.includes("--execute");
const QA_SET = [4, 31, 3, 24]; // House, Sun, Ship, Heart — 涵蓋建築/天體/交通/抽象

function parseOnly(): number[] | null {
  const arg = process.argv.find((a) => a.startsWith("--only="));
  if (!arg) return null;
  const list = arg
    .slice("--only=".length)
    .split(",")
    .map((s) => Number.parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 36);
  return list.length > 0 ? list : null;
}

function selectCards(): LenormandPrompt[] {
  const only = process.argv.includes("--qa") ? QA_SET : parseOnly();
  if (!only) return cards;
  return only.map((n) => cards[n - 1]).filter(Boolean);
}

async function loadEnv() {
  try {
    const dotenv = await import("dotenv");
    dotenv.config({ path: envPath });
  } catch {
    try {
      const raw = await fs.readFile(envPath, "utf8");
      for (const line of raw.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
        if (match && !process.env[match[1]]) {
          process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
        }
      }
    } catch {
      // dry-run path: env optional
    }
  }
}

async function generateImage(card: LenormandPrompt, prompt: string) {
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await client.images.generate({
        model,
        prompt,
        size: "1024x1536",
        n: 1
      });
      const b64 = response.data?.[0]?.b64_json;
      if (!b64) {
        throw new Error("Images API response did not include b64_json data.");
      }
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(path.join(outputDir, card.filename), Buffer.from(b64, "base64"));
      return;
    } catch (error) {
      if (attempt === 2) throw error;
      console.warn(`Retrying ${card.filename} after failure: ${(error as Error).message}`);
    }
  }
}

async function main() {
  await loadEnv();
  const selected = selectCards();
  const perCardCost = 0.04;
  const totalCost = perCardCost * selected.length;

  console.log(`Mode: ${shouldExecute ? "execute" : "dry-run"}`);
  console.log(`Output dir: ${outputDir}`);
  console.log(`Cards: ${selected.length}${selected.length < cards.length ? ` (subset of ${cards.length})` : ""}`);
  console.log(`Estimated total cost: $${totalCost.toFixed(2)} (${selected.length} × $${perCardCost.toFixed(2)})`);

  if (shouldExecute && !process.env.OPENAI_API_KEY) {
    throw new Error(`OPENAI_API_KEY is required in ${envPath} when using --execute.`);
  }

  for (const [index, card] of selected.entries()) {
    const prompt = fullPrompt(card);
    const cumulative = (index + 1) * perCardCost;

    console.log(`\n[${index + 1}/${selected.length}] ${card.filename}`);
    console.log(`cumulative cost: $${cumulative.toFixed(2)}`);
    console.log(prompt);

    if (shouldExecute) {
      await generateImage(card, prompt);
      console.log(`saved: ${path.join(outputDir, card.filename)}`);
    }
  }

  if (!shouldExecute) {
    console.log(`\nDry-run complete. Re-run with --execute to actually generate (costs ~$${totalCost.toFixed(2)}).`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
