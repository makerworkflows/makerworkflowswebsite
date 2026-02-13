
import { v4 as uuidv4 } from "uuid";

export interface IInvoice {
  id: string;
  vendor: string;
  amount: number;
  poId: string;
  status: "Draft" | "Matched" | "Mismatch" | "Paid";
  date: string;
  items: { description: string; quantity: number; unitPrice: number }[];
}

export interface IPO {
  id: string;
  vendor: string;
  totalAmount: number;
  items: { description: string; quantity: number; unitPrice: number }[];
}

// Mock Data
const MOCK_POS: IPO[] = [
  {
    id: "PO-1001",
    vendor: "Acme Ingredients",
    totalAmount: 5000,
    items: [{ description: "Whey Protein Isolate", quantity: 500, unitPrice: 10 }],
  },
  {
    id: "PO-1002",
    vendor: "Global Packaging",
    totalAmount: 1200,
    items: [{ description: "Cardboard Box 12x12", quantity: 1000, unitPrice: 1.2 }],
  },
];

const MOCK_INVOICES: IInvoice[] = [
  {
    id: "INV-2024-001",
    vendor: "Acme Ingredients",
    amount: 5000,
    poId: "PO-1001",
    status: "Draft",
    date: "2024-03-15",
    items: [{ description: "Whey Protein Isolate", quantity: 500, unitPrice: 10 }],
  },
  {
    id: "INV-2024-002",
    vendor: "Global Packaging",
    amount: 1250, // Mismatch (50 higher)
    poId: "PO-1002",
    status: "Draft",
    date: "2024-03-16",
    items: [{ description: "Cardboard Box 12x12", quantity: 1000, unitPrice: 1.25 }],
  },
];

export class InvoiceService {
  private invoices: IInvoice[] = [...MOCK_INVOICES];

  public getInvoices(): IInvoice[] {
    return this.invoices;
  }

  public getPOs(): IPO[] {
    return MOCK_POS;
  }

  public matchInvoice(invoiceId: string): { success: boolean; message: string } {
    const invoice = this.invoices.find((i) => i.id === invoiceId);
    if (!invoice) return { success: false, message: "Invoice not found" };

    const po = MOCK_POS.find((p) => p.id === invoice.poId);
    if (!po) return { success: false, message: "PO not found for this invoice" };

    // 3-Way Match Logic (Simplified: Amount & Vendor)
    const amountMatch = Math.abs(invoice.amount - po.totalAmount) < 0.01;
    const vendorMatch = invoice.vendor === po.vendor;

    if (amountMatch && vendorMatch) {
      invoice.status = "Matched";
      return { success: true, message: "3-Way Match Successful! Ready for payment." };
    } else {
      invoice.status = "Mismatch";
      const reasons = [];
      if (!amountMatch) reasons.push(`Amount mismatch (Inv: ${invoice.amount}, PO: ${po.totalAmount})`);
      if (!vendorMatch) reasons.push("Vendor mismatch");
      return { success: false, message: `Match Failed: ${reasons.join(", ")}` };
    }
  }
}

export const invoiceService = new InvoiceService();
