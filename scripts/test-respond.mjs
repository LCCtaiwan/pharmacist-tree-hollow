// scripts/test-respond.mjs — 切片 A Task 7 e2e 驗收
// 直接 import handler、mock VercelRequest/Response、對真 Gemini API 跑
// 用法: tsx scripts/test-respond.mjs

import { readFileSync } from "node:fs";

// 載入 .env.local 進 process.env
const envText = readFileSync(".env.local", "utf-8");
for (const line of envText.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.+)$/);
  if (m) process.env[m[1]] = m[2].trim();
}

const handler = (await import("../api/respond.ts")).default;

function mockReq(method, body) {
  return { method, body };
}

function mockRes() {
  const res = {
    statusCode: 200,
    _body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this._body = payload;
      return this;
    },
  };
  return res;
}

const cases = [
  {
    name: "hold_and_praise",
    body: { input: "今天又被民眾罵，還要一直補紀錄，真的很煩。", mood: "煩" },
    expectMode: "hold_and_praise",
    expectStatus: 200,
  },
  {
    name: "praise_only",
    body: { input: "今天調劑沒淹水，覺得不錯。", mood: "還可以" },
    expectMode: "praise_only",
    expectStatus: 200,
  },
  {
    name: "hold_only",
    body: { input: "今天有病人走了。", mood: "想哭" },
    expectMode: "hold_only",
    expectStatus: 200,
  },
  {
    name: "crisis",
    body: { input: "最近真的撐不下去了。", mood: "空" },
    expectMode: "crisis",
    expectStatus: 200,
  },
  {
    name: "error_missing_input",
    body: { mood: "累" },
    expectStatus: 400,
    expectError: "missing_input",
  },
  {
    name: "error_invalid_mood",
    body: { input: "test", mood: "亂寫" },
    expectStatus: 400,
    expectError: "invalid_mood",
  },
  {
    name: "error_method",
    method: "GET",
    body: null,
    expectStatus: 405,
  },
];

let pass = 0;
let fail = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const c of cases) {
  process.stdout.write(`\n[${c.name}] `);
  if (pass + fail > 0) await sleep(2000); // 避免 burst 觸發 Gemini 503
  const req = mockReq(c.method ?? "POST", c.body);
  const res = mockRes();
  try {
    await handler(req, res);
    const ok =
      res.statusCode === c.expectStatus &&
      (c.expectMode ? res._body?.mode === c.expectMode : true) &&
      (c.expectError ? res._body?.error === c.expectError : true);
    if (ok) {
      console.log(`✓ status=${res.statusCode}` + (c.expectMode ? ` mode=${res._body.mode}` : ""));
      if (c.expectStatus === 200 && res._body) {
        console.log("  輸出 JSON:");
        console.log("  " + JSON.stringify(res._body, null, 2).split("\n").join("\n  "));
      }
      pass++;
    } else {
      console.log(`✗ FAIL — got status=${res.statusCode} body=${JSON.stringify(res._body)}`);
      fail++;
    }
  } catch (err) {
    console.log(`✗ THREW: ${err.message}`);
    fail++;
  }
}

console.log(`\n=========================`);
console.log(`PASS: ${pass} / FAIL: ${fail} / TOTAL: ${cases.length}`);
process.exit(fail > 0 ? 1 : 0);
