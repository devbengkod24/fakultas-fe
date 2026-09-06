"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useProfile } from "@/context/profileUseContext";

const navigations = [
  { link: "sambutan", title: "Sambutan" },
  { link: "profil-program-studi", title: "Profil" },
  { link: "prospek-karir", title: "Karir" },
  { link: "daftar-mata-kuliah", title: "Kurikulum" },
  { link: "program-unggulan", title: "Unggulan" },
  { link: "struktur-organisasi", title: "Struktural" },
  { link: "pengumuman-terbaru", title: "Pengumuman" },
  { link: "akses-mudah", title: "Layanan" },
];

const HeaderProdi = () => {
  const { profile } = useProfile();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setMobileMenuOpen(false);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100; // Adjust based on header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside or on link
  useEffect(() => {
    // Close mobile menu when window >= xl (1280px)
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white shadow-lg shadow-black/5">
        <div className="mx-auto flex items-center justify-between px-4 py-4 md:px-6 lg:w-[96%] lg:py-5 2xl:w-[90%]">
          {/* Logo */}
          <Link href="/" onClick={scrollToTop} className="items-center sm:gap-3 inline-flex gap-3">
            <Image
              src="/assets/landingpage/logo/logo-dinus.png"
              alt="TI"
              width={180}
              height={40}
              style={{ height: "40px", width: "auto" }}
              className="h-8 sm:h-10"
            />
            <div className="flex flex-col leading-tight font-extrabold uppercase tracking-wide text-[#114D91]">
              <span className="text-xs">UNIVERSITAS</span>
              <span className="text-xs">DIAN NUSWANTORO</span>
            </div>
          </Link>

          {/* Desktop Navigation — hide di tablet (md/lg), show di xl+ (≥1280px) */}
          <div className="hidden xl:flex items-center gap-6 text-sm">
            <ul className="flex gap-6 font-medium">
              {navigations.map((nav, index) => (
                <li key={index} className="group relative">
                  <a
                    href={`#${nav.link}`}
                    onClick={(e) => scrollToSection(e, nav.link)}
                    className="transition-colors duration-200 text-gray-700 hover:text-primary-600 cursor-pointer"
                  >
                    {nav.title}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop CTA Buttons */}
            <div className="flex gap-3 ml-4">
              <Link
                href="https://pmb.dinus.ac.id/"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-primary px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-primary-50"
              >
                <span>Pendaftaran</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              {profile ? (
                <Link
                  href="/apps"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white shadow transition hover:bg-primary-600"
                >
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white shadow transition hover:bg-primary-600"
                >
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle — show di tablet vertikal & mobile */}
          <button
            onClick={toggleMobileMenu}
            className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown — show di tablet vertikal & mobile */}
        <div
          className={`absolute left-0 right-0 top-full z-40 bg-white border-t shadow-lg transition-all duration-300 ease-in-out xl:hidden ${
            isMobileMenuOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2"
          }`}
        >
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <nav className="space-y-3">
              {navigations.map((nav, index) => (
                <a
                  key={index}
                  href={`#${nav.link}`}
                  onClick={(e) => scrollToSection(e, nav.link)}
                  className="block py-2 px-3 rounded-lg text-base font-medium transition-colors text-gray-700 hover:text-primary-600 hover:bg-gray-50 cursor-pointer"
                >
                  {nav.title}
                </a>
              ))}
            </nav>

            {/* Mobile CTA Buttons */}
            <div className="pt-4 border-t space-y-3">
              <Link
                href="https://pmb.dinus.ac.id/"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-lg border-[1.5px] border-primary px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-primary-50"
              >
                <span>Pendaftaran</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              {profile ? (
                <Link
                  href="/apps"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white shadow transition hover:bg-primary-600"
                >
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white shadow transition hover:bg-primary-600"
                >
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay — show di tablet vertikal & mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 xl:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default HeaderProdi;
