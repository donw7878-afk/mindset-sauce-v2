"use client";

import { usePlayer, formatTime, type PlayableTrack } from "./AudioProvider";
import styles from "./Player.module.css";

/**
 * The built-in player, spec §9 — bound to one track. When another track
 * owns the engine, this card shows its own track's saved position and a
 * play button that takes over.
 */

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <rect x="3" y="2" width="3.5" height="12" fill="currentColor" />
      <rect x="9.5" y="2" width="3.5" height="12" fill="currentColor" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path d="M4 2 L14 8 L4 14 Z" fill="currentColor" />
    </svg>
  );
}

function SkipIcon({ back }: { back?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden
      style={back ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M9 3 a6 6 0 1 1 -6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M9 0.5 L12 3 L9 5.5 Z" fill="currentColor" />
      <text
        x="9"
        y="11.5"
        textAnchor="middle"
        fontSize="6.5"
        fill="currentColor"
        style={back ? { transform: "scaleX(-1)", transformOrigin: "center" } : undefined}
      >
        15
      </text>
    </svg>
  );
}

export default function AudioPlayer({ track }: { track: PlayableTrack }) {
  const player = usePlayer();
  const isCurrent = player.track?.id === track.id;
  const playing = isCurrent && player.playing;
  const position = isCurrent ? player.position : player.positions[track.id] ?? 0;
  const duration = isCurrent && player.duration ? player.duration : 0;
  const progress = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className={styles.player}>
      <div className={styles.trackHead}>
        <div>
          <p className={styles.trackTitle}>{track.title}</p>
          <p className={styles.trackSub}>
            {track.moduleTitle} — {track.movement} · {track.meta}
          </p>
        </div>
      </div>

      <div
        className={styles.progressTrack}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration || 100}
        aria-valuenow={position}
        tabIndex={0}
        onClick={(e) => {
          if (!isCurrent || !duration) return;
          const rect = e.currentTarget.getBoundingClientRect();
          player.seek(((e.clientX - rect.left) / rect.width) * duration);
        }}
        onKeyDown={(e) => {
          if (!isCurrent) return;
          if (e.key === "ArrowRight") player.skip(5);
          if (e.key === "ArrowLeft") player.skip(-5);
        }}
      >
        <div className={styles.progressFill} style={{ width: `${progress}%` }}>
          <span className={styles.scrubber} />
        </div>
      </div>

      <div className={styles.controls}>
        <span className={styles.time}>{formatTime(position)}</span>
        <div className={styles.transport}>
          <button
            className={styles.skipBtn}
            aria-label="Back 15 seconds"
            onClick={() => isCurrent && player.skip(-15)}
          >
            <SkipIcon back />
          </button>
          <button
            className={styles.playBtn}
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => player.play(track)}
          >
            <PlayIcon playing={playing} />
          </button>
          <button
            className={styles.skipBtn}
            aria-label="Forward 15 seconds"
            onClick={() => isCurrent && player.skip(15)}
          >
            <SkipIcon />
          </button>
        </div>
        <span className={styles.time}>
          {duration ? formatTime(duration) : "–:––"}
        </span>
      </div>

      <div className={styles.volumeRow}>
        <span className={styles.volumeLabel} aria-hidden>
          vol
        </span>
        <input
          className={styles.volume}
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={player.volume}
          aria-label="Volume"
          onChange={(e) => player.setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
