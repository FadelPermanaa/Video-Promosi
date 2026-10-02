# Voice over (ElevenLabs) — Kasir Warkop

Narasi untuk video demo Kasir Warkop. Suara dibuat di ElevenLabs, lalu `mix-voice.py` menaruh setiap kalimat di adegannya, mengecilkan musik saat ada suara, dan menyamakan kerasnya ke −14 LUFS (standar Reels/TikTok/YouTube).

## Naskah

Salin semua baris ini ke ElevenLabs **dalam satu kali generate**, dengan jeda yang jelas di antara kalimat. Tag `<break time="1.2s" />` membuat jeda itu.

```
Internet warung putus pas lagi ramai? Tenang, kasirnya tetap jalan. <break time="1.2s" />
Kenalin, Kasir Warkop. Sistem kasir untuk warkop dan kedai kopi. <break time="1.2s" />
Cukup laptop dan Wi-Fi warung. Internet? Nggak wajib. <break time="1.2s" />
Pesanan meja tiga: dua kopi susu, pisang goreng, teh manis. Catatan gula sedikit juga ikut tercatat. <break time="1.2s" />
Bayar tunai lima puluh ribu, kembaliannya langsung dihitung, struk langsung keluar. <break time="1.2s" />
Pelanggan juga bisa pesan sendiri dari HP di mejanya. Pesanan langsung masuk ke kasir, sekali klik diterima, dan pelanggan langsung dapat kabar. <break time="1.2s" />
Semua meja kelihatan. Bon bisa dipindah, digabung, atau dipisah. <break time="1.2s" />
Stok mau habis? Langsung ketahuan. <break time="1.2s" />
Tutup kas tiap malam. Selisih dua ribu pun kelihatan. <break time="1.2s" />
Laporan bulanan, dari menu terlaris sampai jam paling ramai. <break time="1.2s" />
Kasir Warkop. Internet putus, kasir tetap jalan. Minta demonya sekarang.
```

| # | Adegan | Detik | Waktu maksimal kalimat |
|---|---|---|---|
| 1 | Internet putus | 0–5,5 | 5,1 dtk |
| 2 | Judul | 5,5–10 | 4,1 dtk |
| 3 | Cara kerja | 10–14 | 3,6 dtk |
| 4 | Layar kasir | 14–21 | 6,6 dtk |
| 5 | Pembayaran | 21–26,8 | 5,4 dtk |
| 6 | Pesan dari meja | 26,8–37 | 9,8 dtk |
| 7 | Meja & bon | 37–42,6 | 5,2 dtk |
| 8 | Stok | 42,6–46,8 | 3,8 dtk |
| 9 | Tutup kas | 46,8–51,8 | 4,6 dtk |
| 10 | Laporan | 51,8–56,4 | 4,2 dtk |
| 11 | Ajakan | 56,4–62 | 5,2 dtk |

Logo penutup Linea.js (62–65,6 dtk) tanpa narasi.

**Setelan yang disarankan:** model *Eleven Multilingual v2* atau *Eleven v3*, suara yang hangat dan santai, Stability 45–55 %, Similarity ±75 %, Style 0–15 %, Speed normal.

## Langsung lewat API ElevenLabs

```bash
python3 generate-voice.py --list-voices   # daftar suara di akun (id, nama, bahasa)
ELEVENLABS_VOICE_ID=<id> python3 generate-voice.py   # 11 kalimat → vo/01–11.mp3 → video
python3 generate-voice.py --only 4,6      # ulangi kalimat tertentu saja
```

- Key dibaca dari `ELEVENLABS_API_KEY` dan dikirim sebagai header `xi-api-key`. ElevenLabs **tidak** menerima key lewat header `Authorization`.
- Di sesi cloud: simpan key sebagai environment variable `ELEVENLABS_API_KEY` (atau sebagai API credential dengan header `xi-api-key`), dan izinkan `api.elevenlabs.io` di Network access. Jangan simpan key di repo.
- Tanpa `ELEVENLABS_VOICE_ID`, skrip memilih suara berlabel Indonesia di akun, lalu suara milikmu sendiri, lalu suara pertama yang ada.

## Menggabungkan

```bash
mkdir -p vo && cp <file dari ElevenLabs>.mp3 vo/naskah.mp3
python3 mix-voice.py                      # → output/kasir-warkop-demo-vo-16x9.mp4, -9x16.mp4
# atau satu file per kalimat:  python3 mix-voice.py vo/01.mp3 vo/02.mp3 … vo/11.mp3
```

- Video sumbernya diambil dari `../../video/kasir-warkop-demo/` (gambarnya tidak dirender ulang).
- Skrip mencetak panjang tiap kalimat dibanding waktu yang tersedia. Kalimat yang sedikit kepanjangan dipercepat paling banyak 12 %. Kalau masih ditandai *terlalu panjang*, persingkat kalimatnya atau naikkan Speed di ElevenLabs.
- Kalau skrip tidak menemukan 11 kalimat, jeda di antara kalimat kurang panjang: generate ulang dengan `<break time="1.2s" />`, atau ekspor satu file per kalimat.
