"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface ProfileImageSectionProps {
  fotoUrl?: string | null;
  nama: string;
}

export default function ProfileImageSection({ fotoUrl, nama }: ProfileImageSectionProps) {
  return (
    <div className="h-full w-full bg-slate-100 relative">
      {fotoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fotoUrl}
          alt={`Foto ${nama}`}
          className="absolute inset-0 w-full h-full object-cover object-top"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = "none";
            const fallback = img.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = "flex";
          }}
        />
      )}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ display: fotoUrl ? "none" : "flex" }}
      >
        <Avatar className="size-24">
          <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-semibold">
            {getInitials(nama)}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}