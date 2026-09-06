"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard-header";
import withAuth from "@/app/(root)/hoc/withAuth";
import { Button } from "@/components/ui/button";
import { Award, Plus } from "lucide-react";
import useSWR from "swr";
import { SertifikatService } from "@/api/bimbingan-karir";
import SertifikatCard from "../_components/sertifikat/card";
import SertifikatDialog from "../_components/sertifikat/dialog";
import DeleteDialog from "../_components/sertifikat/delete";
import { toast } from "sonner";
import { handleToastResponse } from "@/lib/toast-response";
import { TemplateSertifikat } from "@/types/bimbingan-karir/koordinator/sertifikat/sertifikat";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SertifikatSkeleton } from "../_components/sertifikat/skeleton";
import EmptyState from "@/components/empty-state";
import { useProfile } from "@/context/profileUseContext";

const fetcherSertifikat = (activeProdiId: number | null) =>
  SertifikatService.getAllSertifikat(activeProdiId).then((res) => res);

const fetcherSertifikatPreview = (template_id: number) =>
  SertifikatService.getSertifikatPreview(template_id).then((res) => res);

const KoordinatorSertifikat = () => {
  const { activeProdiId } = useProfile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSertifikat | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateSertifikat | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data, error, isLoading, mutate } = useSWR(
    ["sertifikat", activeProdiId],
    () => fetcherSertifikat(activeProdiId),
    { revalidateOnFocus: false, dedupingInterval: 500 }
  );

  const templates: TemplateSertifikat[] = data?.data || [];

  const { data: previewData } = useSWR(
    previewTemplate ? ["sertifikatPreview", previewTemplate.id] : null,
    () => fetcherSertifikatPreview(previewTemplate!.id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const handleAdd = () => {
    setDialogMode("add");
    setSelectedTemplate(null);
    setDialogOpen(true);
  };

  const handleEdit = (template: TemplateSertifikat) => {
    setDialogMode("edit");
    setSelectedTemplate(template);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTemplateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (templateToDelete === null) return;

    try {
      const res = await SertifikatService.deleteSertifikatTemplate(templateToDelete);
      handleToastResponse(res);
      mutate();
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    } catch (error) {
      toast.error("Gagal menghapus template");
      console.error(error);
    }
  };

  const handlePreview = (template: TemplateSertifikat) => {
    setPreviewTemplate(template);
    setPreviewOpen(true);
  };

  const handleSubmit = async (data: TemplateSertifikat) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("nama_template", data.nama_template);

      if (data.file_path instanceof File) {
        formData.append("file_path", data.file_path);
      }

      formData.append("prodi_id", activeProdiId?.toString() || "");

      let res;
      if (dialogMode === "add") {
        res = await SertifikatService.createSertifikatTemplate(formData, activeProdiId);
      } else {
        res = await SertifikatService.updateSertifikatTemplate(formData, data.id!, activeProdiId);
      }
      
      handleToastResponse(res);
      mutate();
      setDialogOpen(false);
    } catch (error) {
      toast.error("Gagal menyimpan template");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update preview URL saat data berubah
  useEffect(() => {
    if (previewData?.data && previewOpen) {
      setPreviewUrl(previewData.data);
    }
  }, [previewData, previewOpen]);

  // Cleanup URL saat dialog ditutup atau component unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Reset preview saat dialog ditutup
  const handlePreviewClose = (isOpen: boolean) => {
    if (!isOpen) {
      setPreviewOpen(false);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setPreviewTemplate(null);
    }
  };

  if (error) return <div>Gagal memuat data</div>;

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/bimbingan-karir" },
          { name: "Sertifikat", url: "/bimbingan-karir/sertifikat" },
        ]}
        titleItems={[
          {
            title: "Sertifikat",
            subtitle: "Berikut adalah daftar template sertifikat pada kategori Seminar dan Workshop.",
          },
        ]}
      />

      <div>
        <div className="flex mb-6">
          <Button onClick={handleAdd} size="sm">
            <Plus size={16}/>
            Tambah Template
          </Button>
        </div>

        {isLoading ? (
          <SertifikatSkeleton/>
        ) : templates.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <EmptyState
              icon={Award}
              title="Belum ada template sertifikat"
              subtitle="Belum ada template sertifikat yang tersedia untuk kategori Seminar dan Workshop."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <SertifikatCard
                key={template.id}
                template={template}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPreview={handlePreview}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit/Add Dialog */}
      <SertifikatDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={selectedTemplate || undefined}
        isLoading={isSubmitting}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={handlePreviewClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogTitle className="mb-4 font-semibold text-lg">
            {previewTemplate?.nama_template}
          </DialogTitle>
          <div className="relative w-full h-[75vh] overflow-auto">
            {previewUrl ? (
              <iframe
                src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border rounded-lg"
                title={`Preview ${previewTemplate?.nama_template}`}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>Loading preview...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setTemplateToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default withAuth(KoordinatorSertifikat, "bimbingan-karir", ["koordinator", "super_fakultas","admin"]);