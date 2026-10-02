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
        { "type": "intro", "d": 5.5, "title": "Bisa bikin <em>apa saja?</em>", "sub": "Empat jenis pekerjaan yang paling sering kami kerjakan.", "cards": ["Website peluncuran", "Pemesanan & booking", "Sistem internal", "Sistem AI"], "cardIcons": ["rocket", "cart", "dash", "spark"] },
        { "type": "service", "d": 6.5, "n": "01", "icon": "rocket", "title": "Website <em>peluncuran</em>", "body": "Halaman cepat dan tajam untuk produk, kampanye, atau profil usaha.", "tags": ["strategi", "susunan copy", "animasi"] },
        { "type": "service", "d": 6.5, "n": "02", "icon": "cart", "title": "Pemesanan <em>& booking</em>", "body": "Pesan, jadwal, bayar, dan panel admin yang sesuai cara usahamu berjalan.", "tags": ["pembayaran", "stok", "otomatisasi"] },
        { "type": "service", "d": 6.5, "n": "03", "icon": "dash", "title": "Sistem <em>internal</em>", "body": "Dashboard dan sistem operasional pengganti spreadsheet berserakan dan chat yang tercecer.", "tags": ["peran akun", "laporan", "database"] },
        { "type": "service", "d": 6.5, "n": "04", "icon": "spark", "title": "Sistem <em>AI</em>", "body": "Asisten dan integrasi AI yang jelas batasnya, tetap ada manusia saat dibutuhkan.", "tags": ["LLM", "alur kerja", "integrasi"] }
      ]
    },
    {
      "id": "karya", "title": "Karya", "icon": "star",
      "stories": [
        { "type": "intro", "d": 5.5, "title": "Sudah bikin <em>apa saja?</em>", "sub": "Lima usaha yang sudah jalan dengan sistem buatan kami.", "cards": ["King Paddle", "Apotek Berkah", "Heavy Equipment", "Brownies Pastry", "Jawa Motor"], "cardIcons": ["court", "pill", "truck", "cake", "moto"] },
        { "type": "project", "d": 7, "mock": "booking", "name": "King Paddle", "kind": "Sistem booking", "body": "Jadwal lapangan real-time, pembayaran aman, kuota member, dan tarif yang bisa diubah pemilik tanpa coding.", "tags": ["Node", "PostgreSQL", "Pembayaran"] },
        { "type": "project", "d": 7, "mock": "pos", "name": "Apotek Berkah", "kind": "Kasir apotek", "body": "Kasir cepat pakai keyboard, menolak obat kedaluwarsa, mencatat setiap pergerakan stok, dan backup otomatis.", "tags": ["Express", "Stok", "Excel"] },
        { "type": "project", "d": 7, "mock": "fleet", "name": "Heavy Equipment", "kind": "Manajemen alat berat", "body": "Lacak pemakaian alat, deteksi jam mesin yang tidak tercatat, pantau efisiensi BBM, dan cek laporan lapangan sebelum ditagih.", "tags": ["Express", "SQLite", "Bisa offline"] },
        { "type": "project", "d": 7, "mock": "order", "name": "Brownies Pastry", "kind": "Pemesanan F&B", "body": "Pesan dalam 4 langkah sesuai kapasitas dapur, cek pembayaran, dan panel pemilik yang praktis.", "tags": ["Toko online", "PostgreSQL", "WhatsApp"] },
        { "type": "project", "d": 7, "mock": "catalog", "name": "Jawa Motor", "kind": "Katalog & CRM", "body": "Katalog motor bekas dengan filter pintar, perbandingan, dan pengelolaan calon pembeli.", "tags": ["Katalog", "Admin", "CRM"] },
        { "type": "statement", "d": 6, "title": "Lima usaha, <em>lima sistem berbeda.</em>", "sub": "Semuanya dibentuk dari apa yang terjadi setelah pelanggan menekan tombol." }
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
