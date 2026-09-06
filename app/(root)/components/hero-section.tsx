"use client";

import type React from "react";

import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import {
  Sparkles,
  Star,
  Circle,
  Search,
  Users,
  BookOpen,
  Award,
  Zap,
} from "lucide-react";

interface HeroSectionBaseProps {
  title: string;
  subtitle: string;
  variant: "badge" | "search" | "apps";
}

interface BadgeVariantProps extends HeroSectionBaseProps {
  variant: "badge";
  badgeText?: string;
  badgeIcon?: string;
}

interface SearchVariantProps extends HeroSectionBaseProps {
  variant: "search";
  searchComponent?: ReactNode;
}

interface AppsVariantProps extends HeroSectionBaseProps {
  variant: "apps";
}

type HeroSectionProps =
  | BadgeVariantProps
  | SearchVariantProps
  | AppsVariantProps;

// Icon mapping untuk convert string ke component
const iconMap = {
  search: Search,
  users: Users,
  book: BookOpen,
  award: Award,
  zap: Zap,
  sparkles: Sparkles,
  star: Star,
  circle: Circle,
} as const;

export function HeroSection(props: HeroSectionProps) {
  const { title = "", subtitle = "", variant } = props;

  // Get icon component from string
  const BadgeIcon =
    variant === "badge"
      ? iconMap[props.badgeIcon as keyof typeof iconMap] || Sparkles
      : null;

  // Safe title splitting with fallback
  const titleWords = title ? title.split(" ") : ["Default", "Title"];
  const titleFirstPart =
    titleWords.length > 1
      ? titleWords.slice(0, -1).join(" ")
      : titleWords[0] || "";
  const titleLastWord = titleWords.length > 1 ? titleWords.slice(-1)[0] : "";

  return (
    <section className="relative bg-gradient-to-br from-[#114D91] to-primary-500 pt-28 pb-8 md:pt-32 md:pb-12 lg:pt-36 lg:pb-16 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Enhanced Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(white 1px, transparent 1px),
                linear-gradient(to right, white 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Enhanced Title */}
          <h1
            className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white leading-normal mb-2 md:mb-4 `}
          >
            {titleWords.length > 1 ? (
              <>
                <span className="block font-light">{titleFirstPart}</span>
                <span className="block pb-2 font-bold bg-gradient-to-r from-primary-200 via-white to-indigo-200 bg-clip-text text-transparent">
                  {titleLastWord}
                </span>
              </>
            ) : (
              <span className="block pb-2 font-bold bg-gradient-to-r from-primary-200 via-white to-indigo-200 bg-clip-text text-transparent">
                {title || "Default Title"}
              </span>
            )}
          </h1>

          {/* Enhanced Subtitle */}
          <p
            className={`text-md sm:text-lg md:text-xl lg:text-2xl text-primary-100 opacity-90 mb-4 md:mb-6 leading-relaxed max-w-4xl mx-auto `}
          >
            {subtitle || "Default subtitle"}
          </p>

          {/* Enhanced Badge Variant */}
          {variant === "badge" && BadgeIcon && (
            <div
              className={`inline-flex items-center justify-center px-4 sm:px-6 py sm:py-2 border border-white/20 rounded-xl backdrop-blur-sm bg-white/10 text-white text-xs sm:text-sm font-medium shadow-lg gap-2`}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-primary-200/5 rounded-2xl"></div>

              {/* Icon with Animation */}
              <span className="">
                <BadgeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>

              {/* Text */}
              <span className="">{props.badgeText || "Default Badge"}</span>
            </div>
          )}

          {/* Enhanced Search Variant */}
          {variant === "search" && (
            <div className={`max-w-3xl mx-auto px-4`}>
              <div className="relative group">
                {/* Enhanced Background for Search */}
                <div className="absolute inset-0 backdrop-blur-sm  transition-all duration-300 ease-out "></div>

                {/* Search Component Container */}
                <div className="relative z-10 p-2">
                  <Suspense
                    fallback={
                      <div className="relative">
                        <Skeleton className="h-14 w-full bg-white/20 rounded-xl" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-xl"></div>
                      </div>
                    }
                  >
                    {props.searchComponent || (
                      <div className="h-14 flex items-center justify-center text-white/70">
                        Search component not provided
                      </div>
                    )}
                  </Suspense>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Apps Variant */}
          {variant === "apps" && BadgeIcon && (
            <div
              className={`inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-white/20 rounded-2xl backdrop-blur-sm bg-white/10 text-white text-sm sm:text-base font-medium shadow-lg hover:shadow-2xl hover:bg-white/15 group`}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-primary-200/5 rounded-2xl"></div>

              {/* Icon with Animation */}
              <span className="mr-3 relative z-10">
                <BadgeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>

      {/* Floating keyframes animation */}
      <style jsx global>{`
        @keyframes floatHeroGeneric {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) translateX(10px) rotate(180deg);
          }
          100% {
            transform: translateY(0) translateX(0) rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
