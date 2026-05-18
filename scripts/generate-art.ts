import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type ApiSize = "1024x1024" | "1024x1536";
type EstimatedTier = "hd-portrait" | "standard";

interface ArtAsset {
  filename: string;
  displaySize: string;
  apiSize: ApiSize;
  tier: EstimatedTier;
  prompt: string;
  /** 若有，覆寫全域 STYLE/NEGATIVE（用於畫風 pivot） */
  styleOverride?: string;
}

const negativeAndStyle = `NEGATIVE: no medical pills, no medicine bottles, no syringes, no white lab coats, no red cross, no hospital signage, no realistic faces, no text or letters in the image, no chibi cartoon big eyes, no neon, no dark gloomy mood
STYLE: watercolor on rough paper, soft hand-drawn lines, gentle desaturation, slight paper grain, painterly imperfect edges`;

/** Ghibli/宮崎駿 高彩度動畫場景風（2026-05-19 主場景 pivot） */
const ghibliSceneStyle = `STYLE: anime background painting in the style of classic Japanese animation backgrounds, painterly anime landscape background, Kazuo Oga inspired background illustration, classic anime environmental art, vibrant saturated palette, rich warm golden-hour lighting or luminous dusk lighting, dramatic colorful sky, highly detailed painterly background, clear object boundaries, defined edges, painterly but crisp, no blur, visible hand-painted brushwork, lush foliage texture, naturalistic environmental detail, warm inviting atmosphere
NEGATIVE: no text, no letters, no kanji, no Chinese characters, no signs, no UI elements, no paper chips, no speech bubbles, no labels, no human figures, no people, no characters, no anime character faces, no chibi big eyes, no anthropomorphic owl, no medical objects, no medicine, no hospital signage, no flat vector style, no dull desaturation, no blur`;

const assets: ArtAsset[] = [
  {
    filename: "scene-main.png",
    displaySize: "1024x1536",
    apiSize: "1024x1536",
    tier: "hd-portrait",
    styleOverride: ghibliSceneStyle,
    prompt:
      "Vertical portrait composition 1024x1536, highly detailed painterly anime landscape background in the style of classic Japanese animation backgrounds and Kazuo Oga inspired environmental art. Bottom-left: a tall mature oak tree with rugged textured bark, strong roots, and a broccoli-like dense leafy crown with clearly separated clusters and defined edges. A realistic brown barn owl, non-anthropomorphic, faces the viewer from a mid-branch; show detailed feather texture, natural posture, and alert eyes, not cute or chibi. A woven wicker nest sits at the roots. Foreground: wildflower meadow with upright purple lavender spikes, white daisies with yellow centers, pale pink wild roses, and loose painterly brushwork grass. Mid-right: a stone-and-timber cottage with a brown thatched roof, brick chimney, and warm amber glowing windows. Distant background: soft blue mountain range. Sky: dramatic golden-hour sunset, deep saturated blue at top grading to warm peach-orange-pink at horizon, fluffy cumulus clouds lit by sunset. Overall: vibrant saturated palette, rich warm lighting, clear object boundaries, defined edges, hand-painted brushwork visible, crisp painterly detail, no blur. No text, no letters, no people, no human figures, no characters, no labels, no speech bubbles."
  },
  {
    filename: "scene-crisis.png",
    displaySize: "1024x1536",
    apiSize: "1024x1536",
    tier: "hd-portrait",
    styleOverride: ghibliSceneStyle,
    prompt:
      "Vertical portrait composition 1024x1536, matching the scene-main composition as a highly detailed painterly anime landscape background in the style of classic Japanese animation backgrounds and Kazuo Oga inspired environmental art. Bottom-left: a tall mature oak tree with rugged textured bark, exposed roots, and a broccoli-like dense leafy crown with defined leafy masses and crisp object boundaries. A realistic brown barn owl, non-anthropomorphic, faces the viewer from a mid-branch; include detailed feather texture and a calm natural posture, avoiding cute, mascot, or chibi styling. A woven wicker nest rests at the roots. Foreground: wildflower meadow with upright purple lavender spikes, white daisies with yellow centers, pale pink wild roses, and loose painterly brushwork grass. Mid-right: stone-and-timber cottage, brown thatched roof, brick chimney, brighter warm amber glowing windows. Distant background: soft blue mountain range. Time and sky: dusk after sunset, deep blue sky with first stars, lingering warm peach-pink horizon glow, subtle moonlight washing the meadow and tree edges. Overall: vibrant saturated palette, luminous dusk lighting, clear object boundaries, defined edges, hand-painted brushwork visible, painterly but crisp, no blur. No text, no letters, no people, no human figures, no characters, no labels, no speech bubbles."
  },
  {
    filename: "letter-paper.png",
    displaySize: "512x512 transparent",
    apiSize: "1024x1024",
    tier: "standard",
    prompt:
      "a small piece of cream-colored handwritten letter paper, slightly crumpled corner, watercolor style, transparent background, no text"
  },
  {
    filename: "mood-累.png",
    displaySize: "300x300 transparent",
    apiSize: "1024x1024",
    tier: "standard",
    prompt: "a small sleeping cat curled up on a folded apron, single object, watercolor style, transparent background"
  },
  {
    filename: "mood-委屈.png",
    displaySize: "300x300 transparent",
    apiSize: "1024x1024",
    tier: "standard",
    prompt: "a single cloud with a tiny soft tear, watercolor pastel, single object, transparent background"
  },
  {
    filename: "mood-煩.png",
    displaySize: "300x300 transparent",
    apiSize: "1024x1024",
    tier: "standard",
    prompt: "a tangled ball of yarn with a small kitten paw, single object, watercolor style, transparent background"
  },
  {
    filename: "mood-空.png",
    displaySize: "300x300 transparent",
    apiSize: "1024x1024",
    tier: "standard",
    prompt: "an empty teacup with a single rising steam wisp, single object, watercolor style, transparent background"
  },
  {
    filename: "mood-緊繃.png",
    displaySize: "300x300 transparent",
    apiSize: "1024x1024",
    tier: "standard",
    prompt: "a tightly closed bud of a chamomile flower, single object, watercolor style, transparent background"
  },
  {
    filename: "mood-想哭.png",
    displaySize: "300x300 transparent",
    apiSize: "1024x1024",
    tier: "standard",
    prompt: "a small puddle reflecting moonlight, single object, watercolor style, transparent background"
  },
  {
    filename: "mood-還可以.png",
    displaySize: "300x300 transparent",
    apiSize: "1024x1024",
    tier: "standard",
    prompt: "a small green sprout pushing through cracked earth, single object, watercolor style, transparent background"
  },
  {
    filename: "astro-saturn.png",
    displaySize: "400x600",
    apiSize: "1024x1536",
    tier: "standard",
    prompt: "Saturn, ringed planet, sand and rust orange, vertical watercolor astrology card, soft deep-night starry background, planet centered"
  },
  {
    filename: "astro-moon.png",
    displaySize: "400x600",
    apiSize: "1024x1536",
    tier: "standard",
    prompt: "the Moon, half moon, mist blue and creamy white, vertical watercolor astrology card, soft deep-night starry background, moon centered"
  },
  {
    filename: "astro-mercury.png",
    displaySize: "400x600",
    apiSize: "1024x1536",
    tier: "standard",
    prompt: "Mercury, a small star with wind around it, vertical watercolor astrology card, soft deep-night starry background, symbol centered"
  },
  {
    filename: "astro-mars.png",
    displaySize: "400x600",
    apiSize: "1024x1536",
    tier: "standard",
    prompt: "Mars, warm red but soft, vertical watercolor astrology card, soft deep-night starry background, planet centered"
  },
  {
    filename: "astro-jupiter.png",
    displaySize: "400x600",
    apiSize: "1024x1536",
    tier: "standard",
    prompt: "Jupiter, large round planet, creamy yellow with gentle glow, vertical watercolor astrology card, soft deep-night starry background, planet centered"
  },
  {
    filename: "astro-venus.png",
    displaySize: "400x600",
    apiSize: "1024x1536",
    tier: "standard",
    prompt: "Venus, soft pink and gentle, vertical watercolor astrology card, soft deep-night starry background, planet centered"
  },
  {
    filename: "astro-rahu.png",
    displaySize: "400x600",
    apiSize: "1024x1536",
    tier: "standard",
    prompt: "Rahu, mist-colored mysterious but not dark, vertical watercolor astrology card, soft deep-night starry background, abstract planet symbol centered"
  }
];

const costs: Record<EstimatedTier, number> = {
  "hd-portrait": 0.08,
  standard: 0.04
};

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(rootDir, "apps/web-pwa/public/art");
const envPath = path.join(rootDir, "ops/.env");
const shouldExecute = process.argv.includes("--execute");

function parseOnlyFilter(): Set<string> | null {
  const idx = process.argv.indexOf("--only");
  if (idx === -1 || idx === process.argv.length - 1) return null;
  return new Set(
    process.argv[idx + 1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

function fullPrompt(asset: ArtAsset): string {
  return `${asset.prompt}\n\n${asset.styleOverride ?? negativeAndStyle}`;
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
      // Dry-runs do not require an env file.
    }
  }
}

async function generateImage(asset: ArtAsset, prompt: string) {
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await client.images.generate({
        model,
        prompt,
        size: asset.apiSize,
        n: 1
      });
      const b64 = response.data?.[0]?.b64_json;
      if (!b64) {
        throw new Error("Images API response did not include b64_json data.");
      }
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(path.join(outputDir, asset.filename), Buffer.from(b64, "base64"));
      return;
    } catch (error) {
      if (attempt === 2) throw error;
      console.warn(`Retrying ${asset.filename} after failure: ${(error as Error).message}`);
    }
  }
}

async function main() {
  await loadEnv();
  let cumulative = 0;
  const onlyFilter = parseOnlyFilter();
  const filteredAssets = onlyFilter
    ? assets.filter((asset) => onlyFilter.has(asset.filename))
    : assets;

  console.log(`Mode: ${shouldExecute ? "execute" : "dry-run"}`);
  console.log(`Output dir: ${outputDir}`);
  if (onlyFilter) {
    console.log(`Filter --only: ${[...onlyFilter].join(", ")}`);
    if (filteredAssets.length === 0) {
      console.log("No matching assets, exiting.");
      return;
    }
  }
  console.log(`Assets: ${filteredAssets.length}${onlyFilter ? ` (of ${assets.length})` : ""}`);

  if (shouldExecute && !process.env.OPENAI_API_KEY) {
    throw new Error(`OPENAI_API_KEY is required in ${envPath} when using --execute.`);
  }

  for (const [index, asset] of filteredAssets.entries()) {
    const cost = costs[asset.tier];
    cumulative += cost;
    const prompt = fullPrompt(asset);

    console.log(`\n[${index + 1}/${filteredAssets.length}] ${asset.filename}`);
    console.log(`size: ${asset.displaySize}; apiSize: ${asset.apiSize}`);
    console.log(`estimated cost: $${cost.toFixed(2)}; cumulative: $${cumulative.toFixed(2)}`);
    console.log(prompt);

    if (shouldExecute) {
      await generateImage(asset, prompt);
      console.log(`saved: ${path.join(outputDir, asset.filename)}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
