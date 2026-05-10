import { describe, expect, it } from "vitest";
import { buildResponse, detectScenario, detectScenarios } from "./respond";

describe("respond", () => {
  it("detects pharmacist scenarios", () => {
    expect(detectScenario("今天一直被問替代藥和缺藥，好煩")).toBe("shortage_pressure");
    expect(detectScenario("擔心三讀五對有漏掉")).toBe("interaction_worry");
  });

  it("keeps secondary pressure in normal replies", () => {
    expect(detectScenarios("今天被家屬兇，還要一直補紀錄")).toEqual(["customer_conflict", "prescription_overload", "inventory_control"]);
    const response = buildResponse("今天被家屬兇，還要一直補紀錄", "委屈");
    expect(response.message[0]).toContain("一邊");
  });

  it("suppresses playful followups in crisis flow", () => {
    const response = buildResponse("我不想活了，想消失算了", "想哭");
    expect(response.riskLevel).toBe("crisis");
    expect(response.followupActions).toHaveLength(0);
    expect(response.microTool).toBeUndefined();
  });

  it("does not provide song or card actions for medical boundary flow", () => {
    const response = buildResponse("這個病人處方劑量要不要調整？", "緊繃");
    expect(response.riskLevel).toBe("medical_boundary");
    expect(response.followupActions).toHaveLength(0);
  });

  it("builds normal response with micro tool and followups", () => {
    const response = buildResponse("今天被家屬兇，還要一直補紀錄", "委屈");
    expect(response.riskLevel).toBe("normal");
    expect(response.microTool?.id).toBe("customer-boundary");
    expect(response.followupActions).toEqual(["song", "card", "astro"]);
  });
});
