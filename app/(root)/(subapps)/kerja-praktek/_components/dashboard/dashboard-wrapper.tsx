import React from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function DashboardLayout({ children, className = "" }: DashboardLayoutProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 ${className}`}>
      {children}
    </div>
  )
}

interface DashboardSectionProps {
  children: React.ReactNode
  span: number
  className?: string
  mobileSpan?: number
}

export function DashboardSection({ 
  children, 
  span, 
  className = "", 
  mobileSpan = 1 
}: DashboardSectionProps) {
  return (
    <div className={`col-span-${mobileSpan} lg:col-span-${span} ${className}`}>
      {children}
    </div>
  )
}