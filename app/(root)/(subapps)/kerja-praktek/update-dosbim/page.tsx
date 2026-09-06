import { Metadata } from "next";
import UpdateDosbimClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Update Dospem - Kerja Praktek",
  description: "Update Dospem Kerja Praktek",
};

const UpdateDosbimPage = () => {
  return <UpdateDosbimClientPage />;
};

export default UpdateDosbimPage;