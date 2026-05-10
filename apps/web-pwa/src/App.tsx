import { useEffect, useMemo, useRef, useState } from "react";
import type { ConversationResponse, FollowupAction, MoodTag } from "@pharmacist-tree-hollow/shared";
import { WatercolorScene } from "./components/WatercolorScene";
import type { SceneState } from "./components/WatercolorScene";
import { ResponseCard } from "./components/ResponseCard";
import { buildResponse } from "./lib/respond";
import "./styles.css";

const moodOptions: Array<{ mood: MoodTag; label: string }> = [
  { mood: "累", label: "累了" },
  { mood: "委屈", label: "委屈" },
  { mood: "煩", label: "煩" },
  { mood: "空", label: "空空的" },
  { mood: "緊繃", label: "緊繃" },
  { mood: "想哭", label: "想哭" },
  { mood: "還可以", label: "還可以" }
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
  const [isResponding, setIsResponding] = useState(false);
  const [microActive, setMicroActive] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const timersRef = useRef<number[]>([]);
  const responseRegionRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setSaved(loadSaved());
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    if (!response) return;

    const frame = window.requestAnimationFrame(() => {
      responseRegionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [response]);

  useEffect(() => {
    if (!composerOpen || response) return;

    const frame = window.requestAnimationFrame(() => {
      composerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      textareaRef.current?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [composerOpen, response]);

  const currentHint = useMemo(() => {
    return promptHints[mood];
  }, [mood]);

  const crisis = response?.riskLevel === "crisis";
  const sceneState: SceneState = isDepositing
    ? "depositing"
    : isThinking
      ? "thinking"
      : isResponding
        ? "responding"
        : input.trim().length > 0
          ? "writing"
          : "idle";

  function submit() {
    const trimmed = input.trim();
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];

    setIsDepositing(true);
    setIsThinking(false);
    setIsResponding(false);
    setMicroActive(false);
    setResponse(null);
    setActivePanel(null);

    const depositingTimer = window.setTimeout(() => {
      setIsDepositing(false);
      setIsThinking(true);

      const thinkingTimer = window.setTimeout(() => {
        setIsThinking(false);
        const result = buildResponse(trimmed || `今天覺得${mood}`, mood);
        setResponse(result);
        setIsResponding(true);

        const respondingTimer = window.setTimeout(() => {
          setIsResponding(false);
        }, 600);

        timersRef.current.push(respondingTimer);
      }, 260);

      timersRef.current.push(thinkingTimer);
    }, 600);

    timersRef.current.push(depositingTimer);
  }

  function selectSceneMood(nextMood: MoodTag) {
    setMood(nextMood);
    setComposerOpen(true);
  }

  function saveCurrent() {
    if (!response) return;
    const text = [response.careTitle, response.empathy, response.praiseNotes?.[0] ?? response.praise, response.tinyAction, response.closingLine]
      .filter(Boolean)
      .join("\n");
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

  function resetConversation() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
    setIsDepositing(false);
    setIsThinking(false);
    setIsResponding(false);
    setResponse(null);
    setActivePanel(null);
    setMicroActive(false);
    setComposerOpen(false);
    setInput("");
  }

  const showSceneEntry = !composerOpen && !response && !isThinking && !isDepositing && !isResponding;

  return (
    <main className={`app-shell ${showSceneEntry ? "app-shell-entry" : ""} ${response ? "app-shell-has-response" : ""} ${crisis ? "crisis-mode" : ""}`}>
      <WatercolorScene
        mood={mood}
        state={sceneState}
        activePanel={activePanel}
        microActive={microActive}
        savedCount={saved.length}
        crisis={Boolean(crisis)}
        showHotspots={showSceneEntry}
        onMoodSelect={selectSceneMood}
      />

      {composerOpen && !response && (
      <section className="composer" aria-label="樹洞輸入" ref={composerRef}>
        <div className="composer-picked">
          <span>你點了</span>
          <strong>{moodOptions.find((item) => item.mood === mood)?.label ?? mood}</strong>
          <button type="button" onClick={() => setComposerOpen(false)}>
            回到底圖
          </button>
        </div>

        <div className="input-row">
          <textarea
            ref={textareaRef}
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
      )}

      {response ? (
        <div className="response-wrap" ref={responseRegionRef}>
          <ResponseCard
            response={response}
            activePanel={activePanel}
            onPanel={(panel) => setActivePanel((current) => (current === panel ? null : panel))}
            onSave={saveCurrent}
            onNewNote={resetConversation}
            onMicroChange={setMicroActive}
          />
        </div>
      ) : isThinking ? (
        <section className="quiet-note quiet-note-thinking" aria-live="polite">
          <p>櫃檯後面的人正在讀你的紙條。</p>
          <div className="thinking-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </section>
      ) : composerOpen ? (
        <section className="quiet-note quiet-note-dynamic" key={mood}>
          <p>不用寫完整。</p>
          <span>一句話也可以，樹洞會先收著。</span>
        </section>
      ) : null}

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
