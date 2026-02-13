
import React from 'react';
import { MRPDashboard } from '@/features/mrp-planner/components/mrp-dashboard';

export default function MRPPlannerPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">MRP Smart Planner</h1>
        <p className="text-slate-500">Material Resource Planning with automated shortage detection.</p>
      </div>
      
      <MRPDashboard />
    </div>
  );
}
