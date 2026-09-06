import { Activity } from "@/types/bimbingan-karir/koordinator/daftar-kegiatan/activity";

const formatLocalDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const activityAppend = (formData: FormData, kegiatan: Activity, prodiId?: number | null) => {
  if (prodiId) {
    formData.append("prodi_id", prodiId.toString());
  }

  const fields = [
    { key: "nama_kegiatan", value: kegiatan.nama_kegiatan },
    { key: "deskripsi", value: kegiatan.deskripsi },
    { key: "tanggal_mulai", value: formatLocalDate(kegiatan.tanggal_mulai) },
    { key: "waktu_mulai", value: kegiatan.tanggal_mulai.toTimeString().slice(0, 5) },
    { key: "tanggal_selesai", value: formatLocalDate(kegiatan.tanggal_selesai) },
    { key: "waktu_selesai", value: kegiatan.tanggal_selesai.toTimeString().slice(0, 5) },
    { key: "lokasi", value: kegiatan.lokasi },
    { key: "pengajar_id", value: kegiatan.pengajar_id?.toString() || "" },
    { key: "kategori", value: kegiatan.kategori },
  ];
  fields.forEach(f => formData.append(f.key, f.value));

  if (Array.isArray(kegiatan.mahasiswa_ids)) {
    kegiatan.mahasiswa_ids.forEach(id => formData.append("mahasiswa_ids[]", id.toString()));
  }

  if (kegiatan.batas_waktu_izin) {
    formData.append("batas_waktu_izin", formatLocalDate(kegiatan.batas_waktu_izin));
  }

  if (kegiatan.link_grup_wa && kegiatan.link_grup_wa.trim() !== '') {
    formData.append("link_grup_wa", kegiatan.link_grup_wa);
  }

  if (kegiatan.poster && kegiatan.poster instanceof File) {
    formData.append("poster", kegiatan.poster);
  }

  if (Array.isArray(kegiatan.file_pdf)) {
    kegiatan.file_pdf.forEach(file => {
      if (file instanceof File) formData.append("file_pdf[]", file);
    });
  }
};

export const activityUpdate = (kegiatan: Activity, deletedPdfIndices: number[] = [], prodiId?: number | null) => {
  const formData = new FormData();
  formData.append("_method", "PUT");

  if (prodiId) {
    formData.append("prodi_id", prodiId.toString());
  }

  const fields = [
    { key: "nama_kegiatan", value: kegiatan.nama_kegiatan },
    { key: "deskripsi", value: kegiatan.deskripsi },
    { key: "tanggal_mulai", value: formatLocalDate(kegiatan.tanggal_mulai) },
    { key: "waktu_mulai", value: kegiatan.tanggal_mulai.toTimeString().slice(0, 5) },
    { key: "tanggal_selesai", value: formatLocalDate(kegiatan.tanggal_selesai) },
    { key: "waktu_selesai", value: kegiatan.tanggal_selesai.toTimeString().slice(0, 5) },
    { key: "lokasi", value: kegiatan.lokasi },
    { key: "pengajar_id", value: kegiatan.pengajar_id?.toString() || "" },
    { key: "kategori", value: kegiatan.kategori },
  ];
  fields.forEach(f => formData.append(f.key, f.value));

  if (Array.isArray(kegiatan.mahasiswa_ids)) {
    // Note: If array is empty, FormData does not send the key, so it won't clear mahasiswas on backend.
    // If clearing is needed, backend should handle it or we append an empty value handled by backend.
    if (kegiatan.mahasiswa_ids.length === 0) {
      formData.append("mahasiswa_ids", "empty");
    } else {
      kegiatan.mahasiswa_ids.forEach(id => formData.append("mahasiswa_ids[]", id.toString()));
    }
  }

  if (kegiatan.batas_waktu_izin) {
    formData.append("batas_waktu_izin", formatLocalDate(kegiatan.batas_waktu_izin));
  }

  if (kegiatan.link_grup_wa && kegiatan.link_grup_wa.trim() !== '') {
    formData.append("link_grup_wa", kegiatan.link_grup_wa);
  }

  // Handle poster deletion or update
  if (kegiatan.poster === "") {
    // User explicitly deleted the poster
    formData.append("delete_poster", "true");
  } else if (kegiatan.poster instanceof File) {
    // User uploaded a new poster
    formData.append("poster", kegiatan.poster);
  }
  if (deletedPdfIndices.length > 0) {
    deletedPdfIndices.forEach(index => {
      formData.append("delete_pdf_indices[]", index.toString());
    });
  }

  // Handle new PDF files
  if (Array.isArray(kegiatan.file_pdf)) {
    const newPdfFiles = kegiatan.file_pdf.filter(f => f instanceof File) as File[];
    newPdfFiles.forEach(file => formData.append("file_pdf[]", file));
  }

  return formData;
};