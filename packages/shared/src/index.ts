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

export interface HealingCard {
  id: string;
  name: string;
  meaning: string;
  reflection: string;
}

export interface AstroReflectionCard {
  id: string;
  name: string;
  lines: string[];
  scenarioTags: ScenarioTag[];
}

export interface ConversationResponse {
  riskLevel: RiskLevel;
  empathy: string;
  praise: string;
  tinyAction: string;
  microTool?: MicroTool;
  followupActions: FollowupAction[];
  song?: SongRecommendation;
  card?: HealingCard;
  astro?: AstroReflectionCard;
}
