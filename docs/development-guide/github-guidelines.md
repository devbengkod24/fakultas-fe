# 🧭 GitHub Guidelines – Project Website STI Apps

Dokumentasi ini berisi aturan dan standar yang digunakan dalam workflow GitHub pada project Website STI Apps agar proses development lebih rapi, konsisten, dan mudah dikembangkan.

---

## 1. 📌 Penamaan Branching

Repository ini menggunakan struktur branching sebagai berikut:

### 🔹 Branch Utama (Feature Domain Branch)

Branch ini berisi pengembangan fitur sesuai domain atau modul besar:

- **bk** → Branch khusus fitur Bimbingan Karir
- **ta** → Branch khusus fitur Tugas Akhir
- **kp** → Branch khusus fitur Kerja Praktik
- **alumni** → Branch khusus sistem Alumni
- **publikasi** → Branch khusus Landing Page dan Publikasi

**Tujuan:**
Memisahkan pengembangan fitur besar berdasarkan domain agar tidak bercampur, memudahkan review, tracking, dan kontrol scope.

### 🔹 Branch Development

**Nama branch:** `development`

Menjadi tempat penggabungan awal (merge) dari seluruh branch domain (`bk`, `ta`, `kp`, `alumni`).

> **Info sekilas:** Branch ini biasanya digunakan ketika ingin melakukan perubahan (seperti menambahkan fitur, memperbaiki bug, melakukan refaktorisasi, atau mengintegrasikan progress mingguan). Selain itu, branch ini juga berfungsi sebagai checkpoint mingguan ketika report progress agar seluruh developer STI Apps dapat menarik versi terbaru dari fitur yang sudah diselesaikan anggota tim lainnya.

**Tujuan:**
Menggabungkan fitur-fitur yang sudah siap untuk dites lebih menyeluruh sebelum naik ke staging.

### 🔹 Branch Staging

**Nama branch:** `staging`

Menerima merge dari `development`.

**Tujuan:**
Menjadi lingkungan testing akhir sebelum di deploy ke production.

> **Link Website Staging:** [https://dev-sti.dinus.id/apps](https://dev-sti.dinus.id/apps)

### 🔹 Branch Production

**Nama branch:** `production`

Menerima merge dari `staging`.

**Tujuan:**
Branch yang dirilis ke publik/user.

> **Link Website Production:** [https://sti.dinus.id/](https://sti.dinus.id/)

### 🚀 Alur Pengembangan Fitur hingga ke Production

```bash
# Checkout ke domain terkait
git checkout bk

# Misal kamu mengerjakan fitur Bimbingan Karir.
## Tambahkan suatu perubahan fitur.
git add .
git commit -m "feat: add [nama_fitur_baru]"
git push

## Merge branch bk ke development
### Gunakan PR dari branch bk ke development
### Gunakan PR dari branch development ke staging
### Gunakan PR dari branch staging ke production

### Note: setelah seseorang PR branch mereka ke development, kita bisa gunakan git pull origin development untuk pull perubahan terbaru mereka ke branch kita
```

## 2. 🧱 Standarisasi Commit

Proyek ini menggunakan Conventional Commits agar riwayat commit lebih terstruktur dan mudah dibaca.

Contoh commit message:

git commit -m "feat: add halaman daftar mahasiswa"

### Format yang digunakan:

feat: → penambahan fitur

fix: → perbaikan bug

docs: → perubahan dokumentasi

refactor: → perombakan struktur kode tanpa mengubah behavior

style: → perubahan yang tidak mempengaruhi logic (misal: formatter)

chore: → update dependency, config, dll

test: → penambahan/perbaikan test

perf: → peningkatan performa

Selengkapnya dapat dilihat pada referensi:
https://gist.github.com/nyancodeid/63f19941c81252bb0cca9c14497cf9f7

## 3. ⚠️ Alur Bila Terjadi Conflict

Konflik merge ini terjadi ketika 2 orang melakukan perubahan pada file yang sama.

Solusinya : 

Gunakan resolve in merge editor dengan cara memilih file yang conflict melalui Source Control (ctrl + shift + G), lalu pilih perubahan mana yang ingin di keep dengan cara klik Accept Current Change atau Accept Incoming Change.

Pastikan tidak ada lagi conflict yang ada sebelum complete merge.

Selengkapnya dapat dilihat pada referensi: 
https://www.youtube.com/watch?v=T1puiPJgP_0

## 4. 📁 Ketentuan .gitignore

Isi dari .gitignore:

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
*.env
.env.*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# vscode setting
/.vscode/
.blackboxrules
```
Selengkapnya dapat dilihat pada referensi: 
https://help.github.com/articles/ignoring-files/
