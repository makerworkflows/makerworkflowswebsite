
import { IUnifiedResource } from '../../integrations/core/types';

export interface IRegulatoryUpdate {
  id: string;
  title: string;
  summary: string;
  source: 'FDA' | 'ISO' | 'Federal Register' | 'Other';
  link: string;
  publishedDate: Date;
  category: 'Food' | 'Drug' | 'Device' | 'General';
}

export class RegulationFeedService {
  
  /**
   * Fetches latest regulatory updates
   * In a real app, this would use an RSS parser like 'rss-parser'
   */
  async getLatestUpdates(): Promise<IRegulatoryUpdate[]> {
    // Mock Data for Demo
    return [
      {
        id: 'fda-1',
        title: 'FDA Finalizes Rule on Laboratory Accreditation for Analyses of Foods',
        summary: ' The FDA is issuing a final rule to establish a laboratory accreditation for analyses of foods program.',
        source: 'FDA',
        link: 'https://www.fda.gov/food/cfsan-constituent-updates',
        publishedDate: new Date(),
        category: 'Food'
      },
      {
        id: 'fr-1',
        title: 'Current Good Manufacturing Practice, Hazard Analysis, and Risk-Based Preventive Controls for Human Food',
        summary: 'Clarification on supply-chain program requirements.',
        source: 'Federal Register',
        link: 'https://www.federalregister.gov/',
        publishedDate: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        category: 'Food'
      },
      {
        id: 'iso-1',
        title: 'ISO 13485:2016 - Medical devices — Quality management systems — Requirements for regulatory purposes',
        summary: 'New guidance on audit trails for digital QMS systems.',
        source: 'ISO',
        link: 'https://www.iso.org/standard/59752.html',
        publishedDate: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        category: 'Device'
      }
    ];
  }

  /**
   * Filters updates by category
   */
  async getUpdatesByCategory(category: IRegulatoryUpdate['category']): Promise<IRegulatoryUpdate[]> {
    const all = await this.getLatestUpdates();
    return all.filter(u => u.category === category);
  }
}

export const regulationFeed = new RegulationFeedService();
