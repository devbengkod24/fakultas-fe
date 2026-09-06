"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Search, X, Users } from "lucide-react";
import { DosenFakultasService } from "@/api";

export interface CoAuthorItem {
  author_id: number;
  author_name: string;
  dosen_id?: number | null;
  is_primary?: boolean;
}

/**
 * Sumber tunggal untuk semua picker penulis.
 *
 * Wajib lewat /authors-with-dosen: yang diminta BE untuk co_author_ids adalah
 * penulis.id (author_id), BUKAN dosen.id. Dua ruang id itu tidak pernah sama —
 * memakai /master/dosen mengirim orang yang salah atau ditolak BE.
 * Search-nya sudah dikerjakan server, jadi tidak perlu filter ulang di client.
 */
export async function searchAuthors(
  query: string,
  excludeAuthorId?: number
): Promise<{ author_id: number; author_name: string; prodi?: string }[]> {
  const res = await DosenFakultasService.getAuthorsWithDosen(query, 10);
  const list: any[] = res?.data?.items ?? [];
  return list
    .filter((a) => a.author_id != null && a.author_id !== excludeAuthorId)
    .map((a) => ({
      author_id: a.author_id,
      author_name: a.nama,
      prodi: a.departemen ?? undefined,
    }));
}

interface ProfileLike {
  roles?: string;
  permissions?: string[];
  dosen?: { dosen_id?: number } | null;
}

/**
 * Cerminan aturan BE (`helpers/permissions.py`) di sisi UI.
 *
 * BE tetap gerbang yang sebenarnya — ini cuma supaya tombol yang pasti ditolak
 * tidak ditampilkan. Kalau salah satu berubah, ubah dua-duanya.
 *
 * `is_primary` diambil dari response detail (urutan_penulis=1 untuk artikel,
 * is_leader untuk penelitian). Kalau tidak ada satu pun yang primary, BE memakai
 * urutan_penulis TERKECIL — dan karena BE mengirim daftar author sudah terurut
 * by urutan_penulis, `authors[0]` di sini adalah orang yang sama persis.
 * Keduanya sengaja disamakan; sebelumnya BE memakai baris junction terlama dan
 * kedua sisi bisa menunjuk orang berbeda.
 */
// Cerminan `helpers/permissions.py::same_person()` — matcher tunggal yang
// dipakai BE untuk memutuskan `is_leader` dari string `nama_ketua`.
//
// Dipakai untuk MENCOCOKKAN nama_ketua yang tersimpan ke daftar anggota, bukan
// untuk memutuskan apa pun: BE tetap wasitnya. Perbandingan `===` tidak cukup —
// dari 626 penelitian cuma 3 yang namanya sama persis, 478 lainnya cuma beda
// kapitalisasi atau gelar ("De Rosal Ignatius Moses Setiadi" vs "DE ROSAL
// IGNATIUS MOSES SETIADI"). Kalau salah satu berubah, ubah dua-duanya.
const GELAR = new Set([
  "prof", "dr", "drs", "dra", "ir", "st", "se", "mm", "mt", "msi", "mkom",
  "skom", "phd", "kom", "si", "sn", "psi", "med", "eng", "sc", "ba", "ma",
  "s", "m",
]);

export function samaOrang(a?: string | null, b?: string | null): boolean {
  const norm = (v?: string | null) =>
    (v ?? "")
      .toLowerCase()
      .split(",")[0]          // buang gelar belakang: ", M.Kom, Ph.D"
      .replace(/\./g, "")     // titik DIHAPUS supaya "ph.d" jadi "phd"
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w && !GELAR.has(w))
      .join(" ");
  const na = norm(a);
  return na !== "" && na === norm(b);
}

export function coAuthorScope(profile: ProfileLike | null, authors: CoAuthorItem[]) {
  const roles = profile?.roles ?? "";
  const perms = profile?.permissions ?? [];
  const isStaff =
    roles === "super_fakultas" || roles === "admin" || perms.includes("fakultas");

  const myDosenId = profile?.dosen?.dosen_id ?? null;
  const me =
    myDosenId == null ? undefined : authors.find((a) => a.dosen_id === myDosenId);

  const explicitPrimary = authors.find((a) => a.is_primary);
  const primaryAuthorId = (explicitPrimary ?? authors[0])?.author_id;
  const isPrimary = me != null && me.author_id === primaryAuthorId;

  const canManage = isStaff || isPrimary;
  return {
    isStaff,
    isPrimary,
    canManage,
    myAuthorId: me?.author_id ?? null,
    canRemove: (a: CoAuthorItem) => canManage || a.author_id === me?.author_id,
  };
}

interface CoAuthorPickerProps {
  value: CoAuthorItem[];
  onChange: (next: CoAuthorItem[]) => void;
  /** Penulis utama halaman ini — tidak ikut muncul di hasil pencarian. */
  excludeAuthorId?: number;
  /** false = tidak boleh menambah orang baru. */
  canAdd?: boolean;
  /** Per-item: boleh dihapus atau tidak. */
  canRemove?: (item: CoAuthorItem) => boolean;
  label?: string;
  note?: string;
}

export function CoAuthorPicker({
  value,
  onChange,
  excludeAuthorId,
  canAdd = true,
  canRemove = () => true,
  label = "Penulis Pendamping",
  note,
}: CoAuthorPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { author_id: number; author_name: string; prodi?: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const runSearch = useCallback(
    async (q: string) => {
      if (!q || q.length < 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        setResults(await searchAuthors(q, excludeAuthorId));
      } catch (error) {
        console.error("Error searching co-author:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [excludeAuthorId]
  );

  const debouncedSearch = useCallback(
    (q: string) => {
      setQuery(q);
      const t = setTimeout(() => runSearch(q), 300);
      return () => clearTimeout(t);
    },
    [runSearch]
  );

  const add = (a: { author_id: number; author_name: string }) => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    if (value.some((c) => c.author_id === a.author_id)) return;
    onChange([...value, { author_id: a.author_id, author_name: a.author_name }]);
  };

  const remove = (authorId: number) =>
    onChange(value.filter((c) => c.author_id !== authorId));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <Label>{label}</Label>
      </div>

      {canAdd && (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => {
                debouncedSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder={`Cari nama ${label.toLowerCase()}...`}
              className="pl-9 pr-9"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
            )}
          </div>
          {showDropdown && results.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {results.map((a) => (
                <button
                  key={a.author_id}
                  type="button"
                  onClick={() => add(a)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                >
                  <span className="font-medium">{a.author_name}</span>
                  {a.prodi && <span className="text-xs text-slate-500">{a.prodi}</span>}
                </button>
              ))}
            </div>
          )}
          {showDropdown && query.length >= 2 && results.length === 0 && !isSearching && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm text-slate-500">
              Tidak ditemukan hasil untuk {query}
            </div>
          )}
        </div>
      )}

      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {value.map((a) => (
            <Badge key={a.author_id} variant="secondary" className="gap-1 py-1 pl-2 pr-1">
              {a.author_name}
              {canRemove(a) ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 text-red-500 hover:text-red-600"
                  onClick={() => remove(a.author_id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              ) : (
                <span className="w-4" />
              )}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-2">Belum ada {label.toLowerCase()}.</p>
      )}

      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
