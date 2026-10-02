# Video Promosi — Sistem Pemesanan F&B

> Aplikasi/website yang direkam ada di repo **web-f-b**. Skrip `capture.js` mengharapkan repo itu di-clone bersebelahan dengan repo ini (`../web-f-b`).

Video promosi 30 detik untuk **pemilik usaha makanan & minuman dengan pengiriman terjadwal** (katering, nasi box, kue, frozen food). Semua layar di video adalah tampilan asli aplikasi ini dengan data demo toko contoh **"Dapur Bu Ratna"**, lalu dianimasikan. Musik dan efek suara dibuat lewat kode, jadi bebas hak cipta.

| File | Ukuran | Untuk |
|---|---|---|
| [output/fnb-promo-16x9.mp4](output/fnb-promo-16x9.mp4) | 1920×1080 | YouTube, website, presentasi |
| [output/fnb-promo-9x16.mp4](output/fnb-promo-9x16.mp4) | 1080×1920 | Instagram Reels, TikTok, YouTube Shorts, Status WA |

Setiap video diberi **watermark Linea.js di pojok** sejak detik pertama (kanan bawah untuk 16:9, kanan atas untuk 9:16) dan ditutup **animasi logo Linea.js** selama 3,6 detik. `build.sh` menambahkannya otomatis lewat [`../brand/`](../brand/README.md).

## Alur video

| Detik | Adegan | Isi |
|---|---|---|
| 0–4,6 | Masalah | Chat pelanggan berdatangan, notifikasi 99+. *"Pesanan numpuk di chat. Tanggal kirim ketuker. Bukti transfer tercecer?"* |
| 4,6–8,6 | Solusi | Layar disapu warna merek, judul **Sistem Pemesanan F&B** |
| 8,6–14 | Pesan dari HP | Pelanggan memilih tanggal di kalender kuota, lalu menambah menu ke keranjang |
| 14–19,4 | Bayar QRIS | QR dengan nominal tertanam dipindai, konfirmasi bayar, halaman status "Pembayaran diterima" |
| 19,4–24,6 | Panel pemilik | Beranda (bukti bayar yang perlu dicek), daftar pesanan, kalender kuota, laporan bulanan |
| 24,6–30 | Ajakan (CTA) | Kurir motor datang membawa kotak, kartu *"Jualan makin rapi, pesanan makin lancar."* dan tombol **Minta Demo Gratis** |

## Mengubah teks lalu render ulang

Semua teks utama ada di `CONFIG` di bagian atas `<script>` dalam [stage.html](stage.html): judul, tagline, kalimat CTA, tombol, dan baris kaki. Teks lain (isi chat di adegan pembuka, judul tiap adegan) langsung ada di HTML-nya.

```bash
cd web-fnb
npm install                     # GSAP + Playwright
npx playwright install chromium # sekali saja
npm run build                   # → output/*.mp4  (perlu ffmpeg dan python3)
```

- **Lihat animasinya tanpa render:** buka `stage.html` di browser (tambahkan `?f=v` untuk versi vertikal).
- **Cek satu frame:** `node render.js h 12.5,27` → `preview/h-12.5.jpg`.
- Kalau `ffmpeg` tidak ada di PATH: `FFMPEG=/lokasi/ffmpeg npm run build`.

## Mengambil ulang screenshot aplikasi

Perlu dilakukan kalau tampilan aplikasi berubah. **Jalankan di salinan proyek**, karena data demo akan menimpa isi database:

```bash
# di salinan folder proyek
rm -rf data
node alat/isi-contoh.js
node <folder ini>/demo-data.js      # Dapur Bu Ratna: menu, ±200 pesanan, kuota, QRIS demo
PORT=3100 node server.js

# di folder ini, terminal lain
BASE_URL=http://localhost:3100 DATA_DIR=<salinan>/data node capture.js   # → shots/*.png + shots/taps.json
```

- Posisi animasi ketukan jari ada di `shots/taps.json`. Kalau angkanya berubah, salin ke `TAPS` di `stage.html`.
- Halaman aplikasi dirender dengan font Roboto (seperti di HP Android), bukan font cadangan bawaan Linux.
- QRIS di video adalah kode **demo** yang tidak terhubung ke rekening mana pun.

## Isi folder

| File | Fungsi |
|---|---|
| `stage.html` | Semua adegan dan animasi (GSAP), ukuran 1920×1080 atau 1080×1920 |
| `render.js` | Merekam `stage.html` frame demi frame (30 fps) dengan Chromium |
| `audio.py` | Membuat musik dan efek suara (Python standar, tanpa library tambahan) |
| `demo-data.js` | Mengisi data demo "Dapur Bu Ratna" lewat service aplikasi sendiri |
| `illus.html`, `illus.js` | Menggambar ilustrasi foto menu (`produk/`) |
| `capture.js` | Mengambil screenshot dari aplikasi demo |
| `build.sh` | Audio + render + encode jadi MP4 |
| `shots/` | Screenshot aplikasi yang dipakai di video |
| `fonts/` | Font Poppins (video) dan Roboto (tampilan aplikasi) |
| `output/` | Video jadi |
