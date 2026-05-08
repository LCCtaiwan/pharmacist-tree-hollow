import type { ConversationResponse, FollowupAction } from "@pharmacist-tree-hollow/shared";

const actionLabels: Record<FollowupAction, string> = {
  song: "給這一刻一首歌",
  card: "抽一張牌",
  astro: "換個星象角度"
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

  return (
    <section className={`response-card ${isCrisis ? "response-card-crisis" : ""}`} aria-live="polite">
      <div className="chat-message">
        {response.message.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="support-strip" aria-label="整理一下">
        <div>
          <span>{isCrisis ? "先不要一個人" : "我想先肯定你"}</span>
          <p>{response.praise}</p>
        </div>
        <div>
          <span>{isCrisis ? "現在先做這件事" : "先做一件小事"}</span>
          <p>{response.tinyAction}</p>
        </div>
      </div>

      {response.microTool && !isCrisis && (
        <div className="micro-tool">
          <div>
            <span>一起停 {response.microTool.durationSeconds} 秒</span>
            <h3>{response.microTool.title}</h3>
          </div>
          <ol>
            {response.microTool.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>{response.microTool.completionText}</p>
        </div>
      )}

      {response.followupActions.length > 0 && (
        <div className="followups" aria-label="後續互動">
          <button type="button" onClick={onSave}>
            收下這句
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
          <span>給這一刻一首歌</span>
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
          <span>抽一張牌</span>
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
