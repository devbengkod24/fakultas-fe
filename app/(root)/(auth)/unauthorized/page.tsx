"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useProfile } from "@/context/profileUseContext";

export default function Unauthorized() {
  const router = useRouter();
  const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-none border border-gray-200 bg-white">
        <CardContent className="p-8">
          <div>
            {/* Logo - Exact same style as 404 page */}
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

            {/* 403 Content - Same structure as 404 page */}
            <div className="space-y-4">
              <div className="">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2 leading-tight">
                  Akses tidak diizinkan di <span className="text-primary">FIK Apps</span>
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
                </p>
              </div>

              {/* 403 Number Display - Same style as 404 */}
              <div className="text-center py-6">
                <div className="text-7xl font-bold text-primary mb-2">403</div>
                <div className="text-gray-500 text-sm">
                  Akses tidak diizinkan
                </div>
              </div>

              {/* Action Buttons - Same style as 404 page */}
              <div className="space-y-4 flex justify-center">
                <Button
                  className="space-y-4 flex justify-center"
                  onClick={() => router.push(profile?.permissions[0] || "/")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Halaman Sebelumnya
                </Button>
              </div>
            </div>

            {/* Footer - Exact same as 404 page */}
            <div className="text-center text-xs text-gray-400 pt-6 border-gray-100">
              2023-2026 FIK Universitas Dian Nuswantoro All rights reserved.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
