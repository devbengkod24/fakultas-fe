import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import Image from "next/image";
  import { FileX } from "lucide-react";
  
  interface DaftarDosenCardTtdProps {
    ttdUrl?: string | null;
  }
  
  export function DaftarDosenCardTtd({ ttdUrl }: DaftarDosenCardTtdProps) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Tanda Tangan Dosen</CardTitle>
          <CardDescription>Preview tanda tangan dosen</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[calc(100%-88px)] min-h-[200px]">
          {ttdUrl ? (
            <div className="relative w-full max-w-[250px] h-[200px]">
              <Image 
                src={ttdUrl}
                alt="Tanda Tangan Dosen"
                fill
                className="object-contain rounded-md"
                onError={(e) => {
                  console.error("Error loading signature image:", e);
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <FileX className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tanda tangan dosen belum tersedia
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Dosen belum mengunggah tanda tangan digital
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
