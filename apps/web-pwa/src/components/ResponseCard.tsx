import { useEffect, useRef, useState } from "react";
import type { ConversationResponse, FollowupAction } from "@pharmacist-tree-hollow/shared";

const actionLabels: Record<FollowupAction, string> = {
  song: "上一首今晚的歌",
  card: "拿一張紙籤",
  astro: "換一個夜空角度"
};

export function ResponseCard({
  response,
  activePanel,
  onPanel,
  onSave
}: {
  response: ConversationResponse;
  activePanel: FollowupAction | null;
  onPanel: (panel: FollowupAction) => void;
  onSave: () => void;
}) {
  const isCrisis = response.riskLevel === "crisis";
  const [microStep, setMicroStep] = useState(0);
  const [microDone, setMicroDone] = useState(false);
  const [praiseIndex, setPraiseIndex] = useState(0);
  const [savedOnce, setSavedOnce] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const microSteps = response.microTool?.steps ?? [];
  const hasMicroTool = Boolean(response.microTool && !isCrisis && microSteps.length > 0);
  const canShowFollowups = response.followupActions.length > 0;
  const microStepCount = Math.max(microSteps.length, 1);
  const praiseNotes = response.praiseNotes?.length ? response.praiseNotes : [response.praise];
  const currentPraise = praiseNotes[praiseIndex % praiseNotes.length];

  useEffect(() => {
    setMicroStep(0);
    setMicroDone(false);
    setPraiseIndex(0);
    setSavedOnce(false);
  }, [response]);

  useEffect(() => {
    if (!activePanel) return;
    window.setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 40);
  }, [activePanel]);

  function advanceMicroTool() {
    if (microStep >= microSteps.length - 1) {
      setMicroDone(true);
      return;
    }
    setMicroStep((step) => step + 1);
  }

  return (
    <section className={`response-card ${isCrisis ? "response-card-crisis" : ""}`} aria-live="polite">
      <div className="reply-meta">
        <span>{response.careTitle ?? "給值班後的你"}</span>
        <i aria-hidden="true" />
      </div>

      <div className="chat-message">
        {response.message.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="support-strip" aria-label="櫃檯回信">
        <div className="praise-ticket">
          <span>{isCrisis ? "先不要一個人" : "今晚替你記一筆"}</span>
          <p>{isCrisis ? response.praise : currentPraise}</p>
          {!isCrisis && praiseNotes.length > 1 && (
            <button type="button" onClick={() => setPraiseIndex((index) => index + 1)}>
              再被看見一點
            </button>
          )}
        </div>
        <div className="next-breath">
          <span>{isCrisis ? "現在先做這件事" : "下一口氣"}</span>
          <p>{response.tinyAction}</p>
        </div>
      </div>

      {canShowFollowups && (
        <div className="followups" aria-label="後續互動">
          <button
            type="button"
            className={savedOnce ? "saved" : ""}
            onClick={() => {
              onSave();
              setSavedOnce(true);
            }}
          >
            {savedOnce ? "已收下" : "收下回信"}
          </button>
          {response.followupActions.map((action) => (
            <button
              type="button"
              key={action}
              className={activePanel === action ? "active" : ""}
              onClick={() => onPanel(action)}
            >
              {actionLabels[action]}
            </button>
          ))}
        </div>
      )}

      {response.gentleQuestion && !isCrisis && (
        <div className="gentle-question">
          <span>留給等一下的你</span>
          <p>{response.gentleQuestion}</p>
        </div>
      )}

      {hasMicroTool && response.microTool && (
        <div className="micro-tool">
          <div>
            <span>櫃檯陪你坐 {response.microTool.durationSeconds} 秒</span>
            <h3>{response.microTool.title}</h3>
          </div>
          <div className="micro-progress" aria-hidden="true">
            <i style={{ width: `${microDone ? 100 : ((microStep + 1) / microStepCount) * 100}%` }} />
          </div>
          {microDone ? (
            <p className="micro-complete">{response.microTool.completionText}</p>
          ) : (
            <p className="micro-step">{microSteps[microStep]}</p>
          )}
          <div className="micro-actions">
            {!microDone && (
              <button type="button" onClick={() => setMicroDone(true)}>
                先跳過
              </button>
            )}
            <button type="button" onClick={microDone ? undefined : advanceMicroTool} disabled={microDone}>
              {microDone ? "坐一下就好" : microStep >= microSteps.length - 1 ? "收尾" : "下一句"}
            </button>
          </div>
        </div>
      )}

      {response.closingLine && <p className="closing-line">{response.closingLine}</p>}

      {activePanel === "song" && response.song && (
        <div className="feature-panel music-panel" ref={panelRef}>
          <div className="music-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <span>今晚櫃檯放這首</span>
          <h3>
            {response.song.title} · {response.song.artist}
          </h3>
          <p>{response.song.reason}</p>
        </div>
      )}

      {activePanel === "card" && response.card && (
        <div className="feature-panel card-panel" ref={panelRef}>
          <div className="symbol-card" aria-hidden="true">
            <div />
          </div>
          <span>紙籤上寫著</span>
          <h3>{response.card.name}</h3>
          <p>{response.card.meaning}</p>
          <p>{response.card.reflection}</p>
          <small>娛樂與反思用，不是預測或專業建議。給今天一個角度，不替你決定答案。</small>
        </div>
      )}

      {activePanel === "astro" && response.astro && (
        <div className="feature-panel astro-panel" ref={panelRef}>
          <div className="astro-mark" aria-hidden="true">
            <i />
          </div>
          <h3>{response.astro.name}</h3>
          {response.astro.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <small>娛樂與反思用，不是預測或專業建議。給今天一個角度，不替你決定答案。</small>
        </div>
      )}
    </section>
  );
}
