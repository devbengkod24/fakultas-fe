import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Award } from "lucide-react";

const DaftarMataKuliahSkeleton = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-4">
      <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden border">
        <div className="bg-gradient-to-r from-primary to-primary-500 py-4 px-6 flex items-center justify-between">
          <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
          <div className="flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-white" />
              <Skeleton className="h-6 w-32 bg-white/20" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-50">
                <th className="py-3 px-6 text-left w-16 text-gray-700">No</th>
                <th className="py-3 px-6 text-left w-32 lg:w-40 text-gray-700">Kode</th>
                <th className="py-3 px-6 text-left text-gray-700">Mata Kuliah</th>
                <th className="py-3 px-6 text-center w-20 text-gray-700">SKS</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(7)].map((_, i) => (
                <tr key={i}>
                  <td className="py-3 px-6 border-b border-gray-200 text-center">
                    <Skeleton className="w-6 h-6 rounded-full mx-auto" />
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200">
                    <Skeleton className="h-4 w-full" />
                  </td>
                  <td className="py-3 px-6 border-b border-gray-200 text-center">
                    <Skeleton className="h-6 w-12 rounded-full mx-auto" />
                  </td>
                </tr>
              ))}
              <tr className="bg-primary-50">
                <td className="py-3 px-6 text-right font-bold text-gray-700" colSpan={3}>
                  <span className="flex items-center justify-end">
                      <Award className="w-4 h-4 mr-2" />
                      Total SKS
                  </span>
                </td>
                <td className="py-3 px-6 font-bold text-center">
                  <Skeleton className="h-8 w-12 rounded-full mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-500 px-4 py-3 flex items-center justify-between text-white">
            <Skeleton className="h-7 w-7 rounded-full bg-white/20" />
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-white" />
              <Skeleton className="h-5 w-24 bg-white/20" />
            </div>
            <Skeleton className="h-7 w-7 rounded-full bg-white/20" />
          </div>
          <div className="p-4 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="ml-3 flex-shrink-0">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-700 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Total SKS
              </span>
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaftarMataKuliahSkeleton;
