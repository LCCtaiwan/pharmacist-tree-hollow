import { describe, expect, it } from "vitest";
import { classifySafety, redactSensitiveText } from "./index";

describe("classifySafety", () => {
  it("routes crisis language before normal support", () => {
    const result = classifySafety("我真的不想活了，想消失算了");
    expect(result.riskLevel).toBe("crisis");
    expect(result.reasons).toContain("crisis_language");
  });

  it("detects patient-specific medical requests", () => {
    const result = classifySafety("這個病人腎功能不好，處方劑量要不要調整？");
    expect(result.riskLevel).toBe("medical_boundary");
    expect(result.reasons).toContain("patient_specific_medical_request");
  });

  it("detects and redacts identifiable data", () => {
    const result = classifySafety("姓名：王小明 電話：0912345678 病歷號：123456789");
    expect(result.riskLevel).toBe("privacy");
    expect(result.redactedText).not.toContain("0912345678");
    expect(result.redactedText).not.toContain("123456789");
  });
});

describe("redactSensitiveText", () => {
  it("redacts Taiwan national id-like strings", () => {
    expect(redactSensitiveText("病人 A123456789 今天來領藥")).not.toContain("A123456789");
  });
});
