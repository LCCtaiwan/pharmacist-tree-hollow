import { useEffect, useMemo, useState } from "react";
import type { ConversationResponse, FollowupAction, MoodTag } from "@pharmacist-tree-hollow/shared";
import { NightPharmacyScene } from "./components/NightPharmacyScene";
import { ResponseCard } from "./components/ResponseCard";
import { buildResponse } from "./lib/respond";
import "./styles.css";

const moods: MoodTag[] = ["累", "委屈", "煩", "空", "緊繃", "想哭", "還可以"];
const savedKey = "pharmacist-tree-hollow:saved";
const promptHints: Record<MoodTag, string[]> = {
  累: ["把今天最耗電的一幕放進來", "不用完整，丟一句最累的就好", "今天是哪一刻讓你覺得電量歸零？"],
  委屈: ["把那句卡在心裡的話放進來", "誰的語氣讓你到現在還不舒服？", "不用替自己解釋，先把委屈放下來"],
  煩: ["把最煩的那個點丟進來", "今天哪件事一直重複消耗你？", "可以只寫：我真的很煩"],
  空: ["把那個空掉的感覺放進來", "下班後，心裡還剩下什麼？", "不用有結論，先丟一小句"],
  緊繃: ["把剛剛讓你一直繃著的事放進來", "哪個細節讓你不敢放鬆？", "先寫那個最怕出錯的瞬間"],
  想哭: ["把那個差點哭出來的瞬間放進來", "如果眼淚有一句話，它會說什麼？", "可以很短：我快撐不住了"],
  還可以: ["把今天還算撐住的一刻放進來", "今天有哪一小段沒有那麼糟？", "留一句給還在撐的自己"]
};

interface SavedItem {
  id: string;
  createdAt: string;
  mood: MoodTag;
  text: string;
}

function loadSaved(): SavedItem[] {
  try {
    return JSON.parse(localStorage.getItem(savedKey) ?? "[]") as SavedItem[];
  } catch {
    return [];
  }
}

export default function App() {
  const [mood, setMood] = useState<MoodTag>("累");
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<ConversationResponse | null>(null);
  const [activePanel, setActivePanel] = useState<FollowupAction | null>(null);
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [hintIndex, setHintIndex] = useState(0);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    setSaved(loadSaved());
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHintIndex((current) => current + 1);
    }, 3600);
    return () => window.clearInterval(timer);
  }, []);

  const currentHint = useMemo(() => {
    const hints = promptHints[mood];
    return hints[hintIndex % hints.length];
  }, [hintIndex, mood]);

  function submit() {
    const trimmed = input.trim();
    setIsThinking(true);
    setActivePanel(null);
    window.setTimeout(() => {
      const result = buildResponse(trimmed || `今天覺得${mood}`, mood);
      setResponse(result);
      setIsThinking(false);
    }, 520);
  }

  function saveCurrent() {
    if (!response) return;
    const text = [response.empathy, response.praise, response.tinyAction].join("\n");
    const item: SavedItem = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      mood,
      text
    };
    const next = [item, ...saved].slice(0, 8);
    setSaved(next);
    localStorage.setItem(savedKey, JSON.stringify(next));
  }

  function clearSaved() {
    setSaved([]);
    localStorage.removeItem(savedKey);
  }

  return (
    <main className={`app-shell ${response?.riskLevel === "crisis" ? "crisis-mode" : ""}`}>
      <header className="app-header">
        <div>
          <p>今日樹洞開著</p>
          <h1>藥師樹洞</h1>
        </div>
        <span>30 秒，把今天放下一點</span>
      </header>

      <NightPharmacyScene mood={mood} quiet={response?.riskLevel === "crisis"} />

      <section className="composer" aria-label="樹洞輸入">
        <div className="mood-row" aria-label="選擇心情">
          {moods.map((item) => (
            <button
              type="button"
              key={item}
              className={mood === item ? "selected" : ""}
              onClick={() => setMood(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="input-row">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={currentHint}
            rows={3}
            aria-label="把今天想放下的一句話丟進來"
          />
          <button type="button" className="send-button" onClick={submit} aria-label="送進樹洞">
            ↗
          </button>
        </div>
      </section>

      {response ? (
        <ResponseCard
          response={response}
          activePanel={activePanel}
          onPanel={(panel) => setActivePanel((current) => (current === panel ? null : panel))}
          onSave={saveCurrent}
        />
      ) : isThinking ? (
        <section className="quiet-note quiet-note-thinking" aria-live="polite">
          <p>樹洞正在把這句話接住。</p>
          <div className="thinking-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </section>
      ) : (
        <section className="quiet-note quiet-note-dynamic" key={`${mood}-${hintIndex}`}>
          <p>{currentHint}</p>
          <span>不用寫完整。一句話就可以。</span>
        </section>
      )}

      {saved.length > 0 && (
        <section className="saved-list">
          <div className="saved-heading">
            <h2>收下的句子</h2>
            <button type="button" onClick={clearSaved}>
              清除
            </button>
          </div>
          {saved.map((item) => (
            <article key={item.id}>
              <span>{item.mood}</span>
              <p>{item.text}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
