
import { CompDocDashboard } from "@/features/comp-doc/components/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CompDoc Manager - Maker Connect",
  description: "Governance & Document Control",
};

export default function CompDocPage() {
  return (
    <div className="container py-6 space-y-6">
      <CompDocDashboard />
    </div>
  );
}
