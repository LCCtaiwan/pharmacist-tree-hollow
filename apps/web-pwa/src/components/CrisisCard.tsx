import type { AILetterResponse } from "@pharmacist-tree-hollow/shared";

const HOTLINES: Array<{ number: string; name: string; hours: string }> = [
  { number: "1925", name: "安心專線", hours: "24 小時" },
  { number: "1995", name: "生命線", hours: "24 小時" },
  { number: "1980", name: "張老師專線", hours: "週一至週六" }
];

export function CrisisCard({
  letter,
  onNewNote
}: {
  letter: AILetterResponse;
  onNewNote: () => void;
}) {
  return (
    <article className="crisis-card" aria-live="polite">
      <header className="crisis-card-header">
        <span className="crisis-card-stamp">先聽見你</span>
        {letter.careTitle && <h2 className="crisis-card-subject">{letter.careTitle}</h2>}
      </header>

      <div className="crisis-card-body">
        {letter.hold && <p className="crisis-card-hold">{letter.hold}</p>}

        <p className="crisis-card-prompt">這句話太重了。今晚先讓一個願意陪你的人接住你。</p>

        <ul className="crisis-card-hotlines">
          {HOTLINES.map((line) => (
            <li key={line.number}>
              <a href={`tel:${line.number}`} className="crisis-card-hotline-link">
                <span className="crisis-card-hotline-number">{line.number}</span>
                <span className="crisis-card-hotline-meta">
                  {line.name}・{line.hours}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="crisis-card-signoff">—— 燈還亮著</p>
      </div>

      <div className="crisis-card-actions">
        <button type="button" className="btn-paper" onClick={onNewNote}>
          再投一張紙條
        </button>
      </div>
    </article>
  );
}
