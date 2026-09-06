import { SubmissionCardSkeleton } from "./submission-card-skeleton";

export function SubmissionListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array(4).fill(0).map((_, index) => (
        <SubmissionCardSkeleton key={index} />
      ))}
    </div>
  );
}