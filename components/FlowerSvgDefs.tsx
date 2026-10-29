import React from "react";

export function FlowerSvgDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
      className="pointer-events-none"
    >
      <defs>
        <linearGradient id="pg1" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff5c9d" />
          <stop offset="0.55" stopColor="#ff8fbd" />
          <stop offset="1" stopColor="#ffd3e5" />
        </linearGradient>
        <linearGradient id="pg2" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff3d8b" />
          <stop offset="0.5" stopColor="#ff77ae" />
          <stop offset="1" stopColor="#ffc1da" />
        </linearGradient>
        <linearGradient id="pg3" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e8307e" />
          <stop offset="0.5" stopColor="#ff5fa2" />
          <stop offset="1" stopColor="#ffb0d0" />
        </linearGradient>
        <linearGradient id="pgIn" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#d81b72" />
          <stop offset="1" stopColor="#ff7fb5" />
        </linearGradient>
        <radialGradient id="pgCore" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff0f6" />
          <stop offset="0.6" stopColor="#ffb3d1" />
          <stop offset="1" stopColor="#ff7fb5" />
        </radialGradient>
        <linearGradient id="stemG" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#1f7a57" />
          <stop offset="1" stopColor="#5fd39a" />
        </linearGradient>
      </defs>
    </svg>
  );
}
