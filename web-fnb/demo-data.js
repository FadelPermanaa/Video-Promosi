// Fills a FRESH copy of the app with believable demo data for the promo video.
//   cd <copy of web-f-b> && rm -rf data && node alat/isi-contoh.js && node <this file>
// Orders go through the app's own services (pesananService), so totals,
// quotas, stock and status history are exactly what the app would produce.
'use strict';
const fs = require('fs');
const path = require('path');
const APP = process.cwd();
const req = (p) => require(path.join(APP, p));
req('config/lengkapiEnv')();

const db = req('services/db');
const waktu = req('services/waktu');
const pengaturan = req('services/pengaturanService');
const pesanan = req('services/pesananService');
const qris = req('services/qrisService');
const k = db.buka();

// ---- Shop settings
const QR = qris.tempelkanCrc(qris.rakitTlv([
  { tag: '00', nilai: '01' }, { tag: '01', nilai: '11' },
  { tag: '26', nilai: qris.rakitTlv([{ tag: '00', nilai: 'ID.CO.QRIS.WWW' }, { tag: '01', nilai: '936000000000000000' }, { tag: '02', nilai: 'DEMO00000000000' }, { tag: '03', nilai: 'UMI' }]) },
  { tag: '51', nilai: qris.rakitTlv([{ tag: '00', nilai: 'ID.CO.QRIS.WWW' }, { tag: '02', nilai: 'ID0000000000000' }, { tag: '03', nilai: 'UMI' }]) },
  { tag: '52', nilai: '5812' }, { tag: '53', nilai: '360' }, { tag: '58', nilai: 'ID' },
  { tag: '59', nilai: 'DAPUR BU RATNA DEMO' }, { tag: '60', nilai: 'JAKARTA SELATAN' }, { tag: '61', nilai: '12810' },
]));
const set = {
  nama_usaha: 'Dapur Bu Ratna',
  tagline: 'Nasi box & masakan rumahan, diantar sesuai jadwal',
  alamat_usaha: 'Jl. Tebet Raya No. 12, Jakarta Selatan 12810',
  telepon_wa: '6281200001234',
  jam_operasional: '08:00 - 19:00',
  warna_utama: '#A4471F',
  warna_latar: '#FBF6F1',
  catatan_area_layanan: 'Pengiriman untuk area Jakarta Selatan & sekitarnya.',
  rekening_bank: 'BCA 0000000000 a.n. Dapur Bu Ratna',
  qris_payload: QR,
  qris_nama_merchant: 'DAPUR BU RATNA',
  kuota_harian_bawaan: '120',
};
const up = k.prepare('INSERT INTO pengaturan (kunci, nilai) VALUES (?, ?) ON CONFLICT(kunci) DO UPDATE SET nilai = excluded.nilai');
for (const [a, b] of Object.entries(set)) up.run(a, b);
pengaturan.muatUlang?.();

k.prepare("UPDATE outlet SET nama = 'Dapur Tebet', alamat = 'Jl. Tebet Raya No. 12, Tebet, Jakarta Selatan', jam_buka = '08:00', jam_tutup = '19:00', lat = -6.2265, lng = 106.8530").run();
const outletId = k.prepare('SELECT id FROM outlet LIMIT 1').get().id;
k.prepare('UPDATE kapasitas_tanggal SET kuota = 120').run();

// ---- Menu with illustrated photos
k.exec('DELETE FROM pesanan_item; DELETE FROM pesanan; DELETE FROM stok_tanggal; DELETE FROM varian_produk; DELETE FROM produk; DELETE FROM kategori;');
const gambarDir = path.join(APP, 'data', 'gambar');
fs.mkdirSync(gambarDir, { recursive: true });
const kat = {};
['Nasi & Lauk', 'Nasi Box & Tumpeng', 'Minuman'].forEach((n, i) => { kat[n] = k.prepare('INSERT INTO kategori (nama, urutan, aktif) VALUES (?, ?, 1)').run(n, i).lastInsertRowid; });
const MENU = [
  ['Nasi & Lauk', 'NL-01', 'Nasi Ayam Bakar Madu', 28000, 'Ayam kampung bakar madu, lalapan, sambal terasi.', 'ayam-bakar'],
  ['Nasi & Lauk', 'NL-02', 'Nasi Rendang Sapi', 35000, 'Rendang dimasak 6 jam, daun singkong, sambal ijo.', 'rendang'],
  ['Nasi & Lauk', 'NL-03', 'Ayam Geprek Sambal Matah', 25000, 'Ayam crispy, sambal matah segar, timun.', 'geprek'],
  ['Nasi Box & Tumpeng', 'NB-01', 'Nasi Box Komplit', 38000, 'Untuk rapat & acara. Nasi, ayam, sayur, sambal.', 'nasi-box'],
  ['Nasi Box & Tumpeng', 'NB-02', 'Tumpeng Mini', 45000, 'Nasi kuning, ayam, telur, urap. Untuk 1–2 orang.', 'tumpeng'],
  ['Minuman', 'MN-01', 'Es Teh Manis', 8000, 'Teh melati, gula asli.', 'es-teh'],
  ['Minuman', 'MN-02', 'Es Kopi Susu Gula Aren', 18000, 'Espresso, susu segar, gula aren.', 'kopi-aren'],
  ['Minuman', 'MN-03', 'Es Jeruk Peras', 10000, 'Jeruk peras segar tanpa pemanis buatan.', 'es-jeruk'],
];
const pid = {};
MENU.forEach(([kt, kode, nama, harga, desk, img], i) => {
  const file = `produk-demo-${img}.png`;
  fs.copyFileSync(path.join(__dirname, 'produk', img + '.png'), path.join(gambarDir, file));
  pid[kode] = k.prepare('INSERT INTO produk (kode, nama, deskripsi, harga, gambar, kategori_id, urutan, aktif) VALUES (?, ?, ?, ?, ?, ?, ?, 1)')
    .run(kode, nama, desk, harga, file, kat[kt], i).lastInsertRowid;
});

// ---- Orders over the coming days (and some past ones for the report)
const NAMA = ['Rina Kusuma', 'Andi Pratama', 'Siti Aminah', 'Budi Santoso', 'Dewi Lestari', 'PT Maju Bersama', 'Yoga Saputra', 'Maya Putri', 'Hendra Wijaya', 'Lina Marlina', 'Fajar Nugroho', 'Ayu Wulandari', 'Rizky Ramadhan', 'Nadia Safitri'];
const JALAN = ['Jl. Tebet Barat Dalam No. 7, Tebet', 'Jl. Kasablanka Raya No. 88, Menteng Dalam', 'Jl. Pancoran Timur II No. 3, Pancoran', 'Jl. Saharjo No. 21, Manggarai', 'Jl. Mampang Prapatan IV No. 15, Mampang', 'Jl. Kalibata Utara No. 9, Pancoran'];
let n = 0;
const rnd = (() => { let s = 11; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
const pick = (a) => a[Math.floor(rnd() * a.length)];
function order(tanggal, opts = {}) {
  const items = opts.items || [[pick(['NL-01', 'NL-02', 'NL-03', 'NB-01']), 1 + Math.floor(rnd() * 4)], [pick(['MN-01', 'MN-02', 'MN-03']), 1 + Math.floor(rnd() * 3)]];
  const nama = opts.nama || NAMA[n % NAMA.length];
  n++;
  const kirim = opts.metode ? opts.metode === 'kirim' : rnd() > 0.25;
  const hasil = pesanan.buat({
    tokenSesi: 'demo-' + n, tanggal, outletId, metode: kirim ? 'kirim' : 'ambil',
    penerima: { nama, telepon: '0812' + String(10000000 + n * 7919).slice(0, 8), alamat_teks: pick(JALAN) + ', Jakarta Selatan', patokan: 'Pagar hitam' },
    item: items.map(([kode, qty]) => ({ id: pid[kode], varian_id: null, qty })),
    catatan: opts.catatan || '',
  });
  return hasil.kode;
}
// Order placed `daysBefore` days before delivery, at a believable hour; history follows it.
function backdate(kode, delivery, daysBefore = 1) {
  const id = k.prepare('SELECT id FROM pesanan WHERE kode = ?').get(kode).id;
  const t = new Date(delivery + 'T00:00:00+07:00');
  t.setDate(t.getDate() - daysBefore);
  t.setUTCHours(1 + Math.floor(rnd() * 12), Math.floor(rnd() * 60));
  k.prepare('UPDATE pesanan SET tanggal_kirim = ?, dibuat_pada = ?, diubah_pada = ? WHERE id = ?').run(delivery, t.toISOString(), t.toISOString(), id);
  k.prepare('SELECT id FROM riwayat_status WHERE pesanan_id = ? ORDER BY id').all(id).forEach((r, i) => {
    const h = new Date(t.getTime() + i * (i < 2 ? 25 : 300) * 60000);
    k.prepare('UPDATE riwayat_status SET pada = ? WHERE id = ?').run(h.toISOString(), r.id);
  });
}
const pay = (kode) => { pesanan.konfirmasiBayar(kode, 'qris'); pesanan.setujuiBayar(kode, 'admin'); };

const today = waktu.hariIni();
const addDays = (d, x) => { const t = new Date(d + 'T00:00:00'); t.setDate(t.getDate() + x); return t.toISOString().slice(0, 10); };
const local = (d) => { const z = (v) => String(v).padStart(2, '0'); return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`; };
const plus = (x) => { const t = new Date(today + 'T12:00:00'); t.setDate(t.getDate() + x); return local(t); };

// Upcoming: day+1 busy, day+3 nearly full, others normal
const plan = { 1: 9, 2: 6, 3: 0, 4: 4, 5: 3, 6: 2, 8: 2 };
const codes = [];
for (const [d, count] of Object.entries(plan)) for (let i = 0; i < count; i++) codes.push([+d, order(plus(+d))]);
// A big office order for day+2
codes.push([2, order(plus(2), { nama: 'PT Maju Bersama', metode: 'kirim', items: [['NB-01', 25], ['MN-01', 25]], catatan: 'Untuk rapat jam 12.00, mohon datang 11.30' })]);
// Payment / status mix for the upcoming orders
codes.forEach(([d, kode], i) => {
  if (i % 5 !== 4) pay(kode);
  else if (i % 2) pesanan.konfirmasiBayar(kode, 'qris');
  if (d === 1 && i % 5 !== 4) pesanan.ubahStatus(kode, 'diproses', 'admin');
});
// Nearly-full and full days via the quota table (what the calendar reads)
k.prepare('INSERT INTO kapasitas_tanggal (tanggal, outlet_id, kuota, terpakai) VALUES (?, ?, 120, 116) ON CONFLICT(tanggal, outlet_id) DO UPDATE SET kuota = 120, terpakai = 116').run(plus(3), outletId);
k.prepare("INSERT INTO kapasitas_tanggal (tanggal, outlet_id, kuota, terpakai) VALUES (?, ?, 120, 120) ON CONFLICT(tanggal, outlet_id) DO UPDATE SET kuota = 120, terpakai = 120").run(plus(7), outletId);

// Past month for the report: create for a future date, then move the date back.
for (let back = 1; back <= 30; back++) {
  const count = 3 + Math.floor(rnd() * 6) + (new Date(plus(-back)).getDay() % 6 === 0 ? 3 : 0);
  for (let i = 0; i < count; i++) {
    k.prepare('DELETE FROM kapasitas_tanggal WHERE tanggal = ?').run(plus(10));
    const kode = order(plus(10));
    pay(kode);
    pesanan.ubahStatus(kode, 'diproses', 'admin');
    pesanan.ubahStatus(kode, 'dikirim', 'admin');
    pesanan.ubahStatus(kode, 'selesai', 'admin');
    backdate(kode, plus(-back), 1 + Math.floor(rnd() * 3));
  }
}
// Today's deliveries, ordered over the last days
for (let i = 0; i < 8; i++) {
  k.prepare('DELETE FROM kapasitas_tanggal WHERE tanggal = ?').run(plus(10));
  const kode = order(plus(10));
  pay(kode);
  pesanan.ubahStatus(kode, 'diproses', 'admin');
  if (i < 3) pesanan.ubahStatus(kode, 'dikirim', 'admin');
  if (i < 1) pesanan.ubahStatus(kode, 'selesai', 'admin');
  backdate(kode, today, 1 + (i % 3));
}
k.prepare('DELETE FROM kapasitas_tanggal WHERE tanggal = ?').run(plus(10));
// Upcoming orders were placed over the last two days
codes.forEach(([d, kode], i) => {
  const id = k.prepare('SELECT id, tanggal_kirim FROM pesanan WHERE kode = ?').get(kode);
  const t = new Date(Date.now() - (i % 7) * 3.1 * 3600000 - 20 * 60000);
  k.prepare('UPDATE pesanan SET dibuat_pada = ?, diubah_pada = ? WHERE kode = ?').run(t.toISOString(), t.toISOString(), kode);
});
console.log('demo data:', k.prepare('SELECT COUNT(*) n FROM pesanan').get().n, 'orders; today', today);
