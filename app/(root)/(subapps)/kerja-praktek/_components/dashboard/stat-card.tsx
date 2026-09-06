import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  className?: string
  description?: string
  color?: "blue" | "green" | "yellow" | "red" | "violet" | "amber" | "emerald"
  variant?: "default" | "transparent" | "borderless"
  textSize?: "sm" | "md" | "lg" | "xl"
  titleColor?: string
  valueColor?: string
}

const colorVariants = {
  blue: "border-l-blue-500 bg-blue-50",
  green: "border-l-green-500 bg-green-50",
  yellow: "border-l-yellow-500 bg-yellow-50",
  red: "border-l-red-500 bg-red-50",
  violet: "border-l-violet-500 bg-violet-50",
  amber: "border-l-amber-500 bg-amber-50",
  emerald: "border-l-emerald-500 bg-emerald-50",
}

const transparentColorVariants = {
  blue: "border-l-blue-500 bg-transparent",
  green: "border-l-green-500 bg-transparent",
  yellow: "border-l-yellow-500 bg-transparent",
  red: "border-l-red-500 bg-transparent",
  violet: "border-l-violet-500 bg-transparent",
  amber: "border-l-amber-500 bg-transparent",
  emerald: "border-l-emerald-500 bg-transparent",
}

const borderlessColorVariants = {
  blue: "bg-transparent",
  green: "bg-transparent",
  yellow: "bg-transparent",
  red: "bg-transparent",
  violet: "bg-transparent",
  amber: "bg-transparent",
  emerald: "bg-transparent",
}

const textSizeVariants = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl", 
  xl: "text-3xl"
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  className = "", 
  description,
  color = "blue",
  variant = "default",
  textSize = "lg",
  titleColor,
  valueColor
}: StatCardProps) {
  const getColorClass = () => {
    switch (variant) {
      case "transparent":
        return transparentColorVariants[color];
      case "borderless":
        return borderlessColorVariants[color];
      default:
        return colorVariants[color];
    }
  };

  const getBorderClass = () => {
    return variant === "borderless" ? "" : "border-l-4";
  };

  const colorClass = getColorClass();
  const borderClass = getBorderClass();
  const valueTextSize = textSizeVariants[textSize];

  return (
    <Card className={`overflow-hidden rounded-md ${borderClass} ${colorClass} ${className}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between gap-4">
          <CardTitle 
            className={`text-sm font-medium ${titleColor || "text-muted-foreground"}`}
          >
            {title}
          </CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div 
          className={`${valueTextSize} font-bold ${valueColor || ""}`}
        >
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}