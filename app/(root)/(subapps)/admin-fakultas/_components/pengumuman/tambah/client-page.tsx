"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AlertTriangle, Megaphone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard-header";
import { toast } from "sonner";
import withAuth from "@/app/(root)/hoc/withAuth";
import { useProfile } from "@/context/profileUseContext";
import { DataTable } from "@/components/data-table";
import EmptyState from "@/components/empty-state";
import PaginationControls from "@/components/pagination-control";
import useSWR from "swr";
import type { FakultasPengumuman } from "@/data/fakultas/tambah-pengumuman";
import PengumumanTambahCards from "./cards";
import { columns } from "./columns";
import PengumumanFormDialog from "./form-dialog";
import { FilterTambahPengumuman } from "./filter";
import { PengumumanService } from "@/api";

function TambahPengumumanClient() {
  const { profile } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [selectedPengumuman, setSelectedPengumuman] = useState<FakultasPengumuman | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "all";
  const popupFilter = searchParams.get("popup") || "all";
  const viewMode = (searchParams.get("view") as "card" | "table") || "card";

  const isPopUp =
    popupFilter === "popup" ? true : popupFilter === "no-popup" ? false : undefined;

  const { data, mutate, isLoading, error } = useSWR(
    ["admin-fakultas-pengumuman", page, limit, statusFilter, search, popupFilter],
    () =>
      PengumumanService.getAdminFakultasPengumumanList(
        "general",
        statusFilter,
        limit,
        "desc",
        page,
        search,
        undefined,
        isPopUp,
      ),
    { revalidateOnFocus: true, revalidateOnReconnect: true }
  );

  // Backend already orders by created_at desc + is_pop_up desc; only
  // normalize the is_pop_up (snake_case) -> is_popup (camelCase) field here.
  const pengumumans = useMemo(() => {
    const apiPengumumans = data?.data || [];
    return apiPengumumans.map((item: any) => ({
      ...item,
      is_popup: item.is_pop_up === 1 || item.is_pop_up === true || item.is_popup === 1 || item.is_popup === true || false,
    }));
  }, [data?.data]);

  const totalItems = data?.meta?.pagination?.total || 0;
  const lastPage = data?.meta?.pagination?.last_page || Math.ceil(totalItems / limit);

  const isSearchActive = search !== "";
  const isAnyFilterActive = isSearchActive || statusFilter !== "all" || popupFilter !== "all";

  const updateQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    if (!updates.page && !updates.view) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleEdit = (pengumuman: FakultasPengumuman) => {
    setSelectedPengumuman(pengumuman);
    setIsFormDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedPengumuman(null);
    setIsFormDialogOpen(true);
  };

  const handleToggleActive = async (pengumuman: FakultasPengumuman) => {
    try {
      const currentStatus = pengumuman.status || "published";
      const newStatus = currentStatus === "archived" ? "published" : "archived";
      
      console.log(`Toggling status for ${pengumuman.id} to ${newStatus}`);
      
      if (newStatus === "published") {
        await PengumumanService.changeStatusAdminFakultasPengumuman(pengumuman.id!, "published");
      } else {
        await PengumumanService.changeStatusAdminFakultasPengumuman(pengumuman.id!, "archived");
      }
      
      toast.success(newStatus === "published" ? "Pengumuman berhasil diaktifkan" : "Pengumuman berhasil diarsipkan");
      mutate();
    } catch (err: any) {
      console.error("[handleToggleActive] Error:", err);
      toast.error("Gagal mengubah status pengumuman");
    }
  };

  const handleTogglepopup = async (pengumuman: FakultasPengumuman) => {
    try {
      const isCurrentlyPopup = pengumuman.is_popup === true;
      const newStatus = isCurrentlyPopup ? "reject" : "approve";
      
      console.log(`Changing popup status for ${pengumuman.id} to ${newStatus}`);
      await PengumumanService.assignOrRemoveAdminFakultasPopup(pengumuman.id!, newStatus);
      
      toast.success(newStatus === "approve" ? "Pop-up berhasil diaktifkan" : "Pop-up berhasil dinonaktifkan");
      mutate();
    } catch (err: any) {
      console.error("[handleTogglepopup] Error:", err);
      toast.error("Gagal mengubah status pop-up");
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (selectedPengumuman) {
        await PengumumanService.updateAdminFakultasPengumuman(selectedPengumuman.id!, formData);
        toast.success("Pengumuman berhasil diperbarui");
      } else {
        await PengumumanService.createAdminFakultasPengumuman(formData);
        toast.success("Pengumuman berhasil dipublikasikan");
      }
      mutate();
    } catch (err) {
      console.error("Error saving pengumuman:", err);
      toast.error("Gagal menyimpan pengumuman");
    } finally {
      setIsFormDialogOpen(false);
    }
  };

  const handleDelete = async (pengumuman: FakultasPengumuman) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) return;

    try {
      await PengumumanService.deleteAdminFakultasPengumuman(pengumuman.id!);
      toast.success("Pengumuman berhasil dihapus");
      mutate();
    } catch {
      toast.error("Gagal menghapus pengumuman");
    }
  };

  const breadcrumb = [
    { name: "Dashboard", url: "/admin-fakultas" },
    { name: "Kelola Pengumuman", url: "/admin-fakultas/pengumuman/tambah" },
  ];

  const titleItems = [
    {
      title: "Kelola Pengumuman Fakultas",
      subtitle: "Buat, ubah, dan hapus pengumuman resmi dari tingkat fakultas.",
    },
  ];

  const resetFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="max-w-none mx-auto pb-20 space-y-4">
      <DashboardHeader breadcrumbItems={breadcrumb} titleItems={titleItems} />

      <div className="flex flex-col gap-6 mt-2">
        <FilterTambahPengumuman
          viewMode={viewMode}
          onViewChange={(v) => updateQuery({ view: v })}
          onAdd={handleAdd}
        />

        {error ? (
          <EmptyState
            icon={AlertTriangle}
            title="Terjadi Kesalahan"
            subtitle="Data pengumuman tidak dapat dimuat. Silakan coba lagi nanti."
            button={<Button variant="outline" size="sm" onClick={() => mutate()}>Coba Lagi</Button>}
            className="h-[400px] border rounded-xl bg-background"
          />
        ) : !isLoading && pengumumans.length === 0 ? (
          <EmptyState
            icon={isSearchActive ? Search : Megaphone}
            title={isSearchActive ? "Tidak Ada Hasil" : "Belum Ada Pengumuman"}
            subtitle={isSearchActive ? "Tidak ditemukan pengumuman sesuai pencarian." : "Anda belum membuat pengumuman apapun."}
            button={
              isAnyFilterActive ?
                <Button variant="outline" size="sm" onClick={resetFilters}>Reset Filter</Button> :
                <Button onClick={handleAdd} className="bg-primary text-white shadow-md">Buat Pengumuman</Button>
            }
            className="h-[400px] border rounded-xl bg-background"
          />
        ) : (
          <div className="flex flex-col gap-6">
            {viewMode === "table" ? (
              <DataTable
                columns={columns(handleEdit, handleDelete, handleToggleActive, handleTogglepopup)}
                data={pengumumans}
                loading={isLoading}
                pagination={{
                  currentPage: page,
                  lastPage: lastPage,
                  limit,
                  total: totalItems,
                }}
              />
            ) : (
              <>
                <PengumumanTambahCards
                  data={pengumumans}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  onTogglepopup={handleTogglepopup}
                  isLoading={isLoading}
                />
                {!isLoading && pengumumans.length > 0 && (
                  <PaginationControls
                    currentPage={page}
                    lastPage={lastPage}
                    total={totalItems}
                    limit={limit}
                    onPageChange={(p) => updateQuery({ page: p.toString() })}
                    onLimitChange={(l) =>
                      updateQuery({ limit: l.toString(), page: "1" })
                    }
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {isFormDialogOpen && (
        <PengumumanFormDialog
          pengumuman={selectedPengumuman as any}
          onSave={handleSave}
          onClose={() => setIsFormDialogOpen(false)}
          userName={profile?.name}
        />
      )}
    </div>
  );
}

export default withAuth(TambahPengumumanClient, "admin-fakultas", ["admin_fakultas", "super_fakultas"]);
