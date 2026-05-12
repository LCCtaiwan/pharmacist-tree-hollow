export type MoodTag = "累" | "委屈" | "煩" | "空" | "緊繃" | "想哭" | "還可以";

export type ScenarioTag =
  | "customer_conflict"
  | "prescription_overload"
  | "interaction_worry"
  | "team_doubt"
  | "pgy_pressure"
  | "night_shift"
  | "shortage_pressure"
  | "inventory_control"
  | "leaving_thought"
  | "not_professional"
  | "unseen_effort"
  | "after_shift";

export type RiskLevel = "normal" | "privacy" | "medical_boundary" | "crisis";

export type FollowupAction = "song" | "card" | "astro";

/** NPC 站點：樹洞=說一說、枝頭=想一下、小屋=聽一首、星光=抽一張、花草=喘口氣、草地=讀一句、小窩=看回顧 */
export type StationType = "vent" | "reflection" | "song" | "astro" | "breathing" | "quote" | "saved";

export interface SafetyResult {
  riskLevel: RiskLevel;
  reasons: string[];
  redactedText: string;
}

export interface MicroTool {
  id: string;
  title: string;
  scenarioTags: ScenarioTag[];
  durationSeconds: number;
  steps: string[];
  completionText: string;
}

export interface SongRecommendation {
  title: string;
  artist: string;
  language: string;
  moodTags: MoodTag[];
  scenarioTags: ScenarioTag[];
  energy: "soft" | "steady" | "quiet" | "release" | "bright";
  timing: string[];
  reason: string;
}

export interface AstroReflectionCard {
  id: string;
  name: string;
  lines: string[];
  scenarioTags: ScenarioTag[];
  /** 今晚療癒提醒：針對藥師日常的具體小行動建議 */
  healingTip?: string;
}

export interface ReflectionQuestion {
  id: string;
  /** today=今天當下、role=藥師身份、team=人際同事、self=長期自己 */
  category: "today" | "role" | "team" | "self";
  text: string;
}

export interface HealingQuote {
  id: string;
  text: string;
  /** original=自寫、public-domain=公領域、book=書摘、tv=影集、movie=電影 */
  source: "original" | "public-domain" | "book" | "tv" | "movie";
  /** 出處（書名/劇名/作者）。original 可省略 */
  attribution?: string;
  language: "zh-Hant" | "en";
}

export interface ConversationResponse {
  riskLevel: RiskLevel;
  message: string[];
  empathy: string;
  praise: string;
  praiseNotes?: string[];
  tinyAction: string;
  careTitle?: string;
  gentleQuestion?: string;
  closingLine?: string;
  microTool?: MicroTool;
  followupActions: FollowupAction[];
  song?: SongRecommendation;
  astro?: AstroReflectionCard;
}
