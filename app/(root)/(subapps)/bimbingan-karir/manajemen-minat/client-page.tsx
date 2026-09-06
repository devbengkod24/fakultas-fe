"use client";

import DashboardHeader from "@/components/dashboard-header";
import withAuth from "@/app/(root)/hoc/withAuth";
import { TablesManajemenMinat } from "./_components/table/table";
import { useProfile } from "@/context/profileUseContext";

const ManajemenMinatPage = () => {
    const { activeProdiId } = useProfile();

    return (
        <div>
            <DashboardHeader
                breadcrumbItems={[
                    { name: "Dashboard", url: "/bimbingan-karir" },
                    { name: "Manajemen Minat", url: "/bimbingan-karir/manajemen-minat" },
                ]}
                titleItems={[
                    {
                        title: "Manajemen Minat",
                        subtitle: "Anda dapat memanajemen minat/peminatan mahasiswa.",
                    },
                ]}
            />
            <TablesManajemenMinat key={activeProdiId} />
        </div>
    );
}

export default withAuth(ManajemenMinatPage, "bimbingan-karir", ["koordinator", "super_fakultas","admin"]);