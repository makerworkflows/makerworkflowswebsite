
"use client";

import { useState } from "react";
import { docControlService, IDocument } from "../service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function CompDocDashboard() {
  const [docs, setDocs] = useState<IDocument[]>(docControlService.getDocuments());

  const handleApprove = (id: string) => {
    try {
        const msg = docControlService.approveDocument(id);
        toast.success(msg);
        setDocs([...docControlService.getDocuments()]);
    } catch (e: any) {
        toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">CompDoc Manager</h2>
          <p className="text-muted-foreground">Document Control & Governance (SOPs, WIs)</p>
        </div>
        <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Document
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Effective Documents</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{docs.filter(d => d.status === 'Effective').length}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Review</CardTitle>
                <RefreshCw className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{docs.filter(d => d.status === 'Review').length}</div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.id}</TableCell>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>v{doc.version}</TableCell>
                  <TableCell>
                    <Badge variant={doc.status === 'Effective' ? 'primary' : 'outline' as any}>
                        {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{doc.effectiveDate || "-"}</TableCell>
                  <TableCell>
                    {doc.status === "Review" && (
                        <Button size="sm" onClick={() => handleApprove(doc.id)}>
                            Approve
                        </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
