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
}

const negativeAndStyle = `NEGATIVE: no medical pills, no medicine bottles, no syringes, no white lab coats, no red cross, no hospital signage, no realistic faces, no text or letters in the image, no chibi cartoon big eyes, no neon, no dark gloomy mood
STYLE: watercolor on rough paper, soft hand-drawn lines, gentle desaturation, slight paper grain, painterly imperfect edges`;

const assets: ArtAsset[] = [
  {
    filename: "scene-main.png",
    displaySize: "1024x1536",
    apiSize: "1024x1536",
    tier: "hd-portrait",
    prompt:
      "watercolor illustration, soft cream yellow paper texture, a large round-canopy tree with a visible hollow in the trunk in the center, a tiny wooden cottage pharmacy on the right with a glowing yellow window, surrounded by gentle herbs like mint, lavender, chamomile, sage in small clusters, a few sleeping cats, an owl on a branch, butterflies in distance, soft pastel sky with hint of dusk pink, hand-drawn imperfect edges, no text, no people, no medication bottles or pills, gentle and calming mood"
  },
  {
    filename: "scene-crisis.png",
    displaySize: "1024x1536",
    apiSize: "1024x1536",
    tier: "hd-portrait",
    prompt:
      "same composition as main scene but at deep twilight, more muted tones, the cottage window glowing more warmly, a single soft moonlight, suggesting safety and quiet presence, no crisis imagery"
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
    filename: "healing-boundary.png",
    displaySize: "400x600",
    apiSize: "1024x1536",
    tier: "standard",
    prompt: "a stone garden with a single curved path, vertical watercolor healing card background, leave quiet blank space in lower left for card name"
  },
  {
    filename: "healing-handoff.png",
    displaySize: "400x600",
    apiSize: "1024x1536",
    tier: "standard",
    prompt: "two hands gently passing a small lantern, vertical watercolor healing card background, leave quiet blank space in lower left for card name"
  },
  {
    filename: "healing-small-light.png",
    displaySize: "400x600",
    apiSize: "1024x1536",
    tier: "standard",
    prompt: "a single firefly resting on a leaf, vertical watercolor healing card background, leave quiet blank space in lower left for card name"
  },
  {
    filename: "healing-temperance.png",
    displaySize: "400x600",
    apiSize: "1024x1536",
    tier: "standard",
    prompt: "a half-filled teapot, vertical watercolor healing card background, leave quiet blank space in lower left for card name"
  },
  {
    filename: "healing-breathe.png",
    displaySize: "400x600",
    apiSize: "1024x1536",
    tier: "standard",
    prompt: "a wide-open window with curtains lifting in breeze, vertical watercolor healing card background, leave quiet blank space in lower left for card name"
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

function fullPrompt(asset: ArtAsset): string {
  return `${asset.prompt}\n\n${negativeAndStyle}`;
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

  console.log(`Mode: ${shouldExecute ? "execute" : "dry-run"}`);
  console.log(`Output dir: ${outputDir}`);
  console.log(`Assets: ${assets.length}`);

  if (shouldExecute && !process.env.OPENAI_API_KEY) {
    throw new Error(`OPENAI_API_KEY is required in ${envPath} when using --execute.`);
  }

  for (const [index, asset] of assets.entries()) {
    const cost = costs[asset.tier];
    cumulative += cost;
    const prompt = fullPrompt(asset);

    console.log(`\n[${index + 1}/${assets.length}] ${asset.filename}`);
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
