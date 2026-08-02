import { copyFile, cp, rm, writeFile } from "node:fs/promises";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("export", Date.now().toString());

const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request("https://yanochaka.github.io/", {
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

if (!response.ok) {
  throw new Error(`Static export failed with status ${response.status}`);
}

const html = await response.text();
const clientDirectory = new URL("../dist/client/", import.meta.url);
const docsDirectory = new URL("../docs/", import.meta.url);

await writeFile(new URL("index.html", clientDirectory), html);
await copyFile(
  new URL("index.html", clientDirectory),
  new URL("404.html", clientDirectory),
);
await rm(docsDirectory, { recursive: true, force: true });
await cp(clientDirectory, docsDirectory, { recursive: true });
await writeFile(new URL(".nojekyll", docsDirectory), "");

console.log("GitHub Pages export created in docs");
