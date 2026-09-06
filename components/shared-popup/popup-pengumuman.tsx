"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, Play, Pause, X, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { PengumumanService } from "@/api";

interface FayettePengumuman {
  id: number;
  judul: string;
  user?: string;
  published_at?: string;
  isi: string;
  type?: string;
}

const STORAGE_KEY = "pengumuman-popup-dismissed";
const sessionStorage = typeof window !== 'undefined' ? window.sessionStorage : null;
const MAX_POPUP = 5;
const AUTO_SLIDE_INTERVAL = 5000;

export default function PopupPengumuman() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pengumumans, setPengumumans] = useState<FayettePengumuman[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  const popupItems = pengumumans.slice(0, MAX_POPUP);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % popupItems.length);
  }, [popupItems.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? popupItems.length - 1 : prev - 1
    );
  }, [popupItems.length]);

  useEffect(() => {
    if (isOpen && popupItems.length > 1 && !isPaused) {
      autoSlideRef.current = setInterval(() => {
        goToNext();
      }, AUTO_SLIDE_INTERVAL);
    }

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [isOpen, popupItems.length, goToNext, isPaused]);

  useEffect(() => {
    const fetchPopupPengumumans = async () => {
      try {
        const response = await PengumumanService.getPublicPopupPengumumans();
        const data = response.data || [];
        setPengumumans(data);
      } catch (err) {
        setPengumumans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopupPengumumans();
  }, []);

  useEffect(() => {
    if (isLoading || popupItems.length === 0) return;

    const isDismissed = sessionStorage?.getItem(STORAGE_KEY);

    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, popupItems.length]);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      sessionStorage?.setItem(STORAGE_KEY, "true");
    }
  }, []);

  if (isLoading || popupItems.length === 0) return null;

  const currentPengumuman = popupItems[currentIndex];

  const formatDate = (pengumuman: FayettePengumuman) => {
    const dateStr = pengumuman.published_at || (pengumuman as any).created_at || new Date().toISOString();
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (pengumuman: FayettePengumuman) => {
    const dateStr = pengumuman.published_at || (pengumuman as any).created_at || new Date().toISOString();
    return new Date(dateStr).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="w-[92%] sm:max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white [&>button]:hidden outline-none"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="bg-gradient-to-r from-primary to-primary-500 px-4 sm:px-5 py-5 sm:py-6 pr-12 relative border-none">
          <DialogTitle className="text-white font-bold text-sm sm:text-base leading-tight break-words">
            {currentPengumuman.judul}
          </DialogTitle>
          <DialogClose className="absolute right-3 top-3 rounded-full p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </DialogClose>
        </DialogHeader>

        <div className="p-5 sm:p-6 max-h-[60vh] sm:max-h-[50vh] overflow-y-auto overflow-x-hidden bg-white">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] sm:text-[11px] text-slate-500 mb-5 sm:mb-6">
            <div className="flex items-center whitespace-nowrap shrink-0">
              <User className="w-3.5 h-3.5 mr-1.5 text-primary/60" />
              <span className="font-medium text-slate-700">
                {currentPengumuman.user || "Admin Fakultas"}
              </span>
            </div>

            <div className="flex items-center whitespace-nowrap shrink-0">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary/60" />
              <span>{formatDate(currentPengumuman)}</span>
            </div>

            <div className="flex items-center whitespace-nowrap shrink-0">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-primary/60" />
              <span>{formatTime(currentPengumuman)}</span>
            </div>
          </div>

          <div
            className="text-slate-700 text-xs sm:text-sm leading-relaxed prose prose-sm max-w-none break-words overflow-hidden"
            dangerouslySetInnerHTML={{ __html: currentPengumuman.isi }}
          />
        </div>

        {popupItems.length > 1 && (
          <div className="flex items-center justify-between px-5 sm:px-6 pb-5 sm:pb-6 bg-white gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />

            <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
              <button
                onClick={() => goToPrev()}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all shadow-sm shrink-0"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-hidden">
                {popupItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? "w-4 sm:w-5 bg-primary" : "w-1.5 sm:w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => goToNext()}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all shadow-sm shrink-0"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all shadow-sm shrink-0"
              title={isPaused ? "Putar Otomatis" : "Jeda"}
            >
              {isPaused ? <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-current" /> : <Pause className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}