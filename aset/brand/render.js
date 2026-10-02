// Renders the Linea.js branding used at the end of every promo video:
//   node render.js        -> frames/h, frames/v (closing animation, 30 fps)
//                            dist/watermark-16x9.png, dist/watermark-9x16.png (transparent)
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'))); }

const FPS = 30;
const page = (p, q) => p.goto('file://' + path.join(__dirname, 'outro.html') + '?' + q);

(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
  for (const fmt of ['h', 'v']) {
    const size = fmt === 'v' ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };
    const p = await browser.newPage({ viewport: size });
    await page(p, 'render=1' + (fmt === 'v' ? '&f=v' : ''));
    await p.evaluate(() => window.ready);
    const n = Math.round(await p.evaluate(() => window.DURATION) * FPS);
    const dir = path.join(__dirname, 'frames', fmt);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    for (let i = 0; i < n; i++) {
      await p.evaluate((t) => window.seek(t), i / FPS);
      await p.screenshot({ path: path.join(dir, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 92 });
    }
    // Watermark: same pill at the size used in this format
    const w = await browser.newPage({ viewport: { width: 600, height: 200 }, deviceScaleFactor: fmt === 'v' ? 1.1 : 1 });
    await page(w, 'wm=1');
    await w.evaluate(() => window.ready);
    await w.locator('#wm').screenshot({ path: path.join(__dirname, 'dist', `watermark-${fmt === 'v' ? '9x16' : '16x9'}.png`), omitBackground: true });
    console.log(fmt, n, 'frames');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
