"use client";

import { useEffect } from "react";
import { PublicTrackVisitService } from "@/api/index";

export function VisitTracker() {
  useEffect(() => {
    if (sessionStorage.getItem("visit_tracked")) return;
    sessionStorage.setItem("visit_tracked", "1");
    PublicTrackVisitService.track().catch(() => {});
  }, []);

  return null;
}
