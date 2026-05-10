import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App scene entry", () => {
  it("starts from clickable scene objects before showing the note composer", () => {
    const html = renderToStaticMarkup(<App />);

    expect(html).toContain("點樹洞：說一說");
    expect(html).toContain("點枝頭：想一下");
    expect(html).toContain("點小屋：聽一首");
    expect(html).toContain("點草地：讀一句");
    expect(html).not.toContain("寫一張投進深夜櫃檯的紙條");
  });
});
