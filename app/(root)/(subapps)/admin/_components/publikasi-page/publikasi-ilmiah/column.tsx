import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import DetailDialog from "./detail-dialog";
import { Publikasi } from "@/types/admin/publikasi-page/publikasi-ilmiah/publikasi-ilmiah";
import { Badge } from "@/components/ui/badge";

export const Columns = (
  currentPage: number,
  perPage: number
): ColumnDef<Publikasi>[] => {
  return [
    {
      header: "No",
      cell: ({ row }) => {
        const number = (currentPage - 1) * perPage + row.index + 1;
        return <div>{number}</div>;
      },
    },
    {
      accessorKey: "title",
      header: "Judul Publikasi",
      cell: ({ row }) => {
        const title = row.getValue("title") as string;
        return (
          <div className="max-w-[300px]">
            <p className="truncate text-sm font-medium" title={title}>
              {title}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "journal",
      header: "Jurnal",
      cell: ({ row }) => {
        const journal = row.getValue("journal") as string;
        return (
          <div className="max-w-[200px]">
            <p className="truncate text-sm" title={journal}>
              {journal}
            </p>
          </div>
        );
      },
    },
    // ...existing code...
    {
      accessorKey: "authors",
      header: "Penulis",
      cell: ({ row }) => {
        const authors = row.original.authors;
        return (
          <div className="max-w-[200px]">
            {authors && authors.length > 0 ? (
              <p
                className="truncate text-sm"
                title={authors.map((author) => author.author_name).join(", ")}
              >
                {authors.map((author) => author.author_name).join(", ")}
              </p>
            ) : (
              <p className="text-sm text-gray-500">-</p>
            )}
          </div>
        );
      },
    },
    // ...existing code...
    {
      accessorKey: "year",
      header: "Tahun",
    },
    {
      accessorKey: "citation_count",
      header: "Sitasi",
      cell: ({ row }) => {
        const citationCount = row.original.citation_count;
        return (
          <div className="text-center">
            <span className="text-sm font-medium">{citationCount || 0}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "accred",
      header: "Akreditasi",
      cell: ({ row }) => {
        const accred = row.original.accred;
        const source = row.original.source;

        return (
          <div className="flex flex-col gap-1">
            {accred && accred !== "Unknown" && (
              <Badge variant="primary" className="text-xs w-fit">
                {accred}
              </Badge>
            )}
            {source && (
              <Badge
                variant={
                  source?.includes("SCOPUS")
                    ? "primary"
                    : source?.includes("SINTA")
                    ? "secondary"
                    : "outline"
                }
                className="text-xs w-fit"
              >
                {source}
              </Badge>
            )}
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "Aksi",
      enableHiding: false,
      cell: ({ row }) => {
        const publikasi = row.original;

        return (
          <div className="flex items-center gap-1">
            <DetailDialog
              publikasi={publikasi}
              trigger={
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        );
      },
    },
  ];
};
