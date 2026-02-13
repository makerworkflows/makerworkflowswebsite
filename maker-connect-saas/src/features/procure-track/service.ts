
export interface IRequisition {
  id: string;
  requester: string;
  items: { itemId: string; name: string; quantity: number; unitPrice: number }[];
  status: 'PENDING' | 'APPROVED' | 'PO_GENERATED';
  createdAt: Date;
}

export interface IPurchaseOrder {
  poNumber: string;
  vendorId: string;
  items: { itemId: string; quantity: number; total: number }[];
  totalAmount: number;
  status: 'ISSUED';
  generatedAt: Date;
}

// Mock Data
const MOCK_REQUISITIONS: IRequisition[] = [
  {
    id: 'req-001',
    requester: 'John Doe',
    items: [
      { itemId: 'i1', name: 'Whey Protein', quantity: 500, unitPrice: 15.50 },
      { itemId: 'i8', name: 'Packaging Bottles', quantity: 1000, unitPrice: 0.50 }
    ],
    status: 'PENDING',
    createdAt: new Date()
  },
  {
    id: 'req-002',
    requester: 'Jane Smith',
    items: [
      { itemId: 'i9', name: 'Citric Acid', quantity: 50, unitPrice: 3.50 }
    ],
    status: 'APPROVED',
    createdAt: new Date()
  }
];

export class ProcureService {
  
  async getRequisitions(): Promise<IRequisition[]> {
    return MOCK_REQUISITIONS;
  }

  /**
   * Auto-generates a PO from a Requisition
   */
  async generatePO(requisitionId: string): Promise<IPurchaseOrder | null> {
    const req = MOCK_REQUISITIONS.find(r => r.id === requisitionId);
    if (!req) return null;

    // Simulate AI logic to select best vendor (mocked)
    const bestVendor = 'VENDOR-XYZ-GLOBAL';

    const po: IPurchaseOrder = {
      poNumber: `PO-${Date.now().toString().slice(-6)}`,
      vendorId: bestVendor,
      items: req.items.map(i => ({
        itemId: i.itemId,
        quantity: i.quantity,
        total: i.quantity * i.unitPrice
      })),
      totalAmount: req.items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0),
      status: 'ISSUED',
      generatedAt: new Date()
    };

    req.status = 'PO_GENERATED';
    return po;
  }
}

export const procureService = new ProcureService();
