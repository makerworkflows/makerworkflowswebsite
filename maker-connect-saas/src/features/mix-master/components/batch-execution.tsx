
"use client";

import { useState } from "react";
import { batchRecordService, IBatchRecord } from "../service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ClipboardList, QrCode, PenTool } from "lucide-react";

export function BatchExecution() {
  const [batches, setBatches] = useState<IBatchRecord[]>(batchRecordService.getBatches());
  const [activeBatchId, setActiveBatchId] = useState<string>(batches[0].id);
  const [inputValue, setInputValue] = useState("");

  const activeBatch = batches.find((b) => b.id === activeBatchId);

  const handleStepComplete = (stepId: string, type: string) => {
    try {
      if (type === "Scan" || type === "Input") {
         if (!inputValue) {
             toast.error("Input required for this step");
             return;
         }
         batchRecordService.completeStep(activeBatchId, stepId, inputValue, "Demo User");
         setInputValue(""); // Clear input
      } else {
         batchRecordService.completeStep(activeBatchId, stepId, "Checked", "Demo User");
      }
      
      setBatches([...batchRecordService.getBatches()]); // Refresh
      toast.success("Step Completed");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (!activeBatch) return <div>No active batches</div>;

  const progress = (activeBatch.steps.filter(s => s.completed).length / activeBatch.steps.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">MixMaster Toolkit</h2>
          <p className="text-muted-foreground">Electronic Batch Records (EBR) & Execution</p>
        </div>
        <Badge variant="outline" className="text-lg py-1 px-4">{activeBatch.status}</Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle>Active Batches</CardTitle>
            </CardHeader>
            <CardContent>
                {batches.map(batch => (
                    <div 
                        key={batch.id} 
                        onClick={() => setActiveBatchId(batch.id)}
                        className={`p-3 rounded-lg border cursor-pointer mb-2 ${batch.id === activeBatchId ? 'bg-primary/10 border-primary' : ''}`}
                    >
                        <div className="font-bold">{batch.batchNumber}</div>
                        <div className="text-sm text-muted-foreground">{batch.productName}</div>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between">
                <span>{activeBatch.productName} ({activeBatch.batchNumber})</span>
                <span className="text-sm font-normal text-muted-foreground">{progress.toFixed(0)}% Complete</span>
            </CardTitle>
            <div className="w-full bg-secondary h-2 rounded-full mt-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeBatch.steps.map((step, index) => (
              <div key={step.id} className={`p-4 border rounded-lg flex flex-col md:flex-row gap-4 items-start ${step.completed ? 'opacity-50 bg-secondary/50' : 'bg-background'}`}>
                <div className="flex items-center space-x-4 min-w-[200px]">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {index + 1}
                    </div>
                    <div>
                        <p className="font-medium">{step.instruction}</p>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                             {step.type === "Scan" && <QrCode className="w-3 h-3"/>} 
                             {step.type === "Signature" && <PenTool className="w-3 h-3"/>}
                             {step.type}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex items-center gap-2 justify-end">
                    {step.completed ? (
                        <div className="text-right text-sm">
                            <span className="text-green-600 font-bold block">Done</span>
                            <span className="text-xs text-muted-foreground">{step.completedBy} @ {new Date(step.completedAt!).toLocaleTimeString()}</span>
                        </div>
                    ) : (
                        <>
                             {(step.type === "Scan" || step.type === "Input") && (
                                 <Input 
                                    placeholder={step.type === "Scan" ? "Scan Barcode..." : "Enter Value..."} 
                                    className="max-w-[200px]"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                 />
                             )}
                             <Button onClick={() => handleStepComplete(step.id, step.type)}>
                                {step.type === "Signature" ? "Sign & Complete" : "Submit"}
                             </Button>
                        </>
                    )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
