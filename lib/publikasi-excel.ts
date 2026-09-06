import ExcelJS from "exceljs";

export type ImportType = "artikel" | "penelitian";

const HEADER_ARTIKEL = [
  "judul",
  "tahun",
  "sumber",
  "primary_sinta_id",
  "primary_author_name",
  "co_author_sinta_ids",
  "jurnal",
  "doi",
  "accred",
  "abstrak",
  "url_artikel",
] as const;

const HEADER_PENELITIAN = [
  "judul",
  "tahun",
  "primary_sinta_id",
  "primary_author_name",
  "co_author_sinta_ids",
  "leader_sinta_id",
  "dana",
  "status_dana",
  "sumber_dana",
  "fund_type",
] as const;

const SAMPLE_ARTIKEL_ROW: Record<string, string | number> = {
  judul: "Contoh judul publikasi artikel",
  tahun: 2024,
  sumber: "MANUAL",
  primary_sinta_id: "12345",
  primary_author_name: "Nama Dosen (Author Utama)",
  co_author_sinta_ids: "67890|11111|22222",
  jurnal: "Nama Jurnal Ilmiah",
  doi: "10.1234/contoh.doi.2024",
  accred: "S2",
  abstrak: "Ringkasan singkat mengenai artikel...",
  url_artikel: "https://journal.example.com/article",
};

const SAMPLE_PENELITIAN_ROW: Record<string, string | number> = {
  judul: "Contoh judul penelitian",
  tahun: 2024,
  primary_sinta_id: "12345",
  primary_author_name: "Nama Ketua Penelitian",
  co_author_sinta_ids: "67890|11111",
  leader_sinta_id: "12345",
  dana: 50000000,
  status_dana: "Approved",
  sumber_dana: "INTERNAL_SOURCE",
  fund_type: "Penelitian Dosen",
};

function styleHeaderRow(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E40AF" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: "FFCBD5E1" } },
      left: { style: "thin", color: { argb: "FFCBD5E1" } },
      bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
      right: { style: "thin", color: { argb: "FFCBD5E1" } },
    };
  });
  row.height = 22;
}

function appendHeaderRow(
  sheet: ExcelJS.Worksheet,
  headers: readonly string[],
  isArtikel: boolean,
) {
  sheet.addRow([...headers]);
  const headerRow = sheet.getRow(1);
  styleHeaderRow(headerRow);

  const sample = isArtikel ? SAMPLE_ARTIKEL_ROW : SAMPLE_PENELITIAN_ROW;
  sheet.addRow(headers.map((header) => sample[header] ?? ""));

  const sampleRow = sheet.getRow(2);
  sampleRow.eachCell((cell) => {
    cell.font = { italic: true, color: { argb: "FF94A3B8" } };
    cell.alignment = { vertical: "middle", wrapText: true };
  });
  sampleRow.getCell(1).note =
    "Baris ini hanya contoh. Hapus baris ini sebelum upload.";
}

function autoWidth(sheet: ExcelJS.Worksheet, headers: readonly string[]) {
  headers.forEach((header, idx) => {
    const col = sheet.getColumn(idx + 1);
    col.width = Math.max(header.length + 4, 18);
  });
}

function triggerDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function downloadImportTemplate(type: ImportType) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "STI-FE";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(
    type === "artikel" ? "Artikel" : "Penelitian",
    {
      views: [{ state: "frozen", ySplit: 1 }],
    },
  );

  if (type === "artikel") {
    appendHeaderRow(sheet, HEADER_ARTIKEL, true);
    autoWidth(sheet, HEADER_ARTIKEL);
  } else {
    appendHeaderRow(sheet, HEADER_PENELITIAN, false);
    autoWidth(sheet, HEADER_PENELITIAN);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  triggerDownload(blob, `template_${type}.xlsx`);
}

function buildQueryString(params?: Record<string, string | number | undefined>): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  if (entries.length === 0) return "";
  const usp = new URLSearchParams();
  entries.forEach(([k, v]) => usp.append(k, String(v)));
  return `?${usp.toString()}`;
}

export function buildExportFilename(type: ImportType): string {
  const date = new Date().toISOString().split("T")[0];
  return type === "artikel"
    ? `publikasi_artikel_${date}.xlsx`
    : `publikasi_penelitian_${date}.xlsx`;
}

export function buildImportFilename(type: ImportType): string {
  return `template_${type}.xlsx`;
}

export function getHeadersFor(type: ImportType): readonly string[] {
  return type === "artikel" ? HEADER_ARTIKEL : HEADER_PENELITIAN;
}

export { buildQueryString, triggerDownload, HEADER_ARTIKEL, HEADER_PENELITIAN };