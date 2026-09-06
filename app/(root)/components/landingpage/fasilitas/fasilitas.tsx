import FasilitasClient from "./fasilitas-client";

export const revalidate = 86400; // Cache 1 hari

export default function FasilitasSection() {
  return <FasilitasClient />;
}