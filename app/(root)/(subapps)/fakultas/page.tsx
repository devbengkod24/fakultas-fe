import React from "react";
import DashboardAdminClient from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Fakultas",
};

const DashboardFakultas = () => {
  return <DashboardAdminClient />;
};

export default DashboardFakultas;