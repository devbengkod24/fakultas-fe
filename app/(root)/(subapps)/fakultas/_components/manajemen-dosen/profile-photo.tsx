"use client";

import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfilePhotoProps {
  fotoUrl?: string | null;
  npp?: string | null;
  nama: string;
  size?: number;
}

export default function ProfilePhoto({ fotoUrl, npp, nama, size = 90 }: ProfilePhotoProps) {
  const [imageError, setImageError] = useState(false);

  const initials = nama
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (!fotoUrl || imageError) {
    return (
      <div
        className="rounded-full flex items-center justify-center border-2 border-slate-200 shadow-sm bg-slate-100"
        style={{ width: size, height: size, minWidth: size }}
      >
        <Avatar className="h-full w-full" style={{ width: size, height: size }}>
          <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div
      className="rounded-full overflow-hidden border-2 border-slate-200 shadow-md"
      style={{ width: size, height: size, minWidth: size }}
    >
      <Image
        src={fotoUrl}
        alt={`Foto ${nama}`}
        width={size}
        height={size}
        className="object-cover w-full h-full"
        onError={() => setImageError(true)}
        unoptimized
      />
    </div>
  );
}