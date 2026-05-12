import type { AILetterResponse, ConversationResponse } from "@pharmacist-tree-hollow/shared";

const FALLBACK_CARE_TITLE = "今晚這張紙先放著";
const MAX_CARE_TITLE_LEN = 14;

function truncateTitle(title: string): string {
  const chars = [...title];
  if (chars.length <= MAX_CARE_TITLE_LEN) return title;
  return chars.slice(0, MAX_CARE_TITLE_LEN).join("");
}

export function staticToAILetter(input: ConversationResponse): AILetterResponse {
  const isCrisis = input.riskLevel === "crisis";

  const careTitleRaw = input.careTitle && input.careTitle.length > 0
    ? input.careTitle
    : FALLBACK_CARE_TITLE;

  const hold = input.empathy && input.empathy.length > 0
    ? input.empathy
    : input.message.join(" ");

  return {
    mode: isCrisis ? "crisis" : "hold_and_praise",
    careTitle: truncateTitle(careTitleRaw),
    hold,
    praise: isCrisis ? "" : input.praise,
    praiseNotes: isCrisis ? [] : (input.praiseNotes ?? [])
  };
}
