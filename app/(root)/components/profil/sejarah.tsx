"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

const sejarah = [
  {
    year: "10 Maret 1994",
    title: "Program Studi Berdiri",
    description: (
      <>
        <p>Berdasarkan SK Dirjen Dikti No. 010/D/O/1994</p>
      </>
    ),
  },
  {
    year: "2000-2011",
    title: "Disamakan dan Terakreditasi B",
    description: (
      <>
        <p>Disamakan dengan surat 210/DIKTI/Kep/2000</p>
        <p className="mt-2">Terakreditasi B dari BAN-PT dengan surat</p>
        <ul className="list-disc pl-5 mt-1">
          <li>Nomor 019/BAN-PT/Ak-IV/VIII/2000</li>
          <li>Nomor 020/BAN-PT/Ak-IX/S1/X/2005</li>
          <li>Nomor 042/BAN-PT/Ak-XIII/S1/I/2011</li>
        </ul>
      </>
    ),
  },
  {
    year: "2015",
    title: "Terakreditasi A",
    description: (
      <>
        <p>Terakreditasi A dari BAN-PT dengan surat</p>
        <p>Nomor 972/SK/BAN-PT/Akred/S/IX/2015</p>
      </>
    ),
  },
  {
    year: "2020",
    title: "Terakreditasi IABEE",
    description: (
      <>
        <p>Akreditasi Internasional IABEE</p>
        <p>Indonesian Accreditation Board for Engineering Education</p>
      </>
    ),
  },
  {
    year: "2022",
    title: "Terakreditasi Unggul",
    description: (
      <>
        <p>Terakreditasi Unggul dari BAN-PT dengan surat</p>
        <p>Nomor 5507/SK/BAN-PT/Ak.KP/S/VIII/2022</p>
      </>
    ),
  },
];

const SejarahSection = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demonstration
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <>
        {/* Desktop Timeline Skeleton */}
        <div className="hidden md:block max-w-5xl mx-auto relative">
          {/* Timeline Line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary-200"
            style={{ transform: "translateX(-50%)" }}
          />

          {[...Array(5)].map((_, index) => (
            <div key={index} className="mb-12 relative">
              <div
                className={`flex items-start ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-1/2 top-8 z-10"
                  style={{ transform: "translateX(-50%)" }}
                >
                  <div className="w-6 h-6 rounded-full bg-primary-500 border-4 border-white shadow-sm" />
                </div>

                {/* Content Skeleton */}
                <div
                  className={`w-1/2 ${
                    index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"
                  }`}
                >
                  <div className="bg-white rounded-xl shadow-md p-6 border">
                    <Skeleton className="h-6 w-24 rounded-full mb-3" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </div>
                <div className="w-1/2"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Timeline Skeleton */}
        <div className="md:hidden max-w-3xl mx-auto relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary-200" />

          {[...Array(5)].map((_, index) => (
            <div key={index} className="mb-8 relative">
              <div className="flex items-start">
                {/* Timeline dot */}
                <div
                  className="absolute left-6 top-6 z-10"
                  style={{ transform: "translateX(-50%)" }}
                >
                  <div className="w-3 h-3 rounded-full bg-primary-500 border-2 border-white shadow-sm" />
                </div>

                {/* Content Skeleton */}
                <div className="ml-12 w-full">
                  <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border">
                    <Skeleton className="h-5 w-20 rounded-full mb-3" />
                    <Skeleton className="h-5 w-2/3 mb-2" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop Timeline */}
      <div className="hidden md:block max-w-5xl mx-auto relative">
        {/* Timeline Line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary-200"
          style={{ transform: "translateX(-50%)" }}
        />

        {sejarah.map((item, index) => (
          <div key={index} className="mb-12 relative">
            <div
              className={`flex items-start ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {/* Timeline dot - positioned relative to the card */}
              <div
                className="absolute left-1/2 top-8 z-10"
                style={{ transform: "translateX(-50%)" }}
              >
                <div className="w-6 h-6 rounded-full bg-primary-500 border-4 border-white shadow-sm" />
              </div>

              {/* Content */}
              <div
                className={`w-1/2 ${
                  index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"
                }`}
              >
                <div className="bg-white rounded-xl shadow-md p-6 border  hover:shadow-lg transition-shadow duration-300">
                  <div className="inline-block px-4 py-1 rounded-full bg-primary-100 text-primary-500 font-bold text-sm mb-3">
                    {item.year}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <div className="text-gray-700">{item.description}</div>
                </div>
              </div>

              <div className="w-1/2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden max-w-3xl mx-auto relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary-200" />

        {sejarah.map((item, index) => (
          <div key={index} className="mb-8 relative">
            <div className="flex items-start">
              {/* Timeline dot */}
              <div
                className="absolute left-6 top-6 z-10"
                style={{ transform: "translateX(-50%)" }}
              >
                <div className="w-3 h-3 rounded-full bg-primary-500 border-2 border-white shadow-sm" />
              </div>

              {/* Content */}
              <div className="ml-12 w-full">
                <div className="bg-white rounded-xl shadow-md  p-4 sm:p-6 border  hover:shadow-lg transition-shadow duration-300">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-500 font-bold text-xs sm:text-sm mb-3">
                    {item.year}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <div className="text-gray-700 text-sm sm:text-base">
                    {item.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SejarahSection;
