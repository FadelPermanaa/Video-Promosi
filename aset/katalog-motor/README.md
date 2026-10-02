# Video Promosi — Katalog Motor Baru & Bekas

> Aplikasi/website yang direkam ada di repo **web-katalog-penjualan-motor-baru-bekas**. Skrip `capture.js` mengharapkan repo itu di-clone bersebelahan dengan repo ini (`../web-katalog-penjualan-motor-baru-bekas`).

Video promosi 30 detik untuk **pemilik dealer / showroom motor**. Semua layar di video adalah tampilan asli aplikasi ini, memakai data demo dealer contoh **"Sinar Jaya Motor"**, lalu dianimasikan. Musik dan efek suara dibuat lewat kode, jadi bebas hak cipta.

| File | Ukuran | Untuk |
|---|---|---|
| [output/motor-promo-16x9.mp4](output/motor-promo-16x9.mp4) | 1920×1080 | YouTube, website, presentasi |
| [output/motor-promo-9x16.mp4](output/motor-promo-9x16.mp4) | 1080×1920 | Instagram Reels, TikTok, YouTube Shorts, Status WA |

Setiap video diberi **watermark Linea.js di pojok** sejak detik pertama (kanan bawah untuk 16:9, kanan atas untuk 9:16) dan ditutup **animasi logo Linea.js** selama 3,6 detik. `build.sh` menambahkannya otomatis lewat [`../brand/`](../brand/README.md).

## Alur video

| Detik | Adegan | Isi |
|---|---|---|
| 0–4,6 | Masalah | Chat "masih ada gan?" dan foto motor di status WA berserakan. *"“Masih ada, gan?” tiap menit. Foto & harga tercecer. Calon pembeli hilang?"* |
| 4,6–8,6 | Solusi | Layar disapu merah, judul **Katalog Motor Baru & Bekas** |
| 8,6–14 | Katalog online | Halaman depan bergulir sampai daftar unit, halaman Bandingkan 3 unit |
| 14–19,4 | Detail & WhatsApp | Halaman unit bekas (rincian, surat & kondisi), tombol WhatsApp ditekan, pesan WA berisi data unit muncul. Klik itu masuk sebagai prospek |
| 19,4–24,6 | Panel dealer | Beranda (prospek belum dihubungi), daftar prospek (yang baru masuk tersorot), laporan bulan lalu |
| 24,6–30 | Ajakan (CTA) | Motor sport melaju masuk, kartu *"Jual motor lebih cepat, pembeli lebih yakin."* dan tombol **Minta Demo Gratis** |

Isi pesan WhatsApp di video adalah teks asli yang dibuat aplikasi saat tombol WhatsApp ditekan (hanya alamat tautannya yang disingkat).

## Mengubah teks lalu render ulang

Teks utama ada di `CONFIG` di bagian atas `<script>` dalam [stage.html](stage.html): judul, tagline, kalimat CTA, tombol, dan baris kaki. Isi chat pembuka, judul tiap adegan, dan teks WA (`WA_TEXT`) juga ada di file itu.

```bash
cd katalog-motor
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
node alat/isi-demo.js --tanpa-foto
node <folder ini>/demo-data.js      # nama dealer, foto ilustrasi, prospek, penjualan bulan lalu
PORT=3300 node server.js

# di folder ini, terminal lain
node polaroids.js                                     # foto kecil untuk adegan pembuka
BASE_URL=http://localhost:3300 node capture.js        # → shots/*.png + shots/taps.json
```

- `shots/taps.json` berisi posisi tombol WhatsApp dan teks WA yang dibuat aplikasi. Kalau berubah, salin ke `TAPS` dan `WA_TEXT` di `stage.html`.
- **Foto motor adalah ilustrasi**, digambar dari `illus.html` sesuai jenis (matic, maxi, bebek, sport) dan warna tiap unit. Foto stok dari `npm run demo` tidak bisa diunduh di lingkungan pembuatan video ini. Untuk video dengan foto unit sungguhan, unggah fotonya lewat panel admin lalu ambil ulang screenshot.
- Halaman dirender dengan font asli aplikasi (Bodoni Moda, IBM Plex Sans/Mono) dari folder `fonts/`.

## Isi folder

| File | Fungsi |
|---|---|
| `stage.html` | Semua adegan dan animasi (GSAP), ukuran 1920×1080 atau 1080×1920 |
| `render.js` | Merekam `stage.html` frame demi frame (30 fps) dengan Chromium |
| `audio.py` | Membuat musik dan efek suara (Python standar, tanpa library tambahan) |
| `demo-data.js` | Mengisi data demo "Sinar Jaya Motor" lewat service aplikasi sendiri |
| `illus.html` | Ilustrasi foto motor dan odometer |
| `polaroids.js` | Foto kecil motor untuk adegan pembuka |
| `capture.js` | Mengambil screenshot dari aplikasi demo |
| `build.sh` | Audio + render + encode jadi MP4 |
| `shots/` | Screenshot aplikasi yang dipakai di video |
| `fonts/` | Font aplikasi (untuk screenshot) dan untuk video |
| `output/` | Video jadi |
