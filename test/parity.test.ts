import { existsSync } from "node:fs";

import { createElement } from "react";
import TestRenderer, { act } from "react-test-renderer";
import { afterEach, describe, expect, it, vi } from "vitest";

import type * as Parity from "../../jamwidgets-core/test/parity.js";
import {
  useAnnouncements,
  useComments,
  useFeedback,
  useForm,
  usePoll,
  useReactions,
  useSubscribe,
  useViews,
  useWaitlist,
} from "../src/index.js";

// The shared fixture lives in the monorepo. Standalone package mirrors
// don't have it, so they skip these suites.
const fixture = new URL("../../jamwidgets-core/test/parity.ts", import.meta.url);
const parity: typeof Parity | null = existsSync(fixture)
  ? await import(/* @vite-ignore */ fixture.pathname)
  : null;
const { CONFIG, expectRequest, PAGE, POLL, SERVER_ERROR, settle, stubApi, WIDGET_CASES } =
  parity ?? ({ WIDGET_CASES: [] } as unknown as typeof Parity);
type Widget = Parity.Widget;

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

interface HookState {
  status: string;
  error: Error | null;
}

// Each widget's hook, and the action a visitor takes (none for widgets that load on mount).
const REACT: Record<Widget, { use: () => HookState & Record<string, unknown>; act?: (hook: any) => Promise<unknown> }> = {
  subscribe: { use: () => useSubscribe(CONFIG) as any, act: (h) => h.subscribe("a@example.com") },
  form: { use: () => useForm({ ...CONFIG, formSlug: "contact" }) as any, act: (h) => h.submit({ message: "Hi" }) },
  waitlist: { use: () => useWaitlist(CONFIG) as any, act: (h) => h.join("a@example.com") },
  feedback: { use: () => useFeedback(CONFIG) as any, act: (h) => h.submit("bug", "Broken") },
  comments: { use: () => useComments({ ...CONFIG, contentId: PAGE }) as any },
  reactions: { use: () => useReactions({ ...CONFIG, contentId: PAGE }) as any },
  views: { use: () => useViews({ ...CONFIG, pageId: PAGE }) as any },
  poll: { use: () => usePoll({ ...CONFIG, slug: POLL.slug }) as any },
  announcements: { use: () => useAnnouncements(CONFIG) as any },
};

async function render(widget: Widget) {
  const latest: { current: any } = { current: null };
  function Probe() {
    latest.current = REACT[widget].use();
    return null;
  }
  await act(async () => {
    TestRenderer.create(createElement(Probe));
  });
  const action = REACT[widget].act;
  if (action) {
    await act(async () => {
      await action(latest.current).catch(() => {});
    });
  }
  await settle(() => latest.current.status === "success" || latest.current.status === "error");
  return latest;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe.skipIf(!parity)("React widget parity", () => {
  for (const testCase of WIDGET_CASES) {
    it(`${testCase.widget}: happy path`, async () => {
      const fetch = stubApi(testCase, true);
      const hook = await render(testCase.widget);
      expect(hook.current.status).toBe("success");
      expect(hook.current.error).toBeNull();
      expectRequest(fetch, testCase);
    });

    it(`${testCase.widget}: error path shows the server's message`, async () => {
      const fetch = stubApi(testCase, false);
      const hook = await render(testCase.widget);
      expect(hook.current.status).toBe("error");
      expect(hook.current.error?.message).toBe(SERVER_ERROR);
      expectRequest(fetch, testCase);
    });
  }
});
