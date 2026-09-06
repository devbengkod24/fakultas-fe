import type React from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  button?: React.ReactNode;
  className?: string;
  variant?: "default" | "small";
}

export default function EmptyState({
  icon: Icon,
  title,
  subtitle,
  button,
  className,
  variant = "default",
}: EmptyStateProps) {
  const isSmall = variant === "small";

  return (
    <div
      className={`flex flex-col items-center justify-center py-${
        isSmall ? "6" : "12"
      } text-center ${
        className || (isSmall ? "h-auto" : "h-[calc(100vh-200px)]")
      }`}
    >
      <div
        className={`rounded-full bg-muted p-${isSmall ? "2" : "3"} mb-${
          isSmall ? "2" : "4"
        }`}
      >
        <Icon
          className={`h-${isSmall ? "4" : "6"} w-${
            isSmall ? "4" : "6"
          } text-muted-foreground`}
        />
      </div>
      <h3 className={`${isSmall ? "text-base" : "text-lg"} font-medium`}>
        {title}
      </h3>
      <p
        className={`${
          isSmall ? "text-xs" : "text-sm"
        } text-muted-foreground mt-1 max-w-md`}
      >
        {subtitle}
      </p>
      {button && <div className={`mt-${isSmall ? "3" : "4"}`}>{button}</div>}
    </div>
  );
}
