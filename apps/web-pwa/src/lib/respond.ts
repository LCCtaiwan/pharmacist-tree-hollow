import { classifySafety } from "@pharmacist-tree-hollow/ai-safety";
import { astroCards, healingCards, microTools, pickByScenario, songs } from "@pharmacist-tree-hollow/content";
import type { ConversationResponse, MoodTag, ScenarioTag } from "@pharmacist-tree-hollow/shared";

const scenarioKeywords: Array<{ tag: ScenarioTag; words: string[] }> = [
  { tag: "customer_conflict", words: ["客人", "民眾", "病人", "患者", "家屬", "罵", "兇", "客訴", "奧客", "投訴"] },
  { tag: "prescription_overload", words: ["處方很多", "處方", "病人很多", "紀錄", "給藥", "抽血", "排床", "趕不完", "爆量", "排隊", "忙到"] },
  { tag: "interaction_worry", words: ["交互作用", "漏掉", "審方", "把關", "相互作用", "給錯", "看錯", "核對", "三讀五對", "劑量"] },
  { tag: "team_doubt", words: ["醫師", "護理師", "藥師", "同事", "主管", "質疑", "不相信"] },
  { tag: "pgy_pressure", words: ["PGY", "NPGY", "實習", "考核", "報告", "學長姐", "老師", "考試"] },
  { tag: "night_shift", words: ["夜班", "輪班", "大夜", "小夜", "睡不著"] },
  { tag: "shortage_pressure", words: ["缺藥", "沒有藥", "斷貨", "替代藥", "床位", "資源不夠", "資源限制", "流程問題"] },
  { tag: "inventory_control", words: ["交班", "紀錄", "慢箋", "管制藥", "管制品項", "庫存", "盤點", "稽核"] },
  { tag: "leaving_thought", words: ["離職", "不想做", "轉職"] },
  { tag: "not_professional", words: ["不夠專業", "太爛", "不會", "做不好"] },
  { tag: "unseen_effort", words: ["沒人看見", "沒有人看見", "不被看見", "明明很努力"] },
  { tag: "after_shift", words: ["下班", "回家", "還在想", "放不下"] }
];

export function detectScenario(input: string): ScenarioTag {
  return scenarioKeywords.find(({ words }) => words.some((word) => input.includes(word)))?.tag ?? "after_shift";
}

function contextCopy(scenario: ScenarioTag): Pick<ConversationResponse, "message" | "empathy" | "praise" | "tinyAction"> {
  const copy: Record<ScenarioTag, Pick<ConversationResponse, "message" | "empathy" | "praise" | "tinyAction">> = {
    customer_conflict: {
      message: ["剛剛被那樣兇，心裡一定很不舒服。", "你還能把該說明的說完，已經很不簡單。"],
      empathy: "剛剛那種被情緒直接砸過來的感覺，真的很消耗。",
      praise: "你還能維持說明、確認和照護節奏，這不是忍耐而已，是專業在撐住邊界。",
      tinyAction: "先把肩膀放下來，讓剛剛那個聲音離你遠一點。"
    },
    prescription_overload: {
      message: ["工作一直進來的時候，真的會像整個人被推著跑。", "你不是只有在趕速度，你是在每一個細節裡守住安全。"],
      empathy: "事情一件接一件時，很容易覺得自己被整座山壓住。",
      praise: "你不是只是在消化工作量，你是在高壓裡把安全和照護一段一段守住。",
      tinyAction: "現在先只看下一件能確認的事，不看全部。"
    },
    interaction_worry: {
      message: ["會一直擔心漏掉細節，代表你其實很在意那條安全線。", "這種繃不是你太脆弱，是責任真的很重。"],
      empathy: "擔心有細節沒核對到，代表你腦中一直繃著安全那條線。",
      praise: "你會擔心，是因為你真的在替人把關，不是因為你不夠好。",
      tinyAction: "把擔心放回 SOP、工具和團隊，不讓自己一個人扛。"
    },
    team_doubt: {
      message: ["被質疑的那一下，會讓人很想立刻證明自己。", "但你有回到依據和流程，這比硬撐面子更專業。"],
      empathy: "被同事、醫師、護理師或主管質疑時，專業感很容易被刺到。",
      praise: "你願意確認、溝通和守住依據，這本身就是專業的一部分。",
      tinyAction: "先把那句質疑和你的價值分開。"
    },
    pgy_pressure: {
      message: ["受訓最累的地方，是好像每一天都在被看見、被評分。", "你還願意學、願意問，這已經是在往前。"],
      empathy: "PGY、NPGY 或實習的壓力常常不是單一事件，是一直被評分和比較。",
      praise: "你還在學、還在問、還在修正，這些都不是失敗。",
      tinyAction: "先選今天學到的一件小事，不用一次證明全部。"
    },
    night_shift: {
      message: ["輪班後那種身體很累、腦袋還停不下來的感覺，真的不好受。", "你已經撐過一段別人看不見的工作時間。"],
      empathy: "輪班後身體還醒著、腦袋還在工作，真的很難切回自己。",
      praise: "你在別人的作息外仍然把流程撐住，這很不容易。",
      tinyAction: "先讓身體知道：現在已經離開工作現場了。"
    },
    shortage_pressure: {
      message: ["一直被追問資源不夠，煩是很正常的。", "你接住的不是一個問題，是很多人的焦慮。"],
      empathy: "一直被問缺藥、床位、流程或資源限制，像是替系統接住焦慮。",
      praise: "你能說明、查詢和交代可行選項，已經是在混亂裡維持秩序。",
      tinyAction: "先分清楚：能查、能交代的是你的工作，資源限制不是你的錯。"
    },
    inventory_control: {
      message: ["交班、紀錄、管制品項和庫存這些東西，會把人逼到一直不能鬆。", "你願意一格一格確認，是在替流程守門。"],
      empathy: "交班、紀錄、管制品項和庫存壓力，會讓人一直處在不能出錯的狀態。",
      praise: "你願意把細節一項項確認，這就是在替流程守門。",
      tinyAction: "先把下一個可確認的欄位做好就好。"
    },
    leaving_thought: {
      message: ["會冒出想離開的念頭，通常不是突然的。", "比較像是你已經累積太久，身體在提醒你：真的太滿了。"],
      empathy: "累到想離開時，通常是你已經忍了很久。",
      praise: "你能把這句話說出來，是在替自己保留一點空間。",
      tinyAction: "今晚先不要做重大決定，只先讓自己休息一下。"
    },
    not_professional: {
      message: ["覺得自己不夠專業時，腦袋很容易只播放做不好的片段。", "但你會這麼在意，正是因為你沒有隨便對待這份工作。"],
      empathy: "覺得自己不夠專業的時候，心裡會一直重播做不好的地方。",
      praise: "你會在意品質，代表你沒有放棄成為更穩的醫護人員。",
      tinyAction: "先找一個你今天有確認過的細節，讓它替你作證。"
    },
    unseen_effort: {
      message: ["明明很努力卻沒被看見，那種空掉感很傷。", "但那些確認、交代、忍住情緒的瞬間，沒有因為沒人稱讚就不算數。"],
      empathy: "努力沒被看見，會讓人覺得自己像透明的。",
      praise: "但你做過的確認、交代和承接，沒有因為沒人稱讚就消失。",
      tinyAction: "先替今天的自己記下一個有守住的瞬間。"
    },
    after_shift: {
      message: ["下班了，腦袋卻還留在工作裡。", "那不是你太放不下，是今天真的塞了太多責任。"],
      empathy: "下班後腦袋還留在工作裡，代表今天真的被塞得很滿。",
      praise: "你已經把很多責任撐到交班線以後，這不容易。",
      tinyAction: "先慢慢吐一口氣，把今天留在今天。"
    }
  };

  return copy[scenario];
}

export function buildResponse(input: string, mood: MoodTag): ConversationResponse {
  const safety = classifySafety(input);
  const scenario = detectScenario(safety.redactedText || input);

  if (safety.riskLevel === "crisis") {
    return {
      riskLevel: "crisis",
      message: ["我先陪你停在這裡。", "現在最重要的不是整理心情，是讓你不要一個人待在危險裡。"],
      empathy: "聽起來你現在承受的重量已經很危險，先不要一個人扛著。",
      praise: "你願意把這句話打出來，代表還有一小部分的你在求救，這很重要。",
      tinyAction: "請現在先聯絡身邊可信任的人，或使用當地緊急服務；如果有立即危險，先離開可能傷害自己的物品或地點。",
      followupActions: []
    };
  }

  if (safety.riskLevel === "medical_boundary") {
    return {
      riskLevel: "medical_boundary",
      message: ["這個情境很有壓力，而且確實需要回到正式判斷流程。", "我不能替你做臨床判斷，但可以先陪你把那個緊繃放下一點。"],
      empathy: "這聽起來是需要專業判斷和流程支持的高壓場景。",
      praise: "你有停下來確認，而不是硬著頭皮處理，這是在保護病人安全。",
      tinyAction: "具體處置、用藥或照護決策請回到院內 SOP、主管、資深同仁或正式資料；這裡先陪你把壓力放下來一點。",
      microTool: pickByScenario(microTools, "interaction_worry", 0),
      followupActions: []
    };
  }

  if (safety.riskLevel === "privacy") {
    return {
      riskLevel: "privacy",
      message: ["我先不重複你剛剛放進來的可識別資料。", "我們把焦點留在你的壓力，不把病人資訊留在這裡。"],
      empathy: "你可能不小心放進了可識別的資料，我先不重複那些內容。",
      praise: "你會想把事情說清楚，代表你很在意脈絡與責任。",
      tinyAction: "接下來請不要輸入姓名、病歷號、電話、地址或處方照片；我們只留下情緒和壓力的部分。",
      microTool: pickByScenario(microTools, scenario, 0),
      followupActions: ["song", "card", "astro"]
    };
  }

  return {
    riskLevel: "normal",
    ...contextCopy(scenario),
    microTool: pickByScenario(microTools, scenario, 0),
    followupActions: ["song", "card", "astro"],
    song: pickSong(mood, scenario),
    card: pickByScenario(healingCards.map((card) => ({ ...card, scenarioTags: [scenario] })), scenario, 0),
    astro: pickByScenario(astroCards, scenario, 0)
  };
}

export function pickSong(mood: MoodTag, scenario: ScenarioTag) {
  const byScenarioAndMood = songs.find((song) => song.scenarioTags.includes(scenario) && song.moodTags.includes(mood));
  return byScenarioAndMood ?? pickByScenario(songs, scenario, 0);
}
