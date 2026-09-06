"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis,
} from "@/components/ui/pagination";

import {
  BookOpen, FlaskConical, Users, Calendar, Banknote, ExternalLink, Plus, Pencil, Search,
} from "lucide-react";

import {
  Publication, Research, CommunityService,
} from "@/types/fakultas/penelitian/penelitian";

import { CreateArtikelDialog, CreatePenelitianDialog } from "@/app/(root)/components/tridharma-dialogs";

// ─── Tab Navigation ───────────────────────────────────────────────────────────

interface TabNavigationProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b border-slate-200 mb-6">
      <div className="flex gap-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`pb-3 px-1 text-sm font-medium transition-all duration-200 relative whitespace-nowrap ${
              activeTab === tab ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Pagination Helper ────────────────────────────────────────────────────────

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  const pages: (number | "...")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }
  return pages;
}

// ─── Pagination UI ────────────────────────────────────────────────────────────

function PaginationControl({
  currentPage, totalPages, totalItems, onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
      <p className="text-sm text-slate-500">
        Page {currentPage} of {totalPages} ({totalItems} total items)
      </p>
      <Pagination className="w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-30" : "cursor-pointer"}
            />
          </PaginationItem>
          {getPageNumbers(currentPage, totalPages).map((page, i) =>
            page === "..." ? (
              <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => onPageChange(page as number)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-30" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface TridharmaSectionProps {
  dosenId: number | string;
  authorId?: number; // ← tambah ini, dari author_id di response API
  authorName?: string;
  publications?: Publication[];
  researches?: Research[];
  communityServices?: CommunityService[];
  baseUrl?: string;
  readOnly?: boolean;
  isSelfView?: boolean;
}

export function TridharmaSection({
  dosenId,
  authorId,
  authorName,
  publications = [],
  researches = [],
  communityServices = [],
  baseUrl = "/fakultas/manajemen-dosen/detail",
  readOnly = false,
  isSelfView = false,
}: TridharmaSectionProps) {
  const [currentTab, setCurrentTab] = useState("Publikasi");
  const router = useRouter();

  // Route detail beda bentuk antara dua konteks:
  //   fakultas/admin -> /fakultas/manajemen-dosen/detail/{dosenId}/penelitian/{id}
  //   profil sendiri -> /tugas-akhir/profile/penelitian/{id}   (TANPA dosenId)
  // Menyisipkan dosenId di profil sendiri menghasilkan segmen yang tidak punya
  // route sama sekali -> 404 di tombol edit publikasi maupun penelitian.
  const itemBase = isSelfView ? baseUrl : `${baseUrl}/${dosenId}`;

  // Daftar tridharma dimiliki DetailDosenFetcher, bukan komponen ini - create
  // lewat dialog tidak memindahkan route jadi fetcher-nya tidak pernah unmount.
  // Number() wajib: prop dosenId bertipe number | string, key di fetcher number,
  // dan SWR banding key by value -> "60" != 60 = mutate meleset tanpa error.
  const refreshTridharma = () => mutate(["tridharma", Number(dosenId)]);

  const ITEMS_PER_PAGE = 5;
  const [pubPage, setPubPage] = useState(1);
  const [penelitianPage, setPenelitianPage] = useState(1);
  const [pengabdianPage, setPengabdianPage] = useState(1);

  const [openArtikelDialog, setOpenArtikelDialog] = useState(false);
  const [openPenelitianDialog, setOpenPenelitianDialog] = useState(false);
  const [searchPublikasi, setSearchPublikasi] = useState("");
  const [searchPenelitian, setSearchPenelitian] = useState("");

  const paginatedPublikasi = publications.slice((pubPage - 1) * ITEMS_PER_PAGE, pubPage * ITEMS_PER_PAGE);
  const paginatedPenelitian = researches.slice((penelitianPage - 1) * ITEMS_PER_PAGE, penelitianPage * ITEMS_PER_PAGE);
  const paginatedPengabdian = communityServices.slice((pengabdianPage - 1) * ITEMS_PER_PAGE, pengabdianPage * ITEMS_PER_PAGE);

  const filteredPublikasi = publications.filter((pub) =>
    pub.title.toLowerCase().includes(searchPublikasi.toLowerCase())
  );
  const filteredPenelitian = researches.filter((res) =>
    res.title.toLowerCase().includes(searchPenelitian.toLowerCase())
  );

  const paginatedFilteredPublikasi = filteredPublikasi.slice((pubPage - 1) * ITEMS_PER_PAGE, pubPage * ITEMS_PER_PAGE);
  const paginatedFilteredPenelitian = filteredPenelitian.slice((penelitianPage - 1) * ITEMS_PER_PAGE, penelitianPage * ITEMS_PER_PAGE);

  const totalPubPages = Math.ceil(filteredPublikasi.length / ITEMS_PER_PAGE);
  const totalPenelitianPages = Math.ceil(filteredPenelitian.length / ITEMS_PER_PAGE);
  const totalPengabdianPages = Math.ceil(communityServices.length / ITEMS_PER_PAGE);

  const tabs = ["Publikasi", "Penelitian", "Pengabdian"];

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "Publikasi": return <BookOpen className="h-5 w-5" />;
      case "Penelitian": return <FlaskConical className="h-5 w-5" />;
      case "Pengabdian": return <Users className="h-5 w-5" />;
      default: return null;
    }
  };

  const formatFundingSource = (source?: string) => {
    if (!source) return "UNKNOWN";
    if (source.includes("INTERNAL")) return "INTERNAL SOURCE";
    if (source.includes("BIMA")) return "BIMA SOURCE";
    return source.replace(/_/g, " ").toUpperCase();
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("id-ID", {
      style: "currency", currency: "IDR", minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {getTabIcon(currentTab)}
            Tri Dharma
          </CardTitle>
        </CardHeader>

        <CardContent>
          <TabNavigation
            tabs={tabs}
            activeTab={currentTab}
            onTabChange={(tab) => {
              setCurrentTab(tab);
              setPubPage(1);
              setPenelitianPage(1);
              setPengabdianPage(1);
            }}
          />

          <div className="space-y-5">

            {/* ================= PUBLIKASI ================= */}
            {currentTab === "Publikasi" && (
              <>
                <div className="flex justify-between items-center mb-4 gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Cari publikasi..."
                      value={searchPublikasi}
                      onChange={(e) => {
                        setSearchPublikasi(e.target.value);
                        setPubPage(1);
                      }}
                      className="pl-9 h-9"
                    />
                  </div>
                  {!readOnly && (
                    <Button size="sm" onClick={() => setOpenArtikelDialog(true)}>
                      <Plus className="w-4 h-4 mr-1" /> Tambah Publikasi
                    </Button>
                  )}
                </div>
                {filteredPublikasi.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    {searchPublikasi ? "Tidak ada publikasi yang cocok" : "Belum ada data publikasi"}
                  </div>
                ) : (
                  <>
                    {paginatedFilteredPublikasi.map((pub, index) => (
                      <Card
                        key={pub.id || index}
                        className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-primary-600"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-4">
                            <h3
                              className="text-lg font-semibold text-primary-600 flex-1 leading- cursor-pointer hover:underline"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                              onClick={() => pub.id && router.push(
                                `/publikasi/detail?id=${pub.id}&type=artikel&from=${encodeURIComponent(window.location.pathname)}`)}
                            >
                              {pub.title}
                            </h3>
                            <div className="flex gap-1 flex-shrink-0">
                              {pub.article_url && (
                                <button
                                  onClick={() => window.open(pub.article_url, "_blank")}
                                  className="text-primary-600 hover:text-primary-700"
                                >
                                  <ExternalLink className="w-5 h-5" />
                                </button>
                              )}
                              {!readOnly && (
                                <button
                                  onClick={() => router.push(`${itemBase}/publikasi/${pub.id}?authorId=${authorId}`)}
                                  className="text-slate-500 hover:text-slate-700"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {pub.journal}
                            {pub.accred && ` ${pub.accred}`}
                            {pub.year && `, ${pub.year}`}
                          </p>
                          <div className="flex flex-wrap items-center text-xs text-gray-500 gap-3">
                            {pub.year && (
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {pub.year}
                              </div>
                            )}
                            {pub.doi && <div className="flex items-center">DOI: {pub.doi}</div>}
                            <div className="flex items-center">
                              <Badge
                                variant="default"
                                className={
                                  pub.source?.includes("SCOPUS") ||
                                  pub.source?.includes("GARUDA") ||
                                  pub.source?.includes("GOOGLE_SCHOLAR")
                                    ? "bg-[#0655a7] hover:bg-[#05488e] text-white"
                                    : ""
                                }
                              >
                                {pub.source || "UNKNOWN"}
                              </Badge>
                            </div>
                            {pub.citation_count !== undefined && (
                              <div className="text-xs text-gray-500">{pub.citation_count} Sitasi</div>
                            )}
                          </div>
                          {pub.authors && pub.authors.length > 0 && (
                            <div className="pt-2">
                              <p className="text-sm">
                                <span className="font-medium">Author:</span>{" "}
                                {pub.authors
                                  .sort((a, b) => a.author_order - b.author_order)
                                  .map((author, i) => (
                                    <span key={author.author_id}>
                                      <span
                                        className="hover:text-primary-600 hover:underline cursor-pointer"
                                        onClick={() => router.push(`/publikasi/dosen/${author.dosen_id ?? author.author_id}`)}
                                      >
                                        {author.author_name}
                                      </span>
                                      {i < pub.authors!.length - 1 && ", "}
                                    </span>
                                  ))}
                              </p>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                    <PaginationControl
                      currentPage={pubPage}
                      totalPages={totalPubPages}
                      totalItems={filteredPublikasi.length}
                      onPageChange={setPubPage}
                    />
                  </>
                )}
              </>
            )}

            {/* ================= PENELITIAN ================= */}
            {currentTab === "Penelitian" && (
              <>
                <div className="flex justify-between items-center mb-4 gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Cari penelitian..."
                      value={searchPenelitian}
                      onChange={(e) => {
                        setSearchPenelitian(e.target.value);
                        setPenelitianPage(1);
                      }}
                      className="pl-9 h-9"
                    />
                  </div>
                  {!readOnly && (
                    <Button size="sm" onClick={() => setOpenPenelitianDialog(true)}>
                      <Plus className="w-4 h-4 mr-1" /> Tambah Penelitian
                    </Button>
                  )}
                </div>
                {filteredPenelitian.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    {searchPenelitian ? "Tidak ada penelitian yang cocok" : "Belum ada data penelitian"}
                  </div>
                ) : (
                  <>
                    {paginatedFilteredPenelitian.map((research, index) => (
                      <Card
                        key={research.id || index}
                        className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-primary-600"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="text-lg font-semibold text-primary-600 flex-1">
                              {research.title}
                            </h3>
                            {!readOnly && (
                              <button
                                onClick={() => router.push(`${itemBase}/penelitian/${research.id}?authorId=${authorId}`)}
                                className="text-slate-500 hover:text-slate-700 flex-shrink-0"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center text-xs text-gray-500 gap-3">
                            <Badge
                              variant={research.status_penelitian === "Approved" ? "default" : "secondary"}
                              className={
                                research.status_penelitian === "Approved"
                                  ? "bg-[#e2eefc] text-[#0655a7] border-[#bfdbf8] hover:bg-[#e2eefc]"
                                  : ""
                              }
                            >
                              {research.status_penelitian || "Unknown"}
                            </Badge>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {research.year}
                            </div>
                            {research.dana_penelitian && (
                              <div className="flex items-center">
                                <Banknote className="w-4 h-4 mr-1" />
                                {formatCurrency(research.dana_penelitian)}
                              </div>
                            )}
                            <Badge
                              variant="outline"
                              className={
                                research.sumber_pendanaan?.includes("INTERNAL_SOURCE")
                                  ? "bg-[#1e7fd9] hover:bg-[#1063b9] text-white border-transparent"
                                  : research.sumber_pendanaan?.includes("BIMA_SOURCE")
                                  ? "bg-[#00a651] hover:bg-[#008a44] text-white border-transparent"
                                  : research.sumber_pendanaan?.includes("SIMLITABMAS")
                                  ? "bg-[#eb8b15] hover:bg-[#d0670f] text-white border-transparent"
                                  : ""
                              }
                            >
                              {formatFundingSource(research.sumber_pendanaan)}
                            </Badge>
                          </div>
                          <div className="pt-2">
                            <p className="text-sm mb-2">
                              <span className="font-medium">Ketua:</span>{" "}
                              {research.leader_name || "-"}
                            </p>
                            {research.coleader_name && (
                              <p className="text-sm mb-2">
                                <span className="font-medium">Ketua Pendamping:</span>{" "}
                                {research.coleader_name}
                              </p>
                            )}
                            {research.personils && (
                              <p className="text-sm">
                                {/* BE sengaja mengecualikan dosen yang halamannya
                                    dibuka (search/authors.py:62), jadi ini memang
                                    bukan daftar lengkap — labelnya harus jujur,
                                    kalau tidak terbaca tidak sinkron dengan form
                                    edit yang menampilkan semua anggota. */}
                                <span className="font-medium">Anggota lain:</span>{" "}
                                {research.personils}
                              </p>
                            )}
                          </div>
                          {research.jenis_penelitian && (
                            <div className="pt-1 text-sm text-primary-600">
                              {research.jenis_penelitian}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                    <PaginationControl
                      currentPage={penelitianPage}
                      totalPages={totalPenelitianPages}
                      totalItems={filteredPenelitian.length}
                      onPageChange={setPenelitianPage}
                    />
                  </>
                )}
              </>
            )}

            {/* ================= PENGABDIAN ================= */}
            {currentTab === "Pengabdian" && (
              <>
                {communityServices.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    Belum ada data pengabdian
                  </div>
                ) : (
                  <>
                    {paginatedPengabdian.map((service, index) => (
                      <Card
                        key={service.id || index}
                        className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-green-500"
                      >
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-green-700">{service.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            {service.tahun && (
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {service.tahun}
                              </div>
                            )}
                            {service.label && (
                              <Badge variant="outline" className="text-green-700 border-green-300">
                                {service.label}
                              </Badge>
                            )}
                          </div>
                          {service.lokasi && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Lokasi:</span>{" "}
                              {service.lokasi}
                            </p>
                          )}
                        </div>
                      </Card>
                    ))}
                    <PaginationControl
                      currentPage={pengabdianPage}
                      totalPages={totalPengabdianPages}
                      totalItems={communityServices.length}
                      onPageChange={setPengabdianPage}
                    />
                  </>
                )}
              </>
            )}

          </div>
        </CardContent>
      </Card>

      {!readOnly && (
        <>
          <CreateArtikelDialog
            open={openArtikelDialog}
            authorId={authorId ?? 0}
            authorName={authorName}
            onClose={() => setOpenArtikelDialog(false)}
            onSuccess={() => {
              setOpenArtikelDialog(false);
              setPubPage(1);
              refreshTridharma();
            }}
          />

          <CreatePenelitianDialog
            open={openPenelitianDialog}
            authorId={authorId ?? 0}
            authorName={authorName}
            onClose={() => setOpenPenelitianDialog(false)}
            onSuccess={() => {
              setOpenPenelitianDialog(false);
              setPenelitianPage(1);
              refreshTridharma();
            }}
          />
        </>
      )}
    </>
  );
}