import { Metadata } from "next";
import KoordinatorFeedbackRating from "./client-page";

export const metadata: Metadata = {
  title: "Daftar Kegiatan - Bimbingan Karir",
  description: "Daftar Kegiatan Bimbingan Karir",
};

const FeedbackRating = () => {
  return <KoordinatorFeedbackRating />;
};

export default FeedbackRating;
