const fs = require("node:fs");

const files = process.argv.slice(2);

if (files.length === 0) {
  throw new Error("Pass at least one generated SVG file.");
}

const cells = (coordinates) =>
  coordinates
    .map(([column, row]) => `<rect x="${386 + column * 12}" y="${17 + row * 12}" width="10" height="10" rx="2" />`)
    .join("");

const h = cells([
  [0, 0], [4, 0], [0, 1], [4, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
  [0, 3], [4, 3], [0, 4], [4, 4], [0, 5], [4, 5], [0, 6], [4, 6],
]);
const i = cells([[6, 0], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6]]);
const exclamation = cells([[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 6]]);

for (const file of files) {
  const svg = fs.readFileSync(file, "utf8");
  const duration = svg.match(/animation:none\s+(\d+)ms/)?.[1];

  if (!duration || !svg.includes("</svg>")) {
    throw new Error(`${file} is not a snake SVG produced by Platane/snk.`);
  }

  const overlay = `<style>
    .greeting { fill: var(--c3); stroke: var(--ce); stroke-width: 1; }
    .greeting .letter { opacity: 0; transform-box: fill-box; transform-origin: center; animation-duration: ${duration}ms; animation-iteration-count: infinite; animation-timing-function: ease-out; }
    .greeting .h { animation-name: form-h; }
    .greeting .i { animation-name: form-i; }
    .greeting .exclamation { animation-name: form-exclamation; }
    @keyframes form-h { 0%, 84% { opacity: 0; transform: scale(0); } 87%, 99% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0); } }
    @keyframes form-i { 0%, 87% { opacity: 0; transform: scale(0); } 90%, 99% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0); } }
    @keyframes form-exclamation { 0%, 90% { opacity: 0; transform: scale(0); } 93%, 99% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0); } }
  </style><g class="greeting" aria-label="Hi!"><g class="letter h">${h}</g><g class="letter i">${i}</g><g class="letter exclamation">${exclamation}</g></g>`;

  fs.writeFileSync(file, svg.replace("</svg>", `${overlay}</svg>`));
}
