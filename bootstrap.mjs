import { spawnSync } from "node:child_process";

const steps = [
  ["node", ["scripts/build-browser-bundle.mjs"]],
  ["node", ["scripts/validate-deck.mjs"]]
];

for (const [command, args] of steps) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
