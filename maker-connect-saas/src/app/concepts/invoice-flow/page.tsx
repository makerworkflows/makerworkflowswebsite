
import { InvoiceDashboard } from "@/features/invoice-flow/components/invoice-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "InvoiceFlow Optimizer - Maker Connect",
  description: "Automated AP Processing and 3-Way Matching",
};

export default function InvoiceFlowPage() {
  return (
    <div className="container py-6 space-y-6">
      <InvoiceDashboard />
    </div>
  );
}
