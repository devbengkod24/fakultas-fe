const PengumumanTerbaruSkeleton = () => {
  return (
    <div className="space-y-4 py-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-sm p-4 animate-pulse border-l-4 border-l-gray-200"
        >
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="h-5 bg-gray-200 rounded-full w-20 mb-3" />
          <div className="space-y-1 mb-3">
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PengumumanTerbaruSkeleton;
