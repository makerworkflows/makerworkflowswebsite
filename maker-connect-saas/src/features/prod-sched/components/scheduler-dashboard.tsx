
"use client";

import { useState } from "react";
import { schedulerService, IJob } from "../service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertTriangle, PlayCircle } from "lucide-react";
import { toast } from "sonner";

export function SchedulerDashboard() {
  const [jobs, setJobs] = useState<IJob[]>(schedulerService.getJobs());

  const runConflictCheck = () => {
    const conflicts = schedulerService.detectConflicts();
    setJobs([...schedulerService.getJobs()]); // Refresh state
    if (conflicts.length > 0) {
      toast.error(`Found ${conflicts.length} scheduling conflicts!`, {
        description: conflicts[0],
      });
    } else {
      toast.success("Schedule is clear. No conflicts detected.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ProdSched Pro</h2>
          <p className="text-muted-foreground">Real-time Production Scheduling & Resource Management</p>
        </div>
        <div className="space-x-2">
           <Button variant="outline" onClick={runConflictCheck}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Check Conflicts
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            New Job
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        {["Line A", "Line B", "Line C"].map((line) => (
          <Card key={line}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                {line}
                <Badge variant="outline" className="ml-2">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {jobs.filter(j => j.line === line).length === 0 && (
                   <p className="text-sm text-muted-foreground py-4">No jobs scheduled.</p>
                )}
                {jobs.filter(j => j.line === line).map(job => (
                  <div key={job.id} className={`
                    min-w-[250px] p-4 rounded-lg border 
                    ${job.status === 'Conflict' ? 'bg-red-50 border-red-200 dark:bg-red-900/20' : 'bg-secondary'}
                  `}>
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm">{job.id}</span>
                        <Badge variant={job.status === 'Conflict' ? 'destructive' : 'default'} className="text-[10px]">
                            {job.status}
                        </Badge>
                    </div>
                    <p className="font-medium text-sm truncate">{job.product}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(job.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                        {new Date(job.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="mt-3 flex justify-between items-center text-xs">
                        <span>qty: {job.quantity.toLocaleString()}</span>
                         <PlayCircle className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
