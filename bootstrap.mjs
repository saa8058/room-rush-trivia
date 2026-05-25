import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { brotliDecompressSync } from "node:zlib";

const chunkCount = 7;
let packed = "";
for (let i = 0; i < chunkCount; i += 1) {
  packed += await readFile(`.deploy/packed/part-${String(i).padStart(2, "0")}.txt`, "utf8");
}

const files = JSON.parse(brotliDecompressSync(Buffer.from(packed, "base64")).toString("utf8"));
for (const [path, base64] of Object.entries(files)) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, Buffer.from(base64, "base64"));
}
console.log(`Restored ${Object.keys(files).length} launch files.`);
