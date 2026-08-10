const fs = require("node:fs");

const [bundlePath] = process.argv.slice(2);
if (!bundlePath) throw new Error("Pass the snake action bundle path.");

const bundle = fs.readFileSync(bundlePath, "utf8");
const original = "const snake = snake4;";
const replacement = "const snake = (0,types_snake/* createSnakeFromCells */.yS)(Array.from({ length: 4 }, (_, i) => ({ x: grid.width - 1 - i, y: -1 })));";

if (bundle.split(original).length !== 2) {
  throw new Error("The pinned snake action bundle no longer has the expected start position.");
}

fs.writeFileSync(bundlePath, bundle.replace(original, replacement));
