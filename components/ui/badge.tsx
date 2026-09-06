import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white",
        "secondary-foreground":
          "border-transparent bg-secondary-500 text-white",
        primary:
          "border-transparent bg-primary-100 shadow-none text-primary border-primary-200",
        secondary:
          "border-transparent bg-secondary-100 text-secondary-600 border-secondary-200",
        success:
          "border-transparent bg-green-100 text-green-600 border border-green-400/60",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        destructiveOutline:
          "border-transparent bg-red-100 text-red-600 border-red-200",
        outline: "text-foreground",
        orange:
          "border-transparent bg-orange-100 text-orange-600 border border-orange-200",
        yellow:
          "border-transparent bg-yellow-100 text-yellow-600 border-yellow-300",
        blue: "border-transparent bg-blue-100 text-blue-600 border border-blue-400/60",
        indigo:
          "border-transparent bg-indigo-100 text-indigo-600 border border-indigo-400/60",
        red:
          "border-transparent bg-red-100 text-red-600 border border-red-400/60",
        gray:
          "border-transparent bg-gray-100 text-gray-600 border border-gray-400/60",
        purple:
          "border-transparent bg-purple-100 text-purple-600 border border-purple-400/60",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }