"use client";

import { useEffect, useState } from "react";

/** Time-aware Garamond greeting — computed in the Builder's timezone. */
export default function Greeting({ name }: { name: string }) {
  const first = name.trim().split(/\s+/)[0] || "Builder";
  // Render a time-neutral greeting on the server, refine after hydration.
  const [word, setWord] = useState("Welcome back");
  useEffect(() => {
    const h = new Date().getHours();
    setWord(h < 5 ? "Late hours" : h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening");
  }, []);
  return (
    <>
      {word}, <span className="goldWord">{first}</span>.
    </>
  );
}
