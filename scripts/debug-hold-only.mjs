// 診斷 hold_only 為何回空
import { readFileSync } from "node:fs";
const envText = readFileSync(".env.local", "utf-8");
for (const line of envText.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.+)$/);
  if (m) process.env[m[1]] = m[2].trim();
}

const { GoogleGenAI } = await import("@google/genai");
const { SYSTEM_PROMPT } = await import("../api/_lib/system-prompt.ts");

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const result = await client.models.generateContent({
  model: "gemini-2.5-flash",
  config: {
    systemInstruction: SYSTEM_PROMPT,
    responseMimeType: "application/json",
    temperature: 0.8,
    maxOutputTokens: 800,
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
    ]
  },
  contents: [{ role: "user", parts: [{ text: "心情：想哭\n紙條：今天有病人走了。" }] }]
});

console.log("=== result.text ===");
console.log(JSON.stringify(result.text));
console.log("\n=== candidates ===");
console.log(JSON.stringify(result.candidates, null, 2));
console.log("\n=== promptFeedback ===");
console.log(JSON.stringify(result.promptFeedback, null, 2));
console.log("\n=== usageMetadata ===");
console.log(JSON.stringify(result.usageMetadata, null, 2));
