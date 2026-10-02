# Video Promosi — PawFlow (sistem petshop)

> Aplikasi yang direkam ada di repo **Petshop**. Skrip `capture.js` mengharapkan repo itu di-clone bersebelahan dengan repo ini (`../Petshop`).

Video promosi 30 detik untuk **pemilik petshop, grooming, dan penitipan hewan**. Semua layar di video adalah tampilan asli aplikasi PawFlow dengan data demo toko contoh **"Paw & Purr Bali"**, lalu dianimasikan. Musik dan efek suara dibuat lewat kode, jadi bebas hak cipta.

| File | Ukuran | Untuk |
|---|---|---|
| `video/petshop/petshop-promo-16x9.mp4` | 1920×1080 | YouTube, website, presentasi |
| `video/petshop/petshop-promo-9x16.mp4` | 1080×1920 | Instagram Reels, TikTok, YouTube Shorts, Status WA |

Setiap video diberi **watermark Linea.js di pojok** sejak detik pertama (kanan bawah untuk 16:9, kanan atas untuk 9:16) dan ditutup **animasi logo Linea.js** selama 3,6 detik. `build.sh` menambahkannya otomatis lewat [`../brand/`](../brand/README.md).

## Alur video

| Detik | Adegan | Isi |
|---|---|---|
| 0–4,6 | Masalah | Chat pelanggan berdatangan, notifikasi 99+. *"Jadwal grooming di buku? Stok pakan habis mendadak? Alergi anabul lupa dicatat?"* |
| 4,6–8,6 | Solusi | Layar disapu warna merek, logo **PawFlow** dan tagline |
| 8,6–14 | Grooming | Papan grooming: Bruno digeser ke *Checked in*, Mochi ke *Ready* |
| 14–19,4 | Paspor & penitipan | Paspor digital Mochi dengan peringatan alergi, lalu tugas makan sore Coco dicentang dan kabar terkirim ke pemilik |
| 19,4–24,6 | Kasir & stok | Penjualan baru (pakan kitten + mainan, QRIS), stok di dasbor langsung berkurang, lalu laporan |
| 24,6–30 | Ajakan (CTA) | Jejak kaki hewan, kartu *"Petshop makin rapi, anabul makin happy."* dan tombol **Minta Demo Gratis** |

## Mengubah teks lalu render ulang

Semua teks utama ada di `CONFIG` di bagian atas `<script>` dalam [stage.html](stage.html): judul, tagline, kalimat CTA, tombol, dan baris kaki. Teks lain (isi chat di adegan pembuka, judul tiap adegan) langsung ada di HTML-nya.

```bash
cd aset/petshop
npm install                     # GSAP + Playwright
npx playwright install chromium # sekali saja
npm run build                   # → output/*.mp4  (perlu ffmpeg dan python3)
```

- **Lihat animasinya tanpa render:** buka `stage.html` di browser (tambahkan `?f=v` untuk versi vertikal).
- **Cek satu frame:** `node render.js h 12.5,27` → `preview/h-12.5.jpg`.
- Kalau `ffmpeg` tidak ada di PATH: `FFMPEG=/lokasi/ffmpeg npm run build`.

## Mengambil ulang screenshot aplikasi

Perlu dilakukan kalau tampilan aplikasi berubah:

```bash
# di repo Petshop
npm install
mkdir -p .openai && echo '{"d1":"DB","r2":"FILES"}' > .openai/hosting.json   # kalau belum ada
npm run dev -- --port 5310

# di folder ini, terminal lain
BASE_URL=http://localhost:5310 node capture.js   # → shots/*.png + shots/marks.json
```

- `capture.js` tidak menyimpan apa pun ke aplikasi: penyimpanan dijawab oleh skrip, jadi setiap kali dijalankan datanya kembali ke toko demo bawaan.
- Kalau database lokal aplikasi sudah berisi data lain, hapus folder `.wrangler/state` di repo Petshop dulu.
- Tombol di judul halaman (misalnya "+ Add appointment") tampil putih di atas putih di aplikasinya. `capture.js` menggambarnya dengan warna yang dimaksud aplikasi (hijau).
- Posisi ketukan dan kotak sorotan ada di `shots/marks.json`. Kalau angkanya berubah, salin ke `MARKS` di `stage.html`.

## Isi folder

| File | Fungsi |
|---|---|
| `stage.html` | Semua adegan dan animasi (GSAP), ukuran 1920×1080 atau 1080×1920 |
| `render.js` | Merekam `stage.html` frame demi frame (30 fps) dengan Chromium |
| `audio.py` | Membuat musik dan efek suara (Python standar, tanpa library tambahan) |
| `capture.js` | Mengambil screenshot dari aplikasi demo |
| `build.sh` | Audio + render + encode jadi MP4 + watermark & penutup Linea.js |
| `shots/` | Screenshot aplikasi yang dipakai di video |
| `fonts/` | Font Poppins |
