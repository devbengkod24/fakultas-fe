import type { HeroSlider } from "@/types/admin/landing-page/hero-slider/hero-slider";
import HeroSliderClient from "./hero-slider-client";
import ErrorState from "../../../../components/error-state";

type Props = {
  images: HeroSlider[];
  error?: string | null;
  prodiName?: string;
};

export const revalidate = 86400; // 1 hari

export default function HeroSlider({ images, error, prodiName }: Props) {
  if (error) {
    return (
      <ErrorState
        title="Gagal Memuat Hero Slider"
        description="Terjadi kesalahan saat memuat data hero slider. Silakan coba lagi."
      />
    );
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <HeroSliderClient
      images={images}
      prodiName={prodiName}
    />
  );
}
