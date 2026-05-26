import { readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const previousBootstrapCommit = "18cb4ab934fb43b8820c3e6c764eb34a68db916e";
const previousBootstrapUrl = `https://raw.githubusercontent.com/saa8058/room-rush-trivia/${previousBootstrapCommit}/bootstrap.mjs`;
const brandCaseCss = `
.rush-strip span:first-child {
  text-transform: none;
}
`;

async function loadPreviousBootstrap() {
  try {
    const { stdout } = await execFileAsync("git", ["show", `${previousBootstrapCommit}:bootstrap.mjs`], {
      maxBuffer: 20 * 1024 * 1024
    });
    if (stdout.includes("ATWIX Trivia")) return stdout;
  } catch {
    // Render may use a shallow clone, so fall back to the immutable GitHub copy.
  }

  const response = await fetch(previousBootstrapUrl);
  if (!response.ok) throw new Error(`Could not load previous bootstrap: ${response.status}`);
  return response.text();
}

const previousBootstrap = await loadPreviousBootstrap();
await import(`data:text/javascript;base64,${Buffer.from(previousBootstrap).toString("base64")}`);

const textFiles = [
  "index.html",
  "package.json",
  "server.mjs",
  "sw.js",
  "src/app.bundle.js",
  "public/manifest.webmanifest",
  "public/icons/icon.svg",
  "public/icons/maskable-icon.svg"
];

const replacements = [
  ["ATWIXTrivia", "AtwixTrivia"],
  ["Install ATWIX Trivia.", "Install Atwix Trivia."],
  ["ATWIX Trivia", "Atwix Trivia"],
  ["ATWIX", "Atwix"]
];

function titleCaseBranding(content) {
  let next = content;
  for (const [from, to] of replacements) next = next.split(from).join(to);
  return next;
}

for (const file of textFiles) {
  const content = await readFile(file, "utf8");
  await writeFile(file, titleCaseBranding(content), "utf8");
}

const css = await readFile("src/styles.css", "utf8");
if (!css.includes(".rush-strip span:first-child")) {
  await writeFile("src/styles.css", `${css}${brandCaseCss}`, "utf8");
}

console.log("Restored launch files with Atwix Trivia branding.");
