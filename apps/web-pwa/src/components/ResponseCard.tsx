import { useEffect, useState } from "react";
import type { ConversationResponse } from "@pharmacist-tree-hollow/shared";

export function ResponseCard({
  response,
  onSave,
  onNewNote
}: {
  response: ConversationResponse;
  onSave: () => void;
  onNewNote: () => void;
}) {
  const isCrisis = response.riskLevel === "crisis";
  const [savedOnce, setSavedOnce] = useState(false);
  const [praiseIndex, setPraiseIndex] = useState(0);
  const praiseNotes = response.praiseNotes?.length ? response.praiseNotes : [response.praise];
  const currentPraise = praiseNotes[praiseIndex % praiseNotes.length];

  useEffect(() => {
    setSavedOnce(false);
    setPraiseIndex(0);
  }, [response]);

  function handleSave() {
    onSave();
    setSavedOnce(true);
  }

  function nextPraise() {
    setPraiseIndex((index) => index + 1);
  }

  return (
    <article className={`letter-card ${isCrisis ? "letter-card-crisis" : ""}`} aria-live="polite">
      <header className="letter-header">
        <span className="letter-stamp">{isCrisis ? "先聽見你" : "樹洞回信"}</span>
        {response.careTitle && <h2 className="letter-subject">{response.careTitle}</h2>}
      </header>

      <div className="letter-body">
        {response.message.map((line, index) => (
          <p key={`m-${index}`}>{line}</p>
        ))}

        <p className="letter-praise">{currentPraise}</p>
        {!isCrisis && praiseNotes.length > 1 && (
          <button type="button" className="letter-cycle" onClick={nextPraise}>
            再誇我一句
          </button>
        )}

        <p className="letter-action">{response.tinyAction}</p>

        {response.gentleQuestion && !isCrisis && (
          <p className="letter-question">{response.gentleQuestion}</p>
        )}

        {response.closingLine && (
          <p className="letter-closing">{response.closingLine}</p>
        )}
      </div>

      <footer className="letter-footer">
        <span className="letter-signature">— 樹洞</span>
      </footer>

      <div className="letter-actions">
        <button type="button" className="btn-text" onClick={handleSave} disabled={savedOnce}>
          {savedOnce ? "已收下 ✓" : "收下這封信"}
        </button>
        <button type="button" className="btn-paper" onClick={onNewNote}>
          再投一張紙條
        </button>
      </div>
    </article>
  );
}
