const fs = require("node:fs");

const files = process.argv.slice(2);

if (files.length === 0) {
  throw new Error("Pass at least one generated SVG file.");
}

const cells = (coordinates) =>
  coordinates
    .map(([column, row]) => {
      const x = 386 + column * 12;
      const y = 17 + row * 12;
      return `<rect class="dot" x="${x}" y="${y}" width="10" height="10" rx="2" style="--dx:${838 - x}px;--dy:${8 - y}px" />`;
    })
    .join("");

const h = cells([
  [0, 0], [4, 0], [0, 1], [4, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
  [0, 3], [4, 3], [0, 4], [4, 4], [0, 5], [4, 5], [0, 6], [4, 6],
]);
const i = cells([[6, 0], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6]]);
const exclamation = cells([[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 6]]);

for (const file of files) {
  const svg = fs.readFileSync(file, "utf8");
  const originalDuration = Number(svg.match(/animation:none\s+(\d+)ms/)?.[1]);

  if (!originalDuration || !svg.includes("</svg>")) {
    throw new Error(`${file} is not a snake SVG produced by Platane/snk.`);
  }

  const duration = Math.round(originalDuration / 3);
  const latestContribution = Math.max(
    95,
    ...[...svg.matchAll(/@keyframes c[0-9a-z]+\{([^}]*)\}/g)].flatMap((match) =>
      [...match[1].matchAll(/(\d+(?:\.\d+)?)%/g)]
        .map((percentage) => Number(percentage[1]))
        .filter((percentage) => percentage < 100),
    ),
  );
  const launch = Math.min(97, latestContribution + 0.1).toFixed(2);
  const arrival = Math.min(99, Number(launch) + 1.8).toFixed(2);

  const overlay = `<style>
    .greeting { fill: var(--c3); stroke: var(--ce); stroke-width: 1; }
    .greeting .dot { opacity: 0; transform-box: fill-box; transform-origin: center; animation: spit ${duration}ms linear infinite; }
    .greeting .muzzle { opacity: 0; animation: muzzle-flash ${duration}ms linear infinite; }
    @keyframes spit { 0%, ${launch}% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.45); } ${(Number(launch) + 0.1).toFixed(2)}% { opacity: 1; transform: translate(var(--dx), var(--dy)) scale(0.45); } ${arrival}%, 99.7% { opacity: 1; transform: translate(0, 0) scale(1); } 100% { opacity: 0; transform: translate(0, 0) scale(0.45); } }
    @keyframes muzzle-flash { 0%, ${launch}% { opacity: 0; r: 2; } ${(Number(launch) + 0.1).toFixed(2)}% { opacity: 1; r: 7; } ${arrival}% { opacity: 0; r: 2; } 100% { opacity: 0; r: 2; } }
  </style><g class="greeting" aria-label="Hi!"><circle class="muzzle" cx="838" cy="8" r="2" />${h}${i}${exclamation}</g>`;

  const accelerated = svg.replaceAll(`${originalDuration}ms`, `${duration}ms`);
  fs.writeFileSync(file, accelerated.replace("</svg>", `${overlay}</svg>`));
}
