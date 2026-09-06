"use client";

import DashboardHeader from "@/components/dashboard-header";
import withAuth from "@/app/(root)/hoc/withAuth";
import { TablesManajemenKategori } from "@/app/(root)/(subapps)/bimbingan-karir/_components/manajemen-kategori/table";
import { useProfile } from "@/context/profileUseContext";

const ManajemenKategoriPage = () => {
    const { activeProdiId } = useProfile();

    return (
        <div>
            <DashboardHeader
                breadcrumbItems={[
                    { name: "Dashboard", url: "/bimbingan-karir" },
                    { name: "Manajemen Kategori", url: "/bimbingan-karir/manajemen-kategori" },
                ]}
                titleItems={[
                    {
                        title: "Manajemen Kategori",
                        subtitle: "Anda dapat memanajemen kategori kegiatan yang ada dan status aktif/non-aktifnya.",
                    },
                ]}
            />
            <TablesManajemenKategori key={activeProdiId} />
        </div>
    );
}

export default withAuth(ManajemenKategoriPage, "bimbingan-karir", ["koordinator", "super_fakultas","admin"]);
