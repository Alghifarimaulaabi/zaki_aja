"use client";

import React, { useEffect, useState } from "react";

interface MessageProps {
  started: boolean;
  title: string;
  body: string;
  hint: string;
}

export function Message({ started, title, body, hint }: MessageProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => {
      setShow(true);
    }, 5200);

    return () => clearTimeout(timer);
  }, [started]);

  return (
    <section className={`message ${show ? "show" : ""}`}>
      <h2>{title}</h2>
      <p>{body}</p>
      <small>{hint}</small>
    </section>
  );
}
