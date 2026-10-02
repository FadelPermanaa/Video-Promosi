// Draws the demo menu photos (produk/*.png) from illus.html.
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright'))); }
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 800, height: 600 } });
  await p.goto('file://' + __dirname + '/illus.html');
  for (const k of await p.evaluate(() => window.KEYS)) {
    await p.evaluate((k) => window.draw(k), k);
    await p.screenshot({ path: path.join(__dirname, 'produk', `${k}.png`) });
  }
  await b.close();
})();
