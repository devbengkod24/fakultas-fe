import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Format: 14 Juni 2025
export const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format: 14 Juni 2025, 22.53
export const formatDateTime = (date: Date | string) => {
  const d = new Date(date);
  const datePart = d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timePart = d
    .toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(".", ":");
  return `${datePart}, ${timePart}`;
};

// Format: Sabtu, 14 Juni 2025 pukul 22.53
export const formatDateFull = (date: Date | string) => {
  const d = new Date(date);
  const dayName = d.toLocaleDateString("id-ID", { weekday: "long" });
  const datePart = d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timePart = d
    .toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(".", ":");
  return `${dayName}, ${datePart} pukul ${timePart}`;
};
