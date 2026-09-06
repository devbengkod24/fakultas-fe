# UI/UX Design System

## 📌 Font and Typography

### Primary Font
**Inter**

Variasi: Normal, Medium, Semibold, Bold

### Heading

#### Headline 1
- `xl:text-4xl text-2xl`
- **Bold**

#### Headline 2
- `xl:text-3xl text-xl`
- **Bold**

#### Headline 3
- `xl:text-2xl text-lg`
- **Bold**

#### Headline 4
- `xl:text-xl text-base`
- **Bold**

### Body Text
- **Text**: `text-base text-gray-700`
- **Muted**: `text-gray-500`
- **Line Height**: `leading-relaxed` (opsional)

---

## 📌 Colors

> **Referensi**: [Tailwind CSS Colors](https://tailwindcss.com/docs/colors)

### Base Color
- **Gray (50–950)**
  - Tersedia skala warna abu-abu dari level 50 hingga 950

### Brand Colors
- **Primary Color (600)** — Congress Blue
- **Secondary Color (300)** — Yellow
- **Orange Color (500)** — Orange

---

## 📌 Spacing

Menggunakan angka dasar: `2`, `4`, `6`, `8`

---

## 📌 Border & Radius (untuk Card)

### Border Width
- `border` (1px) / (0.5px)

### Border Radius
- **Normal**: `rounded-lg`
- **Full (Avatar)**: `rounded-full`

---

## 📌 Shadow

- **Card Shadow**: `shadow`
- **Hover Effect**: `hover:shadow`

> **Catatan**: Ketebalan bebas, yang penting tidak terlalu tebal agar tidak terlihat suram.

---

## 📌 Responsive Breakpoints

| Device | Breakpoint |
|--------|------------|
| Monitor | `xl` ke atas |
| Laptop | `xl` |
| Tablet | `lg` |
| HP ukuran sedang (mayan bear) | `md` |
| HP biasa | `sm` |

> **Note**: Pada beberapa kasus, ukuran layout di desktop (`xl`) bisa berubah menjadi `lg` ketika di tablet.

---

## 📌 Button

Variasi button:

- Primary

  Tombol utama untuk aksi paling penting pada halaman. Class: variant="default"

- Secondary

  Tombol prioritas kedua, digunakan untuk aksi pendamping. Class: variant="secondary"

- Outline

  Tombol dengan border, cocok untuk aksi sekunder dengan visual ringan. Class: variant="outline"

- Ghost

  Tombol tanpa border dan background, cocok untuk aksi minor. Class: variant="ghost"

- Link

  Tombol dengan gaya tautan. Class: variant="link"

**Extended Variants (Khusus STI Apps)**
- Primary Outline

  Outline dengan nuansa warna utama. Class: variant="primaryOutline"

- Secondary Outline

  Outline dengan nuansa warna secondary. Class: variant="secondaryOutline"

- Success Outline

  Digunakan untuk aksi sukses seperti "Simpan", "Berhasil", dll. Class: variant="successOutline"

- Destructive

  Untuk aksi berbahaya seperti hapus data. Class: variant="destructive"

- Destructive Outline

  Versi lebih ringan dari destructive. Class: variant="destructiveOutline"
---

## 📌 Form / Inputan

### Karakteristik
- Memiliki **label**
- Memiliki **placeholder**

### Contoh
- Input field email
- Form field dengan label di atas dan input warna abu-abu
- Area deskripsi (textarea)
- Field input multi-kolom seperti pada contoh desain

---