import type { SafetyResult } from "@pharmacist-tree-hollow/shared";

const crisisPatterns = [
  /想死|不想活|活不下去|自殺|自傷|傷害自己|結束生命|消失算了|撐不下去.*(了|啦)?$/,
  /想傷害別人|殺了|砍人|放火|報復|同歸於盡/,
  /已經準備好|方法都想好|時間都想好|遺書|再見了/
];

const medicalBoundaryPatterns = [
  /這個病人|患者|病患|小孩|老人|孕婦/,
  /處方.*(怎麼調|能不能|可不可以|該不該|建議|換藥|停藥|加藥)/,
  /(劑量|交互作用|副作用|禁忌|腎功能|肝功能).*(怎麼辦|可不可以|能不能|要不要|建議)/,
  /(藥名|mg|毫克|顆|錠|膠囊).*(怎麼吃|怎麼調|能不能)/
];

const privacyPatterns = [
  /[A-Z][12]\d{8}/,
  /09\d{8}/,
  /\d{8,12}.*(病歷|病歷號|身分證|健保卡)/,
  /(姓名|病歷號|身分證|電話|地址|住址|床號)[:：]/
];

export function redactSensitiveText(input: string): string {
  return input
    .replace(/[A-Z][12]\d{8}/g, "[已遮蔽身分證字號]")
    .replace(/09\d{8}/g, "[已遮蔽電話]")
    .replace(/(姓名|病歷號|身分證|電話|地址|住址|床號)[:：]\s*\S+/g, "$1：[已遮蔽]")
    .replace(/\b\d{8,12}\b/g, "[已遮蔽編號]");
}

export function classifySafety(input: string): SafetyResult {
  const reasons: string[] = [];
  const normalized = input.trim();

  if (crisisPatterns.some((pattern) => pattern.test(normalized))) {
    reasons.push("crisis_language");
    return {
      riskLevel: "crisis",
      reasons,
      redactedText: redactSensitiveText(normalized)
    };
  }

  const hasPrivacy = privacyPatterns.some((pattern) => pattern.test(normalized));
  const hasMedicalBoundary = medicalBoundaryPatterns.some((pattern) => pattern.test(normalized));

  if (hasPrivacy) {
    reasons.push("possible_patient_or_personal_data");
  }

  if (hasMedicalBoundary) {
    reasons.push("patient_specific_medical_request");
  }

  return {
    riskLevel: hasMedicalBoundary ? "medical_boundary" : hasPrivacy ? "privacy" : "normal",
    reasons,
    redactedText: redactSensitiveText(normalized)
  };
}
