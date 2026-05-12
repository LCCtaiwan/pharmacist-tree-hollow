import type {
  AstroReflectionCard,
  MicroTool,
  MoodTag,
  ScenarioTag,
  SongRecommendation
} from "@pharmacist-tree-hollow/shared";

export { reflectionQuestions } from "./reflectionQuestions";
export { healingQuotes } from "./healingQuotes";

export const microTools: MicroTool[] = [
  {
    id: "customer-boundary",
    title: "把客訴放回邊界",
    scenarioTags: ["customer_conflict"],
    durationSeconds: 30,
    steps: ["先吐一口氣。", "把剛剛那句重話放回對方的焦慮裡。", "你可以負責說明，不必負責承接所有情緒。"],
    completionText: "好了。你剛剛沒有失去專業，只是承受了很多聲音。"
  },
  {
    id: "shortage-circle",
    title: "缺藥壓力可控圈",
    scenarioTags: ["shortage_pressure", "inventory_control"],
    durationSeconds: 30,
    steps: ["在心裡畫一個小圈。", "圈內放：我能查、能說明、能交代。", "圈外放：供貨、制度、別人的焦急。"],
    completionText: "你負責把能做的做清楚，不負責讓所有限制消失。"
  },
  {
    id: "next-prescription",
    title: "回到下一件能確認的事",
    scenarioTags: ["prescription_overload"],
    durationSeconds: 30,
    steps: ["先看一眼桌面。", "只選下一件能確認的事，不看整座山。", "提醒自己：一段一段確認，就是把安全守住。"],
    completionText: "不用一次處理全部。下一件事，就是現在的範圍。"
  },
  {
    id: "interaction-unload",
    title: "安全線擔心卸載",
    scenarioTags: ["interaction_worry"],
    durationSeconds: 30,
    steps: ["把手放鬆一下。", "承認：你會擔心，是因為你在把關。", "回到 SOP、工具與團隊，不讓腦袋單獨扛。"],
    completionText: "謹慎不是不夠好，是你在保護病人安全。"
  },
  {
    id: "handoff-shutdown",
    title: "交班後關機儀式",
    scenarioTags: ["after_shift", "night_shift"],
    durationSeconds: 30,
    steps: ["把肩膀往下放。", "心裡說：今天已經交到流程裡。", "讓身體先離開值班的速度。"],
    completionText: "下班後還想著工作很正常，但你可以慢慢回到自己。"
  }
];

export const astroCards: AstroReflectionCard[] = [
  {
    id: "astro-saturn",
    name: "土星的邊界",
    scenarioTags: ["shortage_pressure", "inventory_control", "team_doubt"],
    lines: ["你不用替所有混亂負責。", "先把能確認的確認好，", "剩下的，交回流程和團隊。"],
    healingTip: "列出今晚確認過的3件事，提醒自己有把關。"
  },
  {
    id: "astro-moon",
    name: "月亮的水面",
    scenarioTags: ["customer_conflict", "unseen_effort", "after_shift"],
    lines: ["今天有些委屈不必馬上整理好。", "先讓它安靜地浮著，", "你不需要現在就變得很堅強。"],
    healingTip: "夜班後先不回高責任訊息，睡醒再處理。"
  },
  {
    id: "astro-mercury",
    name: "水星的訊息",
    scenarioTags: ["customer_conflict", "team_doubt"],
    lines: ["你已經說明得很努力。", "有些誤會需要時間消化，", "不是每一句話都要立刻修好。"],
    healingTip: "把難回的話先寫草稿，交班後再發。"
  },
  {
    id: "astro-mars",
    name: "火星的停頓",
    scenarioTags: ["customer_conflict", "prescription_overload"],
    lines: ["怒氣來的時候，先不要急著處理它。", "慢一拍，", "你就多一點空間保護自己。"],
    healingTip: "先喝水離開櫃台30秒，再回到流程。"
  },
  {
    id: "astro-jupiter",
    name: "木星的小燈",
    scenarioTags: ["pgy_pressure", "not_professional"],
    lines: ["你不是一開始就要什麼都會。", "今天學到的一點點，", "也會慢慢變成你的底氣。"],
    healingTip: "下班前記一個今天學到的藥名或流程。"
  },
  {
    id: "astro-venus",
    name: "金星的照顧",
    scenarioTags: ["night_shift", "after_shift", "unseen_effort"],
    lines: ["照顧別人很久的人，", "也需要被溫柔地放回自己身上。", "今晚先不要再責備自己。"],
    healingTip: "夜班後先吃點東西，再檢討今天。"
  },
  {
    id: "astro-rahu",
    name: "羅喉的霧",
    scenarioTags: ["shortage_pressure", "prescription_overload", "interaction_worry"],
    lines: ["霧很厚的時候，先不要判斷整條路。", "看清楚腳下這一步，", "就已經夠了。"],
    healingTip: "霧很厚時只查下一張處方，不想全部。"
  },
  {
    id: "astro-sun",
    name: "太陽",
    scenarioTags: ["pgy_pressure", "not_professional", "after_shift"],
    lines: ["有些光不是大聲發亮。", "它只是讓你在忙亂裡，還記得一個清楚的方向。", "今天你也替安全留了一盞燈。"],
    healingTip: "交班前寫下今天照亮過的一個病人安全點。"
  },
  {
    id: "astro-neptune",
    name: "海王",
    scenarioTags: ["night_shift", "after_shift", "interaction_worry"],
    lines: ["夜裡的念頭像潮水，會把小事推得很遠。", "先不用追到海的盡頭。", "讓它退一點，你再回來看。"],
    healingTip: "夜班後把反覆擔心寫成一句，再關燈。"
  },
  {
    id: "astro-uranus",
    name: "天王",
    scenarioTags: ["team_doubt", "prescription_overload", "pgy_pressure"],
    lines: ["被打斷的節奏，不代表你失去能力。", "有時候清醒，是從承認混亂開始。", "你可以重新排列下一步。"],
    healingTip: "流程被打斷時，先重排下一個可確認步驟。"
  },
  {
    id: "astro-pluto",
    name: "冥王",
    scenarioTags: ["leaving_thought", "team_doubt", "interaction_worry"],
    lines: ["有些重，不是今晚就能變輕。", "但你願意看見它，已經不是被它拖著走。", "深處也會慢慢換氣。"],
    healingTip: "把最重的擔心交給一位可信任同事確認。"
  },
  {
    id: "astro-beidou",
    name: "北斗",
    scenarioTags: ["pgy_pressure", "not_professional", "night_shift"],
    lines: ["迷路時，不必一次看完整片天空。", "找一個穩定的點就好。", "它會陪你把班走完。"],
    healingTip: "輪班前先標出今天唯一必守的安全準則。"
  },
  {
    id: "astro-weaver",
    name: "織女",
    scenarioTags: ["unseen_effort", "inventory_control", "after_shift"],
    lines: ["有些專業像細線，安靜地穿過一天。", "沒有人看見每一針，", "但缺口真的被你補上了。"],
    healingTip: "把今天默默補上的一格庫存記下來。"
  },
  {
    id: "astro-meteor",
    name: "流星",
    scenarioTags: ["unseen_effort", "night_shift", "after_shift"],
    lines: ["有些努力只亮一下，然後就被下一件事蓋過。", "可是它亮過。", "你看見了，就不算完全消失。"],
    healingTip: "記下今天沒人說謝謝的一個小細節。"
  }
];

type SongTuple = [
  title: string,
  artist: string,
  language: string,
  moodTags: MoodTag[],
  scenarioTags: ScenarioTag[],
  energy: SongRecommendation["energy"],
  timing: string[],
  reason: string
];

const songSeeds: SongTuple[] = [
  ["Somewhere Only We Know", "Keane", "en", ["累", "空"], ["after_shift", "customer_conflict"], "soft", ["下班路上"], "讓腦袋先離開剛剛那個現場聲音，你不用整晚都留在那裡。"],
  ["Fix You", "Coldplay", "en", ["委屈", "想哭"], ["unseen_effort", "after_shift"], "soft", ["夜晚"], "它適合陪你承認今天真的很累，不急著把自己修好。"],
  ["Holocene", "Bon Iver", "en", ["空", "累"], ["after_shift", "night_shift"], "quiet", ["夜班後"], "聲音很遠，適合讓身體慢慢離開工作速度。"],
  ["Yellow", "Coldplay", "en", ["委屈", "還可以"], ["unseen_effort"], "soft", ["回家路上"], "今天沒有人看見的努力，先讓一點溫暖替你留著。"],
  ["Vienna", "Billy Joel", "en", ["緊繃", "煩"], ["pgy_pressure", "prescription_overload"], "steady", ["考核前"], "它適合提醒你慢一點，不必用同一天證明全部。"],
  ["The Scientist", "Coldplay", "en", ["空", "想哭"], ["interaction_worry", "after_shift"], "quiet", ["睡前"], "適合陪你從反覆回想裡退一步，不把整晚都交給自責。"],
  ["Let It Be", "The Beatles", "en", ["煩", "緊繃"], ["shortage_pressure", "inventory_control"], "steady", ["下班前"], "有些不可控的事，先讓它回到系統和時間裡。"],
  ["Don't Know Why", "Norah Jones", "en", ["累", "空"], ["night_shift", "after_shift"], "quiet", ["夜班後"], "聲音很輕，適合不想再接收太多話的時候。"],
  ["River Flows in You", "Yiruma", "instrumental", ["累", "空"], ["after_shift", "night_shift"], "quiet", ["睡前"], "不需要文字，只讓節奏把今天放慢。"],
  ["Comptine d'un autre ete", "Yann Tiersen", "instrumental", ["空", "緊繃"], ["prescription_overload", "after_shift"], "quiet", ["短暫休息"], "像把混亂收進抽屜，先留一點安靜給自己。"],
  ["Nuvole Bianche", "Ludovico Einaudi", "instrumental", ["想哭", "累"], ["unseen_effort", "after_shift"], "quiet", ["睡前"], "適合讓說不出口的累，有一個不用解釋的地方。"],
  ["Weightless", "Marconi Union", "instrumental", ["緊繃", "累"], ["prescription_overload", "night_shift"], "quiet", ["喘口氣"], "不急著提振，只先把身體的速度降下來。"],
  ["給自己的歌", "李宗盛", "zh", ["累", "委屈"], ["unseen_effort", "after_shift"], "steady", ["下班路上"], "它不急著叫你振作，適合陪你承認有些累是真的。"],
  ["山丘", "李宗盛", "zh", ["空", "累"], ["pgy_pressure", "after_shift"], "steady", ["夜晚"], "今天走過的壓力，也許還沒答案，但你已經走了一段。"],
  ["慢慢喜歡你", "莫文蔚", "zh", ["還可以", "累"], ["after_shift"], "soft", ["回家路上"], "適合把工作速度放慢，重新回到自己的節奏。"],
  ["平凡之路", "朴樹", "zh", ["空", "緊繃"], ["pgy_pressure", "not_professional"], "steady", ["考核後"], "專業不是一天長出來的，今天先讓自己走在路上。"],
  ["刻在我心底的名字", "盧廣仲", "zh", ["想哭", "委屈"], ["unseen_effort"], "soft", ["夜晚"], "適合讓心裡那點酸，有一個不必解釋的出口。"],
  ["魚仔", "盧廣仲", "zh", ["空", "累"], ["after_shift", "night_shift"], "soft", ["回家路上"], "它有一點漂浮感，適合下班後還沒回到自己的人。"],
  ["小幸運", "田馥甄", "zh", ["委屈", "還可以"], ["unseen_effort"], "bright", ["休息時"], "今天仍有一些小小的好，值得被你留住。"],
  ["你就不要想起我", "田馥甄", "zh", ["想哭", "委屈"], ["customer_conflict"], "release", ["下班後"], "有些委屈不需要立刻漂亮地放下，先讓它流過。"],
  ["成全", "林宥嘉", "zh", ["想哭", "空"], ["after_shift"], "release", ["夜晚"], "適合承認自己今天真的撐得很辛苦。"],
  ["兜圈", "林宥嘉", "zh", ["空", "煩"], ["interaction_worry", "after_shift"], "soft", ["睡前"], "當腦袋一直繞回工作，它可以陪你慢慢停下來。"],
  ["浪費", "林宥嘉", "zh", ["想哭", "空"], ["unseen_effort"], "release", ["夜晚"], "適合放一點沒有被看見的疲憊。"],
  ["說好的幸福呢", "周杰倫", "zh", ["委屈", "想哭"], ["customer_conflict"], "release", ["下班後"], "當今天被重話刮到，先讓情緒有個出口。"],
  ["稻香", "周杰倫", "zh", ["緊繃", "煩"], ["pgy_pressure", "not_professional"], "bright", ["休息時"], "適合提醒自己先回到能呼吸的地方，不必一直被壓力推著走。"],
  ["那些你很冒險的夢", "林俊傑", "zh", ["空", "委屈"], ["pgy_pressure", "leaving_thought"], "steady", ["夜晚"], "適合把自我懷疑放輕一點，先記得你為什麼走到這裡。"],
  ["修煉愛情", "林俊傑", "zh", ["想哭", "委屈"], ["unseen_effort"], "release", ["夜晚"], "適合讓心裡那個忍很久的地方被聽見。"],
  ["起風了", "吳青峰", "zh", ["空", "累"], ["after_shift", "pgy_pressure"], "steady", ["回家路上"], "像把一天的風慢慢吹過去，留下還站著的自己。"],
  ["太空人", "吳青峰", "zh", ["空", "緊繃"], ["night_shift", "after_shift"], "quiet", ["夜班後"], "夜班後的世界有點遠，這首歌適合陪你慢慢落地。"],
  ["光年之外", "G.E.M.", "zh", ["緊繃", "煩"], ["pgy_pressure"], "bright", ["考核前"], "適合在壓力很大的時候，借一點往前的力。"],
  ["句號", "G.E.M.", "zh", ["委屈", "煩"], ["leaving_thought", "team_doubt"], "steady", ["下班後"], "適合提醒自己，有些界線可以慢慢重新畫回來。"],
  ["後來", "劉若英", "zh", ["想哭", "空"], ["after_shift"], "release", ["夜晚"], "如果今天有點想哭，先不用把原因說完整。"],
  ["親愛的路人", "劉若英", "zh", ["委屈", "累"], ["customer_conflict", "unseen_effort"], "soft", ["回家路上"], "它適合陪你把別人的情緒放遠一點。"],
  ["寂寞寂寞就好", "田馥甄", "zh", ["空", "想哭"], ["after_shift", "night_shift"], "release", ["夜晚"], "有些空掉的感覺，不必急著填滿。"],
  ["不為誰而作的歌", "林俊傑", "zh", ["累", "委屈"], ["unseen_effort"], "steady", ["下班後"], "今天的努力就算沒被看見，也不是不存在。"],
  ["Island In The Sun", "Weezer", "en", ["煩", "還可以"], ["customer_conflict", "shortage_pressure"], "bright", ["休息時"], "適合讓腦袋短暫離開現場，回到一個輕一點的地方。"],
  ["Banana Pancakes", "Jack Johnson", "en", ["累", "還可以"], ["after_shift"], "soft", ["休息日"], "適合提醒你，生活不只有工作速度。"],
  ["Better Together", "Jack Johnson", "en", ["委屈", "還可以"], ["unseen_effort"], "soft", ["回家路上"], "今天先讓一點簡單的溫暖陪你走完回家路。"],
  ["Breathe", "Lee Hi", "ko", ["想哭", "累"], ["after_shift", "unseen_effort"], "release", ["夜晚"], "適合在很想撐住的時候，先允許自己呼吸。"],
  ["Through the Night", "IU", "ko", ["空", "累"], ["night_shift", "after_shift"], "quiet", ["夜班後"], "很適合夜班後那種安靜又還沒睡著的心情。"],
  ["Palette", "IU", "ko", ["還可以", "緊繃"], ["pgy_pressure", "not_professional"], "soft", ["休息時"], "適合把自己從評分裡拿回來一點。"],
  ["Spring Day", "BTS", "ko", ["想哭", "空"], ["after_shift"], "release", ["夜晚"], "當今天有點遠、有點冷，它適合陪你等情緒過去。"],
  ["Blue & Grey", "BTS", "ko", ["空", "累"], ["night_shift", "unseen_effort"], "quiet", ["夜晚"], "適合不想被催著變好的時候。"],
  ["Sparkle", "RADWIMPS", "ja", ["空", "還可以"], ["after_shift"], "bright", ["回家路上"], "給今天留一點星光感，不必全部都是疲憊。"],
  ["Nandemonaiya", "RADWIMPS", "ja", ["想哭", "空"], ["after_shift", "unseen_effort"], "soft", ["夜晚"], "適合讓說不清的心情先被放著。"],
  ["Lemon", "Kenshi Yonezu", "ja", ["想哭", "委屈"], ["after_shift"], "release", ["夜晚"], "有些重的情緒不必立刻講明白，先讓它有地方待著。"],
  ["Kaze ni Naru", "Ayano Tsuji", "ja", ["煩", "還可以"], ["customer_conflict", "after_shift"], "bright", ["下班路上"], "適合把剛剛的刺耳聲音吹遠一點。"],
  ["Merry-Go-Round of Life", "Joe Hisaishi", "instrumental", ["累", "空"], ["after_shift", "night_shift"], "quiet", ["睡前"], "不需要文字，只讓旋律把今天慢慢收起來。"],
  ["One Summer's Day", "Joe Hisaishi", "instrumental", ["空", "想哭"], ["night_shift", "unseen_effort"], "quiet", ["夜班後"], "像把一天放進比較柔軟的光裡。"],
  ["A Walk", "Yiruma", "instrumental", ["緊繃", "累"], ["prescription_overload", "after_shift"], "quiet", ["短暫休息"], "適合讓步伐和呼吸都慢一點。"]
];

export const songs: SongRecommendation[] = songSeeds.map(([title, artist, language, moodTags, scenarioTags, energy, timing, reason]) => ({
  title,
  artist,
  language,
  moodTags,
  scenarioTags,
  energy,
  timing,
  reason
}));

export function pickByScenario<T extends { scenarioTags: ScenarioTag[] }>(
  items: T[],
  scenario: ScenarioTag,
  fallbackIndex = 0
): T {
  return items.find((item) => item.scenarioTags.includes(scenario)) ?? items[fallbackIndex];
}
