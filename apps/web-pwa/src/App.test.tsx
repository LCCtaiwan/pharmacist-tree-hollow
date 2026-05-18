import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App scene entry", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts from clickable scene objects before showing the note composer", () => {
    vi.stubGlobal("location", { search: "?skipIntro=1" });

    const html = renderToStaticMarkup(<App />);

    expect(html).toContain("點樹洞：樹洞私語");
    expect(html).toContain("點枝頭：意義拾荒");
    expect(html).toContain("點小屋：頻率擁抱");
    expect(html).toContain("點草地：文字微光");
    expect(html).not.toContain("寫一張投進深夜櫃檯的紙條");
    expect(html).not.toContain("櫃檯");
  });
});
