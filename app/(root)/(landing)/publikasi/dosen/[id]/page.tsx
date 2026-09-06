"use client";

import { useParams } from "next/navigation";
import LandingDetailDosenFetcher from "@/app/(root)/components/publikasi/dosen/landing-detail-fetcher";

const LandingLecturerDetailPage = () => {
  const params = useParams();
  const authorId = params.id as string;

  return (
    <main className="flex-grow min-h-screen" id="LandingPublikasiDosenPage">
      <section className="pt-24 pb-4 md:pt-28 md:pb-6 lg:pt-32 lg:pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <LandingDetailDosenFetcher authorId={authorId} />
        </div>
      </section>
    </main>
  );
};

export default LandingLecturerDetailPage;
