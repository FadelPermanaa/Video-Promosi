# Showreel — LineaJS

> Aplikasi/website yang direkam ada di repo **linea.js**. Skrip `capture.js` mengharapkan repo itu di-clone bersebelahan dengan repo ini (`../linea.js`).

A 30-second showreel for the studio, made from real screenshots of this site plus the project images in `public/projects/gallery`. Music and sound effects are generated in code, so there are no licensing issues.

| File | Size | For |
|---|---|---|
| [output/lineajs-showreel-16x9.mp4](output/lineajs-showreel-16x9.mp4) | 1920×1080 | YouTube, website, pitch decks |
| [output/lineajs-showreel-9x16.mp4](output/lineajs-showreel-9x16.mp4) | 1080×1920 | Instagram Reels, TikTok, Shorts, WhatsApp Status |

Every video carries the **Linea.js corner watermark** from the first frame (bottom-right on 16:9, top-right on 9:16) and ends with the 3.6-second **Linea.js logo animation**. `build.sh` adds both automatically via [`../brand/`](../brand/README.md).

## Scenes

| Seconds | Scene |
|---|---|
| 0–3.6 | Type slam on ink: *"Your business deserves a site that works."* with the INTERFACES + APIS + DATABASES ticker |
| 3.6–9 | The site in a browser and a phone: hero, studio idea, selected work |
| 9–14.6 | *"Built for the real world."* — the six project cards land one by one (01/06 → 06/06) |
| 14.6–19.4 | *"From first click to last detail."* — the four services light up in lime |
| 19.4–24.6 | *"Price before the surprise."* — the five starting prices, Custom app marked best value |
| 24.6–30 | Lime CTA: *"Got an idea? Let's make the first move."*, **Start a project ↗**, the cat |

## Change the text and render again

All copy is at the top of the `<script>` in [stage.html](stage.html): `CONFIG` (opening lines, CTA), `PROJECTS`, `SERVICES` and `PACKAGES`. Keep them in step with `app/page.tsx` when prices or projects change.

```bash
cd linea-showreel
npm install                     # GSAP + Playwright
npx playwright install chromium # once
npm run build                   # → output/*.mp4  (needs ffmpeg and python3)
```

- **Preview without rendering:** open `stage.html` in a browser (add `?f=v` for the vertical cut). It loads the project images from the linea.js site, so clone `linea.js` next to this repo.
- **Check one frame:** `node render.js h 12.5,27` → `preview/h-12.5.jpg`.
- If `ffmpeg` is not on PATH: `FFMPEG=/path/to/ffmpeg npm run build`.

## Retake the site screenshots

```bash
npm install && npm run build && PORT=3500 node .output/server/index.mjs   # project root
BASE_URL=http://localhost:3500 node capture.js                             # this folder → shots/
```

Impact is not installed on Linux, so `capture.js` serves **Anton** (a close Google Font, `fonts/`) under the name Impact; Arial falls back to Liberation Sans, which has the same metrics. On Windows or macOS the real fonts are used.

## Files

| File | Purpose |
|---|---|
| `stage.html` | All scenes and motion (GSAP), 1920×1080 or 1080×1920 |
| `render.js` | Records `stage.html` frame by frame (30 fps) with Chromium |
| `audio.py` | Music and sound effects (Python standard library only) |
| `capture.js` | Screenshots of the running site |
| `build.sh` | Audio + frames + ffmpeg encode |
| `shots/` | Site screenshots used in the video |
| `fonts/` | Anton, standing in for Impact |
| `output/` | Finished videos |
