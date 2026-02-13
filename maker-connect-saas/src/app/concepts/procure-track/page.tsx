
import React from 'react';
import { RequisitionList } from '@/features/procure-track/components/requisition-list';

export default function ProcureTrackPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">ProcureTrack AI</h1>
        <p className="text-slate-500">Automated purchasing and intelligent invoice matching.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Open Requisitions</h2>
            <RequisitionList />
        </div>
        
        <div className="bg-slate-50 p-6 rounded-xl h-fit">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    Upload Invoice (PDF)
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    Vendor Performance
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
}
