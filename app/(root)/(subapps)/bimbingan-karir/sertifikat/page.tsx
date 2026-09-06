import { Metadata } from "next";
import KoordinatorSertifikat from "./client-page";

export const metadata: Metadata = {
  title: "Sertifikat - Bimbingan Karir",
  description: "Sertifikat Bimbingan Karir",
};

const Sertifikat = () => {
  return <KoordinatorSertifikat/>;
};

export default Sertifikat;
