/**
 * Re-apply after `prisma generate`. The prisma-client generator uses import.meta.url;
 * Nest compiles to CJS where that hybrid breaks at runtime.
 */
const fs = require("node:fs");
const path = require("node:path");

const clientTs = path.join(__dirname, "..", "src", "generated", "prisma", "client.ts");
if (!fs.existsSync(clientTs)) {
  process.exit(0);
}

let s = fs.readFileSync(clientTs, "utf8");
const before = s;

const needle = `import * as process from 'node:process'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
globalThis['__dirname'] = path.dirname(fileURLToPath(import.meta.url))`;

const replacement = `// Patched for Nest + tsc CommonJS: import.meta.url in compiled output breaks Node (exports is not defined).
declare const __dirname: string
globalThis['__dirname'] = __dirname`;

if (s.includes(needle)) {
  s = s.replace(needle, replacement);
}

if (s === before) {
  console.warn(
    "[apply-prisma-nest-cjs-patch] Prisma client.ts layout changed; patch not applied. Check src/generated/prisma/client.ts",
  );
  process.exit(0);
}

fs.writeFileSync(clientTs, s);
