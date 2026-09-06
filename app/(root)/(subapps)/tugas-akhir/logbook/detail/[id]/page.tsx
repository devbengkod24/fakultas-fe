"use client";

import { use } from "react";
import { StudentLogbookListKoor } from "../../../_components/logbook/student-logbook-list-koor";

export default function KoordinatorLogbookDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const dosenId = parseInt(params.id);

  return <StudentLogbookListKoor dosenId={dosenId} />;
}
