// Takes the app screenshots used in the video (shots/*.png) from a running demo server.
//
//   # in a COPY of the project (it writes demo data):
//   rm -rf data && node alat/isi-demo.js --tanpa-foto && node <this folder>/demo-data.js
//   PORT=3300 node server.js
//   # here:
//   BASE_URL=http://localhost:3300 node capture.js
//
// Phone screens are 390x844 @3x, laptop screens 1440x900 @2x, drawn with the
// app's own fonts (Bodoni Moda, IBM Plex) served from fonts/.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'))); }

const B = process.env.BASE_URL || 'http://localhost:3300';
const shot = (name) => path.join(__dirname, 'shots', name + '.png');
const out = {};
const pct = (box, vw, vh) => ({ left: +((box.x + box.width / 2) / vw * 100).toFixed(2), top: +((box.y + box.height / 2) / vh * 100).toFixed(2) });

async function appFonts(ctx) {
  const css = fs.readFileSync(path.join(__dirname, 'fonts/app-fonts.css'), 'utf8');
  await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ contentType: 'text/css', body: css }));
  await ctx.route('https://fonts.gstatic.com/local/**', (r) => r.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(path.join(__dirname, 'fonts', path.basename(new URL(r.request().url()).pathname))) }));
}
const settle = async (p, ms = 600) => { await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(ms); };
// Full-page captures scroll inside the phone frame, so bars pinned to the
// viewport are hidden for those (they would land in the middle of the image).
const hidePinned = (p) => p.evaluate(() => {
  for (const el of document.querySelectorAll('body *')) {
    const pos = getComputedStyle(el).position;
    if (pos === 'fixed') el.style.visibility = 'hidden';
    if (pos === 'sticky') el.style.position = 'static';
  }
});

(async () => {
  fs.mkdirSync(path.join(__dirname, 'shots'), { recursive: true });
  const browser = await chromium.launch();

  // ---- Buyer's phone
  const ph = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await appFonts(ph);
  const p = await ph.newPage();

  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await settle(p, 900);
  await hidePinned(p);
  await p.screenshot({ path: shot('p-landing-full'), fullPage: true });

  // Compare three units
  await p.goto(B + '/katalog', { waitUntil: 'networkidle' });
  await settle(p);
  const compare = p.locator('.kartu button', { hasText: 'Banding' });
  for (const i of [0, 2, 5]) { await compare.nth(i).click(); await p.waitForTimeout(250); }
  await p.goto(B + '/bandingkan', { waitUntil: 'networkidle' });
  await settle(p, 900);
  await p.screenshot({ path: shot('p-bandingkan') });

  // A used unit's page: full length (scrolls in the video) and the view with the WhatsApp bar.
  const kode = await p.evaluate(async () => {
    const r = await fetch('/api/katalog?cari=PCX'); const j = await r.json();
    const daftar = j.unit || j.data || j.daftar || [];
    return (daftar[0] && daftar[0].kode) || null;
  }).catch(() => null);
  const unitUrl = kode ? `/unit/${kode}` : await p.evaluate(() => [...document.querySelectorAll('a[href^="/unit/"]')].map((a) => a.getAttribute('href')).find(Boolean));
  await p.goto(B + unitUrl, { waitUntil: 'networkidle' });
  await settle(p, 900);
  await p.screenshot({ path: shot('p-unit') });
  const wa = p.locator('#tombol-wa-bawah');
  if (await wa.isVisible()) out.tapWa = pct(await wa.boundingBox(), 390, 844);
  out.unitUrl = unitUrl;
  await hidePinned(p);
  await p.screenshot({ path: shot('p-unit-full'), fullPage: true });

  // Tapping WhatsApp records the enquiry and opens WhatsApp with the unit's
  // details already typed. Catch the WhatsApp link instead of opening it.
  await p.reload({ waitUntil: 'networkidle' });
  await settle(p);
  await p.evaluate(() => {
    window.__wa = null;
    window.open = () => { const tab = { location: {} }; Object.defineProperty(tab.location, 'href', { set(v) { window.__wa = v; } }); return tab; };
  });
  await p.click('#tombol-wa-bawah');
  await p.waitForFunction(() => window.__wa, null, { timeout: 10000 });
  const link = await p.evaluate(() => window.__wa);
  out.waText = new URL(link).searchParams.get('text');

  // ---- Dealer's panel
  const lapCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await appFonts(lapCtx);
  const lap = await lapCtx.newPage();
  await lap.goto(B + '/admin/login.html', { waitUntil: 'networkidle' });
  await lap.fill('#nama', 'admin');
  await lap.fill('#sandi', 'admin123');
  await Promise.all([lap.waitForNavigation(), lap.click('#tombol-masuk')]);
  for (const page of ['beranda', 'prospek']) {
    await lap.goto(`${B}/admin/${page}.html`, { waitUntil: 'networkidle' });
    await settle(lap, 900);
    await lap.mouse.move(1439, 899);
    await lap.screenshot({ path: shot('a-' + page) });
  }
  await lap.goto(`${B}/admin/laporan.html`, { waitUntil: 'networkidle' });
  await settle(lap);
  await lap.getByRole('button', { name: 'Bulan lalu' }).click();
  await settle(lap, 900);
  await lap.mouse.move(1439, 899);
  await lap.screenshot({ path: shot('a-laporan') });

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'shots', 'taps.json'), JSON.stringify(out, null, 1));
  console.log('Screenshots saved in shots/', out);
})().catch((e) => { console.error(e); process.exit(1); });
