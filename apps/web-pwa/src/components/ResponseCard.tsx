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
  const praiseNotes = response.praiseNotes?.length ? response.praiseNotes : [];

  useEffect(() => {
    setSavedOnce(false);
  }, [response]);

  function handleSave() {
    onSave();
    setSavedOnce(true);
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

        <p className="letter-praise">{response.praise}</p>
        {praiseNotes.map((note) => (
          <p key={note} className="letter-praise-extend">{note}</p>
        ))}

        <p className="letter-signoff">—— 燈還亮著</p>
      </div>

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
