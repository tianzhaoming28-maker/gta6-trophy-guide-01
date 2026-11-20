// Leonida Legend — GTA VI trophy guide & tracker: hand-in program.
// Copies app/ to the output directory, materializes the packed screenshots
// into screenshots/, and writes dossier.json with the vendored make.fun
// library (vendor/makefun-frontend.ts, unchanged from the kit).
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';
import { SCREENSHOTS } from './screenshots-data.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });

const shotsDir = join(out, 'screenshots');
mkdirSync(shotsDir, { recursive: true });
for (const shot of SCREENSHOTS) {
  writeFileSync(join(shotsDir, shot.name), Buffer.from(shot.base64, 'base64'));
}
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), shotsDir, { recursive: true });
}

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
console.log(`wrote ${out} with ${SCREENSHOTS.length} screenshots`);
