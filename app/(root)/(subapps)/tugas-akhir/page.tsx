import React from "react";

import DashboardTaClient from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Tugas Akhir",
};

const DashboardTa = () => {
  return <DashboardTaClient />;
};

export default DashboardTa;
