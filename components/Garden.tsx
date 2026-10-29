import React from "react";

function petalPath(L: number, W: number): string {
  return `M0 0C${-W} ${-L * 0.25} ${-W * 0.95} ${-L * 0.88} 0 ${-L}C${W * 0.95} ${-L * 0.88} ${W} ${-L * 0.25} 0 0Z`;
}

interface FlowerConfig {
  x: number;
  h: number;
  s: number;
  sw: number;
  t0: number;
  g: string;
  bend: number;
}

const FLOWERS: FlowerConfig[] = [
  { x: 50, h: 58, s: 36, sw: 5.2, t0: 0.0, g: "pg2", bend: 7.5 },
  { x: 27, h: 46, s: 29, sw: 6.0, t0: 0.5, g: "pg1", bend: -6.8 },
  { x: 73, h: 47, s: 30, sw: 5.6, t0: 0.8, g: "pg3", bend: 8.2 },
  { x: 10, h: 33, s: 22, sw: 6.4, t0: 1.2, g: "pg2", bend: -7.1 },
  { x: 90, h: 34, s: 23, sw: 5.9, t0: 1.5, g: "pg1", bend: 6.4 },
  { x: 38, h: 30, s: 20, sw: 4.8, t0: 1.9, g: "pg3", bend: -5.5 },
  { x: 62, h: 28, s: 19, sw: 5.1, t0: 2.2, g: "pg2", bend: 6.2 },
];

const LEAVES = [
  { p: 0.22, side: "r", r: 30 },
  { p: 0.38, side: "l", r: 30 },
  { p: 0.56, side: "r", r: 24 },
] as const;

function FlowerHead({ grad }: { grad: string }) {
  const rings = [
    { n: 8, L: 48, W: 17, off: 0, fill: `url(#${grad})` },
    { n: 8, L: 40, W: 15, off: 22.5, fill: `url(#${grad})` },
    { n: 6, L: 29, W: 12, off: 10, fill: "url(#pgIn)" },
    { n: 5, L: 18, W: 8, off: 36, fill: "url(#pg3)" },
  ];

  let kCounter = 0;

  return (
    <svg viewBox="-50 -50 100 100" className="w-full h-full">
      {rings.map((ring, ringIdx) => (
        <React.Fragment key={ringIdx}>
          {Array.from({ length: ring.n }).map((_, i) => {
            const rot = ring.off + (360 / ring.n) * i;
            const k = (kCounter++ * 0.6).toFixed(2);
            return (
              <g key={i} transform={`rotate(${rot})`}>
                <path
                  d={petalPath(ring.L, ring.W)}
                  fill={ring.fill}
                  stroke="rgba(255,255,255,.28)"
                  strokeWidth="0.5"
                  className="petal"
                  style={{ "--k": k } as React.CSSProperties}
                />
              </g>
            );
          })}
        </React.Fragment>
      ))}

      <g className="core">
        <circle r={7} fill="url(#pgCore)" />
        {Array.from({ length: 9 }).map((_, i) => {
          const a = (i / 9) * Math.PI * 2;
          const cx = Math.cos(a) * 11;
          const cy = Math.sin(a) * 11;
          return <circle key={i} cx={cx} cy={cy} r={1.5} fill="#fff0f6" />;
        })}
      </g>
    </svg>
  );
}

export function Garden() {
  return (
    <main className="garden" aria-hidden="true">
      {FLOWERS.map((f, idx) => {
        const gd = (1.6 + f.h / 60).toFixed(2);
        return (
          <div
            key={idx}
            className="flower"
            style={
              {
                "--x": `${f.x}%`,
                "--h": `${f.h}vh`,
                "--s": `calc(var(--u) * ${f.s})`,
                "--w": `calc(var(--u) * ${f.s * 0.55})`,
                "--sw": `${f.sw}s`,
                "--t0": `${f.t0}s`,
                "--gd": `${gd}s`,
              } as React.CSSProperties
            }
          >
            {/* Batang Bunga (Stem) */}
            <svg
              className="stem"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d={`M50 100C${50 + f.bend} 70 ${50 - f.bend} 38 50 0`}
                pathLength={1}
              />
            </svg>

            {/* Daun (Leaves) */}
            {LEAVES.map((leaf, lIdx) => (
              <i
                key={lIdx}
                className={`leaf ${leaf.side === "l" ? "l" : ""}`}
                style={
                  {
                    top: `${(1 - leaf.p) * 100}%`,
                    "--p": leaf.p,
                    "--r": `${leaf.side === "l" ? leaf.r : -leaf.r}deg`,
                  } as React.CSSProperties
                }
              />
            ))}

            {/* Kelopak Bunga (Head) */}
            <div className="head">
              <FlowerHead grad={f.g} />
            </div>
          </div>
        );
      })}
    </main>
  );
}
