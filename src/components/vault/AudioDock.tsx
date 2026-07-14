"use client";

import { usePlayer, formatTime } from "./AudioProvider";
import styles from "./Player.module.css";

/**
 * The persistent mini-player — a glass bar that appears once a track is
 * loaded and survives navigation anywhere in the portal (sticky bottom
 * bar on mobile, spec §16).
 */
export default function AudioDock() {
  const { track, playing, position, duration, toggle, skip } = usePlayer();
  if (!track) return null;

  const progress = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className={styles.dock} role="region" aria-label="Now playing">
      <div className={styles.dockProgress} aria-hidden>
        <div className={styles.dockProgressFill} style={{ width: `${progress}%` }} />
      </div>
      <div className={styles.dockInner}>
        <div className={styles.dockMeta}>
          <p className={styles.dockTitle}>{track.title}</p>
          <p className={styles.dockSub}>
            {track.moduleTitle} — {track.movement}
          </p>
        </div>
        <div className={styles.dockControls}>
          <button
            className={styles.skipBtn}
            aria-label="Back 15 seconds"
            onClick={() => skip(-15)}
          >
            −15
          </button>
          <button
            className={`${styles.playBtn} ${styles.playBtnSmall}`}
            aria-label={playing ? "Pause" : "Play"}
            onClick={toggle}
          >
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
                <rect x="3" y="2" width="3.5" height="12" fill="currentColor" />
                <rect x="9.5" y="2" width="3.5" height="12" fill="currentColor" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
                <path d="M4 2 L14 8 L4 14 Z" fill="currentColor" />
              </svg>
            )}
          </button>
          <button
            className={styles.skipBtn}
            aria-label="Forward 15 seconds"
            onClick={() => skip(15)}
          >
            +15
          </button>
        </div>
        <span className={`${styles.time} ${styles.dockTime}`}>
          {formatTime(position)} / {duration ? formatTime(duration) : "–:––"}
        </span>
      </div>
    </div>
  );
}
