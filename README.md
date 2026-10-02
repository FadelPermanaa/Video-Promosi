# Linea.js — Video Promosi

Semua video promosi buatan **Linea.js** dikumpulkan di satu tempat: promo setiap proyek, demo Kasir Warkop, showreel studio, dan story highlight Instagram.

Semua video:
- memakai **watermark Linea.js** sejak frame pertama;
- ditutup **animasi logo Linea.js**;
- memakai musik dan efek suara yang dibuat lewat kode, jadi **bebas hak cipta**.

## Daftar video

| Video | Durasi | 16:9 (YouTube, website) | 9:16 (Reels, TikTok, Status WA) |
|---|---|---|---|
| **Sparkle Wash** — sistem cuci kendaraan | 34 dtk | [sparkle-wash-promo-16x9.mp4](sparkle-wash/output/sparkle-wash-promo-16x9.mp4) | [sparkle-wash-promo-9x16.mp4](sparkle-wash/output/sparkle-wash-promo-9x16.mp4) |
| **Menu Digital Warkop** — pesan lewat WhatsApp | 34 dtk | [warkop-promo-16x9.mp4](menu-digital-warkop/output/warkop-promo-16x9.mp4) | [warkop-promo-9x16.mp4](menu-digital-warkop/output/warkop-promo-9x16.mp4) |
| **Kasir Warkop** — demo kasir offline | 66 dtk | [kasir-warkop-demo-16x9.mp4](kasir-warkop-demo/output/kasir-warkop-demo-16x9.mp4) | [kasir-warkop-demo-9x16.mp4](kasir-warkop-demo/output/kasir-warkop-demo-9x16.mp4) |
| **Web F&B** — pemesanan online | 34 dtk | [fnb-promo-16x9.mp4](web-fnb/output/fnb-promo-16x9.mp4) | [fnb-promo-9x16.mp4](web-fnb/output/fnb-promo-9x16.mp4) |
| **Katalog Motor** — jual beli motor baru & bekas | 34 dtk | [motor-promo-16x9.mp4](katalog-motor/output/motor-promo-16x9.mp4) | [motor-promo-9x16.mp4](katalog-motor/output/motor-promo-9x16.mp4) |
| **Linea.js Showreel** | 34 dtk | [lineajs-showreel-16x9.mp4](linea-showreel/output/lineajs-showreel-16x9.mp4) | [lineajs-showreel-9x16.mp4](linea-showreel/output/lineajs-showreel-9x16.mp4) |

### Story Highlight Instagram Linea.js

Lima video vertikal (1080×1920), satu per highlight. Semuanya di bawah 60 detik, jadi masing-masing muat dalam satu story. Cover setiap highlight ada di [`linea-story-highlight/output/covers/`](linea-story-highlight/output/covers).

| Highlight | Durasi | Video |
|---|---|---|
| Tentang | 31 dtk | [1-tentang.mp4](linea-story-highlight/output/1-tentang.mp4) |
| Layanan | 38 dtk | [2-layanan.mp4](linea-story-highlight/output/2-layanan.mp4) |
| Karya | 52 dtk | [3-karya.mp4](linea-story-highlight/output/3-karya.mp4) |
| Proses | 38 dtk | [4-proses.mp4](linea-story-highlight/output/4-proses.mp4) |
| Tanya & Kontak | 40 dtk | [5-kontak.mp4](linea-story-highlight/output/5-kontak.mp4) |

Cara memasangnya sebagai highlight ada di [linea-story-highlight/README.md](linea-story-highlight/README.md).

## Isi repo

| Folder | Isi |
|---|---|
| `brand/` | Watermark dan animasi penutup Linea.js, dipakai semua video |
| `sparkle-wash/`, `menu-digital-warkop/`, `kasir-warkop-demo/`, `web-fnb/`, `katalog-motor/`, `linea-showreel/` | Satu folder per video: animasi (`stage.html`), musik (`audio.py`), screenshot, dan hasil di `output/` |
| `linea-story-highlight/` | Story Instagram: naskah (`stories.js`), animasi, musik, dan hasil di `output/` |

Setiap folder punya README sendiri berisi alur video dan cara render ulang.

## Render ulang

Perlu **Node.js**, **Python 3**, dan **ffmpeg**:

```bash
cd <folder-video>
npm install
npx playwright install chromium   # sekali saja
npm run build                     # → output/*.mp4
```

Screenshot yang dipakai sudah tersimpan di folder `shots/` masing-masing, jadi render ulang tidak butuh aplikasinya. Aplikasi baru dibutuhkan kalau mau mengambil screenshot baru dengan `capture.js`. Dalam kasus itu, clone repo aplikasinya bersebelahan dengan repo ini, misalnya:

```
github/
├── video-promosi/
├── Washing-Service/
├── warkop-kedai-kopi/
├── web-f-b/
└── web-katalog-penjualan-motor-baru-bekas/
```
