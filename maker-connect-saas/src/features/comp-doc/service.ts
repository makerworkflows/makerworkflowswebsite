
export interface IDocument {
  id: string;
  title: string;
  version: string;
  status: "Draft" | "Review" | "Effective" | "Obsolete";
  effectiveDate?: string;
  owner: string;
  readRequired: boolean;
}

const MOCK_DOCS: IDocument[] = [
  {
    id: "SOP-101",
    title: "Change Control Procedure",
    version: "2.0",
    status: "Effective",
    effectiveDate: "2024-01-01",
    owner: "QA Manager",
    readRequired: true,
  },
  {
    id: "WI-205",
    title: "Sanitation of Mixing Tank",
    version: "1.0",
    status: "Review",
    owner: "Ops Supervisor",
    readRequired: true,
  },
];

export class DocControlService {
  private documents: IDocument[] = [...MOCK_DOCS];

  public getDocuments(): IDocument[] {
    return this.documents;
  }

  public routeForApproval(docId: string): string {
    const doc = this.documents.find(d => d.id === docId);
    if (!doc) throw new Error("Document not found");
    
    doc.status = "Review";
    return `Document ${doc.id} routed to Quality Assurance for approval.`;
  }

  public approveDocument(docId: string): string {
    const doc = this.documents.find(d => d.id === docId);
    if (!doc) throw new Error("Document not found");

    doc.status = "Effective";
    doc.effectiveDate = new Date().toISOString().split('T')[0];
    
    // Bump version if it was draft
    return `Document ${doc.id} is now Effective v${doc.version}`;
  }
}

export const docControlService = new DocControlService();
