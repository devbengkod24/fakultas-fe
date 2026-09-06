"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Copy } from "lucide-react";
import { Research } from "@/types/admin/publikasi-page/riset-ilmiah/riset-ilmiah";

interface DetailDialogProps {
  riset: Research;
  trigger?: React.ReactNode;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ riset, trigger }) => {
  const [open, setOpen] = React.useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to parse personils
  const getPersonilsArray = (
    personils: string | string[] | undefined
  ): string[] => {
    if (!personils) return [];
    if (typeof personils === "string") {
      return personils
        .split(";")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
    }
    return personils;
  };

  const personilsArray = getPersonilsArray(riset.personils);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Detail Riset Ilmiah
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Judul Riset */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {riset.title}
            </h3>
            {riset.status_penelitian && (
              <Badge
                variant={
                  riset.status_penelitian === "Approved"
                    ? "primary"
                    : "secondary"
                }
                className="text-xs"
              >
                {riset.status_penelitian}
              </Badge>
            )}
          </div>

          {/* Informasi Dasar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {riset.leader_name && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Ketua Peneliti
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {riset.leader_name === "Unknown" ? "-" : riset.leader_name}
                  </p>
                </div>
              )}

              {riset.author_name && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Author
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {riset.author_name}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Tahun
                </label>
                <p className="text-sm text-gray-900 mt-1">{riset.year}</p>
              </div>

              {riset.jenis_penelitian && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Jenis Penelitian
                  </label>
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-sm">
                      {riset.jenis_penelitian}
                    </Badge>
                  </div>
                </div>
              )}

              {riset.sumber_pendanaan && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Sumber Pendanaan
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {riset.sumber_pendanaan === "INTERNAL_SOURCE"
                      ? "INTERNAL SOURCE"
                      : riset.sumber_pendanaan === "BIMA_SOURCE"
                      ? "BIMA SOURCE"
                      : riset.sumber_pendanaan === "SIMLIBMAS_SOURCE"
                      ? "SIMLIBMAS SOURCE"
                      : riset.sumber_pendanaan}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {riset.dana_penelitian && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Dana Penelitian
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-sm font-medium">
                      {formatCurrency(riset.dana_penelitian)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        copyToClipboard(riset.dana_penelitian?.toString() || "")
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {personilsArray && personilsArray.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Anggota Peneliti
                  </label>
                  <div className="mt-2 space-y-1">
                    {personilsArray.map((personil, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                      >
                        <span>{personil}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(personil)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {riset.id && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    ID Riset
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {riset.id}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(riset.id || "")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Ringkasan Riset</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Ketua:</span>
                <p className="font-medium">
                  {riset.leader_name === "Unknown"
                    ? "-"
                    : riset.leader_name || "-"}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Tahun:</span>
                <p className="font-medium">{riset.year}</p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <p className="font-medium">{riset.status_penelitian || "-"}</p>
              </div>
              <div>
                <span className="text-gray-600">Anggota:</span>
                <p className="font-medium">
                  {personilsArray.length > 0
                    ? `${personilsArray.length} orang`
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailDialog;
