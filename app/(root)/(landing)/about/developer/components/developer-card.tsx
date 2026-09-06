"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe, Code, User } from "lucide-react";
import { Developer } from "../data/types";

interface DeveloperCardProps {
  developer: Developer;
  color: string;
}

const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
    green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  };
  return colorMap[color] || colorMap.blue;
};

export default function DeveloperCard({ developer, color }: DeveloperCardProps) {
  const colors = getColorClasses(color);
  const hasImage = developer.image && developer.image.trim() !== "";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:-translate-y-1 bg-gray-50/30">
      {/* Profile Image */}
      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border border-gray-200 overflow-hidden bg-white">
          {hasImage ? (
            <Image
              src={developer.image}
              alt={developer.name}
              width={200}
              height={200}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <User className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Developer Info */}
      <div className="flex-grow min-w-0 w-full flex flex-col justify-center items-center sm:items-start text-center sm:text-left">
        <h4 className="font-semibold text-gray-800 text-sm md:text-base leading-tight mb-1 truncate w-full">
          {developer.name}
        </h4>
        <p className="text-xs md:text-sm text-gray-500 mb-2">{developer.nim}</p>
        <div
          className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${colors.bg} ${colors.text}`}
        >
          {developer.role}
        </div>
      </div>

      {/* Social Links */}
      <div className="flex gap-2 flex-shrink-0">
        <Link
          href={developer.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          aria-label={`LinkedIn profile of ${developer.name}`}
        >
          <Globe className="w-4 h-4 text-gray-600 hover:text-blue-600" />
        </Link>
        <Link
          href={developer.github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          aria-label={`GitHub profile of ${developer.name}`}
        >
          <Code className="w-4 h-4 text-gray-600 hover:text-gray-800" />
        </Link>
      </div>
    </div>
  );
}
