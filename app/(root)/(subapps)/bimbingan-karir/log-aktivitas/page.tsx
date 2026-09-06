import { Metadata } from "next";
import KoordinatorLogAktivitas from "./client-page";


export const metadata: Metadata = {
  title: "Log Aktivitas - Bimbingan Karir",
  description: "Log Aktivitas Bimbingan Karir",
};

const LogAktivitasBK = () => {
  return <KoordinatorLogAktivitas/>;
};

export default LogAktivitasBK;
