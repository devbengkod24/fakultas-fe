"use client"

import { useEffect, useState, useRef } from "react"
import RichTextEditor from "@/components/rich-text-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimePicker } from "../../ui/time-picker/time-picker"
import { Activity } from "@/types/bimbingan-karir/koordinator/daftar-kegiatan/activity"
import { Loader2, CalendarIcon, FileText, X, ExternalLink, Image as ImageIcon, MapPin, User, MessageCircle } from "lucide-react"
import { cn, formatDateFull } from "@/lib/utils"
import Image from "next/image"
import { extractFileNameFromUrl, truncateFileNameMiddle } from "@/lib/bimbingan-karir/kegiatan";
import { KategoriService, ManajemenPengajarService, DaftarMhsService } from "@/api/bimbingan-karir";
import { Kategori } from "@/api/bimbingan-karir/koordinator/kategori/kategori";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check } from "lucide-react";

type Props = {
  open: boolean
  mode: "add" | "edit"
  initialData?: Activity
  isLoading?: boolean
  onClose: () => void
  onSubmit: (activity: Activity, deletedPdfIndices: number[]) => void
  isPengajar?: boolean
}

export default function EditAddDialog({
  open,
  mode,
  initialData,
  isLoading = false,
  onClose,
  onSubmit,
  isPengajar = false
}: Props) {
  const getToday = () => {
    const today = new Date()
    today.setHours(10, 0, 0, 0)
    return today
  }

  const [categories, setCategories] = useState<Kategori[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const posterInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await KategoriService.getActive();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    const fetchPengajars = async () => {
      try {
        const response = await ManajemenPengajarService.getAllListPengajar();
        if (response.success) {
          setPengajars(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch pengajar", error);
      }
    };

    const fetchMahasiswas = async () => {
      try {
        const response = await DaftarMhsService.getAllListMahasiswa();
        if (response.success) {
          setMahasiswas(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch mahasiswas", error);
      }
    };

    fetchCategories();
    if (!isPengajar) {
      fetchPengajars();
      fetchMahasiswas();
    }
  }, [isPengajar]);

  const [pengajars, setPengajars] = useState<{ id: number, name: string }[]>([]);
  const [mahasiswas, setMahasiswas] = useState<{ id: number, name: string, nim: string }[]>([]);
  const [mahasiswaOpen, setMahasiswaOpen] = useState(false);

  const [formData, setFormData] = useState<{
    nama_kegiatan: string;
    deskripsi: string;
    lokasi: string;
    kategori: string;
    pengajar_id: number | "";
    link_grup_wa: string;
    mahasiswa_ids: number[];
  }>({
    nama_kegiatan: "",
    deskripsi: "",
    lokasi: "",
    kategori: "",
    pengajar_id: "",
    link_grup_wa: "",
    mahasiswa_ids: [],
  })

  const [existingPdfs, setExistingPdfs] = useState<string[]>([])
  const [originalPdfs, setOriginalPdfs] = useState<string[]>([]) // Track original PDFs
  const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(getToday())
  const [endDate, setEndDate] = useState<Date | undefined>(getToday())
  const [batasWaktuIzin, setBatasWaktuIzin] = useState<Date | undefined>(getToday())
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)
  const [batasWaktuIzinOpen, setBatasWaktuIzinOpen] = useState(false)

  // State untuk poster
  const [poster, setPoster] = useState<File | string | null>(null)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)
  const [posterDeleted, setPosterDeleted] = useState(false)

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        nama_kegiatan: initialData.nama_kegiatan,
        deskripsi: initialData.deskripsi,
        lokasi: initialData.lokasi,
        pengajar_id: initialData.pengajar_id || "",
        kategori: initialData.kategori,
        link_grup_wa: initialData.link_grup_wa || "",
        mahasiswa_ids: initialData.mahasiswa_ids || initialData.mahasiswas?.map(m => m.id) || [],
      });

      setStartDate(initialData.tanggal_mulai)
      setEndDate(initialData.tanggal_selesai)
      setBatasWaktuIzin(initialData.batas_waktu_izin || undefined)

      // Restore existing PDFs from API
      if (initialData.file_pdf && Array.isArray(initialData.file_pdf)) {
        const pdfUrls = initialData.file_pdf.filter(file => typeof file === 'string') as string[]
        setExistingPdfs(pdfUrls)
        setOriginalPdfs(pdfUrls) // Store original PDFs
      } else {
        setExistingPdfs([])
        setOriginalPdfs([])
      }
      setUploadedPdfs([])

      // Restore poster
      if (initialData.poster) {
        if (typeof initialData.poster === 'string') {
          setPoster(initialData.poster)
          setPosterPreview(initialData.poster)
        }
      } else {
        setPoster(null)
        setPosterPreview(null)
      }
      setPosterDeleted(false)
    }

    if (mode === "add" && open) {
      setFormData({
        nama_kegiatan: "",
        deskripsi: "",
        lokasi: "",
        pengajar_id: "",
        kategori: "",
        link_grup_wa: "",
        mahasiswa_ids: [],
      });

      setExistingPdfs([])
      setOriginalPdfs([])
      setUploadedPdfs([])
      const defaultTime = getToday()
      setStartDate(defaultTime)
      setEndDate(new Date(defaultTime.getTime() + 60 * 60 * 1000))
      setBatasWaktuIzin(defaultTime)
      setPoster(null)
      setPosterPreview(null)
      setPosterDeleted(false)
    }
  }, [initialData, mode, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const allowedTypes = ["application/pdf", "application/zip", "application/x-zip-compressed", "application/x-rar-compressed", "application/vnd.rar"]
      const validFiles = Array.from(files).filter(file =>
        allowedTypes.includes(file.type) ||
        file.name.endsWith('.zip') ||
        file.name.endsWith('.rar')
      )
      setUploadedPdfs(prev => [...prev, ...validFiles])
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setPoster(file)
      setPosterDeleted(false)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPosterPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
    if (posterInputRef.current) {
      posterInputRef.current.value = ""
    }
  }

  const removeNewPdf = (index: number) => {
    setUploadedPdfs(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingPdf = (index: number) => {
    setExistingPdfs(prev => prev.filter((_, i) => i !== index))
  }

  const removePoster = () => {
    setPosterPreview(null)
    setPosterDeleted(true)
    setPoster("")

    if (posterInputRef.current) {
      posterInputRef.current.value = ""
    }
  }

  // Calculate deleted PDF indices
  const getDeletedPdfIndices = (): number[] => {
    const deletedIndices: number[] = []
    originalPdfs.forEach((url, index) => {
      if (!existingPdfs.includes(url)) {
        deletedIndices.push(index)
      }
    })
    return deletedIndices
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading || (!startDate && !isPengajar) || (!endDate && !isPengajar)) return;

    const allPdfs = [...existingPdfs, ...uploadedPdfs]
    const deletedPdfIndices = mode === "edit" ? getDeletedPdfIndices() : []

    const activity: Activity = {
      id: mode === "edit" && initialData ? initialData.id : Date.now(),
      nama_kegiatan: formData.nama_kegiatan,
      deskripsi: formData.deskripsi,
      tanggal_mulai: startDate as Date,
      tanggal_selesai: endDate as Date,
      waktu_mulai: startDate as Date,
      waktu_selesai: endDate as Date,
      batas_waktu_izin: batasWaktuIzin,
      lokasi: formData.lokasi,
      kategori: formData.kategori,
      pengajar_id: Number(formData.pengajar_id),
      mahasiswa_ids: isPengajar ? undefined : formData.mahasiswa_ids,
      link_grup_wa: formData.link_grup_wa || undefined,
      file_pdf: allPdfs.length > 0 ? allPdfs : undefined,
      poster: posterDeleted ? "" : (poster || undefined),
    }

    onSubmit(activity, deletedPdfIndices)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isLoading) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isPengajar ? "Upload Materi Kegiatan" : mode === "edit" ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}</DialogTitle>
          <DialogDescription>
            {isPengajar ? "Perbarui materi dan deskripsi kegiatan." : mode === "edit" ? "Perbarui informasi kegiatan." : "Isi detail kegiatan baru di bawah ini."}
          </DialogDescription>
        </DialogHeader>

        {isPengajar && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border mb-2 text-sm">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Judul</p>
              <p className="font-medium text-foreground">{formData.nama_kegiatan}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kategori</p>
              <p className="font-medium inline-flex items-center gap-1">
                {categories.find(c => c.kode === formData.kategori)?.nama || formData.kategori}
              </p>
            </div>
            <div className="space-y-1 col-span-full border-t pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Jadwal Pelaksanaan</p>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                  <span>{startDate ? formatDateFull(startDate) : '-'}</span>
                </div>
                <span className="hidden sm:inline text-muted-foreground">sampai</span>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                  <span>{endDate ? formatDateFull(endDate) : '-'}</span>
                </div>
              </div>
            </div>
            <div className="space-y-1 border-t pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lokasi</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <p>{formData.lokasi}</p>
              </div>
            </div>
            <div className="space-y-1 border-t pt-2 text-right">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Peserta</p>
              <div className="flex items-center justify-end gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <p>{formData.mahasiswa_ids.length} Mahasiswa Terpilih</p>
              </div>
            </div>
            {formData.link_grup_wa && (
              <div className="space-y-1 col-span-full border-t pt-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Link Grup WA</p>
                <a
                  href={formData.link_grup_wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2 truncate"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  {formData.link_grup_wa}
                </a>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          {!isPengajar && (
            <div className="grid gap-2">
              <Label htmlFor="nama_kegiatan">
                Judul <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nama_kegiatan"
                name="nama_kegiatan"
                value={formData.nama_kegiatan}
                onChange={handleChange}
                required
                disabled={isPengajar}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="deskripsi">
              Deskripsi <span className="text-destructive">*</span>
            </Label>
            <RichTextEditor content={formData.deskripsi} onChange={(content) => setFormData(prev => ({ ...prev, deskripsi: content }))} />
          </div>

          {!isPengajar && (
            <>
              {/* Start Date & Time */}
              <div className="grid gap-2">
                <Label>
                  Tanggal & Waktu Mulai <span className="text-destructive">*</span>
                </Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                      disabled={isPengajar}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? formatDateFull(startDate) : "Pilih tanggal & waktu"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" side="right">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date && startDate) {
                          const newDateTime = new Date(date)
                          newDateTime.setHours(startDate.getHours())
                          newDateTime.setMinutes(startDate.getMinutes())
                          newDateTime.setSeconds(startDate.getSeconds())
                          setStartDate(newDateTime)
                        } else {
                          setStartDate(date)
                        }
                      }}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <TimePicker setDate={setStartDate} date={startDate} />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date & Time */}
              <div className="grid gap-2">
                <Label>
                  Tanggal & Waktu Selesai <span className="text-destructive">*</span>
                </Label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                      disabled={isPengajar}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? formatDateFull(endDate) : "Pilih tanggal & waktu"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" side="right">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        if (date && endDate) {
                          const newDateTime = new Date(date)
                          newDateTime.setHours(endDate.getHours())
                          newDateTime.setMinutes(endDate.getMinutes())
                          newDateTime.setSeconds(endDate.getSeconds())
                          setEndDate(newDateTime)
                        } else {
                          setEndDate(date)
                        }
                      }}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <TimePicker setDate={setEndDate} date={endDate} />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Batas Waktu Izin */}
              <div className="grid gap-2">
                <Label>
                  Batas Waktu Izin <span className="text-destructive">*</span>
                </Label>
                <Popover open={batasWaktuIzinOpen} onOpenChange={setBatasWaktuIzinOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !batasWaktuIzin && "text-muted-foreground"
                      )}
                      disabled={isPengajar}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {batasWaktuIzin ? formatDateFull(batasWaktuIzin) : "Pilih tanggal & waktu"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" side="right">
                    <Calendar
                      mode="single"
                      selected={batasWaktuIzin}
                      onSelect={(date) => {
                        if (date && batasWaktuIzin) {
                          const newDateTime = new Date(date)
                          newDateTime.setHours(batasWaktuIzin.getHours())
                          newDateTime.setMinutes(batasWaktuIzin.getMinutes())
                          newDateTime.setSeconds(batasWaktuIzin.getSeconds())
                          setBatasWaktuIzin(newDateTime)
                        } else {
                          setBatasWaktuIzin(date)
                        }
                      }}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <TimePicker setDate={setBatasWaktuIzin} date={batasWaktuIzin} />
                    </div>
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  Batas waktu terakhir mahasiswa dapat mengajukan izin
                </p>
              </div>
            </>
          )}

          {!isPengajar && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="pengajar_id">
                  Pengajar / Mentor <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={String(formData.pengajar_id)}
                  onValueChange={(val) => setFormData((f) => ({ ...f, pengajar_id: Number(val) }))}
                  required
                  disabled={isPengajar}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih pengajar" />
                  </SelectTrigger>
                  <SelectContent>
                    {pengajars.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>
                  Peserta Mahasiswa <span className="text-muted-foreground text-xs">(opsional)</span>
                </Label>
                <Popover open={mahasiswaOpen} onOpenChange={setMahasiswaOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={mahasiswaOpen} className="justify-between" disabled={isPengajar}>
                      {formData.mahasiswa_ids.length > 0
                        ? `${formData.mahasiswa_ids.length} mahasiswa terpilih`
                        : "Pilih mahasiswa..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Cari mahasiswa berdasarkan nama atau NIM..." />
                      <CommandList>
                        <CommandEmpty>Tidak ada mahasiswa ditemukan.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            key="select-all"
                            onSelect={() => {
                              if (formData.mahasiswa_ids.length === mahasiswas.length) {
                                setFormData((prev) => ({ ...prev, mahasiswa_ids: [] }));
                              } else {
                                setFormData((prev) => ({ ...prev, mahasiswa_ids: mahasiswas.map(m => m.id) }));
                              }
                            }}
                          >
                            <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", formData.mahasiswa_ids.length === mahasiswas.length ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible")}>
                              <Check className={cn("h-4 w-4")} />
                            </div>
                            <span>Pilih Semua</span>
                          </CommandItem>
                          {mahasiswas.map((mhs) => {
                            const isSelected = formData.mahasiswa_ids.includes(mhs.id)
                            return (
                              <CommandItem
                                key={mhs.id}
                                onSelect={() => {
                                  setFormData((prev) => {
                                    const newIds = isSelected
                                      ? prev.mahasiswa_ids.filter((id) => id !== mhs.id)
                                      : [...prev.mahasiswa_ids, mhs.id]
                                    return { ...prev, mahasiswa_ids: newIds }
                                  })
                                }}
                              >
                                <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible")}>
                                  <Check className={cn("h-4 w-4")} />
                                </div>
                                <div className="flex flex-col">
                                  <span>{mhs.name}</span>
                                  <span className="text-xs text-muted-foreground">{mhs.nim}</span>
                                </div>
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lokasi">
                  Lokasi <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lokasi"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  required
                  disabled={isPengajar}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="kategori">
                  Kategori <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.kategori}
                  onValueChange={(val) => setFormData((f) => ({ ...f, kategori: val }))}
                  required
                  disabled={isPengajar}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.kode} value={cat.kode}>
                        {cat.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Link Grup WhatsApp */}
              <div className="grid gap-2">
                <Label htmlFor="link_grup_wa">
                  Link Grup WhatsApp <span className="text-muted-foreground text-xs">(opsional)</span>
                </Label>
                <Input
                  id="link_grup_wa"
                  name="link_grup_wa"
                  type="url"
                  placeholder="https://chat.whatsapp.com/..."
                  value={formData.link_grup_wa}
                  onChange={handleChange}
                  disabled={isPengajar}
                />
              </div>

              {/* Upload Poster */}
              <div className="grid gap-2">
                <Label htmlFor="poster">
                  Poster Kegiatan <span className="text-muted-foreground text-xs">(opsional)</span>
                </Label>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => posterInputRef.current?.click()}
                    className="w-full"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {poster ? "Ganti Poster" : "Upload Poster"}
                  </Button>
                  <input
                    ref={posterInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePosterUpload}
                  />

                  {/* Poster Preview */}
                  {posterPreview && (
                    <div className="relative w-full h-48 border rounded-md overflow-hidden">
                      <Image
                        src={posterPreview}
                        alt="Poster preview"
                        className="w-full h-full object-cover"
                        fill
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removePoster}
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Format: png atau jpg (Maks. 5MB)
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Upload Multiple PDFs - OPSIONAL */}
          <div className="grid gap-2">
            <Label htmlFor="file_pdf">
              Upload Materi <span className="text-muted-foreground text-xs">(opsional)</span>
            </Label>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Pilih File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.zip,.rar,application/pdf,application/zip,application/x-zip-compressed,application/x-rar-compressed,application/vnd.rar"
                multiple
                className="hidden"
                onChange={handlePdfUpload}
              />

              {/* Existing PDFs from API */}
              {existingPdfs.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">File yang sudah ada:</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                    {existingPdfs.map((url, index) => {
                      const originalName = extractFileNameFromUrl(url)
                      const fileName = truncateFileNameMiddle(originalName)

                      return (
                        <div
                          key={`existing-${index}`}
                          className="flex items-center justify-between gap-2 p-2 bg-muted rounded-md border"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {fileName}
                              </p>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                              >
                                Lihat file <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExistingPdf(index)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* New Uploaded PDFs */}
              {uploadedPdfs.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">File baru yang akan diupload:</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                    {uploadedPdfs.map((file, index) => {
                      const displayName = truncateFileNameMiddle(file.name)
                      return (
                        <div
                          key={`new-${index}`}
                          className="flex items-center justify-between gap-2 p-2 bg-primary/5 rounded-md border border-primary/20"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {displayName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNewPdf(index)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {(existingPdfs.length > 0 || uploadedPdfs.length > 0) && (
                <p className="text-xs text-muted-foreground">
                  Total: {existingPdfs.length + uploadedPdfs.length} file
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                Format yang didukung: PDF, ZIP, RAR (Maks. 10MB per file)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !startDate || !endDate}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Simpan..." : "Tambah..."}
                </>
              ) : (
                mode === "edit" ? "Simpan Perubahan" : "Tambah"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
