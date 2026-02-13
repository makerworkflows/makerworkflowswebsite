
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { procureService, IRequisition, IPurchaseOrder } from '../service';

export function RequisitionList() {
  const [requisitions, setRequisitions] = useState<IRequisition[]>([]);
  const [lastPO, setLastPO] = useState<IPurchaseOrder | null>(null);

  useEffect(() => {
    procureService.getRequisitions().then(setRequisitions);
  }, []);

  const handleGeneratePO = async (id: string) => {
    const po = await procureService.generatePO(id);
    if (po) {
      setLastPO(po);
      // Refresh list to show updated status
      procureService.getRequisitions().then(setRequisitions);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {requisitions.map((req) => (
          <Card key={req.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        Requisition #{req.id}
                    </CardTitle>
                    <CardDescription>Requested by {req.requester}</CardDescription>
                </div>
                <Badge variant={req.status === 'PO_GENERATED' ? 'secondary' : 'default'} className={req.status === 'PO_GENERATED' ? 'bg-green-100 text-green-700' : 'bg-blue-600'}>
                    {req.status === 'PO_GENERATED' ? <CheckCircle className="w-3 h-3 mr-1"/> : <Clock className="w-3 h-3 mr-1"/>}
                    {req.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
                <div className="text-sm space-y-1 mb-4">
                    {req.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-slate-600">
                            <span>{item.name} (x{item.quantity})</span>
                            <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="border-t pt-1 flex justify-between font-bold text-slate-900">
                        <span>Total:</span>
                        <span>${req.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0).toFixed(2)}</span>
                    </div>
                </div>
                
                {req.status !== 'PO_GENERATED' && (
                    <Button onClick={() => handleGeneratePO(req.id)} size="sm" className="w-full">
                        Generate PO (AI Match)
                    </Button>
                )}
            </CardContent>
          </Card>
        ))}
      </div>

      {lastPO && (
        <Card className="bg-slate-900 text-white border-slate-800 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    PO Generated Successfully
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-400">PO Number:</span>
                        <span className="font-mono">{lastPO.poNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Vendor:</span>
                        <span>{lastPO.vendorId}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-700 pt-2 font-bold">
                        <span>Total:</span>
                        <span>${lastPO.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
