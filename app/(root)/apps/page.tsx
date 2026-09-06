import { Metadata } from "next";
import AppsDashboard from "./client-page";

export const metadata: Metadata = {
  title: "STI Apps",
  description: "Aplikasi Fakultas Ilmu Komputer UDINUS",
};

const AppsPage = () => {
  return <AppsDashboard />;
};

export default AppsPage;
