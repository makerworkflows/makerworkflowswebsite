
import { crmBridge } from '../crm-bridge';
import { IUnifiedLead, IUnifiedOpportunity } from '../../../integrations/core/types';

export interface IAgentResponse {
  text: string;
  suggestedActions?: string[];
  data?: any;
}

export class SalesAgentService {
  
  /**
   * Analyzes a specific lead and generates insights
   */
  async qualifyLead(leadId: string): Promise<IAgentResponse> {
    const leads = await crmBridge.getAllLeads();
    const lead = leads.find(l => l.id === leadId);

    if (!lead) {
      return { text: `Lead ${leadId} not found.` };
    }

    // Mock AI Analysis
    const isHot = (lead.score || 0) > 80;
    const sentiment = isHot ? "High intent" : "Needs nurturing";
    
    return {
      text: `Analysis for ${lead.firstName} ${lead.lastName} at ${lead.company}:\n- Score: ${lead.score}\n- Signal: ${sentiment}\n\nRecommended Action: ${isHot ? 'Schedule Demo immediately.' : 'Send whitepaper and follow up in 3 days.'}`,
      suggestedActions: isHot ? ['Schedule Meeting', 'Send Contract'] : ['Enroll in Nurture Sequence', 'Send Case Study']
    };
  }

  /**
   * Generates a personalized outreach email
   */
  async generateOutreach(leadId: string): Promise<IAgentResponse> {
    const leads = await crmBridge.getAllLeads();
    const lead = leads.find(l => l.id === leadId);

    if (!lead) return { text: "Lead not found" };

    const emailSubject = `Partnership opportunity: ${lead.company} + Maker Connect`;
    const emailBody = `Hi ${lead.firstName},\n\nI noticed ${lead.company} is expanding its compliance operations. Based on your recent webinar attendance, I thought you might be interested in how our new Blockchain Trust Layer can automate your 21 CFR Part 11 audit trails.\n\nAre you free for a 10-minute chat this Thursday?\n\nBest,\nGuillermo`;

    return {
      text: `Draft Email generated used Context: ${lead.source}\n\nSubject: ${emailSubject}\n\nBody:\n${emailBody}`,
      suggestedActions: ['Send via Gmail', 'Send via HubSpot', 'Edit Draft']
    };
  }

  /**
   * Main conversational interface for the agent
   */
  async chatWithAgent(query: string): Promise<IAgentResponse> {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('hottest') || lowerQuery.includes('top leads')) {
      const leads = await crmBridge.getAllLeads();
      const topLeads = leads.filter(l => (l.score || 0) > 80);
      
      const list = topLeads.map(l => `- ${l.firstName} ${l.lastName} (${l.company}) [Score: ${l.score}]`).join('\n');
      
      return {
        text: `Here are your hottest leads right now:\n${list}`,
        data: topLeads
      };
    }

    if (lowerQuery.includes('pipeline') || lowerQuery.includes('revenue')) {
      const opps = await crmBridge.getAllOpportunities();
      const total = opps.reduce((sum, op) => sum + op.amount, 0);
      
      return {
        text: `Current Pipeline Value: $${total.toLocaleString()}.\nYou have ${opps.length} active deals in negotiation.`,
        data: opps
      };
    }

    return {
      text: "I can help you analyze leads, draft emails, or check your pipeline. Try asking 'Who are my top leads?' or 'Check pipeline status'."
    };
  }
}

export const salesAgent = new SalesAgentService();
