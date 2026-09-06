# Software Vision Document

## 📘 Software Vision Document – Website Tugas Akhir STI

**Version:** 1.0  
**Date:** November, 2025  
**Author:** Taliya Meyswara

---

## Executive Summary

**Website Tugas Akhir STI** adalah sistem informasi berbasis web yang dirancang untuk mendukung proses pengelolaan Tugas Akhir (TA) di Program Studi Sarjana Teknik Informatika, Universitas Dian Nuswantoro. Sistem ini hadir sebagai solusi atas proses manual yang selama ini memperlambat pengolahan data, menyulitkan pemantauan mahasiswa, dan menghambat koordinasi antara mahasiswa, dosen pembimbing, dan koordinator Tugas Akhir.

---

## 1. Vision & Mission

### 1.1 Vision Statement

> "Mewujudkan sistem Tugas Akhir yang efisien, terintegrasi dengan SSO, dan mudah digunakan, sehingga dapat mendukung proses bimbingan, pengajuan, dan sidang Tugas Akhir secara optimal dan memperkuat ekosistem layanan akademik Program Studi Teknik Informatika."

### 1.2 Mission Statements

1. **Digitalisasi Proses Tugas Akhir**

   - Menggantikan proses manual dengan sistem otomatis yang lebih cepat, aman, dan terdokumentasi.
   - Mengurangi beban administratif bagi koordinator dan dosen pembimbing.
   - Memfasilitasi proses pengajuan, bimbingan, dan sidang secara digital.

2. **Integrasi Ekosistem STI Apps**

   - Mendukung Single Sign-On (SSO) agar pengguna cukup login satu kali.
   - Sinkronisasi data mahasiswa, dosen, dan periode melalui API kampus (UDI/SIADIN).

3. **Kemudahan Akses & Penggunaan**

   - Menyediakan antarmuka modern yang intuitif dan responsif.
   - Memfasilitasi mahasiswa, dosen, dan koordinator melalui akses dari berbagai perangkat.
   - Menyediakan dashboard yang informatif untuk setiap role.

4. **Monitoring & Evaluasi yang Lebih Akurat**

   - Menyediakan data progres logbook, statistik bimbingan, dan laporan secara real-time.
   - Mempermudah pemantauan pengajuan, bimbingan, dan sidang melalui sistem tracking terpusat.
   - Menyediakan log aktivitas untuk audit dan evaluasi.

5. **Terintegrasi Dengan Data Udi**

   - Integrasi data mahasiswa krs tugas akhir secara real-time.
   - Integrasi data status mahasiswa lulus, sidang secara realtime.

---

## 2. Problem Statement

### 2.1 Current Challenges

#### Untuk Mahasiswa

- 📄 **Proses manual**: Pengajuan Tugas Akhir, pengisian logbook, dan pengajuan sidang dilakukan secara manual dan tidak terdokumentasi dengan baik.
- 🔍 **Tidak ada pusat informasi**: Data pengumuman, periode, dan informasi penting tersebar di berbagai medium.
- ⏳ **Progres sulit dipantau**: Tidak ada dashboard yang menampilkan status pengajuan, progress logbook, dan checklist Tugas Akhir.
- 📝 **Koordinasi dengan dosen sulit**: Komunikasi dan tracking bimbingan tidak terstruktur.

#### Untuk Dosen Pembimbing

- 📑 **Beban administratif tinggi**: Pengecekan logbook, pengajuan, dan sidang dilakukan manual dan memakan waktu.
- ❗ **Sulit memonitor banyak mahasiswa**: Tidak ada sistem tracking terpusat untuk memantau progres semua mahasiswa bimbingan.
- 📉 **Risiko kehilangan data**: Dokumentasi manual rawan tidak konsisten dan sulit diakses.

#### Untuk Koordinator

- 📊 **Manajemen data kompleks**: Pengelolaan data dosen, mahasiswa, kuota, dan periode memerlukan koordinasi manual.
- 🔄 **Sinkronisasi data sulit**: Data dari sistem akademik kampus tidak terintegrasi secara otomatis.
- 📈 **Monitoring tidak real-time**: Sulit memantau distribusi mahasiswa, kuota dosen, dan progres bimbingan secara menyeluruh.

### 2.2 Opportunity

Dengan sistem terintegrasi:

- ✅ Proses pengajuan, bimbingan, dan sidang menjadi optimal dan lebih cepat
- ✅ Data tersentralisasi dan terintegrasi dengan sistem akademik kampus
- ✅ Pengguna hanya login sekali (SSO)
- ✅ Koordinator dapat memantau seluruh proses Tugas Akhir dengan lebih mudah
- ✅ Dosen dapat memantau progres mahasiswa bimbingan secara real-time
- ✅ Mahasiswa dapat melihat progress dan checklist Tugas Akhir mereka
- ✅ Pengolahan laporan dan rekap menjadi lebih efisien

---

## 3. Product Overview

### 3.1 Product Description

Website Tugas Akhir STI adalah platform terpusat untuk mengelola seluruh aktivitas Tugas Akhir, seperti:

- Manajemen periode ajaran dengan sinkronisasi dari UDI
- Manajemen data dosen dan kuota bimbingan
- Manajemen data mahasiswa dan plotting ke dosen pembimbing
- Pengajuan Tugas Akhir oleh mahasiswa
- Manajemen logbook bimbingan
- Pengajuan dan monitoring sidang TA1 dan TA2
- Dashboard informatif untuk setiap role
- Manajemen pengumuman
- Log aktivitas sistem
- Akses berbasis role (koordinator, dosen, mahasiswa)
- Integrasi Single Sign-On STI Apps

Sistem ini mendukung alur kerja yang lebih cepat, aman, dan terorganisir dari awal pengajuan hingga sidang Tugas Akhir.

### 3.2 Key Features

#### Untuk Mahasiswa:

- ✅ Login dengan email/password atau SSO Google
- ✅ Dashboard dengan checklist dan progress Tugas Akhir
- ✅ Melihat dan mengisi form pengajuan Tugas Akhir
- ✅ Melihat status dan riwayat pengajuan
- ✅ Memilih dosen pembimbing dari daftar yang tersedia
- ✅ Membuat dan mengupdate logbook bimbingan
- ✅ Mengisi link folder Tugas Akhir
- ✅ Melihat progress logbook per bab
- ✅ Mengajukan sidang TA1 (minimal 3x bimbingan diterima)
- ✅ Mengajukan sidang TA2 (minimal 5x bimbingan diterima)
- ✅ Melihat status dan draft pengajuan sidang
- ✅ Melihat pengumuman Tugas Akhir
- ✅ Mengubah password

#### Untuk Dosen Pembimbing:

- ✅ Login dengan email/password atau SSO Google
- ✅ Dashboard dengan statistik logbook mahasiswa bimbingan
- ✅ Melihat daftar logbook mahasiswa bimbingan dengan filter dan search
- ✅ Menerima atau meminta revisi logbook mahasiswa
- ✅ Melihat detail logbook dan informasi mahasiswa
- ✅ Melihat daftar pengajuan mahasiswa bimbingan
- ✅ Menerima atau menolak pengajuan Tugas Akhir
- ✅ Melihat daftar pengajuan sidang TA1 dan TA2 mahasiswa bimbingan
- ✅ Melihat log aktivitas mahasiswa bimbingan
- ✅ Melihat pengumuman
- ✅ Menambahkan link grup untuk mahasiswa bimbingan
- ✅ Mengubah password

#### Untuk Koordinator:

- ✅ Login dengan email/password
- ✅ Dashboard dengan statistik logbook, distribusi mahasiswa, dan informasi kuota
- ✅ Manajemen periode ajaran (CRUD, sinkronisasi dengan UDI, aktif/nonaktif)
- ✅ Manajemen pengumuman (CRUD dengan text editor)
- ✅ Manajemen data dosen (CRUD, sinkronisasi dengan UDI, filter)
- ✅ Manajemen kuota dosen (update kuota, alokasi per periode, statistik)
- ✅ Plotting mahasiswa ke dosen pembimbing
- ✅ Manajemen data mahasiswa (CRUD, sinkronisasi dengan UDI, filter)
- ✅ Melihat daftar pengajuan mahasiswa dengan filter, search, dan sort
- ✅ Menerima atau menolak pengajuan Tugas Akhir
- ✅ Rekap logbook per dosen dan mahasiswa
- ✅ Monitoring sidang TA1 dan TA2 (menerima/revisi)
- ✅ Melihat log aktivitas seluruh user dengan filter
- ✅ Menambahkan link grup global untuk mahasiswa Tugas Akhir
- ✅ Mengubah password

---

## 4. Target Audience

### Mahasiswa 🎓

- **Goal**: Mengajukan Tugas Akhir, melakukan bimbingan dengan dosen, mengajukan sidang, dan menyelesaikan Tugas Akhir sesuai ketentuan.
- **Pain Points**: Proses manual, informasi tersebar, sulit memantau progress, koordinasi dengan dosen tidak terstruktur.

### Dosen Pembimbing 👨‍🏫

- **Goal**: Membimbing mahasiswa, memantau progress logbook, mengevaluasi pengajuan, dan memastikan kualitas Tugas Akhir.
- **Pain Points**: Beban administratif tinggi, sulit memonitor banyak mahasiswa, dokumentasi manual tidak terstruktur.

### Koordinator Tugas Akhir 🎯

- **Goal**: Mengelola seluruh proses Tugas Akhir secara terstruktur, efisien, dan terpantau, termasuk manajemen data, kuota, dan monitoring.
- **Pain Points**: Manajemen data kompleks, sinkronisasi data sulit, monitoring tidak real-time, beban koordinasi tinggi.

---

## 5. Business Goals

### 5.1 Short-term Goals (0–6 bulan)

- Implementasi CRUD periode, dosen, mahasiswa, dan pengumuman
- Integrasi SSO dasar dengan STI Apps
- Dashboard untuk setiap role (koordinator, dosen, mahasiswa)
- Sistem pengajuan Tugas Akhir
- Sistem logbook bimbingan
- Sistem pengajuan sidang TA1 dan TA2
- Sinkronisasi data dengan UDI/SIADIN

### 5.2 Medium-term Goals (6–12 bulan)

- Peningkatan UX/UI
- Export laporan dan rekap
- Penambahan fitur notifikasi
- Optimalisasi performa & keamanan
- Fitur advanced filtering dan search
- Analytics dan reporting yang lebih detail

### 5.3 Long-term Goals (1–2 tahun)

- Integrasi penuh dengan sistem akademik UDINUS
- Ekspansi fitur pelaporan & analitik
- Standardisasi Tugas Akhir dalam STI Apps
- Fitur mobile app untuk akses lebih mudah
- Integrasi dengan sistem penilaian dan yudisium

---

## 6. Success Metrics

### 6.1 User Metrics

| Metric             | Target           |
| ------------------ | ---------------- |
| Mahasiswa aktif TA | 80% per semester |
| Dosen aktif        | 90% per semester |
| Kepuasan pengguna  | > 4.3/5          |
| Penggunaan SSO     | 100%             |
| Pengajuan digital  | 100%             |

### 6.2 Operational Metrics

| Metric           | Target    |
| ---------------- | --------- |
| Uptime           | > 99%     |
| API response     | < 500 ms  |
| Error rate       | < 0.5%    |
| Sinkronisasi UDI | < 5 menit |

### 6.3 Process Metrics

| Metric                    | Target   |
| ------------------------- | -------- |
| Waktu pengajuan TA        | < 1 hari |
| Waktu respon dosen        | < 3 hari |
| Akurasi data sinkronisasi | > 99%    |
| Kelengkapan logbook       | > 95%    |

---

## 7. Competitive Analysis

### 7.1 Comparisons

#### Sistem Internal Lain (KP, BK, Alumni)

- ❌ Tidak mendukung proses Tugas Akhir secara spesifik
- ❌ Tidak ada manajemen logbook bimbingan
- ❌ Tidak ada sistem pengajuan sidang TA1/TA2
- 🎯 Website Tugas Akhir fokus pada kebutuhan spesifik proses Tugas Akhir

#### Sistem Akademik Umum (LMS)

- ❌ Tidak optimal untuk proses bimbingan dan pengajuan Tugas Akhir
- ❌ Tidak ada manajemen kuota dosen dan plotting mahasiswa
- 🎯 Sistem ini fokus pada manajemen bimbingan, logbook, dan sidang Tugas Akhir

### 7.2 Unique Value Proposition

**"Sistem Tugas Akhir terintegrasi STI Apps dengan SSO, fokus pada manajemen bimbingan, logbook, pengajuan, dan sidang secara efisien dan terstruktur."**

---

## 8. Technical Vision

### 8.1 Architecture Philosophy

- **Frontend**: Next.js + TypeScript
- **Backend**: Laravel + REST API
- **Database**: MySQL
- **Styling**: Tailwind CSS
- **Auth**: SSO STI Apps + Sanctum
- **Deployment**: VPS
- **API Integration**: UDI/SIADIN untuk sinkronisasi data

### 8.2 Technology Stack

#### Backend

- Laravel Framework
- MySQL Database
- Laravel Sanctum untuk authentication
- RESTful API architecture
- Queue system untuk sinkronisasi data

#### Frontend

- Next.js Framework
- TypeScript
- Tailwind CSS
- Shadcn
- Responsive design

#### Integration

- SSO STI Apps
- UDI/SIADIN API untuk sinkronisasi
- Google OAuth untuk SSO Google

### 8.3 Future Roadmap

#### Phase 1 (Current)

- CRUD periode, dosen, mahasiswa, pengumuman
- Sistem pengajuan Tugas Akhir
- Sistem logbook bimbingan
- Sistem pengajuan sidang TA1/TA2
- SSO dasar
- Sinkronisasi data dengan UDI

#### Phase 2 (Next 6 months)

- Dashboard analytics yang lebih detail
- Notifikasi email dan push notification
- Export PDF/Excel untuk laporan
- Advanced filtering dan search
- Mobile app development

#### Phase 3 (Innovation)

- AI-based recommendation untuk dosen pembimbing
- Smart progress tracking dengan predictive analytics
- Integrasi penuh dengan sistem akademik dan yudisium
- Real-time collaboration tools
- Automated workflow untuk approval process

---

## 9. Risk Assessment

### 9.1 Technical Risks

| Risk                        | Level  | Mitigation                                          |
| --------------------------- | ------ | --------------------------------------------------- |
| Integrasi SSO gagal         | High   | Dokumentasi lengkap, testing, fallback mechanism    |
| Integrasi UDI gagal         | High   | Error handling, retry mechanism, manual sync option |
| Beban server meningkat      | Medium | Optimasi API, caching, queue system                 |
| Bug pada logbook            | Medium | Code review, unit testing, backup mechanism         |
| Data loss pada sinkronisasi | Medium | Backup system, validation, rollback mechanism       |

### 9.2 Business Risks

| Risk                   | Level  | Mitigation                                       |
| ---------------------- | ------ | ------------------------------------------------ |
| Adopsi pengguna rendah | Medium | Pelatihan & sosialisasi, user-friendly interface |
| Perubahan requirement  | Medium | Agile development, regular feedback              |
| Resistance to change   | Medium | Change management, training, support             |
| Data privacy concerns  | Low    | Security best practices, compliance              |

### 9.3 Operational Risks

| Risk                    | Level  | Mitigation                               |
| ----------------------- | ------ | ---------------------------------------- |
| Downtime during peak    | Medium | Load balancing, monitoring, auto-scaling |
| Data inconsistency      | Medium | Validation, transaction management       |
| Performance degradation | Low    | Performance monitoring, optimization     |

---

## 10. Stakeholders

- **Mahasiswa** (pengguna utama)
- **Dosen Pembimbing** (pengguna utama)
- **Koordinator Tugas Akhir** (operasional)
- **Program Studi** (pengambil keputusan)
- **Tim Pengembang STI Apps** (integrasi teknis)
- **Administrator Sistem** (maintenance & support)

---

## 11. Feature Summary

Berdasarkan dokumen fitur yang ada, sistem Tugas Akhir mencakup 13 modul utama:

1. **STI-TA01: Autentikasi** - Login dengan email/password dan SSO Google, perubahan password
2. **STI-TA02: Dashboard** - Dashboard informatif untuk koordinator, dosen, dan mahasiswa
3. **STI-TA03: Manajemen Periode** - CRUD periode, sinkronisasi dengan UDI, aktif/nonaktif
4. **STI-TA04: Manajemen Pengumuman** - CRUD pengumuman dengan text editor, search
5. **STI-TA05: Manajemen Data Dosen** - CRUD dosen, sinkronisasi dengan UDI, plotting mahasiswa
6. **STI-TA06: Manajemen Kuota Dosen** - Update kuota, alokasi per periode, statistik
7. **STI-TA07: Manajemen Data Mahasiswa** - CRUD mahasiswa aktif TA, sinkronisasi dengan UDI
8. **STI-TA08: Manajemen Data Semua Mahasiswa** - CRUD seluruh mahasiswa, termasuk yang sudah lulus
9. **STI-TA09: Pengajuan Mahasiswa** - Form pengajuan TA, approval oleh dosen/koordinator
10. **STI-TA10: Logbook** - Manajemen logbook bimbingan, approval oleh dosen
11. **STI-TA11: Pengajuan Sidang TA1** - Form pengajuan sidang TA1, approval oleh koordinator
12. **STI-TA12: Pengajuan Sidang TA2** - Form pengajuan sidang TA2, approval oleh koordinator
13. **STI-TA13: Log Aktivitas** - Tracking aktivitas user untuk audit dan monitoring

---

## 12. Conclusion

Website Tugas Akhir STI hadir sebagai solusi digital yang efisien, modern, dan terintegrasi untuk mengelola seluruh proses Tugas Akhir dari pengajuan hingga sidang. Dengan mendukung SSO, sistem terpusat, dan interface modern, platform ini akan:

- 🚀 Mempercepat proses administrasi dan koordinasi
- 📊 Memudahkan pemantauan progress mahasiswa dan bimbingan
- 🔗 Mengintegrasikan layanan akademik secara menyeluruh
- 🎓 Mendukung proses Tugas Akhir secara optimal dan terstruktur
- 📝 Meningkatkan kualitas dokumentasi dan tracking
- ⚡ Meningkatkan efisiensi kerja dosen dan koordinator

Sistem ini tidak hanya menggantikan proses manual, tetapi juga meningkatkan kualitas dan akuntabilitas proses Tugas Akhir di Program Studi Teknik Informatika.

---

**Document Version:** 1.0  
**Last Updated:** December 2025  
**Status:** Approved
