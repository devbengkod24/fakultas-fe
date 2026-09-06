import { Metadata } from "next";
import LogAktivitas from "./log-client-page";

export const metadata: Metadata = {
  title: "Log Aktivitas - Tugas Akhir",
  description: "Aktivitas yang telah dilakukan oleh dosen dan mahasiswa",
};

export default function SignInPage() {
  return <LogAktivitas />;
}
