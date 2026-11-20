# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/tianzhaoming28-maker/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/tianzhaoming28-maker/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI: every trophy with its official name, description and grade, an original guide for each one with its sources cited beside it, a four-stage roadmap to the platinum, and the missable trophies flagged.

## What's inside

- **Checklist** — all 55 trophies as cards with official names/descriptions/grades, checkboxes persisted in `localStorage`, a live progress bar with per-grade breakdown, and trophy points.
- **Cited guides** — click any trophy for its full guide in our own words, a step list, and a Sources section naming where each fact comes from (the official PlayStation list via Exophase for every trophy; the PowerPyx trophy guide & roadmap where its roadmap facts are used). Claims no source supports are not made.
- **Roadmap view** — four ordered stages to the platinum (story → 100% checklist → strangers/characters cleanup → platinum), built from the official descriptions: five chapters, the named missions, 250 stunts, 42 Shooting Range challenges, 70 of 80 challenges, 8 stranger strands.
- **Missables view** — exactly one missable trophy, flagged from the cited roadmap: **Positive Mental Attitude**, whose first meditation spot at home in Chapter 1 disappears after that chapter, with no mission replay to fix it. Chapter-start manual saves are the insurance.
- **Filters** — by kind (story / missable / collectibles / activities / online — the official list has no online trophies, and the app says so), by grade, full-text search, and hide-earned.
- **Spoiler mode** — hides story trophies' names and descriptions until you earn them.
- **Export / import** — progress downloads as a JSON file and imports back, validated against the official trophy names.

## Run it

No build step and no network needed at run time:

```sh
node serve.ts            # serves app/ at http://localhost:8080
# or open app/index.html in any browser / static file server
```

Hand-in program (copies `app/` to the output, materializes the screenshots, writes `dossier.json`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots live in `screenshots-src/` locally and are packed into `screenshots-data.ts` by `node pack-screenshots.mjs` (one single-line base64 payload each); `main.ts` writes them back out to `screenshots/`.

## Data & sources

- Trophy names, descriptions and grades: the official PlayStation list as published via [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/).
- Roadmap facts (difficulty 4/10, ~200 hours, one playthrough, free roam after the story, no mission replay, the Chapter 1 meditation warning, checklist thresholds): [PowerPyx — GTA 6 Trophy Guide & Roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/).
- All guide text is original to this entry; sources are cited, never copied. No Rockstar Games logos or artwork are used. Fan-made and unofficial.

## Layout

- `app/` — the static app (`index.html`, `style.css`, `app.js`, `data/trophies.json`)
- `main.ts` — the hand-in program · `serve.ts` — local dev server
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged
- `shots.json` — which views the screenshots show

---

Built for the [make.fun gta6-trophy-guide-01 bounty](https://make.fun/bounty/gta6-trophy-guide-01) · Try make.fun: [make.fun/r/qn2pqd71](https://make.fun/r/qn2pqd71)

---

<sub>Entered on [make.fun](https://make.fun/?ref=qn2pqd71&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
