import React from "react";
import { cn } from "@/lib/utils";

/**
 * Komponen VisuallyHidden untuk menyembunyikan konten secara visual
 * tetapi tetap tersedia untuk screen reader.
 *
 * Digunakan untuk meningkatkan aksesibilitas dengan menyediakan
 * konten tambahan untuk screen reader tanpa mengganggu tampilan visual.
 */
export const VisuallyHidden = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0",
        className
      )}
      style={{
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
      }}
      {...props}
    />
  );
});

VisuallyHidden.displayName = "VisuallyHidden";
