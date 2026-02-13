
"use client";

import { useState } from "react";
import { invoiceService, IInvoice } from "../service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, FileText } from "lucide-react";

export function InvoiceDashboard() {
  const [invoices, setInvoices] = useState<IInvoice[]>(invoiceService.getInvoices());

  const handleMatch = (id: string) => {
    const result = invoiceService.matchInvoice(id);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    // Refresh list
    setInvoices([...invoiceService.getInvoices()]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Matched": return "default"; // green-ish in default theme usually or black
      case "Mismatch": return "destructive";
      case "Paid": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">InvoiceFlow Optimizer</h2>
          <p className="text-muted-foreground">Automated 3-Way Matching & AP Processing</p>
        </div>
        <Button variant="outline">Import Invoices</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.filter(i => i.status === 'Draft').length}</div>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matched (Ready)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.filter(i => i.status === 'Matched').length}</div>
            <p className="text-xs text-muted-foreground">Auto-verified by AI</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exceptions</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.filter(i => i.status === 'Mismatch').length}</div>
            <p className="text-xs text-muted-foreground">Price/quantity variances</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>Manage and match incoming invoices against Purchase Orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>PO Ref</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.vendor}</TableCell>
                  <TableCell>{invoice.poId}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(invoice.status) as any}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {invoice.status === "Draft" || invoice.status === "Mismatch" ? (
                      <Button size="sm" onClick={() => handleMatch(invoice.id)}>
                        Run Match
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" disabled>
                        Verified
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
