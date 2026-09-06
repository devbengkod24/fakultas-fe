interface DosenHeaderProps {
  dosen: {
    id: string;
    name: string;
    npp: string;
  };
}

export function DaftarDosenCardHeader({ dosen }: DosenHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">{dosen.name}</h1>
          <p className="text-muted-foreground">{dosen.npp}</p>
        </div>
      </div>
    </div>
  );
}
