"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll wired into GSAP's ticker so ScrollTrigger and
 * Lenis share one clock. Config per design-system-spec §12:
 * lerp 0.08 (heavy, cinematic), duration 1.2, touchMultiplier 2.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      orientation: "vertical",
      gestureOrientation: "vertical",
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    if (process.env.NODE_ENV !== "production") {
      // Debug hook: lets tooling inspect trigger ranges in dev.
      (window as unknown as { ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger =
        ScrollTrigger;
    }

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Late image loads (lazy covers, slow networks) change the page
    // height AFTER ScrollTrigger measured it, dragging every pin range
    // out of alignment. Re-measure once the late arrivals settle.
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const queueRefresh = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
    };
    const pending = Array.from(document.images).filter((img) => !img.complete);
    pending.forEach((img) => {
      img.addEventListener("load", queueRefresh, { once: true });
      img.addEventListener("error", queueRefresh, { once: true });
    });
    window.addEventListener("load", queueRefresh);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener("load", queueRefresh);
      pending.forEach((img) => {
        img.removeEventListener("load", queueRefresh);
        img.removeEventListener("error", queueRefresh);
      });
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
