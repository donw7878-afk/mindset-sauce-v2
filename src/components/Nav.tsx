"use client";

import { useEffect, useState } from "react";
import { initSoundPref, setSoundEnabled, uiClick } from "@/lib/sound";
import styles from "./Nav.module.css";

/** Chapter markers inside the Institution — not website links. */
const LINKS = [
  { label: "The Method", href: "#chambers", id: "chambers" },
  { label: "Inside the Vault", href: "#inventory", id: "inventory" },
  { label: "The Builders", href: "#builders", id: "builders" },
  { label: "The Exchange", href: "#exchange", id: "exchange" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [sound, setSound] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    setSound(initSoundPref());
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy: the chapter currently on stage is quietly highlighted
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Restrained tactile click on primary/secondary buttons (opt-in sound)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(".btnPrimary, .btnSecondary");
      if (el) uiClick();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundEnabled(next);
  };

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        {/* The brand mark itself — the brush "Sauce" only ever appears via the logo asset */}
        <a href="#top" className={styles.brand} aria-label="The Mindset Sauce Institute — return to the threshold">
          <img src="/images/logo.png" alt="The Mindset Sauce" className={styles.logoImg} />
          <span className={styles.institute}>Institute™</span>
        </a>

        <nav className={styles.links} aria-label="Chapters">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`${styles.link} ${active === l.id ? styles.active : ""}`}
              aria-current={active === l.id ? "true" : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.right}>
          <button
            className={styles.sound}
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={sound ? "Mute vault sound" : "Enable vault sound"}
            title={sound ? "Sound on" : "Sound off"}
          >
            {sound ? "Sound On" : "Sound Off"}
          </button>
          <a
            href="/login"
            className={styles.login}
            aria-label="Builder Login — returning Builders enter here"
          >
            Builder Login
          </a>
          <a href="#exchange" className={`btnPrimary ${styles.cta}`}>
            Enter the Institute
          </a>
        </div>
      </div>
    </header>
  );
}
