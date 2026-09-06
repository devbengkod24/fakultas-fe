"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; 

export default function NotFound() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Only run client-side code after mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBack = () => {
    if (isMounted) {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-none border border-gray-200 bg-white">
        <CardContent className="p-8">
          <div>
            {/* Logo - Exact same style as original */}
            <div className="flex mb-6">
              <Link href={"/"} className="inline-flex items-center gap-3">
                <Image
                  src={"/assets/landingpage/logo/logo-dinus.png"}
                  alt="Logo Udinus Biru"
                  className="object-contain"
                  width={50}
                  height={7}
                />
                <div className="flex flex-col leading-tight font-extrabold uppercase tracking-wide text-[#114D91]">
                  <span className="text-sm">UNIVERSITAS</span>
                  <span className="text-sm">DIAN NUSWANTORO</span>
                </div>
              </Link>
            </div>

            {/* 404 Content - Same structure as login form */}
            <div className="space-y-4">
              <div className="">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Halaman tidak ditemukan di{" "}
                  <span className="text-primary">FIK Apps</span>
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Silahkan kembali untuk mengakses layanan dari website Fakultas
                  Ilmu Komputer!
                </p>
              </div>

              {/* 404 Number Display */}
              <div className="text-center py-6">
                <div className="text-7xl font-bold text-primary mb-2">404</div>
                <div className="text-gray-500 text-sm">
                  Halaman tidak dapat ditemukan
                </div>
              </div>

              {/* Action Buttons - Same style as login buttons */}
              <div className="space-y-4 flex justify-center">
                <Button onClick={handleBack}>
                  <ArrowLeft /> Kembali ke Halaman Sebelumnya
                </Button>
              </div>
            </div>

            {/* Footer - Exact same as original */}
            <div className="text-center text-xs text-gray-400 pt-6 border-gray-100">
              2023-2026 FIK Universitas Dian Nuswantoro All rights reserved.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
