import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type {
  AstroReflectionCard,
  ConversationResponse,
  FollowupAction,
  HealingQuote,
  MicroTool,
  MoodTag,
  ReflectionQuestion,
  SongRecommendation,
  StationType
} from "@pharmacist-tree-hollow/shared";
import {
  astroCards,
  healingQuotes,
  microTools,
  reflectionQuestions,
  songs
} from "@pharmacist-tree-hollow/content";
import { WatercolorScene } from "./components/WatercolorScene";
import type { SceneState } from "./components/WatercolorScene";
import { ResponseCard } from "./components/ResponseCard";
import { buildResponse } from "./lib/respond";
import "./styles.css";

const savedKey = "pharmacist-tree-hollow:saved";
const introSeenKey = "pharmacist-tree-hollow:hasSeenIntro";

const ventPlaceholder = "今晚想說什麼？把卡在心裡的話投進來。一句也好。";
const introLines = ["燈亮著，紙攤著。", "椅子留著你的位置。", "不用敲門，輕輕推就好。"];

type AppPhase = "splash" | "intro" | "scene";
type IntroFlow = "full" | "repeat" | "skip";

const stationCopy: Record<Exclude<StationType, "vent" | "saved">, { object: string; verb: string; cycleLabel: string }> = {
  reflection: { object: "枝頭的貓頭鷹", verb: "想一下", cycleLabel: "換一題" },
  song: { object: "小屋的收音機", verb: "聽一首", cycleLabel: "換一首" },
  astro: { object: "天上的星光", verb: "抽一張", cycleLabel: "換一張" },
  breathing: { object: "搖晃的花草", verb: "喘口氣", cycleLabel: "換一個" },
  quote: { object: "草地上的紙條", verb: "讀一句", cycleLabel: "換一句" }
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

function getIntroFlow(): IntroFlow {
  try {
    if (typeof location !== "undefined" && new URLSearchParams(location.search).get("skipIntro") === "1") {
      return "skip";
    }

    if (typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return "skip";
    }

    if (typeof localStorage !== "undefined" && localStorage.getItem(introSeenKey) === "1") {
      return "repeat";
    }
  } catch {
    return "full";
  }

  return "full";
}

function markIntroSeen() {
  try {
    localStorage.setItem(introSeenKey, "1");
  } catch {
    // localStorage can be unavailable in private or server-like environments.
  }
}

function pickRandom<T>(arr: readonly T[]): T | null {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

type StationContent =
  | { type: "reflection"; data: ReflectionQuestion }
  | { type: "song"; data: SongRecommendation }
  | { type: "astro"; data: AstroReflectionCard }
  | { type: "breathing"; data: MicroTool }
  | { type: "quote"; data: HealingQuote }
  | null;

function pickStationContent(station: StationType): StationContent {
  if (station === "reflection") {
    const data = pickRandom(reflectionQuestions);
    return data ? { type: "reflection", data } : null;
  }
  if (station === "song") {
    const data = pickRandom(songs);
    return data ? { type: "song", data } : null;
  }
  if (station === "astro") {
    const data = pickRandom(astroCards);
    return data ? { type: "astro", data } : null;
  }
  if (station === "breathing") {
    const data = pickRandom(microTools);
    return data ? { type: "breathing", data } : null;
  }
  if (station === "quote") {
    const data = pickRandom(healingQuotes);
    return data ? { type: "quote", data } : null;
  }
  return null;
}

export default function App() {
  const [introFlow] = useState<IntroFlow>(() => getIntroFlow());
  const [appPhase, setAppPhase] = useState<AppPhase>(() => (introFlow === "skip" ? "scene" : "splash"));
  const [isSceneRevealing, setIsSceneRevealing] = useState(false);
  const mood: MoodTag = "累"; // 內部 default，不再由 NPC click 決定
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<ConversationResponse | null>(null);
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [activeStation, setActiveStation] = useState<StationType | null>(null);
  const [stationContent, setStationContent] = useState<StationContent>(null);
  const timersRef = useRef<number[]>([]);
  const responseRegionRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLElement | null>(null);
  const stationRef = useRef<HTMLElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setSaved(loadSaved());
  }, []);

  useEffect(() => {
    if (introFlow === "skip") return;

    if (introFlow === "repeat") {
      const timer = window.setTimeout(() => {
        setAppPhase("scene");
      }, 500);

      return () => {
        window.clearTimeout(timer);
      };
    }

    const splashTimer = window.setTimeout(() => {
      setAppPhase("intro");
    }, 1800);

    const revealTimer = window.setTimeout(() => {
      setIsSceneRevealing(true);
    }, 7700);

    const sceneTimer = window.setTimeout(() => {
      markIntroSeen();
      setAppPhase("scene");
      setIsSceneRevealing(false);
    }, 9100);

    return () => {
      window.clearTimeout(splashTimer);
      window.clearTimeout(revealTimer);
      window.clearTimeout(sceneTimer);
    };
  }, [introFlow]);

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
    if (!activeStation || response) return;

    const frame = window.requestAnimationFrame(() => {
      if (activeStation === "vent") {
        composerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        textareaRef.current?.focus({ preventScroll: true });
      } else {
        stationRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [activeStation, response]);

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

  const ventOpen = activeStation === "vent";

  // 場景反應：station 同步觸發 scene 視覺
  // quote station 已有專屬 grass-quote.png 視覺錨點，不再 mapping 到 card 避免雙紙條
  const microActive = activeStation === "breathing";
  const sceneActivePanel: FollowupAction | null =
    activeStation === "song"
      ? "song"
      : activeStation === "astro"
        ? "astro"
        : null;

  function submit() {
    const trimmed = input.trim();
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];

    setIsDepositing(true);
    setIsThinking(false);
    setIsResponding(false);
    setResponse(null);

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

  function selectStation(station: StationType) {
    setActiveStation(station);
    setStationContent(pickStationContent(station));
  }

  function cycleStationContent() {
    if (!activeStation || activeStation === "vent" || activeStation === "saved") return;
    setStationContent(pickStationContent(activeStation));
  }

  function closeStation() {
    setActiveStation(null);
    setStationContent(null);
    if (ventOpen) {
      setInput("");
    }
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
    setActiveStation(null);
    setStationContent(null);
    setInput("");
  }

  const showSceneEntry = !activeStation && !response && !isThinking && !isDepositing && !isResponding;

  const ventActive = ventOpen && !response;
  const otherStationActive = Boolean(activeStation && activeStation !== "vent");
  const sceneMounted = appPhase === "scene" || isSceneRevealing;

  return (
    <main className={`app-shell app-shell-${appPhase} ${isSceneRevealing ? "app-shell-scene-revealing" : ""} ${showSceneEntry ? "app-shell-entry" : ""} ${response ? "app-shell-has-response" : ""} ${crisis ? "crisis-mode" : ""}`}>
      {sceneMounted && (
        <div className={`scene-reveal ${isSceneRevealing ? "scene-reveal-entering" : "scene-reveal-ready"}`}>
          <WatercolorScene
            state={sceneState}
            activePanel={sceneActivePanel}
            microActive={microActive}
            savedCount={saved.length}
            crisis={Boolean(crisis)}
            showHotspots={appPhase === "scene" && showSceneEntry}
            onStationSelect={selectStation}
          />
        </div>
      )}

      {appPhase === "splash" && (
        <section className={`intro-screen splash-screen ${introFlow === "repeat" ? "splash-screen-quick" : ""}`} aria-label="藥師樹洞開場">
          <h1>藥師樹洞</h1>
        </section>
      )}

      {appPhase === "intro" && (
        <section className={`intro-screen intro-lines-screen ${isSceneRevealing ? "intro-lines-screen-exiting" : ""}`} aria-label="開頭引言">
          <div className="intro-lines" aria-live="polite">
            {introLines.map((line, index) => (
              <p key={line} style={{ "--intro-line-index": index } as CSSProperties}>
                {line}
              </p>
            ))}
            <span className="intro-ink-dot intro-ink-dot-1" aria-hidden="true" />
            <span className="intro-ink-dot intro-ink-dot-2" aria-hidden="true" />
          </div>
        </section>
      )}

      {ventActive && (
        <section className="composer" aria-label="樹洞輸入" ref={composerRef}>
          <div className="composer-picked">
            <span>你點了</span>
            <strong>樹洞</strong>
            <button type="button" className="btn-text" onClick={closeStation}>
              回到底圖
            </button>
          </div>

          <div className="input-row">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={ventPlaceholder}
              rows={3}
              aria-label="寫一張投進樹洞的紙條"
            />
            <button type="button" className="send-button" onClick={submit} aria-label="送進樹洞">
              投
            </button>
          </div>
        </section>
      )}

      {otherStationActive && activeStation && activeStation !== "vent" && (
        <StationView
          station={activeStation}
          content={stationContent}
          saved={saved}
          onCycle={cycleStationContent}
          onClose={closeStation}
          onClearSaved={clearSaved}
          stationRef={stationRef}
        />
      )}

      {response ? (
        <div className="response-wrap" ref={responseRegionRef}>
          <ResponseCard
            response={response}
            onSave={saveCurrent}
            onNewNote={resetConversation}
          />
        </div>
      ) : isThinking ? (
        <section className="quiet-note quiet-note-thinking" aria-live="polite">
          <p>樹洞那頭有人正在讀你的紙條。</p>
          <div className="thinking-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </section>
      ) : ventActive ? (
        <section className="quiet-note quiet-note-dynamic">
          <p>不用寫完整。</p>
          <span>一句話也可以，樹洞會先收著。</span>
        </section>
      ) : null}
    </main>
  );
}

interface StationViewProps {
  station: Exclude<StationType, "vent">;
  content: StationContent;
  saved: SavedItem[];
  onCycle: () => void;
  onClose: () => void;
  onClearSaved: () => void;
  stationRef: React.RefObject<HTMLElement | null>;
}

function StationView({ station, content, saved, onCycle, onClose, onClearSaved, stationRef }: StationViewProps) {
  return (
    <section className={`station-panel station-${station}`} aria-label="場景小站" ref={stationRef}>
      {station === "saved" ? (
        <>
          <div className="station-header">
            <div>
              <span>你點了</span>
              <strong>小窩</strong>
            </div>
            <button type="button" className="station-close" onClick={onClose}>
              回到底圖
            </button>
          </div>
          <div className="station-body">
            {saved.length === 0 ? (
              <p className="station-empty">小窩還是空的。從樹洞收下幾張紙條再回來看看吧。</p>
            ) : (
              <>
                <div className="station-saved-meta">
                  <span>共 {saved.length} 張收下的紙條</span>
                  <button type="button" className="station-saved-clear" onClick={onClearSaved}>
                    清除
                  </button>
                </div>
                <div className="station-saved-list">
                  {saved.map((item) => (
                    <article key={item.id}>
                      <span>{item.mood}</span>
                      <p>{item.text}</p>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="station-header">
            <div>
              <span>你點了</span>
              <strong>{stationCopy[station].object}</strong>
            </div>
            <button type="button" className="station-close" onClick={onClose}>
              回到底圖
            </button>
          </div>
          <div className="station-body">
            {content?.type === "reflection" && (
              <article className="station-reflection-card">
                <span className="station-tag">想一下</span>
                <p>{content.data.text}</p>
                <small>看了就走也行。不用回答。</small>
              </article>
            )}

            {content?.type === "song" && (
              <article className="station-song-card">
                <span className="station-tag">窗口傳來這首</span>
                <h3>
                  {content.data.title} · {content.data.artist}
                </h3>
                <p>{content.data.reason}</p>
              </article>
            )}

            {content?.type === "astro" && (
              <article className="station-astro-card">
                <span className="station-tag">抽到的是</span>
                <h3>{content.data.name}</h3>
                {content.data.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {content.data.healingTip && (
                  <div className="station-healing-tip">
                    <span>今晚療癒</span>
                    <p>{content.data.healingTip}</p>
                  </div>
                )}
                <small>娛樂與反思用，不是預測或專業建議。</small>
              </article>
            )}

            {content?.type === "breathing" && (
              <BreathingMicro tool={content.data} />
            )}

            {content?.type === "quote" && (
              <article className="station-quote-card">
                <span className="station-tag">紙條上寫著</span>
                <blockquote>{content.data.text}</blockquote>
                {content.data.attribution && <small>— {content.data.attribution}</small>}
              </article>
            )}

            {!content && <p className="station-empty">這裡還在準備中。</p>}
          </div>
          {content && (
            <div className="station-actions">
              <button type="button" onClick={onCycle}>
                {stationCopy[station].cycleLabel}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function BreathingMicro({ tool }: { tool: MicroTool }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const stepCount = Math.max(tool.steps.length, 1);

  useEffect(() => {
    setStep(0);
    setDone(false);
  }, [tool.id]);

  function advance() {
    if (step >= tool.steps.length - 1) {
      setDone(true);
      return;
    }
    setStep((current) => current + 1);
  }

  return (
    <article className="station-breathing-card">
      <span className="station-tag">花草陪你坐 {tool.durationSeconds} 秒</span>
      <h3>{tool.title}</h3>
      <div className="station-breathing-progress" aria-hidden="true">
        <i style={{ width: `${done ? 100 : ((step + 1) / stepCount) * 100}%` }} />
      </div>
      {done ? (
        <p className="station-breathing-complete">{tool.completionText}</p>
      ) : (
        <p className="station-breathing-step">{tool.steps[step]}</p>
      )}
      <div className="station-breathing-actions">
        {!done && (
          <button type="button" onClick={() => setDone(true)}>
            先跳過
          </button>
        )}
        <button type="button" onClick={done ? undefined : advance} disabled={done}>
          {done ? "坐一下就好" : step >= tool.steps.length - 1 ? "收尾" : "下一句"}
        </button>
      </div>
    </article>
  );
}
