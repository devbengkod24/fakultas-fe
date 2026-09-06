import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import DialogPopUp from "./dialog-popup";
import { ProfesiLulusan } from "@/types/admin/landing-page/prospek-karir/profesi-lulusan";

interface FilterProps {
  onAdd: (profesiLulusan: ProfesiLulusan) => Promise<void>;
}

export function FilterProfesiLulusan({ onAdd }: FilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-full sm:w-72">
        <Input
          placeholder="Cari Profesi Lulusan..."
          className="pl-10 h-10 w-full"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      <DialogPopUp mode="add" onSubmit={onAdd} />
    </div>
  );
}
