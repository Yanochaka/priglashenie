import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the invitation", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Для Яны — один важный вопрос<\/title>/i);
  assert.match(html, /Яна,/);
  assert.match(html, /пойдёшь со мной/);
  assert.match(html, /Да, с удовольствием/);
  assert.match(html, />Нет</);
  assert.doesNotMatch(html, /TELEGRAM_BOT_TOKEN|AA[A-Za-z0-9_-]{30,}/);
});

test("keeps Telegram credentials on the server", async () => {
  const [page, route, gitignore, envExample] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/send-date/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../.gitignore", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
  ]);

  assert.match(page, /fetch\("\/api\/send-date"/);
  assert.match(route, /process\.env\.TELEGRAM_BOT_TOKEN/);
  assert.match(route, /process\.env\.TELEGRAM_CHAT_ID/);
  assert.match(gitignore, /^\.env\*/m);
  assert.match(envExample, /TELEGRAM_BOT_TOKEN=your_bot_token_here/);
  assert.doesNotMatch(`${page}\n${route}\n${envExample}`, /\d{8,12}:AA[A-Za-z0-9_-]{30,}/);
});
