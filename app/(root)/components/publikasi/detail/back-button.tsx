"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  return (
    <button
      onClick={() => router.push(from ? decodeURIComponent(from) : "/publikasi")}
      className="
        flex items-center gap-2
        rounded-lg
        border border-gray-300
        bg-white
        px-4 py-2
        text-sm font-medium
        text-gray-700
        shadow-sm
        transition-all
        hover:bg-gray-100
        hover:text-blue-600
      "
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Kembali</span>
    </button>
  );
};

export default BackButton;