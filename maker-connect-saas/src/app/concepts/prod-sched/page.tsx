
import { SchedulerDashboard } from "@/features/prod-sched/components/scheduler-dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProdSched Pro - Maker Connect",
  description: "Advanced Production Scheduling",
};

export default function ProdSchedPage() {
  return (
    <div className="container py-6 space-y-6">
      <SchedulerDashboard />
    </div>
  );
}
