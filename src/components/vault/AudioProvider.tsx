"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

/**
 * The vault's one audio engine. A single <audio> element lives here so
 * playback survives navigation inside the portal; every player UI
 * (dashboard card, chamber rows, Audio Vault, the dock) drives it
 * through this context.
 *
 * Positions: seeded from the server, updated locally, persisted every
 * 5s while playing, on pause/track-change, and on tab hide via
 * sendBeacon — so any device resumes where the last one stopped.
 * A finished track posts chapter completion (the server enforces order).
 */

export interface PlayableTrack {
  id: string;
  module: number;
  chapter: number;
  movement: string;
  title: string;
  moduleTitle: string;
  meta: string;
}

interface PlayerContextValue {
  track: PlayableTrack | null;
  playing: boolean;
  position: number;
  duration: number;
  volume: number;
  positions: Record<string, number>;
  play: (track: PlayableTrack) => void;
  toggle: () => void;
  seek: (seconds: number) => void;
  skip: (delta: number) => void;
  setVolume: (v: number) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <AudioProvider>");
  return ctx;
}

export default function AudioProvider({
  initialPositions,
  children,
}: {
  initialPositions: Record<string, number>;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef<PlayableTrack | null>(null);
  const positionsRef = useRef<Record<string, number>>({ ...initialPositions });

  const [track, setTrack] = useState<PlayableTrack | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [positions, setPositions] = useState<Record<string, number>>({
    ...initialPositions,
  });

  const persist = useCallback((useBeacon = false) => {
    const audio = audioRef.current;
    const t = trackRef.current;
    if (!audio || !t) return;
    const payload = JSON.stringify({
      track: t.id,
      seconds: audio.currentTime,
      duration: audio.duration || undefined,
    });
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon("/api/vault/audio-position", payload);
    } else {
      fetch("/api/vault/audio-position", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, []);

  const rememberLocal = useCallback((id: string, seconds: number) => {
    positionsRef.current[id] = seconds;
    setPositions((p) => ({ ...p, [id]: seconds }));
  }, []);

  const ensureAudio = useCallback((): HTMLAudioElement => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = "metadata";

      audio.addEventListener("timeupdate", () => {
        setPosition(audio.currentTime);
        if (trackRef.current) {
          positionsRef.current[trackRef.current.id] = audio.currentTime;
        }
      });
      audio.addEventListener("durationchange", () => setDuration(audio.duration || 0));
      audio.addEventListener("play", () => setPlaying(true));
      audio.addEventListener("pause", () => {
        setPlaying(false);
        if (trackRef.current) {
          rememberLocal(trackRef.current.id, audio.currentTime);
          persist();
        }
      });
      audio.addEventListener("ended", async () => {
        setPlaying(false);
        const t = trackRef.current;
        if (!t) return;
        rememberLocal(t.id, 0);
        persist();
        // A finished chapter seals itself; the server enforces the order.
        try {
          const res = await fetch("/api/vault/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ module: t.module, chapter: t.chapter }),
          });
          if (res.ok) router.refresh();
        } catch {
          /* the Mark Complete button remains */
        }
      });
      audioRef.current = audio;
    }
    return audioRef.current;
  }, [persist, rememberLocal, router]);

  // Persist every 5s while playing; flush on tab hide/close.
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) persist();
    }, 5000);
    const onHide = () => {
      if (document.visibilityState === "hidden") persist(true);
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", () => persist(true));
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [persist]);

  const play = useCallback(
    (next: PlayableTrack) => {
      const audio = ensureAudio();
      if (trackRef.current?.id === next.id) {
        if (audio.paused) void audio.play();
        else audio.pause();
        return;
      }
      if (trackRef.current) persist();

      trackRef.current = next;
      setTrack(next);
      setDuration(0);
      audio.src = `/api/media/audio/${next.id}`;

      const saved = positionsRef.current[next.id] ?? 0;
      audio.addEventListener(
        "loadedmetadata",
        () => {
          // Resume where they left off — unless the track was finished.
          const resumeAt =
            saved > 1 && saved < (audio.duration || Infinity) - 5 ? saved : 0;
          audio.currentTime = resumeAt;
          setPosition(resumeAt);
        },
        { once: true }
      );
      void audio.play();
    },
    [ensureAudio, persist]
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !trackRef.current) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  }, []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(seconds, audio.duration || seconds));
    setPosition(audio.currentTime);
  }, []);

  const skip = useCallback(
    (delta: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      seek(audio.currentTime + delta);
    },
    [seek]
  );

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (audioRef.current) audioRef.current.volume = clamped;
  }, []);

  const value = useMemo(
    () => ({
      track,
      playing,
      position,
      duration,
      volume,
      positions,
      play,
      toggle,
      seek,
      skip,
      setVolume,
    }),
    [track, playing, position, duration, volume, positions, play, toggle, seek, skip, setVolume]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
