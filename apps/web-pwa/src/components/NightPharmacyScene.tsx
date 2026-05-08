import type { MoodTag } from "@pharmacist-tree-hollow/shared";

const tokenClass: Record<MoodTag, string> = {
  累: "token token-leaf",
  委屈: "token token-drop",
  煩: "token token-bag",
  空: "token token-star",
  緊繃: "token token-light",
  想哭: "token token-drop",
  還可以: "token token-leaf"
};

export function NightPharmacyScene({
  mood,
  quiet = false,
  depositing = false
}: {
  mood: MoodTag;
  quiet?: boolean;
  depositing?: boolean;
}) {
  return (
    <section
      className={`scene ${quiet ? "scene-quiet" : ""} ${depositing ? "scene-depositing" : ""}`}
      aria-label="深夜藥局櫃檯旁的安靜樹洞"
    >
      <div className="shop-sign" aria-hidden="true">OPEN</div>
      <div className="pharmacy-window" aria-hidden="true">
        <div className="counter-line" />
        <div className="coat-shape" />
      </div>
      <div className="tree">
        <div className="tree-crown" />
        <div className="trunk">
          <div className="hollow" />
        </div>
      </div>
      <div className="paper-bag bag-one" aria-hidden="true" />
      <div className="paper-bag bag-two" aria-hidden="true" />
      <div className="letter-slot" aria-hidden="true" />
      <div className="star star-one" aria-hidden="true" />
      <div className="star star-two" aria-hidden="true" />
      <div className={tokenClass[mood]} aria-hidden="true" />
    </section>
  );
}
