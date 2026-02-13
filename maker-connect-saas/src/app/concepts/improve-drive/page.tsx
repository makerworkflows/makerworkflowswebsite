
import { ImproveDriveDashboard } from "@/features/improve-drive/components/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ImproveDrive - Maker Connect",
  description: "Continuous Improvement",
};

export default function ImproveDrivePage() {
  return (
    <div className="container py-6 space-y-6">
      <ImproveDriveDashboard />
    </div>
  );
}
