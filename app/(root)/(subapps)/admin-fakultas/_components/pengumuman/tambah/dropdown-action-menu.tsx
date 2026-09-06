"use client";

import * as React from "react";
import { MoreHorizontal, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownActionMenuProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  icon?: LucideIcon;
  triggerClassName?: string;
  contentClassName?: string;
}

export function DropdownActionMenu({
  children,
  align = "end",
  icon: Icon = MoreHorizontal,
  triggerClassName = "h-8 w-8 p-0",
  contentClassName,
}: DropdownActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={triggerClassName}>
          <span className="sr-only">Open menu</span>
          <Icon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={contentClassName}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
