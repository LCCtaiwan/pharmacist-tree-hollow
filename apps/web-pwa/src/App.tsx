import { useEffect, useMemo, useState } from "react";
import type { ConversationResponse, FollowupAction, MoodTag } from "@pharmacist-tree-hollow/shared";
import { NightPharmacyScene } from "./components/NightPharmacyScene";
import { ResponseCard } from "./components/ResponseCard";
import { buildResponse } from "./lib/respond";
import "./styles.css";

const moods: MoodTag[] = ["累", "委屈", "煩", "空", "緊繃", "想哭", "還可以"];
const savedKey = "pharmacist-tree-hollow:saved";

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

  useEffect(() => {
    setSaved(loadSaved());
  }, []);

  const placeholder = useMemo(() => {
    if (mood === "想哭") return "把那個差點哭出來的瞬間放進來";
    if (mood === "緊繃") return "把剛剛讓你一直繃著的事放進來";
    return "把今天想放下的一句話丟進來";
  }, [mood]);

  function submit() {
    const trimmed = input.trim();
    const result = buildResponse(trimmed || `今天覺得${mood}`, mood);
    setResponse(result);
    setActivePanel(null);
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
            placeholder={placeholder}
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
      ) : (
        <section className="quiet-note">
          <p>不用寫完整。只要一句「今天被客人兇到很累」也可以。</p>
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
