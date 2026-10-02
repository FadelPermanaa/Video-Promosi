# Instagram stories — Linea.js highlights

> Isi dan fakta diambil dari website linea.js. Folder ini berdiri sendiri; tidak perlu repo lain untuk render ulang.

Six vertical videos (1080×1920, Indonesian), **one per main idea**, each made as one continuous animation with its own soundtrack, that explain what Linea.js is, what it builds, what it has shipped, how its services differ, how a project starts, and how to get in touch. Each video is saved as one **highlight** on @linea.js. The brief is in [PROMPT.md](PROMPT.md).

Every visual is new: there are no screenshots of the website. The project screens are redrawn illustrations, marked "ilustrasi tampilan". All facts come from the website, and the videos show no prices.

| Highlight | Video | Length | Cover |
|---|---|---|---|
| Tentang | `output/1-tentang.mp4` | 31 s | `output/covers/tentang.png` |
| Layanan | `output/2-layanan.mp4` | 46 s | `output/covers/layanan.png` |
| Karya | `output/3-karya.mp4` | 52 s | `output/covers/karya.png` |
| Bedanya Apa? | `output/4-bedanya.mp4` | 52 s | `output/covers/bedanya.png` |
| Proses | `output/5-proses.mp4` | 38 s | `output/covers/proses.png` |
| Tanya & Kontak | `output/6-kontak.mp4` | 40 s | `output/covers/kontak.png` |

- **Under 60 seconds.** Every video fits in a single Instagram story without being split.
- **One continuous animation.** The parts are not clips glued together. Each part lifts away, a blue panel with the Linea.js mark sweeps across, and the next part builds in. The background lines keep moving the whole time, and the counter in the label rolls from 1/4 to 2/4.
- **Scored sound.** Each video has one piece of music (100 BPM: kick, snare, hats, bass, electric piano, pad and a plucked hook) with the scene changes on the beat. A drum fill, a riser and a hit mark every change, and the sound effects come from the animation itself (text, pops, checks, counters, typing, stamps). The music resolves under the logo at the end.
- **Watermark** at the top right, inside the area Instagram leaves visible.
- **Logo animation** of Linea.js once, at the end of each video.
- **Safe zones.** Important text stays out of the top 260 px and the bottom 340 px, where Instagram shows the account name and the reply box.

Covers for three highlights that have no video in this folder are also in `output/covers/`: **Demo** (`demo.png`, for the 9:16 project videos), **W Client** (`client.png`) and **Portofolio** (`portofolio.png`). They are listed under `extraCovers` in [stories.js](stories.js); `node render.js covers` redraws every cover.

## Posting them as highlights

1. **Post the story.** Upload one video as a story, for example `1-tentang.mp4`.
2. **Create the highlight.** On the profile, tap **New** (+) under the bio, pick that story, and name the highlight, for example *Tentang*.
3. **Set the cover.** Tap **Edit cover** and choose the matching image from `output/covers/`. Instagram crops it to the circle in the middle.
4. **Repeat** for the other videos. The order in the table is the suggested order on the profile.

## Changing the text and rendering again

All text lives in [stories.js](stories.js). Each story has a `type` (layout), a duration `d` in seconds, and its own fields. Wrap words in `<em>…</em>` to colour them.

```bash
cd linea-story-highlight
npm install && npx playwright install chromium   # once
npm run build                                    # → output/ (needs ffmpeg and python3)
```

- **Preview without rendering:** open `stage.html?h=karya` in a browser (the animation plays without sound).
- **Render single frames:** `node render.js preview karya 4.5,12` → `preview/karya-4.5.jpg`, `preview/karya-12.jpg`.

## Files

| File | Purpose |
|---|---|
| `PROMPT.md` | Brief: goal, format, visual identity, script, rules, facts |
| `stories.js` | Text and settings for every story |
| `stage.html` | Styles and the fixed layers (background, label, watermark, sweep panel, logo ending) |
| `scenes.js` | Builds each highlight as one timeline (GSAP) and lists its sound cues |
| `render.js` | Exports the sound cues, renders each highlight to MP4, and draws the covers |
| `audio.py` | Scores the music and sound effects to those cues (Python standard library) |
| `build.sh` | Cues → audio → render |
