export const StrukturOrganisasiSkeleton = () => {
  return (
    <div className="bg-gray-50 rounded-2xl p-8 md:p-12 animate-pulse">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-1 bg-gray-300 rounded"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
        <div className="h-8 w-48 bg-gray-300 rounded mx-auto mb-6"></div>
        <div className="h-4 w-full max-w-2xl bg-gray-300 rounded mx-auto"></div>
      </div>

      {/* Leadership Team Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex flex-col items-center">
            {/* Position Title Skeleton */}
            <div className="h-12 w-32 bg-gray-300 rounded mb-8 mx-auto"></div>

            {/* Image Skeleton */}
            <div className="w-48 h-48 md:w-40 md:h-40 bg-gray-300 rounded-full mb-6"></div>

            {/* Name Card Skeleton */}
            <div className="w-full h-12 bg-gray-300 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
