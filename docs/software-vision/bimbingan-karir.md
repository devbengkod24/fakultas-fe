# Software Vision Document
## 📘 Software Vision Document – Website Bimbingan Karir STI

*Version:* 2.0  
*Date:* November, 2025  
*Authors:*  
- Bambang Putra Amsal Gautama  
- Fernando Oloan Tambun  

---

## Executive Summary

*Website Bimbingan Karir STI* adalah sistem informasi berbasis web yang dirancang untuk mendukung proses pengelolaan kegiatan luar kelas pada mata kuliah Bimbingan Karir di Program Studi Sarjana Teknik Informatika, Universitas Dian Nuswantoro. Sistem ini hadir sebagai solusi atas proses manual yang selama ini memperlambat pengolahan data, menyulitkan pemantauan mahasiswa, dan menghambat koordinasi kegiatan.

---

## 1. Vision & Mission

### 1.1 Vision Statement

> “Mewujudkan sistem Bimbingan Karir yang efisien, terintegrasi dengan sso, dan mudah digunakan, sehingga dapat mendukung proses bimbingan karir mahasiswa secara optimal dan memperkuat ekosistem layanan akademik Program Studi Teknik Informatika.”

### 1.2 Mission Statements

1. *Digitalisasi Proses Bimbingan Karir*

   * Menggantikan proses manual dengan sistem otomatis yang lebih cepat, aman, dan terdokumentasi.
   * Mengurangi beban administratif bagi koordinator.

2. *Integrasi Ekosistem STI Apps*

   * Mendukung Single Sign-On (SSO) agar pengguna cukup login satu kali.
   * Sinkronisasi data mahasiswa melalui API kampus.

3. *Kemudahan Akses & Penggunaan*

   * Menyediakan antarmuka modern yang intuitif dan responsif.
   * Memfasilitasi mahasiswa dan dosen melalui akses dari berbagai perangkat.

4. *Monitoring & Evaluasi yang Lebih Akurat*

   * Menyediakan data progres, statistik kegiatan, dan laporan secara real-time.
   * Mempermudah evaluasi kegiatan melalui feedback dan rating mahasiswa.

---

## 2. Problem Statement

### 2.1 Current Challenges

#### Untuk Mahasiswa
- 📄 *Proses manual*: Pengumpulan dan pengecekan kegiatan tidak terdokumentasi dengan baik.
- 🔍 *Tidak ada pusat informasi*: Data kegiatan tersebar di berbagai medium.
- ⏳ *Progres sulit dipantau*: Tidak ada dashboard yang menampilkan status pencapaian.

#### Untuk Koordinator
- 📑 *Beban administratif tinggi*: Rekap data dilakukan manual dan memakan waktu.
- ❗ *Sulit memonitor banyak mahasiswa*: Tidak ada sistem tracking terpusat.
- 📉 *Risiko kehilangan data*: Dokumentasi manual rawan tidak konsisten.

### 2.2 Opportunity

Dengan sistem terintegrasi:
- ✅ Proses menjadi optimal dan lebih cepat
- ✅ Data tersentralisasi
- ✅ Pengguna hanya login sekali (SSO)
- ✅ Koordinator dapat memantau kegiatan mahasiswa dengan lebih mudah
- ✅ Pengolahan laporan menjadi lebih efisien

---

## 3. Product Overview

### 3.1 Product Description

Website Bimbingan Karir STI adalah platform terpusat untuk mengelola seluruh aktivitas Bimbingan Karir, seperti:

- Presensi Mahasiswa Berdasarkan Kegiatan
- Input dan rekap nilai
- Dashboard mahasiswa
- Rekapitulasi nilai mahasiswa
- Akses berbasis role (koordinator vs mahasiswa)
- Integrasi Single Sign-On STI Apps

Sistem ini mendukung alur kerja yang lebih cepat, aman, dan terorganisir.

### 3.2 Key Features

#### Untuk Mahasiswa:
* ✅ Melihat jadwal kegiatan dan lampiran
* ✅ Presensi digital
* ✅ Memberikan rating dan saran
* ✅ Mengunduh sertifikat setelah memenuhi syarat
* ✅ Melihat progres kegiatan melalui dashboard

#### Untuk Koordinator:
* ✅ CRUD kegiatan dan unggah lampiran PDF
* ✅ Menambahkan link grup WhatsApp kegiatan
* ✅ Sinkronisasi data mahasiswa dari API kampus
* ✅ Mengelola presensi dan nilai
* ✅ Impor nilai + konversi nilai otomatis
* ✅ Melihat analisis kegiatan antarperiode
* ✅ Memantau log aktivitas sistem

---

## 4. Target Audience

### Mahasiswa 🎓
* *Goal*: Mengikuti kegiatan Bimbingan Karir, memperoleh informasi lengkap, dan mengakses sertifikat.
* *Pain Points*: Informasi tersebar, akses sulit, dan sertifikat manual.

### Koordinator 👨‍🏫
* *Goal*: Mengelola kegiatan secara terstruktur, efisien, dan terpantau.
* *Pain Points*: Beban kerja manual, tidak ada analisis kegiatan, dan rekap data memakan waktu.

## 5. Business Goals

### 5.1 Short-term Goals (0–6 bulan)
- Implementasi CRUD kegiatan, kategori, rekap nilai
- Integrasi SSO dasar dengan STI Apps
- Dashboard mahasiswa & koordinator

### 5.2 Medium-term Goals (6–12 bulan)
- Peningkatan UI/UX
- Export laporan
- Penambahan fitur notifikasi
- Optimalisasi performa & keamanan

### 5.3 Long-term Goals (1–2 tahun)
- Integrasi penuh dengan sistem akademik UDINUS
- Ekspansi fitur pelaporan & analitik
- Standardisasi Bimbingan Karir dalam STI Apps

---

## 6. Success Metrics

### 6.1 User Metrics

| Metric                | Target              |
| --------------------- | ------------------- |
| Mahasiswa aktif       | 80% per semester    |
| Kepuasan pengguna     | > 4.3/5             |
| Penggunaan SSO        | 100%                |

### 6.2 Operational Metrics

| Metric              | Target     |
| ------------------- | ---------- |
| Uptime              | > 99%      |
| API response        | < 500 ms   |
| Error rate          | < 0.5%     |

---

## 7. Competitive Analysis

### 7.1 Comparisons

#### Sistem Akademik Umum (LMS)
- ❌ Tidak optimal untuk event/seminar seperti BK
- 🎯 Sistem ini fokus pada manajemen kegiatan & pencatatan nilai kegiatan

### 7.2 Unique Value Proposition

*“Sistem Bimbingan Karir terintegrasi STI Apps dengan SSO, fokus pada manajemen kegiatan dan rekap mahasiswa secara efisien.”*

---

## 8. Technical Vision

### 8.1 Architecture Philosophy

- *Frontend*: Next.js + TypeScript  
- *Backend*: Laravel + REST API  
- *Database*: MySQL  
- *Styling*: Tailwind CSS  
- *Auth*: SSO STI Apps  
- *Deployment*: VPS (Backend)

### 8.2 Future Roadmap

#### Phase 1 (Current)
- CRUD kegiatan & kategori
- Rekap nilai mahasiswa
- SSO dasar
- Export PDF/Excel
- Penyederhanaan manajemen kegiatan dengan mekanisme penambahan sesi (tanggal, jam, tempat) yang lebih fleksibel.
- Penambahan fitur unggah lampiran pada kegiatan (PDF/File pendukung).
- Penambahan kolom tautan komunikasi (mis. grup WhatsApp) untuk koordinasi peserta.
- Implementasi fitur feedback mahasiswa (rating & saran).
- Dasbor analisis kegiatan untuk melihat statistik, progres, dan tren aktivitas mahasiswa.
- Sinkronisasi data mahasiswa melalui API kampus agar tidak perlu input manual.
- Perbaikan mekanisme import nilai agar proses unggah nilai berjalan normal.
- Penambahan konversi nilai otomatis untuk menghindari penghitungan manual.
- Integrasi syarat sertifikat (feedback + presensi) sebelum tombol Unduh Sertifikat aktif.
- Peningkatan sistem presensi digital agar pencatatan kehadiran lebih akurat.
- Penambahan log aktivitas pengguna untuk meningkatkan audit & keamanan sistem.

#### Phase 2 (Innovation)
- Import Presensi
- Notifikasi email
- Fitur communities dan Direct Message atau semacam customer help
- Integrasi penuh dengan sistem akademik

---

## 9. Risk Assessment

### 9.1 Technical Risks

| Risk                     | Level | Mitigation                      |
| ------------------------ | ----- | -------------------------------- |
| Integrasi SSO gagal     | High  | Dokumentasi lengkap, testing    |
| Beban server meningkat  | Medium| Optimasi API, caching           |
| Bug pada rekap nilai    | Medium| Code review, unit testing       |

### 9.2 Business Risks

| Risk                     | Level | Mitigation                  |
| ------------------------ | ----- | --------------------------- |
| Adopsi pengguna rendah  | Medium| Pelatihan & sosialisasi     |
| Perubahan requirement   | Medium| Agile development           |

---

## 10. Stakeholders

- *Mahasiswa* (pengguna utama)  
- *Koordinator Bimbingan Karir* (operasional)  
- *Program Studi* (pengambil keputusan)  
- *Tim Pengembang STI Apps* (integrasi teknis)

---

## 11. Conclusion

Website Bimbingan Karir STI hadir sebagai solusi digital yang efisien, modern, dan terintegrasi untuk mengelola proses pembinaan karir mahasiswa. Dengan mendukung SSO, sistem terpusat, dan interface modern, platform ini akan:

- 🚀 Mempercepat proses administrasi  
- 📊 Memudahkan pemantauan mahasiswa  
- 🔗 Mengintegrasikan layanan akademik secara menyeluruh  
- 🎓 Mendukung pengembangan karir mahasiswa secara optimal  

---

*Document Version:* 2.0  
*Last Updated:* November 2025  
*Status:* Approved