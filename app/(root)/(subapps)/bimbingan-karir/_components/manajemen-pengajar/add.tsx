/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useState } from "react"
import { Plus, Search, List, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  addDosenManualSchema,
  addDosenFromListSchema,
  type AddDosenManualFormData,
  type AddDosenFromListFormData,
} from "./schema"
import { ManajemenPengajarService } from "@/api/bimbingan-karir"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { CustomTabs } from "@/components/custom-tabs"
import { handleToastResponse } from "@/lib/toast-response"
import useSWR, { KeyedMutator } from "swr"
import { useProfile } from "@/context/profileUseContext"

interface ListDosen {
  id: number
  name: string
  email: string
  gelar_depan: string | null
  gelar_belakang: string | null
  has_bk_permission: boolean
}

interface AddDosenButtonProps {
  mutate: KeyedMutator<any>
}

const fetcherListDosen = (prodiId: number | null) => {
  return ManajemenPengajarService.getAllListDosen(prodiId).then((res) => res)
}

// Helper function to format name with titles
const formatNameWithTitles = (name: string, gelarDepan: string | null, gelarBelakang: string | null) => {
  let fullName = name
  
  if (gelarDepan) {
    fullName = `${gelarDepan} ${fullName}`
  }
  
  if (gelarBelakang) {
    fullName = `${fullName}, ${gelarBelakang}`
  }
  
  return fullName
}

export default function AddDosenButton({ mutate: mutateTable }: AddDosenButtonProps) {
  const { activeProdiId } = useProfile();
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch list dosen
  const { data, error, isLoading, } = useSWR(
    open ? ["list-dosen", activeProdiId] : null,
    () => fetcherListDosen(activeProdiId),
    { revalidateOnFocus: false }
  )

  const listDosen = data?.data || []

  // Form untuk manual
  const manualForm = useForm<AddDosenManualFormData>({
    resolver: zodResolver(addDosenManualSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  // Form untuk pilih dari list
  const listForm = useForm<AddDosenFromListFormData>({
    resolver: zodResolver(addDosenFromListSchema),
    defaultValues: {
      selectedDosen: "",
    },
  })

  // Tabs configuration
  const tabs = [
    {
      status: "list",
      label: "Pilih dari List",
      icon: List,
    },
    {
      status: "manual",
      label: "Manual",
      icon: Edit,
    },
  ]

  // Filter dosen berdasarkan search
  const filteredDosen = listDosen.filter((dosen: ListDosen) => {
    const query = searchQuery.toLowerCase()
    const fullName = formatNameWithTitles(dosen.name, dosen.gelar_depan, dosen.gelar_belakang)
    return (
      fullName.toLowerCase().includes(query) ||
      dosen.name.toLowerCase().includes(query) ||
      dosen.email.toLowerCase().includes(query)
    )
  })

  const handleSubmitManual = async (data: AddDosenManualFormData) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("prodi_id", activeProdiId?.toString() || "")

      const response = await ManajemenPengajarService.createPengajar(formData, activeProdiId)

      if (response.success) {
        handleToastResponse(response)
        handleReset()
        await mutateTable({ revalidate: true })

        setTimeout(async () => {
          await mutateTable({ revalidate: true })
        }, 200)
      } else {
        handleToastResponse(response)
      }

    } catch (error) {
      toast.error("Terjadi kesalahan saat menambahkan pengajar")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitList = async (data: AddDosenFromListFormData) => {
    setIsSubmitting(true)
    try {
      const dosenId = parseInt(data.selectedDosen)
      const response = await ManajemenPengajarService.createPermission(dosenId, activeProdiId)

      if (response.success) {
        handleToastResponse(response)
        handleReset()
        await mutateTable({ revalidate: true })

        setTimeout(async () => {
          await mutateTable({ revalidate: true })
        }, 200)
      } else {
        handleToastResponse(response)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memberikan permission")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    manualForm.reset()
    listForm.reset()
    setSearchQuery("")
    setOpen(false)
  }

  const handleSubmit = () => {
    if (activeTab === "manual") {
      manualForm.handleSubmit(handleSubmitManual)()
    } else {
      listForm.handleSubmit(handleSubmitList)()
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Tambah Pengajar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tambah Pengajar</DialogTitle>
            <DialogDescription>Tambahkan pengajar baru secara manual atau pilih dari daftar dosen yang sudah ada.</DialogDescription>
          </DialogHeader>

          <CustomTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="mt-4">
            {/* Tab: Pilih dari List */}
            {activeTab === "list" && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama atau email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Form {...listForm}>
                  <form className="space-y-4">
                    <FormField
                      control={listForm.control}
                      name="selectedDosen"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="max-h-[400px] space-y-2 overflow-y-auto rounded-md border p-2"
                            >
                              {isLoading ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                  Memuat data dosen...
                                </div>
                              ) : error ? (
                                <div className="py-8 text-center text-sm text-destructive">
                                  Gagal memuat data dosen
                                </div>
                              ) : filteredDosen.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                  Tidak ada dosen ditemukan
                                </div>
                              ) : (
                                filteredDosen.map((dosen: ListDosen, index: number) => {
                                  const fullName = formatNameWithTitles(
                                    dosen.name, 
                                    dosen.gelar_depan, 
                                    dosen.gelar_belakang
                                  )
                                  
                                  return (
                                    <div
                                      key={`${dosen.id}-${dosen.email}-${index}`}
                                      className="flex items-start space-x-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                                    >
                                      <RadioGroupItem
                                        value={dosen.id.toString()}
                                        id={`dosen-${dosen.id}-${index}`}
                                        className="mt-1"
                                      />
                                      <label
                                        htmlFor={`dosen-${dosen.id}-${index}`}
                                        className="flex-1 cursor-pointer space-y-1"
                                      >
                                        <div className="font-medium">{fullName}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {dosen.email}
                                        </div>
                                      </label>
                                    </div>
                                  )
                                })
                              )}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {listForm.watch("selectedDosen") && (
                      <div className="text-sm text-muted-foreground">
                        1 dosen dipilih
                      </div>
                    )}
                  </form>
                </Form>
              </div>
            )}

            {/* Tab: Manual */}
            {activeTab === "manual" && (
              <div className="space-y-4">
                <Form {...manualForm}>
                  <form className="space-y-4">
                    <FormField
                      control={manualForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan nama lengkap dosen"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={manualForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Masukkan email dosen"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                activeTab === "list" ? "Tambahkan" : "Tambah"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}