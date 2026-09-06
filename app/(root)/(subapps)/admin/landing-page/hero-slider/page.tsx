import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataHeroSlider } from "../../_components/landing-page/hero-slider/table";

const HeroSliderPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          {
            name: "Hero Slider",
            url: "/admin/landing-page/hero-slider",
          },
        ]}
        titleItems={[
          {
            title: "Hero Slider",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataHeroSlider />
    </div>
  );
};

export default HeroSliderPage;
