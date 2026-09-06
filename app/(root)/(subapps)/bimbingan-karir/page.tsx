import { Metadata } from "next";
import DashboardBKClient from "./client-page";

export const metadata: Metadata = {
  title: "Dashboard - Bimbingan Karir",
  description: "Dashboard Bimbingan Karir",
};

const DashboardBK = () => {
  return <DashboardBKClient />;
};

export default DashboardBK;
