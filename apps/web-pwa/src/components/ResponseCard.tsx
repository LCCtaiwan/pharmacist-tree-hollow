import { useEffect, useRef, useState } from "react";
import type { ConversationResponse, FollowupAction } from "@pharmacist-tree-hollow/shared";

const actionCopy: Record<FollowupAction, { title: string; detail: string }> = {
  song: { title: "收音機", detail: "聽一首適合現在的歌" },
  card: { title: "紙籤盒", detail: "抽一張反思用的小紙籤" },
  astro: { title: "窗邊星光", detail: "看一段今日狀態提醒" }
};

export function ResponseCard({
  response,
  activePanel,
  onPanel,
  onSave,
  onNewNote,
  onMicroChange
}: {
  response: ConversationResponse;
  activePanel: FollowupAction | null;
  onPanel: (panel: FollowupAction) => void;
  onSave: () => void;
  onNewNote: () => void;
  onMicroChange?: (active: boolean) => void;
}) {
  const isCrisis = response.riskLevel === "crisis";
  const [microStep, setMicroStep] = useState(0);
  const [microDone, setMicroDone] = useState(false);
  const [praiseIndex, setPraiseIndex] = useState(0);
  const [savedOnce, setSavedOnce] = useState(false);
  const [showAftercare, setShowAftercare] = useState(response.followupActions.length > 0);
  const [showMicroTool, setShowMicroTool] = useState(false);
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
    setShowAftercare(response.followupActions.length > 0);
    setShowMicroTool(false);
  }, [response]);

  useEffect(() => {
    onMicroChange?.(showMicroTool && !microDone);
  }, [microDone, onMicroChange, showMicroTool]);

  useEffect(() => {
    if (!activePanel) return;
    window.setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 40);
  }, [activePanel]);

  function advanceMicroTool() {
    if (microStep >= microSteps.length - 1) {
      setMicroDone(true);
      return;
    }
    setMicroStep((step) => step + 1);
  }

  function selectPanel(panel: FollowupAction) {
    setShowAftercare(true);
    setShowMicroTool(false);
    onPanel(panel);
  }

  function showThirtySeconds() {
    if (activePanel) {
      onPanel(activePanel);
    }
    setShowAftercare(true);
    setShowMicroTool((current) => !current);
  }

  return (
    <section className={`response-card ${isCrisis ? "response-card-crisis" : ""} ${showAftercare ? "response-card-aftercare" : ""}`} aria-live="polite">
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

      {canShowFollowups && !showAftercare && (
        <button type="button" className="aftercare-open" onClick={() => setShowAftercare(true)}>
          還想留一下
        </button>
      )}

      {canShowFollowups && showAftercare && (
        <div className="aftercare" aria-label="可以繼續留下的方式">
          <span>接著可以選一個，不用做完</span>
          <div className="followups npc-row">
            <button
              type="button"
              className={`npc-button npc-save ${savedOnce ? "saved" : ""}`}
              onClick={() => {
                onSave();
                setSavedOnce(true);
              }}
            >
              <i aria-hidden="true" />
              <span>
                <strong>{savedOnce ? "已收下" : "收下回信"}</strong>
                <small>{savedOnce ? "已放進回顧清單" : "把這段回信放進回顧"}</small>
              </span>
            </button>
            {hasMicroTool && (
              <button
                type="button"
                className={`npc-button npc-light ${showMicroTool ? "active" : ""}`}
                onClick={showThirtySeconds}
              >
                <i aria-hidden="true" />
                <span>
                  <strong>小燈</strong>
                  <small>30 秒跟著句子喘口氣</small>
                </span>
              </button>
            )}
            {response.followupActions.map((action) => {
              const copy = actionCopy[action];

              return (
                <button
                  type="button"
                  key={action}
                  className={`npc-button npc-${action} ${activePanel === action ? "active" : ""}`}
                  onClick={() => selectPanel(action)}
                >
                  <i aria-hidden="true" />
                  <span>
                    <strong>{copy.title}</strong>
                    <small>{copy.detail}</small>
                  </span>
                </button>
              );
            })}
          </div>

          {showMicroTool && hasMicroTool && response.microTool && (
            <div className="focus-panel micro-tool" ref={panelRef}>
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

          {activePanel === "song" && response.song && (
            <div className="focus-panel feature-panel music-panel" ref={panelRef}>
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
            <div className="focus-panel feature-panel card-panel" ref={panelRef}>
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
            <div className="focus-panel feature-panel astro-panel" ref={panelRef}>
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
        </div>
      )}

      {response.gentleQuestion && !isCrisis && showAftercare && (
        <div className="gentle-question">
          <span>留給等一下的你</span>
          <p>{response.gentleQuestion}</p>
        </div>
      )}

      {response.closingLine && showAftercare && <p className="closing-line">{response.closingLine}</p>}

      {!isCrisis && (
        <button type="button" className="new-note-button" onClick={onNewNote}>
          再投一張紙條
        </button>
      )}
    </section>
  );
}
