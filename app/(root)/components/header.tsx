"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useProfile } from "@/context/profileUseContext";

const navigations = [
  { link: "#", title: "Beranda" },
  { link: "profil", title: "Profil" },
  { link: "inovasi", title: "Inovasi" },
  { link: "publikasi", title: "Publikasi" },
  { link: "pengumuman", title: "Pengumuman" },
  { link: "berita", title: "Berita Kegiatan" },
];

const Header = () => {
  const url = usePathname();
  const activePath = url ? url.split("/")[1] : "";
  const { profile } = useProfile();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Close mobile menu when clicking outside or on link
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when clicking on a link
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-gradient-to-br from-[#114D91] to-primary-500 shadow-lg shadow-black/10">
        <div className="mx-auto flex items-center justify-between px-4 py-4 md:px-6 lg:w-[96%] lg:py-5 2xl:w-[90%]">
          {/* Logo */}
          <Link href="/" onClick={handleLinkClick} className="items-center sm:gap-3 inline-flex gap-3">
            <Image
              src="/assets/landingpage/logo/logo-dinus.png"
              alt="TI"
              width={180}
              height={40}
              style={{ height: "40px", width: "auto" }}
              className="h-8 sm:h-10"
            />
            <div className="flex flex-col leading-tight font-extrabold uppercase tracking-wide text-white">
              <span className="text-xs">UNIVERSITAS</span>
              <span className="text-xs">DIAN NUSWANTORO</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 text-sm">
            <ul className="flex gap-6 font-medium">
              {navigations.map((nav, index) => (
                <li key={index} className="group relative">
                  <Link
                    href={nav.link ? `/${nav.link}` : "#"}
                    className={`transition-colors duration-200 ${
                      activePath === nav.link
                        ? "text-[#F3BC45]"
                        : "text-white hover:text-[#F3BC45]"
                    }`}
                  >
                    {nav.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop CTA Buttons */}
            <div className="flex gap-3 ml-4">
              <Link
                href="https://pmb.dinus.ac.id/"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-white text-white hover:bg-white hover:text-[#114D91] px-4 py-2 text-sm font-medium transition-colors duration-300"
              >
                <span>Pendaftaran</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              {profile ? (
                <Link
                  href="/apps"
                  className="inline-flex items-center gap-2 rounded-full bg-[#F3BC45] px-6 py-2 text-sm font-medium text-white hover:bg-white hover:text-[#114D91] shadow transition-colors duration-300"
                >
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full bg-[#F3BC45] px-6 py-2 text-sm font-medium text-white hover:bg-white hover:text-[#114D91] shadow transition-colors duration-300"
                >
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`absolute left-0 right-0 top-full z-40 bg-white border-t shadow-lg transition-all duration-300 ease-in-out lg:hidden ${
            isMobileMenuOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2"
          }`}
        >
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <nav className="space-y-3">
              {navigations.map((nav, index) => (
                <Link
                  key={index}
                  href={nav.link ? `/${nav.link}` : "#"}
                  onClick={handleLinkClick}
                  className={`block py-2 px-3 rounded-lg text-base font-medium transition-colors ${
                    activePath === nav.link
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  {nav.title}
                </Link>
              ))}
            </nav>

            {/* Mobile CTA Buttons */}
            <div className="pt-4 border-t space-y-3">
              <Link
                href="https://pmb.dinus.ac.id/"
                target="_blank"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 w-full rounded-lg border-[1.5px] border-primary px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-primary-50"
              >
                <span>Pendaftaran</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              {profile ? (
                <Link
                  href="/apps"
                  onClick={handleLinkClick}
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white shadow transition hover:bg-primary-600"
                >
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={handleLinkClick}
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white shadow transition hover:bg-primary-600"
                >
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
