
import { HubSpotAdapter } from '../../integrations/crm/hubspot/adapter';
import { SalesforceAdapter } from '../../integrations/crm/salesforce/adapter';
import { Dynamics365SalesAdapter } from '../../integrations/crm/dynamics365_sales/adapter';
import { IUnifiedLead, IUnifiedOpportunity, IUnifiedResource, IntegrationCategory } from '../../integrations/core/types';

// Mock connection for demonstration - in real app, these come from DB
const mockConnection = {
  id: 'generic-crm-conn',
  provider: 'hubspot', // Default to HubSpot for this bridge
  category: IntegrationCategory.CRM,
  settings: {},
  credentials: { accessToken: 'mock-token' },
  isActive: true
};

export class CRMBridge {
  private adapters: Map<string, any> = new Map();

  constructor() {
    // Initialize adapters (lazy loading in production)
    // Using mockConnection for now to instantiate adapters
    this.adapters.set('hubspot', new HubSpotAdapter(mockConnection));
    this.adapters.set('salesforce', new SalesforceAdapter(mockConnection));
    this.adapters.set('dynamics365', new Dynamics365SalesAdapter(mockConnection));
  }

  /**
   * Aggregates leads from all connected CRMs
   */
  async getAllLeads(): Promise<IUnifiedLead[]> {
    const allLeads: IUnifiedLead[] = [];

    // In a real scenario, we'd iterate over active user connections from DB
    // Here we just mock fetching from the instantiated adapters
    
    // Simulating HubSpot Leads
    allLeads.push(...this.mockHubSpotLeads());
    
    // Simulating Salesforce Leads
    allLeads.push(...this.mockSalesforceLeads());

    return allLeads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Aggregates opportunities from all connected CRMs
   */
  async getAllOpportunities(): Promise<IUnifiedOpportunity[]> {
    const allOppts: IUnifiedOpportunity[] = [];
    allOppts.push(...this.mockOpportunities());
    return allOppts;
  }

  /**
   * Updates a lead's status in the source CRM
   */
  async updateLeadStatus(leadId: string, status: string, notes?: string): Promise<boolean> {
    console.log(`[CRMBridge] Updating lead ${leadId} to status ${status}. Notes: ${notes}`);
    // Extract provider from ID (e.g., "hubspot:123") or lookup map
    const [provider, remoteId] = leadId.split(':');
    
    if (this.adapters.has(provider)) {
      // await this.adapters.get(provider).updateResource(...)
      return true;
    }
    return false;
  }

  // --- MOCK DATA GENERATORS (Replacing actual API calls for the demo) ---

  private mockHubSpotLeads(): IUnifiedLead[] {
    return [
      {
        id: 'hubspot:101',
        remoteId: '101',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@biotech-inc.com',
        company: 'Biotech Inc.',
        status: 'NEW',
        score: 85,
        source: 'Webinar',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        updatedAt: new Date()
      },
      {
        id: 'hubspot:102',
        remoteId: '102',
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob@pharma-global.com',
        company: 'Pharma Global',
        status: 'CONTACTED',
        score: 60,
        source: 'LinkedIn',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        updatedAt: new Date()
      }
    ];
  }

  private mockSalesforceLeads(): IUnifiedLead[] {
    return [
      {
        id: 'salesforce:00Q5j000008',
        remoteId: '00Q5j000008',
        firstName: 'Charlie',
        lastName: 'Davis',
        email: 'charlie@med-devices.org',
        company: 'MedDevices Org',
        status: 'NEW',
        score: 92,
        source: 'Referral',
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        updatedAt: new Date()
      }
    ];
  }

  private mockOpportunities(): IUnifiedOpportunity[] {
    return [
      {
        id: 'hubspot:opp1',
        remoteId: 'opp1',
        title: 'Q1 Licensing Deal - Biotech Inc.',
        amount: 50000,
        currency: 'USD',
        stage: 'NEGOTIATION',
        probability: 75,
        accountId: 'hubspot:101',
        createdAt: new Date(),
        updatedAt: new Date(),
        closeDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // +30 days
      }
    ];
  }
}

export const crmBridge = new CRMBridge();
