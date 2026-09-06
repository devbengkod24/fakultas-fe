import React from "react";

import DashboardKPClient from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Kerja Praktek",
};

const DashboardKP = () => {
  return <DashboardKPClient />;
};

export default DashboardKP;