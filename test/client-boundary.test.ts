import { readdir, readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

// React Server Components (Next.js App Router) reject hooks in the server graph.
// web/scripts/jamwidgets-next-check.sh proves this with a real build; this is
// the fast check that runs with the unit tests.
const src = new URL("../src/", import.meta.url);

async function sources(): Promise<Array<{ name: string; text: string }>> {
  const names = (await readdir(src)).filter((name) => /\.tsx?$/.test(name));
  return Promise.all(names.map(async (name) => ({ name, text: await readFile(new URL(name, src), "utf8") })));
}

describe("client boundary", () => {
  it('marks every module that imports react with "use client"', async () => {
    const reactModules = (await sources()).filter(({ text }) => /from "react"/.test(text));
    expect(reactModules.map(({ name }) => name).sort()).toEqual(["Galleries.tsx", "PoweredBy.tsx", "hooks.ts"]);
    for (const { name, text } of reactModules) {
      expect(text.startsWith('"use client";\n'), name).toBe(true);
    }
  });

  it("keeps the entry point server-safe so core fetchers stay callable", async () => {
    const index = await readFile(new URL("index.ts", src), "utf8");
    expect(index).not.toMatch(/^["']use client["'];?$/m);
    expect(index).not.toMatch(/from "react"/);
  });
});
