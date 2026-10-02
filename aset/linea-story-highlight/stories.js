// Text for every Instagram story. Change words here, then run `npm run build`.
// Used by stage.html (animation), audio.py (sound) and render.js (file names).
// Kept as plain JSON after the "=" so audio.py can read it.
window.STORIES = {
  "highlights": [
    {
      "id": "tentang", "title": "Tentang", "icon": "x",
      "stories": [
        { "type": "logo", "d": 6, "title": "Halo, ini <em>Linea.js.</em>", "sub": "Studio web independen dari Indonesia." },
        { "type": "chain", "d": 6.5, "title": "Kami bikin <em>website & aplikasi</em> untuk usaha.", "sub": "Dari tampilan, server, sampai database.", "nodes": ["Tampilan", "Server", "Database"] },
        { "type": "crossed", "d": 7, "title": "Bukan template. <em>Dibuat dari nol.</em>", "items": ["Tanpa page builder", "Tanpa biaya bulanan misterius", "Tidak menghilang setelah launching"] },
        { "type": "stats", "d": 6.5, "title": "Sudah <em>teruji.</em>", "stats": [["10+", "proyek selesai"], ["2", "tahun membangun"], ["98", "rata-rata skor kecepatan (Lighthouse)"], ["< 6 jam", "biasanya sudah dibalas"]] }
      ]
    },
    {
      "id": "layanan", "title": "Layanan", "icon": "grid",
      "stories": [
        { "type": "intro", "d": 5.5, "title": "Bisa bikin <em>apa saja?</em>", "sub": "Empat hal yang paling sering kami kerjakan untuk usaha.", "cards": ["Website & pemesanan F&B", "Sistem kasir (POS)", "Dashboard usaha", "Web app"], "cardIcons": ["food", "pos", "dash", "app"] },
        { "type": "service", "d": 6.5, "n": "01", "icon": "food", "title": "Website <em>& pemesanan F&B</em>", "body": "Menu digital, pesan dari HP atau langsung dari meja, bayar QRIS, dan kuota dapur per hari.", "tags": ["menu digital", "QR meja", "QRIS"] },
        { "type": "service", "d": 6.5, "n": "02", "icon": "pos", "title": "Sistem <em>kasir</em>", "body": "Transaksi cepat, cetak struk, stok berkurang otomatis, dan tutup kasir tiap hari. Tetap jalan tanpa internet.", "tags": ["struk", "stok", "bisa offline"] },
        { "type": "service", "d": 6.5, "n": "03", "icon": "dash", "title": "Dashboard <em>usaha</em>", "body": "Penjualan, stok, dan kinerja karyawan dalam satu layar. Laporan siap diunduh ke Excel.", "tags": ["laporan", "akun karyawan", "Excel"] },
        { "type": "service", "d": 6.5, "n": "04", "icon": "app", "title": "Web <em>app</em>", "body": "Sistem web sesuai alur kerja usahamu: booking, katalog, sampai operasional. Buka dari HP atau laptop, tanpa install.", "tags": ["booking", "katalog", "operasional"] }
      ]
    },
    {
      "id": "karya", "title": "Karya", "icon": "star",
      "stories": [
        { "type": "intro", "d": 5.5, "title": "Sudah bikin <em>apa saja?</em>", "sub": "Lima jenis usaha yang sudah jalan dengan sistem buatan kami.", "cards": ["Sport booking", "Kasir apotek", "Alat berat", "F&B ordering", "Dealership web"], "cardIcons": ["court", "pill", "truck", "cake", "moto"] },
        { "type": "project", "d": 7, "mock": "booking", "name": "Sport Booking System", "kind": "Booking lapangan olahraga", "body": "Jadwal lapangan real-time, pembayaran aman, kuota member, dan tarif yang bisa diubah pemilik tanpa coding.", "tags": ["Node", "PostgreSQL", "Pembayaran"] },
        { "type": "project", "d": 7, "mock": "pos", "name": "Sistem Kasir Apotek", "kind": "Kasir & stok obat", "body": "Kasir cepat pakai keyboard, menolak obat kedaluwarsa, mencatat setiap pergerakan stok, dan backup otomatis.", "tags": ["Express", "Stok", "Excel"] },
        { "type": "project", "d": 7, "mock": "fleet", "name": "Sistem Alat Berat", "kind": "Manajemen armada", "body": "Lacak pemakaian alat, deteksi jam mesin yang tidak tercatat, pantau efisiensi BBM, dan cek laporan lapangan sebelum ditagih.", "tags": ["Express", "SQLite", "Bisa offline"] },
        { "type": "project", "d": 7, "mock": "order", "name": "F&B Ordering System", "kind": "Pemesanan toko kue", "body": "Pesan dalam 4 langkah sesuai kapasitas dapur, cek pembayaran, dan panel pemilik yang praktis.", "tags": ["Toko online", "PostgreSQL", "WhatsApp"] },
        { "type": "project", "d": 7, "mock": "catalog", "name": "Dealership Website", "kind": "Katalog & CRM motor", "body": "Katalog motor bekas dengan filter pintar, perbandingan, dan pengelolaan calon pembeli.", "tags": ["Katalog", "Admin", "CRM"] },
        { "type": "statement", "d": 6, "title": "Lima jenis usaha, <em>lima sistem berbeda.</em>", "sub": "Semuanya dibentuk dari apa yang terjadi setelah pelanggan menekan tombol." }
      ]
    },
    {
      "id": "bedanya", "title": "Bedanya Apa?", "icon": "split",
      "stories": [
        { "type": "statement", "d": 5.5, "title": "Website, booking, kasir, dashboard, web app. <em>Bedanya apa?</em>", "sub": "Gampangnya: lihat siapa yang memakainya." },
        { "type": "service", "d": 5.5, "n": "01", "label": "Dipakai pelanggan", "icon": "food", "title": "Website F&B, <em>untuk pesan makanan</em>", "body": "Pelanggan pesan dan bayar sendiri dari HP, dari rumah atau langsung dari meja. Kamu tinggal masak.", "tags": ["pesan online", "QR meja", "QRIS"] },
        { "type": "service", "d": 5.5, "n": "02", "label": "Dipakai pelanggan", "icon": "cal", "iconTop": 1250, "title": "Sistem booking, <em>untuk pesan jadwal</em>", "body": "Pelanggan pilih jam kosong, bayar, dan slotnya langsung terkunci. Cocok untuk lapangan, salon, grooming.", "tags": ["jadwal real-time", "bayar di muka", "member"] },
        { "type": "service", "d": 5.5, "n": "03", "label": "Dipakai kasir", "icon": "pos", "title": "Kasir, <em>untuk karyawan</em>", "body": "Mencatat penjualan di toko: struk tercetak, stok berkurang, dan uang di laci selalu cocok.", "tags": ["di toko", "struk", "bisa offline"] },
        { "type": "service", "d": 5.5, "n": "04", "label": "Dipakai pemilik", "icon": "dash", "title": "Dashboard, <em>untuk pemilik</em>", "body": "Bukan untuk mencatat, tapi memantau: omzet hari ini, menu terlaris, stok menipis, dari mana saja.", "tags": ["omzet", "laporan", "dari HP"] },
        { "type": "chain", "d": 5.5, "title": "Semuanya <em>saling terhubung.</em>", "sub": "Pesanan dan booking masuk ke kasir, lalu langsung tercatat di dashboard.", "nodes": ["Pelanggan pesan", "Kasir mencatat", "Pemilik memantau"], "icons": ["cal", "pos", "dash"] },
        { "type": "service", "d": 5.5, "n": "05", "label": "Sesuai kebutuhan", "icon": "app", "title": "Web app, <em>untuk alur yang unik</em>", "body": "Katalog, manajemen armada, sampai operasional. Kalau alur usahamu beda dari biasanya, sistemnya kami buat mengikuti alurmu.", "tags": ["custom", "tanpa install"] },
        { "type": "cta", "d": 5.5, "title": "Bingung pilih yang mana? <em>Ceritakan usahamu.</em>", "button": "Kirim DM", "contacts": ["@linea.js", "Lineajs01@gmail.com"] }
      ]
    },
    {
      "id": "proses", "title": "Proses", "icon": "loop",
      "stories": [
        { "type": "steps", "d": 6, "title": "Dari ide sampai <em>rencana jelas,</em> cuma 4 langkah.", "items": ["Kirim brief", "Dibalas dengan arah", "Ngobrol 30 menit", "Terima rencana pasti"] },
        { "type": "step", "d": 6.5, "n": "01", "scene": "brief", "title": "Kirim <em>brief</em>", "body": "Pilih kebutuhan, kisaran budget, dan kapan harus jadi. Tidak perlu dokumen rapi." },
        { "type": "step", "d": 6.5, "n": "02", "scene": "reply", "title": "Dibalas <em>dengan arah</em>", "body": "Dalam 1 hari kerja, kamu dapat pertanyaan yang benar-benar menentukan hasilnya." },
        { "type": "step", "d": 6.5, "n": "03", "scene": "call", "title": "Ngobrol <em>30 menit</em>", "body": "Sepakati pengguna, batasan, ruang lingkup, dan kapan dianggap selesai." },
        { "type": "step", "d": 6.5, "n": "04", "scene": "plan", "title": "Terima <em>rencana pasti</em>", "body": "Ruang lingkup, jadwal, harga, dan milestone pertama. Tinggal setujui atau tidak." }
      ]
    },
    {
      "id": "kontak", "title": "Tanya & Kontak", "icon": "chat",
      "stories": [
        { "type": "faq", "d": 7, "q": "Siapa yang punya hasilnya?", "a": "Kamu. Kode, domain, database, akun, dan dokumentasi diserahkan semua, tanpa terkunci di platform." },
        { "type": "faq", "d": 7, "q": "Berapa lama jadinya?", "a": "Landing page biasanya 1–2 minggu. Sistem dengan akun, pembayaran, atau logika operasional biasanya 4–8 minggu." },
        { "type": "faq", "d": 7, "q": "Bisa lanjutin kode yang sudah ada?", "a": "Sering bisa. Dicek dulu, lalu dijelaskan mana yang lebih hemat: lanjut, dirapikan, atau dibangun ulang." },
        { "type": "faq", "d": 7, "q": "Berapa biayanya?", "a": "Tergantung kebutuhan. Ceritakan lewat DM, nanti kamu dapat rencana dengan harga pasti sebelum kerja dimulai." },
        { "type": "cta", "d": 6.5, "title": "Punya ide? <em>Kirim versi kasarnya.</em>", "button": "Kirim DM", "contacts": ["@linea.js", "Lineajs01@gmail.com"] }
      ]
    }
  ]
};
