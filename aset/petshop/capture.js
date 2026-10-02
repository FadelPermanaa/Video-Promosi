// Takes the app screenshots used in the video (shots/*.png) from a running PawFlow dev server.
//
//   # in the Petshop repo (cloned next to this repo):
//   cd ../../../Petshop && npm install && npm run dev -- --port 5310
//   # here:
//   BASE_URL=http://localhost:5310 node capture.js   # → shots/*.png + shots/marks.json
//
// The browser never saves anything: POST /api/state is answered here, so every run
// starts from the built-in demo shop "Paw & Purr Bali". Screens are 1600x1000 @1.5x.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'))); }

const B = process.env.BASE_URL || 'http://localhost:5310';
const VW = 1600, VH = 1000;
const shot = (name) => path.join(__dirname, 'shots', name + '.png');
const marks = {};
const pct = (b) => ({ left: +((b.x + b.width / 2) / VW * 100).toFixed(2), top: +((b.y + b.height / 2) / VH * 100).toFixed(2) });
const box = (b) => ({ left: +(b.x / VW * 100).toFixed(2), top: +(b.y / VH * 100).toFixed(2), width: +(b.width / VW * 100).toFixed(2), height: +(b.height / VH * 100).toFixed(2) });
// The page-header buttons (e.g. "+ Add appointment") render white on white in the app,
// because `.welcome>button` overrides `.primary`. Draw them the way the app intends.
const FIX = '.welcome>button.primary{background:#174b37;color:#fff;border-color:#174b37}';

(async () => {
  fs.mkdirSync(path.join(__dirname, 'shots'), { recursive: true });
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1.5, timezoneId: 'Asia/Makassar' });
    await ctx.route('**/api/state*', (r) => (r.request().method() === 'POST' ? r.fulfill({ json: { ok: true, updatedAt: Date.now() } }) : r.continue()));
    await ctx.addInitScript((css) => { document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); }); }, FIX);
    const p = await ctx.newPage();
    const away = () => p.mouse.move(VW - 2, VH - 2);
    const snap = async (name, ms = 500) => { await away(); await p.waitForTimeout(ms); await p.screenshot({ path: shot(name) }); };
    const tab = async (name) => { await p.locator('.sidebar nav button', { hasText: name }).first().click(); await p.waitForTimeout(700); };
    const tapOn = async (key, loc) => { const b = await loc.boundingBox(); marks[key] = pct(b); await loc.click(); };

    await p.goto(B + '/', { waitUntil: 'networkidle' });
    await p.waitForSelector('.metrics');

    // Grooming: move Bruno to "Checked in", then Mochi to "Ready"
    await tab('Grooming');
    await snap('g-0');
    await tapOn('tapBruno', p.locator('.service-card', { hasText: 'Bruno' }).getByRole('button', { name: /Move forward/ }));
    await snap('g-1', 300);
    await p.waitForTimeout(3500);
    await tapOn('tapMochi', p.locator('.service-card', { hasText: 'Mochi' }).getByRole('button', { name: /Move forward/ }));
    await snap('g-2', 300);
    await p.waitForTimeout(3500);

    // Pet passport (Mochi is selected first) with the allergy warning
    await tab('Customers & pets');
    marks.ringAllergy = box(await p.locator('.passport-alert').first().boundingBox());
    await snap('c-0');

    // Boarding: tick Coco's afternoon meal
    await tab('Boarding');
    await snap('b-0');
    const coco = p.locator('.boarding-card', { hasText: 'Coco' });
    await tapOn('tapMeal', coco.locator('.task-list label', { hasText: 'Afternoon meal' }).locator('input'));
    await snap('b-1', 400);
    await p.waitForTimeout(3500);

    // Sale: 1x Royal Feline Kitten + 2x Catnip Mouse Trio for Ayu Lestari, paid by QRIS
    await tab('Overview');
    await p.getByRole('button', { name: /New sale/ }).first().click();
    await p.waitForSelector('.product-picker');
    const pick = (name) => p.locator('.product-picker>button', { hasText: name });
    await snap('s-0', 400);
    await tapOn('tapKitten', pick('Royal Feline Kitten'));
    await tapOn('tapCatnip', pick('Catnip Mouse Trio'));
    await pick('Catnip Mouse Trio').click();
    await p.locator('.cart select').first().selectOption({ label: 'Ayu Lestari' });
    await snap('s-1', 400);
    await tapOn('tapCheckout', p.locator('.checkout'));
    await p.waitForSelector('.toast');
    marks.ringStock = box(await p.locator('.stock-row').first().boundingBox());
    await snap('o-1', 300);
    await p.waitForTimeout(3500);

    await tab('Reports');
    await snap('r-0');

    fs.writeFileSync(path.join(__dirname, 'shots', 'marks.json'), JSON.stringify(marks, null, 1) + '\n');
    console.log(marks);
  } finally {
    await browser.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });
