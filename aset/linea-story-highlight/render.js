// Renders each highlight as one continuous video, plus the highlight covers.
//   node render.js cues            -> cues/<highlight>.json  (timing for audio.py)
//   node render.js covers          -> output/covers/*.png only (also the extra covers in stories.js)
//   node render.js [highlight]     -> output/<n>-<highlight>.mp4 (needs audio/<highlight>.wav), output/covers/*.png
//   node render.js preview karya 4.5,12   -> preview/karya-4.5.jpg …
const path = require('path');
const fs = require('fs');
const { execSync, execFileSync } = require('child_process');

let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'))); }

const FPS = 30;
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const src = fs.readFileSync(path.join(__dirname, 'stories.js'), 'utf8');
const DATA = JSON.parse(src.slice(src.indexOf('=', src.indexOf('window.STORIES')) + 1).trim().replace(/;\s*$/, '')).highlights;
const url = (q) => 'file://' + path.join(__dirname, 'stage.html') + '?render=1&' + q;
const dir = (...p) => { const d = path.join(__dirname, ...p); fs.mkdirSync(d, { recursive: true }); return d; };

(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const open = async (q) => { await page.goto(url(q)); await page.evaluate(() => window.ready); };
  const [, , mode, a, b] = process.argv;

  if (mode === 'preview') {
    await open(`h=${a}`);
    for (const t of b.split(',').map(Number)) {
      await page.evaluate((x) => window.seek(x), t);
      await page.screenshot({ path: path.join(dir('preview'), `${a}-${t}.jpg`), type: 'jpeg', quality: 85 });
    }
  } else if (mode === 'cues') {
    for (const H of DATA) {
      await open(`h=${H.id}`);
      const info = await page.evaluate(() => ({ ...window.MUSIC, cues: window.CUES }));
      fs.writeFileSync(path.join(dir('cues'), `${H.id}.json`), JSON.stringify(info, null, 1));
      console.log('cues', H.id, info.duration.toFixed(1) + 's', info.cues.length, 'cues');
    }
  } else if (mode === 'covers') {
    // Every highlight cover, plus covers for highlights that have no video here (extraCovers)
    const all = JSON.parse(src.slice(src.indexOf('=', src.indexOf('window.STORIES')) + 1).trim().replace(/;\s*$/, ''));
    for (const H of [...all.highlights, ...(all.extraCovers || [])]) {
      await open(`cover=${H.id}`);
      await page.screenshot({ path: path.join(dir('output', 'covers'), `${H.id}.png`) });
      console.log('cover', H.id);
    }
  } else {
    for (const [hi, H] of DATA.entries()) {
      if (mode && mode !== H.id) continue;
      await open(`cover=${H.id}`);
      await page.screenshot({ path: path.join(dir('output', 'covers'), `${H.id}.png`) });
      await open(`h=${H.id}`);
      const n = Math.round((await page.evaluate(() => window.DURATION)) * FPS);
      const frames = path.join(__dirname, 'frames');
      fs.rmSync(frames, { recursive: true, force: true });
      fs.mkdirSync(frames);
      for (let f = 0; f < n; f++) {
        await page.evaluate((t) => window.seek(t), f / FPS);
        await page.screenshot({ path: path.join(frames, String(f).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 92 });
      }
      const out = path.join(dir('output'), `${hi + 1}-${H.id}.mp4`);
      execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, '%05d.jpg'), '-i', path.join(__dirname, 'audio', `${H.id}.wav`),
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-preset', 'slow', '-tune', 'animation', '-c:a', 'aac', '-b:a', '256k', '-ar', '44100', '-shortest', '-movflags', '+faststart', out]);
      console.log(path.relative(__dirname, out), n, 'frames');
    }
    fs.rmSync(path.join(__dirname, 'frames'), { recursive: true, force: true });
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
