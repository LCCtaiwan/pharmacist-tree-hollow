import { useEffect, useState } from "react";
import type { AILetterResponse } from "@pharmacist-tree-hollow/shared";

export function ResponseCard({
  letter,
  onSave,
  onNewNote
}: {
  letter: AILetterResponse;
  onSave: () => void;
  onNewNote: () => void;
}) {
  const [savedOnce, setSavedOnce] = useState(false);

  useEffect(() => {
    setSavedOnce(false);
  }, [letter]);

  function handleSave() {
    onSave();
    setSavedOnce(true);
  }

  return (
    <article className="letter-card" aria-live="polite">
      <header className="letter-header">
        <span className="letter-stamp">樹洞回信</span>
        {letter.careTitle && <h2 className="letter-subject">{letter.careTitle}</h2>}
      </header>

      <div className="letter-body">
        {letter.hold && <p>{letter.hold}</p>}

        {letter.praise && <p className="letter-praise">{letter.praise}</p>}
        {letter.praiseNotes.map((note) => (
          <p key={note} className="letter-praise-extend">{note}</p>
        ))}

        <p className="letter-signoff">—— 燈還亮著</p>
      </div>

      <p className="letter-disclosure">樹洞回信由 AI 協助撰寫，內容不會被保留訓練。</p>

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
