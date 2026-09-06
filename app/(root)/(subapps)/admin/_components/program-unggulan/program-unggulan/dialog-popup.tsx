"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Plus, Trash } from "lucide-react";
import { ProgramUnggulan } from "@/types/admin/program-unggulan/program-unggulan/program-unggulan";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  shortDesc: z.string().min(1, "Deskripsi singkat harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  partner: z.string().min(1, "Partner harus diisi"),
  duration: z.string().min(1, "Durasi harus diisi"),
  location: z.string().min(1, "Lokasi harus diisi"),
  applicationDeadline: z
    .string()
    .min(1, "Deadline pendaftaran harus diisi")
    .refine((date) => {
      return !isNaN(Date.parse(date));
    }, "Format tanggal tidak valid"),
  applicationLink: z.string().min(1, "Link pendaftaran harus diisi"),
  image: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DialogPopUpProps {
  mode?: "add" | "edit";
  initialData?: ProgramUnggulan;
  onSubmit?: (data: ProgramUnggulan & { imageFile?: File }) => Promise<void>;
  trigger?: React.ReactNode;
}

const DialogPopUp: React.FC<DialogPopUpProps> = ({
  mode = "add",
  initialData,
  onSubmit,
  trigger,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string>(
    initialData?.image || ""
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Helper function to transform relative image paths to full URLs
  const getFullImageUrl = (relativePath: string | null | undefined): string => {
    if (!relativePath) return "";

    // Return as-is if already a full URL or data URL
    if (
      relativePath.startsWith("data:") ||
      relativePath.startsWith("http://") ||
      relativePath.startsWith("https://")
    ) {
      return relativePath;
    }

    // Construct full URL based on API base URL patterns
    // Check for development/local API
    if (
      relativePath.includes("127.0.0.1") ||
      relativePath.includes("localhost")
    ) {
      return relativePath;
    }

    // For relative paths, construct full URL
    const baseUrl = "https://api-dev-sti.dinus.id/storage/";
    // Remove leading slash if present to avoid double slash
    const cleanPath = relativePath.startsWith("/")
      ? relativePath.slice(1)
      : relativePath;
    const fullUrl = baseUrl + cleanPath;

    return fullUrl;
  };

  const [benefits, setBenefits] = React.useState<string[]>(
    initialData?.benefits ||
      initialData?.program_benefits?.map((b) => b.benefit) || [""]
  );
  const [requirements, setRequirements] = React.useState<string[]>(
    initialData?.requirements ||
      initialData?.program_requirements?.map((r) => r.requirement) || [""]
  );
  const [statistics, setStatistics] = React.useState<
    Array<{ name: string; value: number }>
  >(
    // Use statisticsData if available, otherwise transform statistics
    initialData?.statisticsData ||
      initialData?.statistics?.map((s) => ({
        name: s.name,
        value: s.pivot?.value || 0,
      })) || [{ name: "", value: 0 }]
  );

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      shortDesc: initialData?.shortDesc || "",
      description: initialData?.description || "",
      partner: initialData?.partner || "",
      duration: initialData?.duration || "",
      location: initialData?.location || "",
      applicationDeadline: initialData?.applicationDeadline || "",
      applicationLink: initialData?.applicationLink || "",
      image: initialData?.image || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      if (initialData && mode === "edit") {
        form.reset({
          title: initialData.title || "",
          shortDesc: initialData.shortDesc || "",
          description: initialData.description || "",
          partner: initialData.partner || "",
          duration: initialData.duration || "",
          location: initialData.location || "",
          applicationDeadline: initialData.applicationDeadline || "",
          applicationLink: initialData.applicationLink || "",
          image: initialData.image || "",
        });

        // Reset image states for edit mode
        setPreviewImage(getFullImageUrl(initialData.image) || "");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Reset benefits
        setBenefits(
          initialData.benefits ||
            initialData.program_benefits?.map((b) => b.benefit) || [""]
        );

        // Reset requirements
        setRequirements(
          initialData.requirements ||
            initialData.program_requirements?.map((r) => r.requirement) || [""]
        );

        // Reset statistics
        setStatistics(
          initialData.statisticsData ||
            initialData.statistics?.map((s) => ({
              name: s.name,
              value: s.pivot?.value || 0,
            })) || [{ name: "", value: 0 }]
        );
      } else if (mode === "add") {
        form.reset({
          title: "",
          shortDesc: "",
          description: "",
          partner: "",
          duration: "",
          location: "",
          applicationDeadline: "",
          applicationLink: "",
          image: "",
        });
        setPreviewImage("");
        setSelectedFile(null);
        setBenefits([""]);
        setRequirements([""]);
        setStatistics([{ name: "", value: 0 }]);
      }
    }
  }, [initialData, mode, open, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - accept all common image formats
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      // Additional check for file extension as backup
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));

      // Check if file is valid (either by MIME type OR file extension)
      const isValidType = allowedTypes.includes(file.type);
      const isValidExtension = allowedExtensions.includes(fileExtension);

      if (!isValidType && !isValidExtension) {
        e.target.value = "";
        return;
      }

      // Validate file size - maximum 5MB
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        e.target.value = "";
        return;
      }

      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // File was cleared
      setSelectedFile(null);
      setPreviewImage(mode === "edit" ? initialData?.image || "" : "");
    }
  };

  const addBenefit = () => setBenefits([...benefits, ""]);
  const removeBenefit = (index: number) => {
    if (benefits.length > 1) {
      setBenefits(benefits.filter((_, i) => i !== index));
    }
  };
  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const addRequirement = () => setRequirements([...requirements, ""]);
  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };
  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const addStatistic = () =>
    setStatistics([...statistics, { name: "", value: 0 }]);
  const removeStatistic = (index: number) => {
    if (statistics.length > 1) {
      setStatistics(statistics.filter((_, i) => i !== index));
    }
  };
  const updateStatistic = (
    index: number,
    field: "name" | "value",
    value: string | number
  ) => {
    const newStatistics = [...statistics];
    newStatistics[index] = { ...newStatistics[index], [field]: value };
    setStatistics(newStatistics);
  };

  const handleFormSubmit = async (data: FormData) => {
    if (!onSubmit) return;

    // Validate image for add mode
    if (mode === "add" && !selectedFile) {
      setSubmitError("Gambar harus diupload untuk mode tambah");
      return;
    }

    // Validate arrays
    const filledBenefits = benefits.filter((b) => b.trim());
    const filledRequirements = requirements.filter((r) => r.trim());
    const filledStatistics = statistics.filter(
      (s) => s.name.trim() && s.value > 0
    );

    if (filledBenefits.length === 0) {
      setSubmitError("Minimal harus ada satu benefit yang diisi");
      return;
    }

    if (filledRequirements.length === 0) {
      setSubmitError("Minimal harus ada satu requirement yang diisi");
      return;
    }

    if (filledStatistics.length === 0) {
      setSubmitError("Minimal harus ada satu statistik yang diisi");
      return;
    }

    // Clear previous errors and set loading
    setSubmitError(null);
    setIsSubmitting(true);

    const formData: ProgramUnggulan & {
      imageFile?: File;
    } = {
      ...data,
      id: initialData?.id || undefined,
      image:
        mode === "edit" && !selectedFile
          ? initialData?.image || ""
          : previewImage,
      imageFile: selectedFile || undefined,
      short_desc: data.shortDesc,
      application_deadline: data.applicationDeadline,
      application_link: data.applicationLink,
      shortDesc: data.shortDesc,
      applicationDeadline: data.applicationDeadline,
      applicationLink: data.applicationLink,
      benefits: filledBenefits,
      requirements: filledRequirements,
      statisticsData: filledStatistics,
    };

    try {
      await onSubmit(formData);
      setOpen(false);
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan data"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = mode === "edit";
  const title = isEditMode
    ? "Edit Program Unggulan Program Studi"
    : "Tambah Program Unggulan Program Studi";
  const buttonText = isEditMode ? "Perbarui" : "Simpan";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant={isEditMode ? "outline" : "default"}
            className="h-full"
          >
            <PlusCircle className="h-4 w-4" />
            <span>
              {isEditMode ? "Edit" : "Tambah Program Unggulan Program Studi"}
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Gambar</FormLabel>

                  <FormControl>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormMessage />
                  {previewImage && (
                    <div className="mt-2">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        width={200}
                        height={150}
                        className="object-cover rounded border"
                        style={{ maxHeight: "150px", width: "auto" }}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
            {/* Main Image */}
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan judul program" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="partner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan partner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durasi</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan durasi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan lokasi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicationDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline Pendaftaran</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicationLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Pendaftaran</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="Masukkan link pendaftaran"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="shortDesc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Singkat</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan deskripsi singkat"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Lengkap</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan deskripsi lengkap"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Benefits Section */}
            <div>
              <Label className="text-sm font-medium">Benefits</Label>
              <div className="space-y-2 mt-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={`Benefit ${index + 1}`}
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeBenefit(index)}
                      disabled={benefits.length === 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBenefit}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Benefit
                </Button>
              </div>
            </div>

            {/* Requirements Section */}
            <div>
              <Label className="text-sm font-medium">Requirements</Label>
              <div className="space-y-2 mt-2">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={`Requirement ${index + 1}`}
                      value={requirement}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeRequirement(index)}
                      disabled={requirements.length === 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRequirement}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Requirement
                </Button>
              </div>
            </div>

            {/* Statistics Section */}
            <div>
              <Label className="text-sm font-medium">Statistik</Label>
              <div className="space-y-2 mt-2">
                {statistics.map((statistic, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Nama statistik"
                      value={statistic.name}
                      onChange={(e) =>
                        updateStatistic(index, "name", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Nilai"
                      min={0}
                      value={statistic.value}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        updateStatistic(index, "value", val);
                      }}
                      className="w-24"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeStatistic(index)}
                      disabled={statistics.length === 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStatistic}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Statistik
                </Button>
              </div>
            </div>

            {submitError && (
              <div className="text-red-600 text-sm">{submitError}</div>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPopUp;
