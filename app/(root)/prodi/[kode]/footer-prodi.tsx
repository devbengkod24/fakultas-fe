import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface FooterProdiProps {
  prodiName?: string;
}

export default function FooterProdi({ prodiName }: FooterProdiProps) {
  return (
    <footer className="bg-[#0B132B] text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <div className="flex flex-col md:flex-row md:justify-between gap-6 sm:gap-8 md:gap-12">

          {/* Kolom Info Prodi */}
          <div className="max-w-lg space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3 mb-4 px-2 group-data-[collapsible=icon]:hidden">
              <Image
                src="/assets/landingpage/logo/logo-dinus.png"
                alt="Logo Udinus"
                className="object-contain shrink-0"
                width={60}
                height={7}
              />
              <div className="flex flex-col leading-tight font-extrabold uppercase tracking-wide text-white">
                <span className="text-sm">UNIVERSITAS</span>
                <span className="text-sm">DIAN NUSWANTORO</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {prodiName ? `Program Studi ${prodiName}` : "Universitas Dian Nuswantoro"}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Mempersiapkan generasi digital yang kompeten, inovatif, dan siap menghadapi tantangan teknologi masa depan.
              </p>
            </div>
          </div>

          {/* Kolom Kontak */}
          <div className="md:min-w-[320px] space-y-4 sm:space-y-5 md:pt-2">
            <h4 className="text-base sm:text-lg font-semibold text-white">Kontak</h4>
            <div className="space-y-3 sm:space-y-3.5">
              <div className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">
                  Jl. Imam Bonjol No.207, Semarang
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="text-sm">(024) 3517261</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="text-sm">info@dinus.ac.id</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom (Jarak atas dirapatkan) */}
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-slate-500 text-xs sm:text-sm">
          <p>© 2026 Universitas Dian Nuswantoro. All rights reserved.</p>
          <Link href="/about/developer" className="hover:text-white transition-colors">
            About Developer
          </Link>
        </div>
      </div>
    </footer>
  );
}