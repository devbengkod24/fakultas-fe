import { Metadata } from "next";
import DeveloperClient from "./developer-client";

export const metadata: Metadata = {
  title: "Developer - FIK Apps",
  description: "Tim Pengembang FIK Apps - Fakultas Ilmu Komputer UDINUS",
};

export default function DeveloperPage() {
  return <DeveloperClient />;
}
