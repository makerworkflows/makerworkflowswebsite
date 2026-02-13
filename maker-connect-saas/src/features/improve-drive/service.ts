
export interface ICAPA {
  id: string;
  title: string;
  source: "Audit" | "Customer Complaint" | "Deviation";
  status: "Open" | "Investigating" | "Implementing Fix" | "Closed";
  severity: "Low" | "Medium" | "High" | "Critical";
  rootCause?: string;
}

const MOCK_CAPAS: ICAPA[] = [
  {
    id: "CAPA-2024-001",
    title: "Metal sliver found in raw material",
    source: "Deviation",
    status: "Investigating",
    severity: "High",
  },
  {
    id: "CAPA-2024-002",
    title: "Label misalignment on Line B",
    source: "Audit",
    status: "Open",
    severity: "Medium",
  },
];

export class ImproveDriveService {
  private capas: ICAPA[] = [...MOCK_CAPAS];

  public getCAPAs(): ICAPA[] {
    return this.capas;
  }

  public runRootCauseAnalysis(capaId: string, method: "5-Whys" | "Fishbone"): string {
    // Mock AI Analysis
    return `AI Analysis (${method}): Potential root cause linked to supplier 'Acme Ingredients' batch variability. Recommended Action: Supplier Audit.`;
  }
}

export const improveDriveService = new ImproveDriveService();
