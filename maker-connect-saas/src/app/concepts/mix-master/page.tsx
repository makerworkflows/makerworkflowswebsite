
import { BatchExecution } from "@/features/mix-master/components/batch-execution";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MixMaster Toolkit - Maker Connect",
  description: "Electronic Batch Records & Execution",
};

export default function MixMasterPage() {
  return (
    <div className="container py-6 space-y-6">
      <BatchExecution />
    </div>
  );
}
