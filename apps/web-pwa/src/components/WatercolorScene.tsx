import { useEffect, useState } from "react";
import type { FollowupAction, MoodTag } from "@pharmacist-tree-hollow/shared";

export type SceneState = "idle" | "writing" | "thinking" | "depositing" | "responding";

export interface WatercolorSceneProps {
  mood: MoodTag;
  state: SceneState;
  activePanel: FollowupAction | null;
  microActive: boolean;
  savedCount: number;
  crisis: boolean;
}

export function WatercolorScene({ mood, state, activePanel, microActive, savedCount, crisis }: WatercolorSceneProps) {
  const imageSrc = crisis ? "/art/scene-crisis.png" : "/art/scene-main.png";
  const [imageFailed, setImageFailed] = useState(false);
  const [moodVisible, setMoodVisible] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageSrc]);

  useEffect(() => {
    setMoodVisible(false);
    const frame = window.requestAnimationFrame(() => {
      setMoodVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [mood]);

  return (
    <section
      className={[
        "scene-watercolor",
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

      <img
        key={mood}
        className="scene-mood-pet"
        src={`/art/mood-${mood}.png`}
        alt=""
        aria-hidden="true"
        style={{ opacity: moodVisible ? 0.85 : 0 }}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />

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

      {savedCount > 0 && (
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
