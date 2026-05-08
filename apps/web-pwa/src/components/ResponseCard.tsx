import { useEffect, useState } from "react";
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
  const microSteps = response.microTool?.steps ?? [];
  const hasMicroTool = Boolean(response.microTool && !isCrisis);
  const canShowFollowups = response.followupActions.length > 0 && (!hasMicroTool || microDone);
  const microStepCount = Math.max(microSteps.length, 1);

  useEffect(() => {
    setMicroStep(0);
    setMicroDone(false);
  }, [response]);

  function advanceMicroTool() {
    if (microStep >= microSteps.length - 1) {
      setMicroDone(true);
      return;
    }
    setMicroStep((step) => step + 1);
  }

  return (
    <section className={`response-card ${isCrisis ? "response-card-crisis" : ""}`} aria-live="polite">
      <div className="chat-message">
        {response.message.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="support-strip" aria-label="櫃檯回信">
        {isCrisis && <span>先不要一個人</span>}
        <p>{response.praise}</p>
        {isCrisis && <span>現在先做這件事</span>}
        <p>{response.tinyAction}</p>
      </div>

      {response.microTool && !isCrisis && (
        <div className="micro-tool">
          <div>
            <span>店裡陪你坐 {response.microTool.durationSeconds} 秒</span>
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

      {canShowFollowups && (
        <div className="followups" aria-label="後續互動">
          <button type="button" onClick={onSave}>
            夾進口袋
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

      {activePanel === "song" && response.song && (
        <div className="feature-panel music-panel">
          <span>今晚櫃檯放這首</span>
          <h3>
            {response.song.title} · {response.song.artist}
          </h3>
          <p>{response.song.reason}</p>
        </div>
      )}

      {activePanel === "card" && response.card && (
        <div className="feature-panel card-panel">
          <div className="symbol-card" aria-hidden="true">
            <div />
          </div>
          <span>紙籤上寫著</span>
          <h3>{response.card.name}</h3>
          <p>{response.card.meaning}</p>
          <p>{response.card.reflection}</p>
          <small>給今天一個角度，不替你決定答案。</small>
        </div>
      )}

      {activePanel === "astro" && response.astro && (
        <div className="feature-panel astro-panel">
          <div className="astro-mark" aria-hidden="true">
            <i />
          </div>
          <h3>{response.astro.name}</h3>
          {response.astro.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <small>給今天一個角度，不替你決定答案。</small>
        </div>
      )}
    </section>
  );
}
