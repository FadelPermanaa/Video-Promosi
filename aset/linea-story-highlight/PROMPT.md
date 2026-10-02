# Prompt — Seri Story & Highlight Instagram Linea.js

> Dokumen ini adalah brief lengkap untuk membuat seri Story Instagram yang menjelaskan **apa itu Linea.js, apa saja yang dikerjakan, contoh hasilnya, cara kerja, dan cara menghubungi**. Seluruh story nanti disimpan sebagai **Highlight** di profil @linea.js.
>
> Semua visual dibuat **baru**. Tidak ada screenshot website linea.js. Fakta (layanan, proses, angka, proyek) tetap diambil dari website supaya isinya sama dan tidak ada yang dikarang.

---

## 1. Tujuan

Orang yang baru mampir ke profil @linea.js bisa paham dalam **±1 menit per highlight**:

1. Linea.js itu siapa.
2. Bisa bikin apa saja.
3. Pernah bikin apa (bukti).
4. Prosesnya bagaimana, dan aman tidak.
5. Cara mulai ngobrol.

**Target penonton:** pemilik usaha kecil–menengah di Indonesia (F&B, toko, apotek, jasa, rental, dealer) yang belum tentu paham istilah teknis.

**Satu kalimat inti:** *Website & aplikasi yang bikin usaha jalan lebih rapi, dibuat dari nol sesuai cara kerja usahamu.*

---

## 2. Format teknis (wajib)

| Hal | Ketentuan |
|---|---|
| Ukuran | 1080 × 1920 px (9:16), 30 fps, MP4 H.264 + AAC |
| Durasi | Setiap bagian 5–8 detik. Satu video per highlight jadi 25–50 detik (di bawah 60 detik) |
| Zona aman | **Atas 260 px dan bawah 340 px tidak boleh ada teks penting.** Atas tertutup nama akun dan bar progres, bawah tertutup kolom balas |
| Samping | Margin minimal 70 px kiri–kanan |
| Teks | Minimal 44 px untuk isi, 80–120 px untuk judul. Maksimal ±20 kata per story |
| Watermark | Logo Linea.js di pojok kanan atas, **di dalam zona aman** (y ≈ 270 px), bukan y = 150 seperti video biasa |
| Penutup | Animasi logo Linea.js 3,6 detik (`marketing/brand/`) sekali, di akhir setiap video |
| Suara | Satu lagu utuh per video (dibuat lewat kode, bebas hak cipta) dengan pergantian bagian tepat di ketukan, ditambah efek suara yang mengikuti animasi. Isi tetap harus jelas walau ditonton **tanpa suara**, karena banyak orang menonton story dengan mute |
| Transisi | Satu animasi utuh, bukan potongan yang disambung. Isi lama terangkat keluar, panel biru dengan logo menyapu layar, lalu isi baru masuk. Latar tetap bergerak sepanjang video |
| Cover highlight | 1080 × 1920 PNG, ikon di tengah dalam lingkaran aman Ø 600 px, latar biru Linea.js |

---

## 3. Identitas visual (baru, bukan dari website)

- **Logo:** tanda X biru dengan empat titik bulat + tulisan "Linea.js" (file `marketing/brand/assets/linea-mark.png`).
- **Warna:**
  - Biru utama `#2231F6`
  - Biru tua (teks) `#0D208D`
  - Biru muda aksen `#68C4FF`
  - Putih `#FFFFFF`
  - Abu kebiruan `#F2F5FF` (latar)
  - Satu warna aksen hangat untuk tombol/sorotan: kuning `#FFB423`
- **Huruf:** Poppins (800 untuk judul, 600 untuk sub, 400–500 untuk isi).
- **Motif:** garis tipis bercabang seperti jalur sirkuit yang ada di logo. Garis "mengalir" dari satu story ke story berikutnya, sesuai ide "Linea" = garis.
- **Ilustrasi:** bentuk datar dan sederhana (HP, laptop, struk, kalender, keranjang, grafik), dibuat dengan SVG atau HTML. Tidak memakai foto stok dan tidak memakai gambar orang sungguhan.
- **Gerak:** masuk cepat (0,4–0,6 detik, *ease out*), sisa waktu tenang untuk dibaca, transisi antar story memakai garis yang menyapu layar.

---

## 4. Struktur highlight

Lima highlight, urut dari kiri ke kanan di profil:

| # | Highlight | Ikon cover | Jumlah story |
|---|---|---|---|
| 1 | **Tentang** | tanda X | 4 |
| 2 | **Layanan** | kotak-kotak (grid) | 5 |
| 3 | **Karya** | bintang/medali | 7 |
| 4 | **Proses** | anak panah melingkar | 5 |
| 5 | **Tanya & Kontak** | gelembung chat | 5 |

**Total 26 story**, kira-kira 2,5–3 menit kalau semua ditonton.

---

## 5. Naskah per story

Teks di bawah adalah teks yang **tampil di layar**. Bagian dalam kurung adalah arahan visual.

### Highlight 1 — Tentang

1. **"Halo, ini Linea.js."**
   Sub: *Studio web independen dari Indonesia.*
   (Logo X tergambar dari garis, lalu tulisan muncul.)
2. **"Kami bikin website & aplikasi untuk usaha."**
   Sub: *Dari tampilan, server, sampai database.*
   (Garis menghubungkan ikon: layar → server → database.)
3. **"Bukan template. Dibuat dari nol."**
   Sub: *Tanpa page builder, tanpa biaya bulanan misterius, tidak menghilang setelah launching.*
   (Tiga ikon dicoret: template, tagihan misterius, hantu.)
4. **"10+ proyek · 2 tahun · balasan < 6 jam"**
   Sub: *Rata-rata skor kecepatan (Lighthouse) 98.*
   (Angka berhitung naik, lalu animasi penutup logo.)

### Highlight 2 — Layanan

1. **"Bisa bikin apa saja?"** (Empat kartu layanan berputar masuk.)
2. **"01 · Website peluncuran"**
   *Halaman cepat dan tajam untuk produk, kampanye, atau profil usaha.*
   Label: strategi · susunan copy · animasi
3. **"02 · Pemesanan & booking"**
   *Pesan, jadwal, bayar, dan panel admin yang sesuai cara usahamu berjalan.*
   Label: pembayaran · stok · otomatisasi
4. **"03 · Sistem internal"**
   *Dashboard dan sistem operasional pengganti spreadsheet berserakan dan chat yang tercecer.*
   Label: peran akun · laporan · database
5. **"04 · Sistem AI"**
   *Asisten & integrasi AI yang jelas batasnya, tetap ada manusia saat dibutuhkan.*
   Label: LLM · alur kerja · integrasi
   (Animasi penutup logo.)

### Highlight 3 — Karya

Setiap proyek digambar ulang sebagai **ilustrasi/mockup baru**, bukan screenshot website. Satu story untuk setiap proyek: nama + jenis + satu kalimat hasil + 2–3 label teknologi. **Nama brand klien tidak ditampilkan**: setiap proyek disebut dengan jenis sistemnya.

1. **"Sudah bikin apa saja?"** (Lima kartu proyek mengalir di satu garis.)
2. **Sport Booking System** — *Booking lapangan olahraga*
   *Jadwal lapangan real-time, pembayaran aman, kuota member, tarif bisa diubah pemilik tanpa coding.*
3. **Sistem Kasir Apotek** — *Kasir & stok obat*
   *Kasir cepat pakai keyboard, menolak obat kedaluwarsa, mencatat setiap pergerakan stok, backup otomatis.*
4. **Sistem Alat Berat** — *Manajemen armada*
   *Lacak pemakaian alat, deteksi jam mesin yang tidak tercatat, pantau efisiensi BBM, cek laporan lapangan sebelum ditagih.*
5. **F&B Ordering System** — *Pemesanan toko kue*
   *Pesan dalam 4 langkah sesuai kapasitas dapur, cek pembayaran, panel pemilik yang praktis.*
6. **Dealership Website** — *Katalog & CRM motor*
   *Katalog motor bekas dengan filter pintar, perbandingan, dan pengelolaan calon pembeli.*
7. **"Lima jenis usaha, lima sistem berbeda."**
   Sub: *Semuanya dibentuk dari apa yang terjadi setelah pelanggan menekan tombol.*
   (Animasi penutup logo.)

### Highlight 4 — Proses

1. **"Dari 'aku punya ide' sampai rencana jelas, cuma 4 langkah."**
2. **"01 · Kirim brief"**
   *Pilih kebutuhan, kisaran budget, dan kapan harus jadi. Tidak perlu dokumen rapi.*
3. **"02 · Dibalas dengan arah"**
   *Dalam 1 hari kerja, kamu dapat pertanyaan yang benar-benar menentukan hasilnya.*
4. **"03 · Ngobrol 30 menit"**
   *Sepakati pengguna, batasan, ruang lingkup, dan kapan dianggap selesai.*
5. **"04 · Terima rencana pasti"**
   *Ruang lingkup, jadwal, harga, dan milestone pertama. Tinggal setujui atau tidak.*
   (Stempel "SIAP", lalu animasi penutup logo.)

### Highlight 5 — Tanya & Kontak

1. **"Siapa yang punya hasilnya?"**
   *Kamu. Kode, domain, database, akun, dan dokumentasi diserahkan semua, tanpa terkunci di platform.*
2. **"Berapa lama jadinya?"**
   *Landing page biasanya 1–2 minggu. Sistem dengan akun, pembayaran, atau logika operasional biasanya 4–8 minggu.*
3. **"Bisa lanjutin kode yang sudah ada?"**
   *Sering bisa. Dicek dulu, lalu dijelaskan mana yang lebih hemat: lanjut, dirapikan, atau dibangun ulang.*
4. **"Berapa biayanya?"**
   *Tergantung kebutuhan. Ceritakan lewat DM, nanti kamu dapat rencana dengan harga pasti sebelum kerja dimulai.*
5. **"Punya ide? Kirim versi kasarnya."**
   DM **@linea.js** · email **Lineajs01@gmail.com**
   (Tombol kuning "Kirim DM", lalu animasi penutup logo.)

---

## 6. Aturan isi (jangan dilanggar)

- **Hanya fakta dari website linea.js** (bagian 7). Tidak boleh menambah klien, angka, testimoni, atau janji baru.
- **Tidak ada testimoni palsu** dan tidak ada logo klien yang tidak ada izinnya.
- **Tidak menyebut harga atau angka rupiah.** Pertanyaan biaya diarahkan ke DM.
- **Bahasa Indonesia santai tapi profesional.** Pakai "kamu" dan hindari istilah teknis tanpa penjelasan. Istilah seperti LLM/API boleh muncul sebagai label kecil saja.
- **Satu story, satu pesan.**

---

## 7. Sumber fakta (dari website linea.js)

| Topik | Isi |
|---|---|
| Identitas | Linea JS — studio web independen, satu orang, dari Indonesia. "Websites that keep business moving." |
| Prinsip | No page builders. No mystery retainers. No vanishing after launch. |
| Angka | 10+ projects shipped · 2 years building · 98 average Lighthouse · <6h typical reply |
| Layanan | Launch sites · Commerce & booking · Internal tools · AI systems |
| Proses | Send the brief → I reply with a direction (1 hari kerja) → We align for 30 minutes → You get the fixed plan |
| Kepemilikan | Repository, domain, database, akun, desain, dokumentasi diserahkan |
| Waktu | Landing page 1–2 minggu. Produk dengan akun/pembayaran 4–8 minggu |
| Proyek | Sport Booking System · Sistem Kasir Apotek · Sistem Alat Berat · F&B Ordering System · Dealership Website |
| Kontak | Lineajs01@gmail.com · instagram.com/linea.js |

---

## 8. Hasil yang diserahkan

**Satu video per ide utama (per highlight)**, 25–50 detik, tetap di bawah 60 detik supaya muat dalam satu story. Setiap video berisi semua bagian dari naskah highlight itu secara berurutan.

```
linea.js/marketing/stories/
├── PROMPT.md                ← dokumen ini
├── stage.html               ← semua bagian (GSAP), dipilih lewat ?h=tentang&i=0
├── stories.js               ← teks semua bagian (diubah di sini saja)
├── render.js / audio.py / build.sh / combine.sh
└── output/
    ├── 1-tentang.mp4  2-layanan.mp4  3-karya.mp4  4-proses.mp4  5-kontak.mp4
    └── covers/        tentang.png, layanan.png, karya.png, proses.png, kontak.png
```

- Setiap video ber-watermark dari awal dan diakhiri animasi logo Linea.js sekali.
- README pendek berisi cara upload ke highlight dan cara mengubah teks lalu render ulang.

## 9. Keputusan

| Hal | Keputusan |
|---|---|
| Bahasa | Bahasa Indonesia |
| Harga | Tidak ditampilkan. Pertanyaan biaya diarahkan ke DM |
| Grand Palace | Tidak dimasukkan |
| Proyek di Karya | Lima proyek dari website, disebut dengan jenis sistemnya, bukan nama brand klien |
| Nama brand klien | Tidak ditampilkan di video mana pun |
| Kontak | DM Instagram @linea.js dan email Lineajs01@gmail.com |
| Sapaan | "Kami" |
| Format | Satu video per highlight (bukan per story, bukan satu video untuk semuanya) |
