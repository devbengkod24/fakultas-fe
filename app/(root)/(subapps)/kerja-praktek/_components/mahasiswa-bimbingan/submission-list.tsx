import { Pengajuan } from "@/types/kerja-praktek/pengajuan";
import { SubmissionCard } from "./submission-card";

interface SubmissionListProps {
  submissions: Pengajuan[];
  onStatusChange: () => void;
}

export function SubmissionList({ submissions, onStatusChange }: SubmissionListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {submissions.length > 0 ? (
        submissions.map((submission) => (
          <SubmissionCard 
            key={submission.kerja_praktek_id} 
            submission={submission}
            onStatusChange={onStatusChange}
          />
        ))
      ) : (
        <div className="col-span-full flex justify-center items-center p-8 border rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-medium">Tidak ada data</h3>
            <p className="text-muted-foreground">
              Tidak ada pengajuan kerja praktek yang sesuai dengan filter yang dipilih.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}