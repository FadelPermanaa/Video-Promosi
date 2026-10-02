# Aset video

Bahan untuk membuat ulang setiap video di folder [`video/`](../video): animasi, musik, screenshot, naskah, dan cover story. Video jadinya sendiri hanya disimpan di `video/`.

| Folder | Isi |
|---|---|
| `brand/` | Watermark dan animasi penutup Linea.js, dipakai semua video |
| `sparkle-wash/`, `menu-digital-warkop/`, `kasir-warkop-demo/`, `web-fnb/`, `katalog-motor/`, `linea-showreel/` | Satu folder per video: animasi (`stage.html`), musik (`audio.py`), dan screenshot |
| `linea-story-highlight/` | Story Instagram: naskah (`stories.js`), animasi, musik, dan cover highlight di `output/covers/` |
| `sparkle-wash-prompt-ai/` | Prompt video AI (bukan animasi) untuk promosi Sparkle Wash |

Setiap folder punya README sendiri berisi alur video dan cara render ulang.

## Render ulang

Perlu **Node.js**, **Python 3**, dan **ffmpeg**:

```bash
cd aset/<folder-video>
npm install
npx playwright install chromium   # sekali saja
npm run build                     # → output/*.mp4
```

Hasilnya muncul di `output/` folder itu dan tidak ikut ter-commit. Salin video yang sudah oke ke folder yang sama di `video/`.

Screenshot yang dipakai sudah tersimpan di folder `shots/` masing-masing, jadi render ulang tidak butuh aplikasinya. Aplikasinya baru dibutuhkan untuk mengambil screenshot baru dengan `capture.js`, atau untuk `linea-showreel` yang mengambil gambar dari website linea.js. Untuk itu, clone repo aplikasinya bersebelahan dengan repo ini:

```
github/
├── Video-Promosi/
├── Washing-Service/
├── warkop-kedai-kopi/
├── web-f-b/
├── web-katalog-penjualan-motor-baru-bekas/
└── linea.js/
```
