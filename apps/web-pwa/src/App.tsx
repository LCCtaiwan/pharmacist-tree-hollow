import { useEffect, useMemo, useRef, useState } from "react";
import type { ConversationResponse, FollowupAction, MoodTag } from "@pharmacist-tree-hollow/shared";
import { NightPharmacyScene } from "./components/NightPharmacyScene";
import { ResponseCard } from "./components/ResponseCard";
import { buildResponse } from "./lib/respond";
import "./styles.css";

const moodOptions: Array<{ mood: MoodTag; label: string; note: string }> = [
  { mood: "累", label: "熱湯", note: "累了" },
  { mood: "委屈", label: "紙巾", note: "委屈" },
  { mood: "煩", label: "苦茶", note: "煩" },
  { mood: "空", label: "空碗", note: "空空的" },
  { mood: "緊繃", label: "小火", note: "緊繃" },
  { mood: "想哭", label: "雨傘", note: "想哭" },
  { mood: "還可以", label: "白水", note: "還可以" }
];
const savedKey = "pharmacist-tree-hollow:saved";
const promptHints: Record<MoodTag, string> = {
  累: "寫給今晚值班後的自己：哪一幕最耗電？",
  委屈: "把那句卡在心裡的話投進來。",
  煩: "今晚最想從值班櫃檯帶走哪一件煩事？",
  空: "如果現在心裡很空，留一張白紙也可以。",
  緊繃: "哪個細節讓你下班後還不敢放鬆？",
  想哭: "差點哭出來的那一刻，先放在這裡。",
  還可以: "今天還算撐住的一小段，也可以寫下來。"
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
  const [isThinking, setIsThinking] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const thinkingTimer = useRef<number | null>(null);

  useEffect(() => {
    setSaved(loadSaved());
  }, []);

  const currentHint = useMemo(() => {
    return promptHints[mood];
  }, [mood]);

  function submit() {
    const trimmed = input.trim();
    if (thinkingTimer.current) {
      window.clearTimeout(thinkingTimer.current);
    }
    setIsThinking(true);
    setIsDepositing(true);
    setResponse(null);
    setActivePanel(null);
    thinkingTimer.current = window.setTimeout(() => {
      const result = buildResponse(trimmed || `今天覺得${mood}`, mood);
      setResponse(result);
      setIsThinking(false);
      setIsDepositing(false);
    }, 860);
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
          <p>深夜值班櫃檯還亮著</p>
          <h1>醫護樹洞</h1>
        </div>
        <span>把值班後的一張紙條留在這裡</span>
      </header>

      <NightPharmacyScene mood={mood} quiet={response?.riskLevel === "crisis"} depositing={isDepositing} />

      <section className="composer" aria-label="樹洞輸入">
        <div className="mood-row" aria-label="今晚想點什麼">
          {moodOptions.map((item) => (
            <button
              type="button"
              key={item.mood}
              className={mood === item.mood ? "selected" : ""}
              onClick={() => setMood(item.mood)}
              aria-label={`${item.label}，${item.note}`}
            >
              <strong>{item.label}</strong>
              <small>{item.note}</small>
            </button>
          ))}
        </div>

        <div className="input-row">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={currentHint}
            rows={3}
            aria-label="寫一張投進深夜櫃檯的紙條"
          />
          <button type="button" className="send-button" onClick={submit} aria-label="送進樹洞">
            投
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
          <p>櫃檯後面的人正在讀你的紙條。</p>
          <div className="thinking-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </section>
      ) : (
        <section className="quiet-note quiet-note-dynamic" key={mood}>
          <p>{currentHint}</p>
          <span>不用寫完整，像投進深夜信箱的一句話就好。</span>
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
