import React from "react";

// Deterministic pseudo-random generation to avoid SSR hydration mismatches
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const STARS_COUNT = 60;
const STARS_DATA = Array.from({ length: STARS_COUNT }, (_, i) => {
  const left = (pseudoRandom(i * 4 + 1) * 100).toFixed(2);
  const top = (pseudoRandom(i * 4 + 2) * 100).toFixed(2);
  const sz = (1.5 + pseudoRandom(i * 4 + 3) * 2.0).toFixed(1);
  const d = (2.5 + pseudoRandom(i * 4 + 4) * 3.5).toFixed(1);
  const dl = (pseudoRandom(i * 4 + 5) * 6.0).toFixed(1);
  return { left, top, sz, d, dl };
});

export function Stars() {
  return (
    <div className="stars" aria-hidden="true">
      {STARS_DATA.map((star, idx) => (
        <i
          key={idx}
          className="star"
          style={
            {
              left: `${star.left}%`,
              top: `${star.top}%`,
              "--sz": `${star.sz}px`,
              "--d": `${star.d}s`,
              "--dl": `${star.dl}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
