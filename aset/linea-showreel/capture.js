// Takes the site screenshots used in the video (shots/*.png).
//
//   npm install && npm run build && PORT=3500 node .output/server/index.mjs   # in the project root
//   BASE_URL=http://localhost:3500 node capture.js                             # here
//
// Each section is captured after its reveal animation has finished. Impact
// is not installed on Linux, so Anton (a close match) is served under that
// name; Arial falls back to Liberation Sans, which has the same metrics.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'))); }

const B = process.env.BASE_URL || 'http://localhost:3500';
const shot = (name) => path.join(__dirname, 'shots', name + '.png');

async function impact(ctx) {
  await ctx.route('**/__fonts/*', (r) => {
    const f = path.join(__dirname, 'fonts', path.basename(new URL(r.request().url()).pathname));
    r.fulfill({ body: fs.readFileSync(f), contentType: f.endsWith('.css') ? 'text/css' : 'font/woff2' });
  });
  await ctx.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '/__fonts/impact.css'; document.head.prepend(l);
    });
  });
}
const settle = async (p, ms = 1200) => { await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(ms); };
const toSection = (p, id, offset = 0) => p.evaluate(([id, offset]) => {
  const el = document.getElementById(id) || document.querySelector('.' + id);
  window.scrollTo(0, el.getBoundingClientRect().top + scrollY + offset);
}, [id, offset]);

(async () => {
  fs.mkdirSync(path.join(__dirname, 'shots'), { recursive: true });
  const browser = await chromium.launch();

  // Laptop 1440x900 @2x
  const lap = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await impact(lap);
  const p = await lap.newPage();
  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await settle(p);
  await p.mouse.move(1000, 420);
  // Walk the page once so every lazy image and reveal has run.
  const height = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(120); }
  for (const [name, id, offset] of [['l-hero', 'top', 0], ['l-studio', 'studio', 0], ['l-services', 'services', 0], ['l-packages', 'packages', 420], ['l-brief', 'brief', 0]]) {
    await toSection(p, id, offset);
    await settle(p, 1500);
    await p.screenshot({ path: shot(name) });
  }
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await settle(p, 1500);
  await p.screenshot({ path: shot('l-end') });

  // Phone 390x844 @3x: hero
  const ph = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await impact(ph);
  const q = await ph.newPage();
  await q.goto(B + '/', { waitUntil: 'networkidle' });
  await settle(q, 1500);
  await q.screenshot({ path: shot('p-hero') });

  await browser.close();
  console.log('Screenshots saved in shots/');
})().catch((e) => { console.error(e); process.exit(1); });
