"use client";

import DialogPopUp from "./dialog-popup";
import { HeroSlider } from "@/types/admin/landing-page/hero-slider/hero-slider";

interface FilterHeroSliderProps {
  onAdd?: (data: HeroSlider & { imageFile?: File }) => Promise<void>;
}

export function FilterHeroSlider({ onAdd }: FilterHeroSliderProps) {
  const handleAddHeroSlider = async (
    data: HeroSlider & { imageFile?: File }
  ) => {
    if (onAdd) {
      await onAdd(data);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-end">
      <DialogPopUp mode="add" onSubmit={handleAddHeroSlider} />
    </div>
  );
}
