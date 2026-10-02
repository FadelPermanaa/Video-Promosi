# Linea.js video branding

Every Linea.js promo video uses the same branding:

- **Corner watermark** from the first frame: the Linea.js mark and the name "Linea.js".
  - 16:9: bottom-right.
  - 9:16: top-right, because the Reels/TikTok buttons and captions cover the bottom and the right edge.
- **3.6-second closing animation** after the video ends: the Linea.js mark and name, with sound.

## Files

| File | Purpose |
|---|---|
| `outro.html` | Closing animation and watermark design (GSAP) |
| `render.js` | Renders the animation to frames and the watermark to transparent PNGs |
| `audio.py` | Sound for the closing animation (Python standard library) |
| `build.sh` | Builds every asset into `dist/` |
| `apply-brand.sh` | Adds the watermark and closing animation to a finished video |
| `dist/` | Built assets: `outro-16x9.mp4`, `outro-9x16.mp4`, `watermark-16x9.png`, `watermark-9x16.png` |

## Using it

Every video folder in this repository ends its `build.sh` with:

```sh
FFMPEG="$FFMPEG" sh ../brand/apply-brand.sh output/name-16x9.mp4 h
FFMPEG="$FFMPEG" sh ../brand/apply-brand.sh output/name-9x16.mp4 v
```

For Instagram stories, use `s` instead of `v`: the watermark moves down to y = 270 so the account name does not cover it. `NO_OUTRO=1` adds only the watermark. Run it once per freshly rendered video; running it twice adds the branding twice.

## Changing the logo or animation

```bash
cd brand
npm install && npx playwright install chromium   # once
npm run build                                    # → dist/ (needs ffmpeg and python3)
```

Every video picks up the new `dist/` the next time it is built.
