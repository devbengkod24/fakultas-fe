import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#114D91] to-primary-500 text-white">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:pl-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand & Address */}
          <div className="space-y-6">
            {/* Logo and Faculty Name */}
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

            <p className="text-slate-300 leading-relaxed text-sm">
              Mempersiapkan generasi digital yang kompeten, inovatif, dan siap menghadapi tantangan teknologi masa depan.
            </p>

            {/* Address */}
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-slate-400" />
                <span className="text-sm leading-relaxed">
                  Jl. Imam Bonjol No.207, Pendrikan Kidul, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah 50131
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-slate-400" />
                <span className="text-sm">(024) 3517261</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-slate-400" />
                <span className="text-sm"></span>
              </li>
            </ul>
          </div>

          {/* Program Studi */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Program Studi</h4>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  Program Studi Sarjana (S1)
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  Program Diploma & Sarjana Terapan (D3 & SST)
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  Program Diploma & Sarjana Magister (S2)
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  Program Studi Doktor (S3)
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  Program Pendidikan Jarak Jauh (PJJ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Organisasi & Biro */}
          <div className="lg:pl-12">
            <h4 className=" space-x-14 text-lg font-semibold mb-6">Organisasi Mahasiswa</h4>
            <ul className="space-y-3 text-slate-300 text-sm mb-8">
              <li><Link href="https://bemfikdinus.com/" className="hover:text-white transition-colors">BEM FIK</Link></li>
              <li><Link href="https://dpmfikudinus.com/" className="hover:text-white transition-colors">DPM FIK</Link></li>
            </ul>

            <h4 className="text-lg font-semibold mb-6">Biro</h4>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li><Link href="https://biak.dinus.ac.id/" className="hover:text-white transition-colors">Biro Akademik</Link></li>
              <li><Link href="https://biku.dinus.ac.id/" className="hover:text-white transition-colors">Biro Keuangan</Link></li>
              <li><Link href="https://bima.dinus.ac.id/" className="hover:text-white transition-colors">Biro Mahasiswa</Link></li>
            </ul>
          </div>

          {/* Unit & Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Unit</h4>
            <ul className="space-y-3 text-slate-300 text-sm mb-8">
              <li><Link href="https://perpustakaan.dinus.ac.id/" className="hover:text-white transition-colors">UPT Perpustakaan</Link></li>
              <li><Link href="https://cc.dinus.ac.id/" className="hover:text-white transition-colors">UPT Career Center</Link></li>
              <li><Link href="https://dinustek.com/" className="hover:text-white transition-colors">UPT Dinustek</Link></li>
              <li><Link href="https://lsp.dinus.id/" className="hover:text-white transition-colors">UPT LSP</Link></li>
              <li><Link href="https://penerbitan.dinus.ac.id/" className="hover:text-white transition-colors">UPT Penerbitan</Link></li>
              <li><Link href="https://poli.dinus.ac.id/" className="hover:text-white transition-colors">UPT Poliklinik</Link></li>
              <li><Link href="https://tvku.tv/beranda/" className="hover:text-white transition-colors">UPT TVKU</Link></li>
            </ul>

            {/* Program links moved here to fit the layout better */}
             {/* <h4 className="text-lg font-semibold mb-6">Program Unggulan</h4>
             <ul className="space-y-3 text-slate-300 text-sm">
              <li><a href="https://bengkelkoding.dinus.id/" className="hover:text-white transition-colors">Bengkel Koding</a></li>
              <li><Link href="/program-unggulan" className="hover:text-white transition-colors">Apple Academy</Link></li>
              <li><Link href="/program-unggulan" className="hover:text-white transition-colors">Google Bangkit</Link></li>
              <li><Link href="/verifikasi-sertifikat" className="hover:text-white transition-colors">Verifikasi Sertifikat</Link></li>
            </ul> */}
          </div>

        </div>

        <div className="border-t border-slate-400 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-slate-400 text-sm">
              © 2025 Universitas Dian Nuswantoro. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
              <Link
                href="/about/developer"
                className="hover:text-white transition-colors"
              >
                About Developer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}