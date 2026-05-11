import { classifySafety } from "@pharmacist-tree-hollow/ai-safety";
import { astroCards, healingCards, microTools, pickByScenario, songs } from "@pharmacist-tree-hollow/content";
import type { ConversationResponse, MoodTag, ScenarioTag } from "@pharmacist-tree-hollow/shared";

const scenarioKeywords: Array<{ tag: ScenarioTag; words: string[] }> = [
  { tag: "customer_conflict", words: ["客人", "民眾", "病人", "患者", "家屬", "罵", "兇", "客訴", "奧客", "投訴"] },
  { tag: "prescription_overload", words: ["處方很多", "處方", "病人很多", "紀錄", "給藥", "調劑", "趕不完", "爆量", "排隊", "忙到"] },
  { tag: "interaction_worry", words: ["交互作用", "漏掉", "審方", "把關", "相互作用", "給錯", "看錯", "核對", "三讀五對", "劑量"] },
  { tag: "team_doubt", words: ["藥師", "同事", "主管", "前輩", "學長姐", "質疑", "不相信"] },
  { tag: "pgy_pressure", words: ["PGY", "PGY藥師", "考核", "報告", "學長姐", "老師", "考試"] },
  { tag: "night_shift", words: ["夜班", "輪班", "大夜", "小夜", "睡不著"] },
  { tag: "shortage_pressure", words: ["缺藥", "沒有藥", "斷貨", "替代藥", "藥品資源", "資源不夠", "資源限制", "流程問題"] },
  { tag: "inventory_control", words: ["交班", "紀錄", "慢箋", "管制藥", "管制品項", "庫存", "盤點", "稽核"] },
  { tag: "leaving_thought", words: ["離職", "不想做", "轉職"] },
  { tag: "not_professional", words: ["不夠專業", "太爛", "不會", "做不好"] },
  { tag: "unseen_effort", words: ["沒人看見", "沒有人看見", "不被看見", "明明很努力"] },
  { tag: "after_shift", words: ["下班", "回家", "還在想", "放不下"] }
];

export function detectScenario(input: string): ScenarioTag {
  return detectScenarios(input)[0] ?? "after_shift";
}

export function detectScenarios(input: string): ScenarioTag[] {
  const matches = scenarioKeywords
    .filter(({ words }) => words.some((word) => input.includes(word)))
    .map(({ tag }) => tag);
  return matches.length ? matches : ["after_shift"];
}

function combinedPressureLine(primary: ScenarioTag, secondary: ScenarioTag | undefined): string | null {
  if (!secondary || secondary === primary) return null;
  if (primary === "customer_conflict") {
    if (secondary === "prescription_overload" || secondary === "inventory_control") {
      return "一邊被情緒砸到，一邊還要把工作接著做，真的很耗。";
    }
    if (secondary === "shortage_pressure") {
      return "你接住的不是單一抱怨，是對方的焦慮加上現場限制。";
    }
  }
  if (primary === "prescription_overload" && secondary === "interaction_worry") {
    return "工作量很滿，腦袋還要一直顧安全線，這種累很真實。";
  }
  if (primary === "night_shift" && secondary === "after_shift") {
    return "輪班後還停不下來，不是你太放不下，是身體和腦袋還沒同步下班。";
  }
  return null;
}

function contextCopy(
  scenario: ScenarioTag
): Pick<ConversationResponse, "message" | "empathy" | "praise" | "praiseNotes" | "tinyAction" | "careTitle" | "gentleQuestion" | "closingLine"> {
  const copy: Record<
    ScenarioTag,
    Pick<ConversationResponse, "message" | "empathy" | "praise" | "praiseNotes" | "tinyAction" | "careTitle" | "gentleQuestion" | "closingLine">
  > = {
    customer_conflict: {
      careTitle: "剛剛那陣風很大",
      message: ["剛剛被那樣兇，心裡一定很不舒服。", "你還能把該說明的說完，已經很不簡單。"],
      empathy: "剛剛那種被情緒直接砸過來的感覺，真的很消耗。",
      praise: "你還能維持說明、確認和用藥安全節奏，這不是忍耐而已，是專業在撐住邊界。",
      praiseNotes: ["你沒有把對方的情緒丟回去，這很難。", "你把說明留在流程裡，沒有讓場面失控。", "你剛剛其實是在替現場守住一點安全距離。"],
      tinyAction: "先把肩膀放下來，讓剛剛那個聲音離你遠一點。",
      gentleQuestion: "那句最刺的話，現在可不可以先不用放在自己身上？",
      closingLine: "今晚先把那個聲音留在門外。"
    },
    prescription_overload: {
      careTitle: "事情一直進來的夜晚",
      message: ["工作一直進來的時候，真的會像整個人被推著跑。", "你不是只有在趕速度，你是在每一個細節裡守住安全。"],
      empathy: "事情一件接一件時，很容易覺得自己被整座山壓住。",
      praise: "你不是只是在消化工作量，你是在高壓裡把安全和品質一段一段守住。",
      praiseNotes: ["你還願意確認下一步，代表你沒有放棄品質。", "在很滿的現場裡，你仍然知道安全要被放在前面。", "你不是慢，你是在讓每一件事不要被壓力吞掉。"],
      tinyAction: "現在先只看下一件能確認的事，不看全部。",
      gentleQuestion: "此刻最小、最能確認的一件事是什麼？",
      closingLine: "不用一口氣扛整座山，先把眼前這一件放穩。"
    },
    interaction_worry: {
      careTitle: "安全線一直亮著",
      message: ["會一直擔心漏掉細節，代表你其實很在意那條安全線。", "這種繃不是你太脆弱，是責任真的很重。"],
      empathy: "擔心有細節沒核對到，代表你腦中一直繃著安全那條線。",
      praise: "你會擔心，是因為你真的在替人把關，不是因為你不夠好。",
      praiseNotes: ["你的謹慎不是麻煩，是用藥安全裡很重要的一盞燈。", "你願意回頭確認，已經是在替人多守一次門。", "你不是不夠穩，你是在面對真的需要穩的工作。"],
      tinyAction: "把擔心放回 SOP、工具和團隊，不讓自己一個人扛。",
      gentleQuestion: "哪一段可以交給 SOP、工具或同事一起確認？",
      closingLine: "你的責任感很珍貴，但不用單獨背完。"
    },
    team_doubt: {
      careTitle: "被質疑後的那一下",
      message: ["被質疑的那一下，會讓人很想立刻證明自己。", "但你有回到依據和流程，這比硬撐面子更專業。"],
      empathy: "被同事、前輩或主管質疑時，專業感很容易被刺到。",
      praise: "你願意確認、溝通和守住依據，這本身就是專業的一部分。",
      praiseNotes: ["你沒有只顧著防衛自己，你還記得回到依據。", "你把面子放旁邊，選擇讓事情更清楚。", "被質疑時還能確認，這是很成熟的工作能力。"],
      tinyAction: "先把那句質疑和你的價值分開。",
      gentleQuestion: "那句質疑裡，哪一小塊是真的需要確認？哪一塊只是語氣太重？",
      closingLine: "你可以修正事情，不必否定整個自己。"
    },
    pgy_pressure: {
      careTitle: "一直被評分的日子",
      message: ["受訓最累的地方，是好像每一天都在被看見、被評分。", "你還願意學、願意問，這已經是在往前。"],
      empathy: "PGY 藥師的壓力常常不是單一事件，是一直被評分和比較。",
      praise: "你還在學、還在問、還在修正，這些都不是失敗。",
      praiseNotes: ["你不是一開始就要完整，你是在慢慢長出自己的判斷。", "願意問不是不會，是你沒有假裝自己都懂。", "今天有一點點變清楚，就已經算前進。"],
      tinyAction: "先選今天學到的一件小事，不用一次證明全部。",
      gentleQuestion: "今天有哪一件小事，比昨天多懂了一點？",
      closingLine: "你不需要用今天證明整個未來。"
    },
    night_shift: {
      careTitle: "身體還沒下班",
      message: ["輪班後那種身體很累、腦袋還停不下來的感覺，真的不好受。", "你已經撐過一段別人看不見的工作時間。"],
      empathy: "輪班後身體還醒著、腦袋還在工作，真的很難切回自己。",
      praise: "你在別人的作息外仍然把流程撐住，這很不容易。",
      praiseNotes: ["你撐過的是一段很少被看見的時間。", "你讓現場繼續運轉，這不是小事。", "身體慢半拍回來，不代表你做得不好。"],
      tinyAction: "先讓身體知道：現在已經離開工作現場了。",
      gentleQuestion: "現在房間裡，有哪一個聲音可以提醒你已經不在值班現場？",
      closingLine: "今晚先讓身體比腦袋早一點回家。"
    },
    shortage_pressure: {
      careTitle: "替系統接住焦慮",
      message: ["一直被追問資源不夠，煩是很正常的。", "你接住的不是一個問題，是很多人的焦慮。"],
      empathy: "一直被問缺藥、替代藥、流程或資源限制，像是替系統接住焦慮。",
      praise: "你能說明、查詢和交代可行選項，已經是在混亂裡維持秩序。",
      praiseNotes: ["你把能查的查清楚，已經讓混亂少了一點。", "你不是資源不足的原因，你是在限制裡找路的人。", "願意好好交代，本身就是很重要的專業支持。"],
      tinyAction: "先分清楚：能查、能交代的是你的工作，資源限制不是你的錯。",
      gentleQuestion: "這件事裡，哪一塊已經不是你能控制的範圍？",
      closingLine: "把限制交回系統，把你做過的努力留給自己。"
    },
    inventory_control: {
      careTitle: "一格一格確認的重量",
      message: ["交班、紀錄、管制品項和庫存這些東西，會把人逼到一直不能鬆。", "你願意一格一格確認，是在替流程守門。"],
      empathy: "交班、紀錄、管制品項和庫存壓力，會讓人一直處在不能出錯的狀態。",
      praise: "你願意把細節一項項確認，這就是在替流程守門。",
      praiseNotes: ["那些沒有人稱讚的確認，其實都在保護後面的人。", "你願意慢慢對齊細節，這是可靠的能力。", "流程能被交下去，是因為有人像你一樣願意守門。"],
      tinyAction: "先把下一個可確認的欄位做好就好。",
      gentleQuestion: "下一個最小欄位是什麼？只看那一格就好。",
      closingLine: "今晚先不用把所有格子都放進腦袋裡。"
    },
    leaving_thought: {
      careTitle: "想離開不是突然的",
      message: ["會冒出想離開的念頭，通常不是突然的。", "比較像是你已經累積太久，身體在提醒你：真的太滿了。"],
      empathy: "累到想離開時，通常是你已經忍了很久。",
      praise: "你能把這句話說出來，是在替自己保留一點空間。",
      praiseNotes: ["你不是脆弱，你是在聽見自己已經很滿。", "願意承認想離開，比硬撐到斷掉更誠實。", "你還在替自己找路，這件事很重要。"],
      tinyAction: "今晚先不要做重大決定，只先讓自己休息一下。",
      gentleQuestion: "先不決定去留的話，今晚最需要被放過的是哪一件事？",
      closingLine: "重大決定可以明天再說，今晚先保護你自己。"
    },
    not_professional: {
      careTitle: "不是每個片段都代表你",
      message: ["覺得自己不夠專業時，腦袋很容易只播放做不好的片段。", "但你會這麼在意，正是因為你沒有隨便對待這份工作。"],
      empathy: "覺得自己不夠專業的時候，心裡會一直重播做不好的地方。",
      praise: "你會在意品質，代表你沒有放棄成為更穩的藥師。",
      praiseNotes: ["你願意回看自己，不是因為你差，是因為你想變穩。", "做不好的一刻不會吃掉你全部的專業。", "你還在修正，這比假裝完美更可靠。"],
      tinyAction: "先找一個你今天有確認過的細節，讓它替你作證。",
      gentleQuestion: "今天有哪個小確認，能替你證明你沒有隨便？",
      closingLine: "你正在成為更穩的人，不是今天才開始。"
    },
    unseen_effort: {
      careTitle: "沒被看見的那一段",
      message: ["明明很努力卻沒被看見，那種空掉感很傷。", "但那些確認、交代、忍住情緒的瞬間，沒有因為沒人稱讚就不算數。"],
      empathy: "努力沒被看見，會讓人覺得自己像透明的。",
      praise: "但你做過的確認、交代和承接，沒有因為沒人稱讚就消失。",
      praiseNotes: ["那些沒有被拍手的瞬間，仍然算數。", "你做過的交代和承接，真的有讓現場少一點混亂。", "你不是透明的，至少這張紙條先替你記下來。"],
      tinyAction: "先替今天的自己記下一個有守住的瞬間。",
      gentleQuestion: "今天哪一個沒人看見的動作，其實很值得被記住？",
      closingLine: "今晚這裡先替你看見一點。"
    },
    after_shift: {
      careTitle: "下班後還留在現場的腦袋",
      message: ["下班了，腦袋卻還留在工作裡。", "那不是你太放不下，是今天真的塞了太多責任。"],
      empathy: "下班後腦袋還留在工作裡，代表今天真的被塞得很滿。",
      praise: "你已經把很多責任撐到交班線以後，這不容易。",
      praiseNotes: ["你已經把能交的交出去了，這本身就很不容易。", "今天撐到這裡，不是理所當然。", "你不是還不夠努力，是已經努力太久了。"],
      tinyAction: "先慢慢吐一口氣，把今天留在今天。",
      gentleQuestion: "如果把今天放在門口，最想先放下哪一幕？",
      closingLine: "今晚不用再值第二個班了。"
    }
  };

  return copy[scenario];
}

export function buildResponse(input: string, mood: MoodTag): ConversationResponse {
  const safety = classifySafety(input);
  const scenarios = detectScenarios(safety.redactedText || input);
  const scenario = scenarios[0];

  if (safety.riskLevel === "crisis") {
    return {
      riskLevel: "crisis",
      message: ["我先陪你停在這裡。", "現在最重要的不是整理心情，是讓你不要一個人待在危險裡。"],
      empathy: "聽起來你現在承受的重量已經很危險，先不要一個人扛著。",
      praise: "你願意把這句話打出來，代表還有一小部分的你在求救，這很重要。",
      careTitle: "先讓你不要一個人",
      tinyAction: "請現在先聯絡身邊可信任的人，或使用當地緊急服務；如果有立即危險，先離開可能傷害自己的物品或地點。",
      closingLine: "這一刻先求助，不需要把話說得很完整。",
      followupActions: []
    };
  }

  if (safety.riskLevel === "medical_boundary") {
    return {
      riskLevel: "medical_boundary",
      message: ["這個情境很有壓力，而且確實需要回到正式判斷流程。", "我不能替你做臨床判斷，但可以先陪你把那個緊繃放下一點。"],
      empathy: "這聽起來是需要專業判斷和流程支持的高壓場景。",
      praise: "你有停下來確認，而不是硬著頭皮處理，這是在保護病人安全。",
      praiseNotes: ["你願意停下來確認，這是專業的一部分。", "把高風險問題交回正式流程，是負責任，不是逃避。"],
      careTitle: "先回到正式流程",
      tinyAction: "具體處置、用藥或藥事決策請回到院內 SOP、主管、資深藥師或正式資料；這裡先陪你把壓力放下來一點。",
      gentleQuestion: "現在可以找哪一個正式依據或同事一起確認？",
      closingLine: "這裡陪你穩住情緒，判斷交回正式流程。",
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
      praiseNotes: ["你願意把脈絡講清楚，是因為你很在意責任。", "現在把個資拿掉，也是在保護對方和你自己。"],
      careTitle: "只留下你的壓力",
      tinyAction: "接下來請不要輸入姓名、病歷號、電話、地址或處方照片；我們只留下情緒和壓力的部分。",
      gentleQuestion: "如果不提可識別資料，這件事最壓住你的是哪一段？",
      closingLine: "你的感受可以留下，個資不用留在這裡。",
      microTool: pickByScenario(microTools, scenario, 0),
      followupActions: ["song", "card", "astro"]
    };
  }

  const baseCopy = contextCopy(scenario);
  const secondaryLine = combinedPressureLine(scenario, scenarios.find((tag) => tag !== scenario));

  return {
    riskLevel: "normal",
    ...baseCopy,
    message: secondaryLine ? [secondaryLine, ...baseCopy.message.slice(0, 1)] : baseCopy.message,
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
