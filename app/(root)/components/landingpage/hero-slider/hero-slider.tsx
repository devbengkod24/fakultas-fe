import type { HeroSlider } from "@/types/admin/landing-page/hero-slider/hero-slider";
import HeroSliderClient from "./hero-slider-client";
import ErrorState from "../../error-state";

type Props = {
  images: HeroSlider[];
  error?: string | null;
};

export const revalidate = 86400; // 1 hari

export default function HeroSlider({ images, error }: Props) {
  if (error) {
    return (
      <ErrorState
        title="Gagal Memuat Hero Slider"
        description="Terjadi kesalahan saat memuat data hero slider. Silakan coba lagi."
      />
    );
  }
  // Fallback dummy jika data kosong
  const fallback = [
    {
      id: 1,
      title: "title1",
      subtitle: "subtitle1",
      image: "/assets/landingpage/img/slideshow-new/slideshow-bengkod.webp",
      isActive: 1,
    },
    {
      id: 2,
      title: "title2",
      subtitle: "subtitle2",
      image: "/assets/landingpage/img/slideshow-new/slideshow-ugm.webp",
      isActive: 1,
    },
    {
      id: 3,
      title: "title3",
      subtitle: "subtitle3",
      image: "/assets/landingpage/img/slideshow-new/slideshow-garudaace.webp",
      isActive: 1,
    },
  ];
  return <HeroSliderClient images={images.length > 0 ? images : fallback} />;
}
