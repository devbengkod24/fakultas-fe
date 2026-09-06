import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import LeftColumnSection from "@/app/(root)/components/publikasi/detail/left-column";
import RightColumnSection from "@/app/(root)/components/publikasi/detail/right-column";
import Author from "@/app/(root)/components/publikasi/detail/author";
import BackButton from "@/app/(root)/components/publikasi/detail/back-button";

// LOADING SKELETONS
const LeftColumnSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />

    <div className="space-y-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);

const RightColumnSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-1/2" />

    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);

const AuthorSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center space-x-3">
      <Skeleton className="h-12 w-12 rounded-full" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

// PAGE
const PublikasiDetailPage = () => {
  return (
    <main
      className="flex-grow min-h-screen bg-gray-50"
      id="DetailPublikasiPage"
    >
      {/* CONTENT SECTION */}
      <section className="pt-24 pb-8 md:pt-28 lg:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* BACK BUTTON */}
          <div className="mb-6 flex">
            <Suspense fallback={<div className="h-10 w-32" />}>
              <BackButton />
            </Suspense>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
            {/* MAIN CONTENT */}
            <div className="xl:col-span-9">
              {/* PUBLICATION DETAILS */}
              <Card className="p-4 md:p-6 lg:p-8 mb-4 md:mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {/* LEFT COLUMN */}
                  <div className="order-2 lg:order-1">
                    <Suspense fallback={<LeftColumnSkeleton />}>
                      <LeftColumnSection />
                    </Suspense>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="order-1 lg:order-2">
                    <Suspense fallback={<RightColumnSkeleton />}>
                      <RightColumnSection />
                    </Suspense>
                  </div>
                </div>
              </Card>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="xl:col-span-3 order-first xl:order-last">
              <div className="space-y-4 md:space-y-6">
                {/* AUTHOR CARD */}
                <Card className="p-4 md:p-5">
                  <h3 className="mb-4 text-base font-semibold md:text-lg">
                    Authors
                  </h3>

                  <Suspense fallback={<AuthorSkeleton />}>
                    <Author />
                  </Suspense>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PublikasiDetailPage;

