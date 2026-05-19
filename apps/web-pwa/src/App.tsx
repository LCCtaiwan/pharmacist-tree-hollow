import { useEffect, useRef, useState } from "react";
import type { CSSProperties, Dispatch, RefObject, SetStateAction } from "react";
import { classifySafety, redactSensitiveText } from "@pharmacist-tree-hollow/ai-safety";
import type {
  AILetterResponse,
  FollowupAction,
  HealingQuote,
  LenormandCard,
  MicroTool,
  MoodTag,
  ReflectionQuestion,
  SongRecommendation,
  StationType
} from "@pharmacist-tree-hollow/shared";
import {
  buildLenormandPrompt,
  drawLenormandSpread,
  healingQuotes,
  microTools,
  reflectionQuestions,
  songs
} from "@pharmacist-tree-hollow/content";
import { WatercolorScene } from "./components/WatercolorScene";
import type { SceneState } from "./components/WatercolorScene";
import { CrisisCard } from "./components/CrisisCard";
import { ResponseCard } from "./components/ResponseCard";
import { hasUsedLetterToday, markLetterSent } from "./lib/daily-limit";
import { requestAILetter, RateLimitedError } from "./lib/letter-client";
import { staticToAILetter } from "./lib/letter-adapter";
import { buildResponse } from "./lib/respond";
import "./styles.css";

const savedKey = "pharmacist-tree-hollow:saved";
const introSeenKey = "pharmacist-tree-hollow:hasSeenIntro";

const ventPlaceholder = "今晚想說什麼？把卡在心裡的話投進來。一句也好。";
const introLines = ["燈亮著，紙攤著。", "椅子留著你的位置。", "不用敲門，輕輕推就好。"];

type AppPhase = "splash" | "intro" | "scene";
type IntroFlow = "full" | "repeat" | "skip";

const stationCopy: Record<Exclude<StationType, "vent" | "saved">, { object: string; verb: string; cycleLabel: string }> = {
  reflection: { object: "枝頭的貓頭鷹", verb: "意義拾荒", cycleLabel: "換一題" },
  song: { object: "小屋的收音機", verb: "頻率擁抱", cycleLabel: "換一首" },
  astro: { object: "天上的星光", verb: "宇宙的悄悄話", cycleLabel: "換一組" },
  breathing: { object: "搖晃的花草", verb: "意識降落", cycleLabel: "換一個" },
  quote: { object: "草地上的紙條", verb: "文字微光", cycleLabel: "換一句" }
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
  | { type: "breathing"; data: MicroTool }
  | { type: "quote"; data: HealingQuote }
  | null;

const astroSpreadPositions = [{ label: "1" }, { label: "2" }, { label: "3" }] as const;

function getAstroCardImagePath(id: string): string {
  return `/art/lenormand/${id}.png`;
}

function pickStationContent(station: StationType): StationContent {
  if (station === "reflection") {
    const data = pickRandom(reflectionQuestions);
    return data ? { type: "reflection", data } : null;
  }
  if (station === "song") {
    const data = pickRandom(songs);
    return data ? { type: "song", data } : null;
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
  const mood: MoodTag = "累";
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<AILetterResponse | null>(null);
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [rateLimitHit, setRateLimitHit] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isAstroCardVisible, setIsAstroCardVisible] = useState(true);
  const [isAstroCycling, setIsAstroCycling] = useState(false);
  const [astroSpreadCards, setAstroSpreadCards] = useState<LenormandCard[]>([]);
  const [astroQuestion, setAstroQuestion] = useState("");
  const [astroDrawn, setAstroDrawn] = useState(false);
  const [failedAstroImageIds, setFailedAstroImageIds] = useState<Record<string, true>>({});
  const [astroImageRetries, setAstroImageRetries] = useState<Record<string, number>>({});
  const [activeStation, setActiveStation] = useState<StationType | null>(null);
  const [stationContent, setStationContent] = useState<StationContent>(null);
  const timersRef = useRef<number[]>([]);
  const astroCycleTimerRef = useRef<number | null>(null);
  const astroUnlockTimerRef = useRef<number | null>(null);
  const responseRegionRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLElement | null>(null);
  const stationRef = useRef<HTMLElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setSaved(loadSaved());
  }, []);

  useEffect(() => {
    setDailyLimitReached(hasUsedLetterToday());
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
      if (astroCycleTimerRef.current) window.clearTimeout(astroCycleTimerRef.current);
      if (astroUnlockTimerRef.current) window.clearTimeout(astroUnlockTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (astroSpreadCards.length === 0) return;
    astroSpreadCards.forEach((card) => {
      const img = new Image();
      img.src = getAstroCardImagePath(card.id);
    });
  }, [astroSpreadCards]);

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

  const crisis = response?.mode === "crisis";
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

  async function submit() {
    if (dailyLimitReached) return;

    const trimmed = input.trim();
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];

    setIsDepositing(true);
    setIsThinking(false);
    setIsResponding(false);
    setResponse(null);

    try {
      await new Promise<void>((resolve) => {
        const depositingTimer = window.setTimeout(() => {
          resolve();
        }, 600);

        timersRef.current.push(depositingTimer);
      });

      setIsDepositing(false);
      setIsThinking(true);

      const userText = trimmed || `今天覺得${mood}`;
      const safety = classifySafety(userText);
      let letter: AILetterResponse;

      if (safety.riskLevel === "crisis") {
        const staticCrisis = buildResponse(userText, mood);
        letter = staticToAILetter({ ...staticCrisis, riskLevel: "crisis" });
        markLetterSent();
        setDailyLimitReached(true);
      } else {
        const safeText = redactSensitiveText(userText);
        try {
          const result = await requestAILetter(safeText, mood);
          letter = result.letter;
        } catch (err) {
          if (err instanceof RateLimitedError) {
            setIsThinking(false);
            setRateLimitHit(true);
            return;
          }
          throw err;
        }
      }

      setResponse(letter);
      if (safety.riskLevel !== "crisis") {
        markLetterSent();
        setDailyLimitReached(true);
      }
      setIsThinking(false);
      setIsResponding(true);

      const respondingTimer = window.setTimeout(() => {
        setIsResponding(false);
      }, 600);

      timersRef.current.push(respondingTimer);
    } catch {
      setIsDepositing(false);
      setIsThinking(false);
    }
  }

  function selectStation(station: StationType) {
    if (astroCycleTimerRef.current) window.clearTimeout(astroCycleTimerRef.current);
    if (astroUnlockTimerRef.current) window.clearTimeout(astroUnlockTimerRef.current);
    setIsAstroCycling(false);
    setIsAstroCardVisible(true);
    setActiveStation(station);

    if (station === "astro") {
      setStationContent(null);
      setFailedAstroImageIds({});
      setAstroImageRetries({});
      setAstroSpreadCards([]);
      setAstroQuestion("");
      setAstroDrawn(false);
    } else {
      setAstroSpreadCards([]);
      setStationContent(pickStationContent(station));
    }
  }

  function cycleStationContent() {
    if (!activeStation || activeStation === "vent" || activeStation === "saved") return;

    if (activeStation === "astro") {
      if (isAstroCycling) return;
      if (astroCycleTimerRef.current) window.clearTimeout(astroCycleTimerRef.current);
      if (astroUnlockTimerRef.current) window.clearTimeout(astroUnlockTimerRef.current);

      setIsAstroCycling(true);
      setIsAstroCardVisible(false);
      astroCycleTimerRef.current = window.setTimeout(() => {
        setFailedAstroImageIds({});
        setAstroImageRetries({});
        setAstroSpreadCards([]);
        setAstroQuestion("");
        setAstroDrawn(false);
        setIsAstroCardVisible(true);
        astroUnlockTimerRef.current = window.setTimeout(() => {
          setIsAstroCycling(false);
        }, 1500);
      }, 200);
      return;
    }

    setStationContent(pickStationContent(activeStation));
  }

  function closeStation() {
    if (astroCycleTimerRef.current) window.clearTimeout(astroCycleTimerRef.current);
    if (astroUnlockTimerRef.current) window.clearTimeout(astroUnlockTimerRef.current);
    setIsAstroCycling(false);
    setIsAstroCardVisible(true);
    setAstroSpreadCards([]);
    setAstroQuestion("");
    setAstroDrawn(false);
    setActiveStation(null);
    setStationContent(null);
    if (ventOpen) {
      setInput("");
    }
  }

  function saveCurrent() {
    if (!response) return;
    const text = [response.careTitle, response.hold, response.praise, ...response.praiseNotes]
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
    if (astroCycleTimerRef.current) window.clearTimeout(astroCycleTimerRef.current);
    if (astroUnlockTimerRef.current) window.clearTimeout(astroUnlockTimerRef.current);
    setIsAstroCycling(false);
    setIsAstroCardVisible(true);
    setAstroSpreadCards([]);
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
    <>
      <div className="page-backdrop" aria-hidden="true" />
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
              看看別處
            </button>
          </div>

          {dailyLimitReached && (
            <p className="daily-limit-notice">
              今晚的紙條已經投了。明天燈還會亮著。
            </p>
          )}

          {rateLimitHit && !dailyLimitReached && (
            <p className="daily-limit-notice">
              今晚這裡比較滿，明天再試試。
            </p>
          )}

          <div className="input-row">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={ventPlaceholder}
              rows={3}
              disabled={dailyLimitReached || rateLimitHit}
              aria-label="寫一張投進樹洞的紙條"
            />
            <button type="button" className="send-button" onClick={submit} disabled={dailyLimitReached || rateLimitHit} aria-label="送進樹洞">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21.5 2.5 11 13" />
                <path d="M21.5 2.5 14.5 21.5l-3.5-8.5-8.5-3.5z" />
              </svg>
            </button>
          </div>
        </section>
      )}

      {otherStationActive && activeStation && activeStation !== "vent" && (
        <StationView
          station={activeStation}
          content={stationContent}
          saved={saved}
          isAstroCardVisible={isAstroCardVisible}
          isAstroCycling={isAstroCycling}
          astroSpreadCards={astroSpreadCards}
          astroQuestion={astroQuestion}
          astroDrawn={astroDrawn}
          onAstroQuestionChange={setAstroQuestion}
          onAstroDraw={() => {
            setFailedAstroImageIds({});
            setAstroImageRetries({});
            setAstroSpreadCards(drawLenormandSpread());
            setAstroDrawn(true);
            setIsAstroCardVisible(true);
          }}
          failedAstroImageIds={failedAstroImageIds}
          astroImageRetries={astroImageRetries}
          setFailedAstroImageIds={setFailedAstroImageIds}
          setAstroImageRetries={setAstroImageRetries}
          onCycle={cycleStationContent}
          onClose={closeStation}
          onClearSaved={clearSaved}
          stationRef={stationRef}
        />
      )}

      {response ? (
        <div className="response-wrap" ref={responseRegionRef}>
          {response.mode === "crisis" ? (
            <CrisisCard letter={response} onNewNote={resetConversation} />
          ) : (
            <ResponseCard
              letter={response}
              onSave={saveCurrent}
              onNewNote={resetConversation}
            />
          )}
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
    </>
  );
}

interface StationViewProps {
  station: Exclude<StationType, "vent">;
  content: StationContent;
  saved: SavedItem[];
  isAstroCardVisible: boolean;
  isAstroCycling: boolean;
  astroSpreadCards: LenormandCard[];
  astroQuestion: string;
  astroDrawn: boolean;
  onAstroQuestionChange: (q: string) => void;
  onAstroDraw: () => void;
  failedAstroImageIds: Record<string, true>;
  astroImageRetries: Record<string, number>;
  setFailedAstroImageIds: Dispatch<SetStateAction<Record<string, true>>>;
  setAstroImageRetries: Dispatch<SetStateAction<Record<string, number>>>;
  onCycle: () => void;
  onClose: () => void;
  onClearSaved: () => void;
  stationRef: RefObject<HTMLElement | null>;
}

function StationView({
  station,
  content,
  saved,
  isAstroCardVisible,
  isAstroCycling,
  astroSpreadCards,
  astroQuestion,
  astroDrawn,
  onAstroQuestionChange,
  onAstroDraw,
  failedAstroImageIds,
  astroImageRetries,
  setFailedAstroImageIds,
  setAstroImageRetries,
  onCycle,
  onClose,
  onClearSaved,
  stationRef
}: StationViewProps) {
  const MAX_IMAGE_RETRIES = 2;

  function handleAstroImageError(cardId: string) {
    setAstroImageRetries((current) => {
      const attempts = (current[cardId] ?? 0) + 1;
      if (attempts > MAX_IMAGE_RETRIES) {
        setFailedAstroImageIds((failed) => ({ ...failed, [cardId]: true }));
      }
      return { ...current, [cardId]: attempts };
    });
  }
  const hasAstroSpread = station === "astro" && astroDrawn && astroSpreadCards.length === 3;
  const showAstroInput = station === "astro" && !astroDrawn;
  const [promptCopied, setPromptCopied] = useState(false);
  const lenormandPrompt = hasAstroSpread ? buildLenormandPrompt(astroSpreadCards, astroQuestion) : "";

  useEffect(() => {
    setPromptCopied(false);
  }, [astroSpreadCards]);

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(lenormandPrompt);
      setPromptCopied(true);
      window.setTimeout(() => setPromptCopied(false), 2200);
    } catch {
      setPromptCopied(false);
    }
  }

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
              看看別處
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
              看看別處
            </button>
          </div>
          <div className="station-body">
            {content?.type === "reflection" && (
              <article className="station-reflection-card">
                <span className="station-tag">意義拾荒</span>
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

            {showAstroInput && (
              <div className="station-astro-question">
                <p className="station-astro-question-hint">寫下你想問的問題，或留空直接抽牌。</p>
                <textarea
                  className="station-astro-question-input"
                  placeholder="例：最近工作的方向是否正確？"
                  value={astroQuestion}
                  onChange={(e) => onAstroQuestionChange(e.target.value)}
                  rows={3}
                  maxLength={100}
                />
                <button
                  type="button"
                  className="btn-paper station-astro-draw-btn"
                  onClick={onAstroDraw}
                >
                  ✦ 抽牌
                </button>
              </div>
            )}

            {hasAstroSpread && (
              <div className={`station-astro-spread ${isAstroCardVisible ? "station-astro-spread-visible" : "station-astro-spread-hidden"}`}>
                <div className="station-astro-spread-grid">
                  {astroSpreadCards.map((card, index) => (
                    <article
                      key={card.id}
                      className="station-astro-spread-card"
                      style={{ "--spread-index": index } as CSSProperties}
                    >
                      <div className="station-astro-spread-position">
                        <span>{astroSpreadPositions[index].label}</span>
                      </div>
                      <div className="station-astro-card-art">
                        {failedAstroImageIds[card.id] ? (
                          <div className="station-astro-card-fallback" role="img" aria-label={`${card.nameZh} 卡面`}>
                            <span className="station-astro-card-emoji" aria-hidden="true">{card.emoji}</span>
                            <p>{card.nameEn}</p>
                          </div>
                        ) : (
                          <img
                            key={`${card.id}-${astroImageRetries[card.id] ?? 0}`}
                            src={`${getAstroCardImagePath(card.id)}${astroImageRetries[card.id] ? `?r=${astroImageRetries[card.id]}` : ""}`}
                            alt={`${card.nameZh} 卡面`}
                            loading="eager"
                            decoding="async"
                            width={1024}
                            height={1536}
                            onError={() => handleAstroImageError(card.id)}
                          />
                        )}
                      </div>
                      <h3>{card.nameZh}</h3>
                      <p className="station-astro-card-en">{card.number}. {card.nameEn}</p>
                    </article>
                  ))}
                </div>
                <div className="station-lenormand-prompt">
                  <p className="station-lenormand-prompt-hint">
                    複製下方 prompt，貼到 ChatGPT / Claude / Gemini 讓它替你解讀。
                  </p>
                  <pre className="station-lenormand-prompt-body">{lenormandPrompt}</pre>
                  <button
                    type="button"
                    className="station-lenormand-prompt-copy"
                    onClick={handleCopyPrompt}
                    aria-live="polite"
                  >
                    {promptCopied ? "已複製 ✓" : "複製到剪貼簿"}
                  </button>
                </div>
                <small>娛樂與反思用，不是預測或專業建議。</small>
              </div>
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

            {!content && !hasAstroSpread && !showAstroInput && <p className="station-empty">這裡還在準備中。</p>}
          </div>
          {(content || hasAstroSpread) && (
            <div className="station-actions">
              <button type="button" onClick={onCycle} disabled={station === "astro" && isAstroCycling}>
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
      <div className="station-tag-row">
        <span className="station-tag">跟著做・{tool.durationSeconds} 秒專注</span>
        <span className="station-step-counter">
          {done ? `${stepCount} / ${stepCount}` : `${step + 1} / ${stepCount}`}
        </span>
      </div>
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
          {done ? "坐一下就好" : step >= tool.steps.length - 1 ? "最後一步" : "下一步"}
        </button>
      </div>
    </article>
  );
}
