// Takes the app screenshots used in the video (shots/*.png) from a running demo server.
//
//   # in a COPY of the project (it writes demo data):
//   rm -rf data && node alat/isi-contoh.js && node <this folder>/demo-data.js
//   PORT=3100 node server.js
//   # here:
//   BASE_URL=http://localhost:3100 DATA_DIR=<copy>/data node capture.js
//
// Phone screens are 390x844 @3x, laptop screens 1440x900 @2x. Pages are drawn
// with Roboto (what Android phones show) instead of a Linux fallback font.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { DatabaseSync } = require('node:sqlite');

let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'))); }

const B = process.env.BASE_URL || 'http://localhost:3100';
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, '../../web-f-b/data'));
const db = new DatabaseSync(path.join(DATA_DIR, 'tokoku.db'));
const shot = (name) => path.join(__dirname, 'shots', name + '.png');
const out = {};
const pct = (box, vw, vh) => ({ left: +((box.x + box.width / 2) / vw * 100).toFixed(2), top: +((box.y + box.height / 2) / vh * 100).toFixed(2) });

async function roboto(ctx) {
  await ctx.route('**/__fonts/*', (r) => {
    const f = path.join(__dirname, 'fonts', path.basename(new URL(r.request().url()).pathname));
    r.fulfill({ body: fs.readFileSync(f), contentType: f.endsWith('.css') ? 'text/css' : 'font/woff2' });
  });
  await ctx.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '/__fonts/roboto.css'; document.head.appendChild(l);
      const s = document.createElement('style'); s.textContent = "html:root{--sans:'Roboto',system-ui,sans-serif}"; document.head.appendChild(s);
    });
  });
}
const settle = async (p, ms = 600) => { await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(ms); };

(async () => {
  fs.mkdirSync(path.join(__dirname, 'shots'), { recursive: true });
  const browser = await chromium.launch();

  // ---- Owner's panel (before the customer flow adds an order)
  const lapCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await roboto(lapCtx);
  const lap = await lapCtx.newPage();
  await lap.goto(B + '/admin/login.html', { waitUntil: 'networkidle' });
  await lap.fill('#nama', 'admin');
  await lap.fill('#sandi', 'admin123');
  await Promise.all([lap.waitForNavigation(), lap.click('#tblMasuk')]);
  for (const page of ['beranda', 'pesanan', 'kalender']) {
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

  // ---- Customer's phone
  const ph = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await roboto(ph);
  const p = await ph.newPage();
  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await settle(p);
  await p.screenshot({ path: shot('p-home') });
  const day = p.locator('#wadahKalender button.sel-tanggal').nth(1);
  out.tapDate = pct(await day.boundingBox(), 390, 844);
  await day.click();
  await settle(p, 900);
  await p.screenshot({ path: shot('p-home-date') });

  await p.click('#tblLanjut');
  await p.waitForLoadState('networkidle');
  await settle(p);
  await p.screenshot({ path: shot('p-katalog') });
  const add = p.locator('[data-tambah]').first();
  out.tapAdd = pct(await add.boundingBox(), 390, 844);
  await add.click();
  await settle(p, 500);
  const plus = p.locator('[data-aksi] button', { hasText: '+' }).first();
  out.tapPlus = pct(await plus.boundingBox(), 390, 844);
  await p.screenshot({ path: shot('p-katalog-1') });
  await plus.click();
  await settle(p, 500);
  await p.screenshot({ path: shot('p-katalog-2') });

  await p.click('#tblLanjut');
  await p.waitForLoadState('networkidle');
  await settle(p);
  await p.click('#tblProfilBaru');
  await p.waitForTimeout(600);
  await p.fill('#fNama', 'Rina Kusuma');
  await p.fill('#fTelepon', '081398774215');
  await p.fill('#fAlamat', 'Jl. Tebet Barat Dalam No. 7, Tebet, Jakarta Selatan');
  await p.fill('#fPatokan', 'Rumah pagar hitam');
  await p.click('#tblSimpan');
  await p.waitForTimeout(4500); // let the "saved" toast go away
  await p.screenshot({ path: shot('p-alamat') });
  await p.click('#tblLanjut');
  await p.waitForTimeout(1500);
  await p.click('#tblLanjut');
  await p.waitForURL(/bayar/);
  await settle(p, 1200);
  await p.screenshot({ path: shot('p-bayar') });
  out.tapPaid = pct(await p.locator('#tblSudahBayar').boundingBox(), 390, 844);

  // A paid order being prepared, as the customer sees it through their link.
  const status = db.prepare("SELECT kode FROM pesanan WHERE status = 'diproses' AND status_bayar = 'lunas' AND metode = 'kirim' ORDER BY tanggal_kirim, id LIMIT 1").get();
  await p.goto(`${B}/pesanan/${status.kode}`, { waitUntil: 'networkidle' });
  await settle(p, 900);
  await p.screenshot({ path: shot('p-status') });

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'shots', 'taps.json'), JSON.stringify(out, null, 1));
  console.log('Screenshots saved in shots/', out);
})().catch((e) => { console.error(e); process.exit(1); });
