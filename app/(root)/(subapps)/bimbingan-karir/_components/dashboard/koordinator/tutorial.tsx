import { BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Tutorial() {
  const handleOpenTutorial = () => {
    window.open(
      "https://www.notion.so/DOKUMENTASI-PENGGUNAAN-KOORDINATOR-53804d67c6ce4817945b0dda7784c27b",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2 justify-between">
            <span>Tutorial Penggunaan</span>
            <BookOpen className="size-4" />
        </CardTitle>
        <CardDescription>
          Panduan menggunakan sistem Bimbingan Karir sebagai Koordinator
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button onClick={handleOpenTutorial} className="w-full sm:w-auto gap-2" size="lg">
            <ExternalLink className="h-4 w-4" />
            Tutorial Dokumentasi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}