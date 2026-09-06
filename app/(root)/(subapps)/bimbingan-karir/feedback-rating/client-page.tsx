"use client";

import DashboardHeader from "@/components/dashboard-header";
import withAuth from "@/app/(root)/hoc/withAuth";
import { TablesFeedbackRating } from "../_components/feedback-rating/data-feedback";
import { useProfile } from "@/context/profileUseContext";


const FeedbackRatingPage = () => {
  const { activeProdiId } = useProfile();

  return (
    <div>
        <DashboardHeader
            breadcrumbItems={[
            { name: "Dashboard", url: "/bimbingan-karir" },
            { name: "Feedback Rating", url: "/bimbingan-karir/riwayat" },
            ]}
            titleItems={[
            {
                title: "Feedback Rating",
                subtitle: "Berikut adalah list rating mahasiswa mengenai kegiatan yang diikuti!",
            },
            ]}
        />
        <TablesFeedbackRating key={activeProdiId} />
    </div>
  );
}

export default withAuth(FeedbackRatingPage, "bimbingan-karir", ["koordinator","admin","super_fakultas"]);