import { BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Tutorial() {
  const handleOpenTutorial = () => {
    window.open(
      "https://www.notion.so/DOKUMENTASI-PENGGUNAAN-MAHASISWA-2ccdc2720398802ea35ad8d761052432",
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
          Panduan website Bimbingan Karir
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