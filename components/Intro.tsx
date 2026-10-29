"use client";

import React, { useEffect, useState } from "react";

interface IntroProps {
  helloText: string;
  nameText: string;
  subtitleText: string;
  buttonText: string;
  started: boolean;
  onOpen: () => void;
}

export function Intro({
  helloText,
  nameText,
  subtitleText,
  buttonText,
  started,
  onOpen,
}: IntroProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Memberikan waktu sedikit agar animasi CSS stagger berjalan mulus
    const timer = setTimeout(() => {
      setReady(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className={`intro ${started ? "out" : ""}`}
      aria-hidden={started}
    >
      <h1
        className={`hello ${ready ? "ready" : ""}`}
        aria-label={`${helloText} ${nameText}`}
      >
        <span className="hello__line">
          {[...helloText].map((ch, i) => (
            <span
              key={i}
              style={{ "--i": i } as React.CSSProperties}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
        <span className="hello__name">
          {[...nameText].map((ch, i) => (
            <span
              key={i}
              style={{ "--i": i + helloText.length } as React.CSSProperties}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      </h1>

      <p className="sub">{subtitleText}</p>

      <button
        className="open"
        type="button"
        onClick={onOpen}
      >
        <span>{buttonText}</span>
        <i aria-hidden="true">💗</i>
      </button>
    </section>
  );
}
