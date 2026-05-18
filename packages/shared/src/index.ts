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

/** NPC 站點：樹洞=樹洞私語、枝頭=意義拾荒、小屋=頻率擁抱、星光=宇宙的悄悄話、花草=意識降落、草地=文字微光、小窩=情緒考古 */
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

/** Lenormand 36 張系統卡牌（線性 3 張牌陣使用） */
export interface LenormandCard {
  id: string;
  /** 1-36 傳統編號 */
  number: number;
  nameZh: string;
  nameEn: string;
  /** PNG 就位前的 emoji 佔位符 */
  emoji: string;
  /** 傳統關鍵字（給 AI prompt 與 UI tooltip 使用） */
  keywords: string[];
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

export type AILetterMode = "hold_and_praise" | "praise_only" | "hold_only" | "crisis";

export interface AILetterResponse {
  mode: AILetterMode;
  careTitle: string;
  hold: string;
  praise: string;
  praiseNotes: string[];
}
