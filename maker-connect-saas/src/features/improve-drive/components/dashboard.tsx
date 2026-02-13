
"use client";

import { useState } from "react";
import { improveDriveService, ICAPA } from "../service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, AlertOctagon, Activity } from "lucide-react";
import { toast } from "sonner";

export function ImproveDriveDashboard() {
  const [capas, setCapas] = useState<ICAPA[]>(improveDriveService.getCAPAs());

  const runAnalysis = (id: string) => {
    const result = improveDriveService.runRootCauseAnalysis(id, "5-Whys");
    toast.message("AI Root Cause Analysis Complete", {
        description: result,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ImproveDrive</h2>
          <p className="text-muted-foreground">Continuous Improvement & CAPA Management</p>
        </div>
        <Button>
            <AlertOctagon className="mr-2 h-4 w-4" />
            Report Issue
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open CAPAs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{capas.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader>
            <CardTitle>Active Investigations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {capas.map(capa => (
                    <div key={capa.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold">{capa.id}</span>
                                <Badge variant={capa.severity === 'High' ? 'destructive' : 'secondary'}>{capa.severity}</Badge>
                            </div>
                            <p className="font-medium">{capa.title}</p>
                            <p className="text-sm text-muted-foreground">Source: {capa.source}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => runAnalysis(capa.id)}>
                            <Lightbulb className="mr-2 h-4 w-4" />
                            Analyze Root Cause
                        </Button>
                    </div>
                ))}
            </div>
          </CardContent>
      </Card>
    </div>
  );
}
