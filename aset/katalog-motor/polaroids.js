// Small bike pictures for the opening scene's "WhatsApp status" polaroids.
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright'))); }
const BIKES = {
  'bike-ninja': { type: 'sport', body: '#3fae2a', accent: '#1f2126', bg: '#eef3ea' },
  'bike-nmax': { type: 'maxi', body: '#2c4f86', accent: '#223f6c', bg: '#e6edf6' },
  'bike-supra': { type: 'bebek', body: '#c62828', accent: '#1f2126', bg: '#f4ece8' },
  'bike-scoopy': { type: 'matic', body: '#f4f4f2', accent: '#7a5230', bg: '#f3ede6' },
};
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 0.4 });
  await p.goto('file://' + path.join(__dirname, 'illus.html'));
  for (const [name, o] of Object.entries(BIKES)) {
    await p.evaluate((o) => window.draw({ seat: '#1b1d22', ...o }), o);
    await p.screenshot({ path: path.join(__dirname, 'shots', name + '.jpg'), type: 'jpeg', quality: 85 });
  }
  await b.close();
})();
