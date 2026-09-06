import { Metadata } from "next";
import ManajemenMinatClient from "./client-page";

export const metadata: Metadata = {
    title: "Manajemen Minat | SISFO STI",
    description: "Lihat dan kelola minat/peminatan Bimbingan Karir",
};

export default function Page() {
    return <ManajemenMinatClient />;
}