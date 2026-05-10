import { useEffect, useState } from "react";
import type { FollowupAction, StationType } from "@pharmacist-tree-hollow/shared";

export type SceneState = "idle" | "writing" | "thinking" | "depositing" | "responding";

export interface WatercolorSceneProps {
  state: SceneState;
  activePanel: FollowupAction | null;
  microActive: boolean;
  savedCount: number;
  crisis: boolean;
  showHotspots?: boolean;
  onStationSelect?: (station: StationType) => void;
}

const sceneHotspots: Array<{
  station: StationType;
  label: string;
  object: string;
  className: string;
}> = [
  { station: "vent", label: "說一說", object: "樹洞", className: "scene-hotspot-hollow" },
  { station: "saved", label: "看回顧", object: "小窩", className: "scene-hotspot-nest" },
  { station: "reflection", label: "想一下", object: "枝頭", className: "scene-hotspot-owl" },
  { station: "astro", label: "抽一張", object: "星光", className: "scene-hotspot-stars" },
  { station: "breathing", label: "喘口氣", object: "花草", className: "scene-hotspot-flowers" },
  { station: "song", label: "聽一首", object: "小屋", className: "scene-hotspot-house" },
  { station: "quote", label: "讀一句", object: "草地", className: "scene-hotspot-meadow" }
];

export function WatercolorScene({
  state,
  activePanel,
  microActive,
  savedCount,
  crisis,
  showHotspots = false,
  onStationSelect
}: WatercolorSceneProps) {
  const imageSrc = crisis ? "/art/scene-crisis.png" : "/art/scene-main.png";
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageSrc]);

  return (
    <section
      className={[
        "scene-watercolor",
        showHotspots ? "scene-watercolor-entry" : "",
        crisis ? "scene-watercolor-crisis" : "",
        microActive && !crisis ? "scene-watercolor-breathing" : ""
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="水彩藥師樹洞"
    >
      {imageFailed ? (
        <div className="scene-fallback">樹洞還在準備中</div>
      ) : (
        <img className="scene-bg" src={imageSrc} alt="" aria-hidden="true" onError={() => setImageFailed(true)} />
      )}

      {!crisis && showHotspots && (
        <img
          className="scene-grass-note"
          src="/art/grass-quote.png"
          alt=""
          aria-hidden="true"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}

      {showHotspots && onStationSelect && (
        <div className="scene-entry-layer" aria-label="點一個物件，做不同的事">
          {sceneHotspots.map((hotspot) => (
            <button
              type="button"
              key={hotspot.station}
              className={`scene-hotspot ${hotspot.className}`}
              onClick={() => onStationSelect(hotspot.station)}
              aria-label={`點${hotspot.object}：${hotspot.label}`}
            >
              <span>{hotspot.object}</span>
              <strong>{hotspot.label}</strong>
            </button>
          ))}
        </div>
      )}

      {state === "writing" && <div className="scene-hollow-glow scene-hollow-glow-soft" aria-hidden="true" />}
      {state === "thinking" && <div className="scene-hollow-glow scene-hollow-glow-thinking" aria-hidden="true" />}

      {state === "depositing" && (
        <img
          className="scene-letter-deposit"
          src="/art/letter-paper.png"
          alt=""
          aria-hidden="true"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}

      {state === "responding" && (
        <img
          className="scene-letter-return"
          src="/art/letter-paper.png"
          alt=""
          aria-hidden="true"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}

      {showHotspots && savedCount > 0 && (
        <div className="scene-saved-shelf" aria-hidden="true">
          {Array.from({ length: Math.min(savedCount, 8) }).map((_, index) => (
            <i key={index} className="scene-saved-note" />
          ))}
        </div>
      )}

      {activePanel === "song" && (
        <div className="scene-window-music" aria-hidden="true">
          <div className="scene-window-glow-strong" />
          <svg className="scene-music-note scene-music-note-1" viewBox="0 0 24 24" focusable="false">
            <path d="M14 4v10.6a3.2 3.2 0 1 1-1.5-2.7V7.2l7-1.7v8.1a3.2 3.2 0 1 1-1.5-2.7V4z" />
          </svg>
          <svg className="scene-music-note scene-music-note-2" viewBox="0 0 24 24" focusable="false">
            <path d="M14 4v10.6a3.2 3.2 0 1 1-1.5-2.7V7.2l7-1.7v8.1a3.2 3.2 0 1 1-1.5-2.7V4z" />
          </svg>
          <svg className="scene-music-note scene-music-note-3" viewBox="0 0 24 24" focusable="false">
            <path d="M14 4v10.6a3.2 3.2 0 1 1-1.5-2.7V7.2l7-1.7v8.1a3.2 3.2 0 1 1-1.5-2.7V4z" />
          </svg>
        </div>
      )}

      {activePanel === "card" && (
        <img
          className="scene-tree-card"
          src="/art/letter-paper.png"
          alt=""
          aria-hidden="true"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}

      {activePanel === "astro" && (
        <div className="scene-stars" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, index) => (
            <i key={index} className="scene-star" />
          ))}
        </div>
      )}
    </section>
  );
}
