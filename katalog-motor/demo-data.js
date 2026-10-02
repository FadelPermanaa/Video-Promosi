// Demo data for the promo video, on a FRESH copy of the app:
//   cd <copy> && rm -rf data && node alat/isi-demo.js --tanpa-foto && node <this file>
// Adds: dealer name, drawn photos for the 10 demo units, buyer enquiries,
// and last month's sales — all through the app's own services.
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const APP = process.cwd();
const req = (p) => require(path.join(APP, p));
req('config/lengkapiEnv')();
const db = req('services/db');
const unitService = req('services/unitService');
const prospekService = req('services/prospekService');
const merekService = req('services/merekService');
const k = db.buka();

let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'))); }

// ---- Dealer settings
const up = k.prepare('INSERT INTO pengaturan (kunci, nilai) VALUES (?, ?) ON CONFLICT(kunci) DO UPDATE SET nilai = excluded.nilai');
for (const [a, b] of Object.entries({
  nama_usaha: 'Sinar Jaya Motor',
  tagline: 'Motor baru & bekas pilihan, surat lengkap, siap pakai',
  alamat_usaha: 'Jl. Slamet Riyadi No. 210, Laweyan, Surakarta 57141',
  telepon_wa: '6281200005678',
  jam_operasional: '08:00 - 17:00, Senin - Sabtu',
  promo_berlaku: 'Sampai akhir bulan',
})) up.run(a, b);

// ---- Drawn photos: type and colours per model
const LOOK = {
  'Vario 160 CBS': ['matic', '#2a2c31', '#3d4048', '#e8eef4'],
  'NMAX 155 Connected': ['maxi', '#2c4f86', '#223f6c', '#e6edf6'],
  'Beat Street': ['matic', '#1f2126', '#c9ced6', '#eef0f2'],
  'Aerox 155 Connected': ['maxi', '#f4f4f2', '#d23a2f', '#f4ece8'],
  'PCX 160 ABS': ['maxi', '#6b7078', '#4c5058', '#eceef0'],
  'Supra X 125 FI': ['bebek', '#c62828', '#1f2126', '#f4ece8'],
  'Ninja 250 SL': ['sport', '#3fae2a', '#1f2126', '#eef3ea'],
  'Satria F150': ['sport', '#2a5fb8', '#f4f4f2', '#e9eef6'],
  'Fazzio 125 Hybrid': ['matic', '#e8dcc0', '#8a6a3f', '#f6f0e4'],
  'Scoopy Prestige': ['matic', '#f4f4f2', '#7a5230', '#f3ede6'],
  'Vario 125 CBS': ['matic', '#b71c1c', '#3d4048', '#f4ece8'],
  'Mio M3 125': ['matic', '#2d6cdf', '#1f2126', '#e6edf6'],
  'CB150R Streetfire': ['sport', '#d62828', '#1f2126', '#f4ece8'],
  'Revo X': ['bebek', '#1f2126', '#c62828', '#eef0f2'],
  'Genio CBS': ['matic', '#9ccbd6', '#2b2f37', '#e9f2f4'],
  'Vixion R': ['sport', '#1f2126', '#d4a017', '#f1efe8'],
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  await page.goto('file://' + path.join(__dirname, 'illus.html'));
  const shot = async (fn, arg) => {
    await page.evaluate(([f, a]) => window[f](...a), [fn, arg]);
    const buf = await page.screenshot({ type: 'jpeg', quality: 82 });
    return `data:image/jpeg;base64,${buf.toString('base64')}`;
  };
  const photosFor = async (u) => {
    const [type, body, accent, bg] = LOOK[u.model] || ['matic', '#555', '#333', '#eee'];
    await unitService.tambahFoto(u.id, await shot('draw', [{ type, body, accent, seat: '#1b1d22', bg }]), 'demo');
    if (u.kondisi === 'bekas' && u.km) unitService.tambahFoto(u.id, await shot('drawOdo', [u.km, bg]), 'demo');
  };

  for (const u of k.prepare('SELECT * FROM unit').all()) await photosFor(u);

  // ---- Last month's sales (for the report), created then sold through the services
  const merek = Object.fromEntries(merekService.daftar ? merekService.daftar().map((m) => [m.nama, m.id]) : k.prepare('SELECT id, nama FROM merek').all().map((m) => [m.nama, m.id]));
  const SOLD = [
    ['Honda', 'Vario 125 CBS', 'matic', 2021, 'Merah', 125, 15_900_000, 'Bapak Agus'],
    ['Yamaha', 'Mio M3 125', 'matic', 2020, 'Biru', 125, 10_500_000, 'Ibu Wulan'],
    ['Honda', 'CB150R Streetfire', 'sport', 2019, 'Merah Hitam', 149, 17_200_000, 'Mas Dimas'],
    ['Honda', 'Revo X', 'bebek', 2019, 'Hitam', 110, 8_900_000, 'Pak Slamet'],
    ['Honda', 'Genio CBS', 'matic', 2022, 'Biru Muda', 110, 14_300_000, 'Mbak Rara'],
    ['Yamaha', 'Vixion R', 'sport', 2018, 'Hitam', 155, 16_400_000, 'Bapak Yoga'],
  ];
  const now = new Date();
  for (const [i, [m, model, tipe, tahun, warna, cc, harga, pembeli]] of SOLD.entries()) {
    const unit = unitService.buat({
      kondisi: 'bekas', merek_id: merek[m], model, tipe, transmisi: tipe === 'matic' ? 'otomatis' : tipe === 'bebek' ? 'manual' : 'kopling',
      tahun, warna, cc, harga, km: 20_000 + i * 7_300, jumlah_pemilik: 1, pajak_sampai: '2027-03', plat_nomor: `AD ${2100 + i * 377} AB`,
      kelengkapan: ['stnk', 'bpkb'], deskripsi: 'Unit sudah terjual.', stok: 1,
    }, 'demo');
    await photosFor({ ...unit, id: unit.id, model, kondisi: 'bekas', km: 0 });
    unitService.tandaiTerjual(unit.id, { harga_terjual: harga - 300_000, nama_pembeli: pembeli }, 'demo');
    // Four sales last month, the two latest earlier today
    const d = i < 4 ? new Date(now.getFullYear(), now.getMonth() - 1, 4 + i * 6, 10 + i, 15) : new Date(now.getTime() - (i - 3) * 2.5 * 3600 * 1000);
    const iso = d.toISOString();
    k.prepare('UPDATE unit SET terjual_pada = ?, diubah_pada = ? WHERE id = ?').run(iso, iso, unit.id);
    k.prepare('UPDATE pembayaran SET tanggal = ?, dibuat_pada = ? WHERE unit_id = ?').run(iso.slice(0, 10), iso, unit.id);
  }

  // ---- Buyer enquiries from the last two weeks
  const units = k.prepare("SELECT kode, model FROM unit WHERE status <> 'terjual'").all();
  const NAMA = ['Rizky', 'Bagus Setiawan', 'Dewi', 'Pak Haryanto', 'Fajar', 'Nita', 'Arif Rahman', 'Bu Sri', 'Yusuf', 'Kevin', 'Maya', 'Hendra'];
  const SUMBER = ['detail', 'detail', 'katalog', 'bandingkan', 'detail', 'lainnya'];
  const STATUS = ['baru', 'baru', 'baru', 'dihubungi', 'dihubungi', 'nego', 'nego', 'deal', 'batal'];
  for (let i = 0; i < 18; i++) {
    const u = units[(i * 7) % units.length];
    const p = prospekService.catat({ kodeUnit: u.kode, nama: NAMA[i % NAMA.length], telepon: '0812' + String(31415926 + i * 7717).slice(0, 8), pesan: `Halo, ${u.model} masih ada? Bisa lihat unitnya besok?`, sumber: SUMBER[i % SUMBER.length] });
    const st = STATUS[i % STATUS.length];
    if (st !== 'baru') prospekService.ubahStatus(p.id, st, '', 'demo');
    // Six from today (hours ago), the rest spread over the past two weeks
    const hoursAgo = i < 6 ? 0.5 + i * 1.7 : 14 + (i - 6) * 26;
    const t = new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();
    k.prepare('UPDATE prospek SET dibuat_pada = ?, diubah_pada = ? WHERE id = ?').run(t, t, p.id);
  }
  // A few page views so "most viewed" looks alive
  units.forEach((u, i) => k.prepare('UPDATE unit SET dilihat = ? WHERE kode = ?').run(40 + ((i * 53) % 260), u.kode));

  await browser.close();
  console.log('demo data ready:', k.prepare('SELECT COUNT(*) n FROM unit').get().n, 'units,', k.prepare('SELECT COUNT(*) n FROM prospek').get().n, 'enquiries');
})().catch((e) => { console.error(e); process.exit(1); });
