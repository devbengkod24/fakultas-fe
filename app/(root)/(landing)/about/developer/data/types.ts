import { LucideIcon } from "lucide-react";

export interface Developer {
  name: string;
  nim: string;
  role: string;
  image: string;
  linkedin: string;
  github: string;
}

export interface Application {
  name: string;
  icon: LucideIcon;
  color: string;
  developers: Developer[];
}

export interface TeamData {
  year: string;
  title: string;
  subtitle: string;
  applications: Application[];
}
