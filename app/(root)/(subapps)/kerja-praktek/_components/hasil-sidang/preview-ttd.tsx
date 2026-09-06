import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Role } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";

interface PreviewTtdProps {
  isOpen: boolean;
  onClose: () => void;
  signatureUrl: string | null;
}

export function PreviewTtdKoor({
  isOpen,
  onClose,
  signatureUrl
}: PreviewTtdProps) {

  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tanda Tangan {role === "koordinator" ? "Koordinator" : role === "dosen" ? "Dosen" : ""}</DialogTitle>
        </DialogHeader>

        <div className="py-4 flex justify-center">
          {signatureUrl ? (
            <div className="border rounded-md p-4 w-64 h-64 relative">
              <Image
                src={signatureUrl}
                alt="TTD"
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 256px) 100vw, 256px"
              />
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Belum ada tanda tangan yang diunggah.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}