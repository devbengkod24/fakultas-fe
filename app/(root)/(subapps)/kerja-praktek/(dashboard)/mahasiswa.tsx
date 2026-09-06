"use client";

import DashboardMahasiswaKP from "../_components/dashboard/mahasiswa/dashboard-mahasiswa-kp";
import withAuth from "@/app/(root)/hoc/withAuth";

const DashboardMahasiswa = () => {
  return <DashboardMahasiswaKP />;
};

export default withAuth(DashboardMahasiswa, "kerja-praktek", "mahasiswa");
