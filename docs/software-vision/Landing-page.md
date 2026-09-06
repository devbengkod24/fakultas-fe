# Software Vision Document

## 📘 Software Vision Document – Website STI General

_Version:_ 2.0  
_Date:_ November, 2025  
_Authors:_

- Hanif Cahyo Prasetyo
- Muhammad Iqbal Ali Sa'idil Muna

---

## Executive Summary

**Website STI General** adalah sistem informasi berbasis web yang dirancang sebagai portal terpadu untuk mendukung kegiatan akademik dan administratif di Program Studi Sarjana Teknik Informatika, Universitas Dian Nuswantoro. Sistem ini mengintegrasikan berbagai informasi penting seperti profil jurusan, informasi akademik, mata kuliah, publikasi dosen, dan pengumuman dalam satu platform yang mudah diakses. Website ini juga berfungsi sebagai portal utama yang menghubungkan empat aplikasi pendukung yaitu Tugas Akhir, Bimbingan Karir, Kerja Praktek, dan Alumni. Dilengkapi dengan dashboard Content Management System (CMS), sistem ini memungkinkan pengelolaan konten yang efisien dan terstruktur, menggantikan proses manual yang selama ini memperlambat pengolahan data, menyulitkan pemantauan informasi, dan menghambat koordinasi kegiatan akademik.

---

## 1. Vision & Mission

### 1.1 Vision Statement

> "Mewujudkan portal akademik terpadu yang efisien, terintegrasi dengan SSO, dan mudah digunakan sebagai pusat informasi dan layanan akademik Program Studi Teknik Informatika yang mendukung ekosistem digital kampus secara optimal."

### 1.2 Mission Statements

1. _Digitalisasi dan Sentralisasi Informasi Akademik_

   - Menyediakan platform terpadu untuk informasi profil jurusan, akademik, mata kuliah, publikasi dosen, dan pengumuman.
   - Menampilkan publikasi ilmiah dosen secara real-time melalui integrasi crawling data dari SINTA (Science and Technology Index).
   - Menggantikan proses manual dengan sistem otomatis yang lebih cepat, aman, dan terdokumentasi.

2. _Integrasi Ekosistem STI Apps_

   - Menjadi portal utama yang menghubungkan empat aplikasi: Tugas Akhir, Bimbingan Karir, Kerja Praktek, dan Alumni.
   - Mendukung Single Sign-On (SSO) agar pengguna cukup login satu kali untuk mengakses semua aplikasi.
   - Sinkronisasi data mahasiswa dan dosen melalui API kampus.

3. _Kemudahan Akses & Pengelolaan Konten_

   - Menyediakan antarmuka modern yang intuitif dan responsif untuk landing page dan informasi jurusan.
   - Memfasilitasi pengelolaan konten melalui dashboard Content Management System (CMS).
   - Memastikan akses mudah dari berbagai perangkat untuk mahasiswa, dosen, dan admin.

4. _Transparansi & Peningkatan Visibilitas Akademik_

   - Menampilkan publikasi ilmiah dosen Teknik Informatika UDINUS secara terpusat dan terstruktur.
   - Menyediakan informasi terkini tentang kegiatan akademik dan pengumuman secara real-time.
   - Mempermudah koordinasi antar aplikasi dalam ekosistem STI.
   - Meningkatkan efisiensi komunikasi antara program studi dengan mahasiswa dan dosen.

---

## 2. Problem Statement

### 2.1 Current Challenges

#### Untuk Mahasiswa

- 🔍 _Informasi tersebar_: Informasi akademik, mata kuliah, dan pengumuman tersebar di berbagai platform dan sulit diakses.
- 📚 _Kesulitan mencari referensi_: Tidak ada platform terpusat untuk melihat publikasi dan jurnal dosen sebagai referensi penelitian.
- 🔐 _Login berulang_: Harus login berkali-kali untuk mengakses aplikasi berbeda (Tugas Akhir, Bimbingan Karir, Kerja Praktek, Alumni).
- ❓ _Kurang informasi jurusan_: Informasi profil jurusan dan publikasi dosen tidak mudah diakses.

#### Untuk Dosen

- 📊 _Publikasi tidak tervisibilisasi_: Karya ilmiah dosen tidak ditampilkan secara terpusat dan terstruktur.
- 📑 _Pengelolaan konten manual_: Update informasi akademik dan pengumuman dilakukan secara terpisah-pisah.
- 🔄 _Koordinasi aplikasi sulit_: Tidak ada portal tunggal untuk mengelola berbagai aplikasi STI.

#### Untuk Super Admin

- 📝 _Beban administratif tinggi_: Pengelolaan konten website dan koordinasi aplikasi membutuhkan bantuan developer untuk setiap perubahan.
- ❗ _Tidak ada sistem CMS terpusat_: Tidak ada dashboard untuk mengelola konten secara mandiri dan real-time sehingga setiap update informasi memerlukan perubahan kode dan deploy ulang.
- ⏳ _Update informasi lambat_: Proses update pengumuman, informasi akademik, dan konten lainnya memakan waktu lama.
- 📉 _Ketergantungan pada developer_: Admin tidak bisa update konten sendiri tanpa melibatkan tim teknis.

### 2.2 Opportunity

Dengan portal STI General yang terintegrasi:

- ✅ Sentralisasi informasi akademik, mata kuliah, profil jurusan, dan pengumuman dalam satu platform
- ✅ Publikasi dosen tampil otomatis melalui crawling SINTA sebagai referensi mahasiswa
- ✅ Single Sign-On (SSO) untuk akses ke semua aplikasi (Tugas Akhir, Bimbingan Karir, Kerja Praktek, Alumni)
- ✅ Dashboard CMS untuk pengelolaan konten mandiri tanpa perlu coding atau deploy ulang
- ✅ Update informasi real-time oleh admin tanpa ketergantungan pada developer
- ✅ Landing page modern yang informatif dan mudah dinavigasi
- ✅ Peningkatan visibilitas dan reputasi akademik program studi
- ✅ Koordinasi antar aplikasi menjadi lebih mudah dan terintegrasi

---

## 3. Product Overview

### 3.1 Product Description

Website STI General adalah portal terpadu Program Studi Teknik Informatika yang menyediakan informasi akademik lengkap dan menghubungkan ekosistem aplikasi STI. Platform ini menampilkan:

- Landing page jurusan Teknik Informatika
- Informasi akademik dan mata kuliah
- Profil jurusan dan program studi
- Publikasi dosen (crawling otomatis dari SINTA)
- Pengumuman dan berita terkini
- Portal akses ke 4 aplikasi: Tugas Akhir, Bimbingan Karir, Kerja Praktek, dan Alumni
- Dashboard Content Management System (CMS) untuk pengelolaan konten dinamis
- Integrasi Single Sign-On (SSO) STI Apps

Sistem ini menggantikan website versi lama yang hardcode, memungkinkan pengelolaan konten secara mandiri, cepat, dan real-time tanpa ketergantungan pada developer.

### 3.2 Key Features

#### Untuk Mahasiswa:

- ✅ Melihat landing page dengan informasi lengkap jurusan
- ✅ Mengakses informasi akademik dan mata kuliah
- ✅ Membaca profil jurusan dan visi-misi program studi
- ✅ Melihat publikasi ilmiah dosen sebagai referensi penelitian
- ✅ Mendapatkan pengumuman dan berita terkini
- ✅ Akses ke 4 aplikasi (Tugas Akhir, Bimbingan Karir, Kerja Praktek, Alumni) dengan satu kali login (SSO)

#### Untuk Super Admin:

- ✅ Full akses dashboard CMS untuk semua konten website
- ✅ Mengelola konten landing page melalui dashboard CMS
- ✅ Update informasi akademik dan mata kuliah secara mandiri
- ✅ Mengelola akun koordinator aplikasi lainnya
- ✅ Memonitor publikasi dosen yang ter-crawl dari SINTA

---

## 4. Target Audience

### Mahasiswa 🎓

- _Goal_: Mengakses informasi akademik lengkap, melihat publikasi dosen sebagai referensi, mendapatkan pengumuman terkini, dan menggunakan aplikasi STI dengan mudah.
- _Pain Points_: Informasi tersebar di berbagai platform, kesulitan mencari referensi jurnal dosen, harus login berulang kali ke aplikasi berbeda.

### Dosen 👨‍🏫

- _Goal_: Publikasi ilmiah ditampilkan secara terpusat dan terstruktur, meningkatkan visibilitas karya akademik.
- _Pain Points_: Publikasi tidak tervisibilisasi dengan baik, sulit diakses oleh mahasiswa sebagai referensi.

### Super Admin 🔧

- _Goal_: Mengelola seluruh konten website, mengatur akun koordinator, dan mengonfigurasi sistem secara menyeluruh tanpa perlu coding.
- _Pain Points_: Ketergantungan pada developer untuk setiap perubahan konten, tidak ada sistem CMS terpusat, beban administratif tinggi untuk update informasi.

## 5. Business Goals

### 5.1 Short-term Goals (0–6 bulan)

- Implementasi landing page jurusan dengan desain modern dan responsif
- Implementasi dashboard CMS untuk pengelolaan konten (pengumuman, informasi akademik, mata kuliah)
- Integrasi crawling publikasi dosen dari SINTA
- Implementasi Single Sign-On (SSO) untuk akses ke 4 aplikasi STI
- Migrasi konten dari website lama (hardcode) ke sistem CMS

### 5.2 Medium-term Goals (6–12 bulan)

- Peningkatan UI/UX landing page dan dashboard CMS
- Penambahan fitur notifikasi untuk pengumuman terbaru
- Implementasi sistem pencarian publikasi dosen yang lebih advanced
- Optimalisasi performa crawling SINTA dan loading website
- Penambahan analitik pengunjung dan tracking engagement
- Peningkatan keamanan sistem dan data

### 5.3 Long-term Goals (1–2 tahun)

- Integrasi penuh dengan sistem akademik UDINUS (data mahasiswa, dosen, mata kuliah real-time)
- Ekspansi fitur: alumni tracking, event management, e-learning integration
- Implementasi personalisasi konten berdasarkan profil pengguna
- Pengembangan mobile app untuk akses lebih mudah
- Standardisasi portal sebagai template untuk program studi lain di UDINUS
- Implementasi AI/chatbot untuk bantuan informasi otomatis

---

## 6. Success Metrics

### 6.1 User Metrics

| Metric                              | Target             |
| ----------------------------------- | ------------------ |
| Pengunjung website aktif per bulan  | > 500 users        |
| Mahasiswa mengakses publikasi dosen | > 60% per semester |
| Kepuasan pengguna (usability)       | > 4.3/5            |
| Penggunaan SSO untuk akses aplikasi | 100%               |
| Engagement rate (waktu di website)  | > 3 menit          |

### 6.2 Operational Metrics

| Metric       | Target   |
| ------------ | -------- |
| Uptime       | > 99%    |
| API response | < 500 ms |
| Error rate   | < 0.5%   |

### 6.3 Administrative Metrics

| Metric                                  | Target                      |
| --------------------------------------- | --------------------------- |
| Pengurangan waktu update konten         | 80% lebih cepat vs hardcode |
| Kepuasan admin/koordinator terhadap CMS | > 4.5/5                     |
| Frekuensi ketergantungan pada developer | Berkurang 90%               |

---

## 7. Competitive Analysis

### 7.1 Comparisons

#### Website Program Studi Umum (Static Website)

- ❌ Konten hardcode, sulit diupdate tanpa developer
- ❌ Tidak ada integrasi SSO dan portal aplikasi terpadu
- ❌ Publikasi dosen tidak ditampilkan atau manual
- 🎯 STI General menyediakan CMS untuk update mandiri dan crawling otomatis publikasi

### 7.2 Unique Value Proposition

_"Portal terpadu Program Studi Teknik Informatika dengan CMS mandiri, crawling otomatis publikasi dosen dari SINTA, dan integrasi SSO untuk 4 aplikasi (Tugas Akhir, Bimbingan Karir, Kerja Praktek, Alumni) dalam satu ekosistem."_

---

## 8. Technical Vision

### 8.1 Architecture Philosophy

- _Frontend_: Next.js + TypeScript (SSR untuk SEO optimal)
- _Backend_: Laravel + REST API
- _Database_: MySQL
- _Styling_: Tailwind CSS
- _Auth_: SSO STI Apps (Single Sign-On)
- _Web Scraping_: Laravel + FlaskAPI untuk crawling SINTA
- _Deployment_: VPS (Backend & Frontend)

### 8.2 Future Roadmap

#### Phase 1 (Current - 0-6 bulan)

- Landing page responsif dengan Next.js
- Dashboard CMS untuk pengelolaan konten (pengumuman, akademik, mata kuliah)
- Crawling publikasi dosen dari SINTA
- Implementasi SSO untuk akses 4 aplikasi STI
- Migrasi konten dari website lama
- CRUD profil jurusan dan informasi akademik

#### Phase 2 (Medium-term - 6-12 bulan)

- Dashboard analytics pengunjung website
- Sistem notifikasi pengumuman (email/push notification)
- Advanced search & filter publikasi dosen
- SEO optimization & performance tuning
- Versioning konten dan preview sebelum publish
- Role management & audit log untuk CMS

#### Phase 3 (Long-term - 1-2 tahun)

- AI-powered search untuk publikasi dosen
- Personalisasi konten berdasarkan profil mahasiswa
- Chatbot untuk informasi akademik otomatis
- Integrasi penuh dengan sistem akademik UDINUS (real-time data)
- Mobile app untuk akses lebih mudah
- Multi-language support (Indonesia & English)
- Advanced analytics & reporting dashboard

---

## 9. Risk Assessment

### 9.1 Technical Risks

| Risk                                  | Level  | Mitigation                                   |
| ------------------------------------- | ------ | -------------------------------------------- |
| Crawling SINTA gagal/berubah struktur | High   | Monitoring otomatis, fallback manual input   |
| Integrasi SSO gagal                   | High   | Dokumentasi lengkap, testing menyeluruh      |
| Beban server saat crawling            | Medium | Caching Redis, scheduled jobs, rate limiting |
| Migrasi data dari website lama        | Low    | Backup lengkap, staging environment testing  |
| SEO performance menurun               | Low    | SSR Next.js, sitemap, meta tags optimization |

### 9.2 Business Risks

| Risk                                   | Level  | Mitigation                                   |
| -------------------------------------- | ------ | -------------------------------------------- |
| Adopsi pengguna rendah                 | Medium | Pelatihan admin/koordinator, user onboarding |
| Koordinator kesulitan menggunakan CMS  | Medium | UI/UX intuitif, dokumentasi, tutorial video  |
| Perubahan requirement dari stakeholder | Medium | Agile development, iterative feedback        |
| Ketergantungan pada SINTA              | High   | Cache data, manual backup, multiple sources  |
| Konten tidak ter-update secara berkala | Low    | Reminder system, content calendar            |

### 9.3 Data Risks

| Risk                               | Level  | Mitigation                                  |
| ---------------------------------- | ------ | ------------------------------------------- |
| Kehilangan data publikasi          | High   | Automated backup, redundant storage         |
| Inkonsistensi data mahasiswa/dosen | Medium | API validation, data synchronization checks |
| Privasi data publikasi dosen       | Low    | Data publik dari SINTA, proper attribution  |

---

## 10. Stakeholders

- _Mahasiswa_ (pengguna utama)
- Program Studi / Kaprodi (pengambil keputusan)
- Super Admin / Admin CMS (manajemen konten & konfigurasi)
- _Tim Pengembang STI Apps_ (integrasi teknis)

---

## 11. Conclusion

Website STI General hadir sebagai solusi digital yang efisien, modern, dan terintegrasi untuk mengelola proses layanan dan informasi akademik Program Studi Teknik Informatika. Dengan mendukung SSO, sistem terpusat, dan antarmuka modern, platform ini akan:

- 🚀 Mempercepat proses administrasi
- 📊 Memudahkan pemantauan mahasiswa
- 🔗 Mengintegrasikan layanan akademik secara menyeluruh
- 🎓 Mendukung pengembangan karir mahasiswa secara optimal

---

_Document Version:_ 2.0  
_Last Updated:_ November 2025  
_Status:_ Approved
