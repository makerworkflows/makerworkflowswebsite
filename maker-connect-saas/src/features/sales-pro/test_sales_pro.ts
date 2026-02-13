
import { salesAgent } from './agent/service';
import { crmBridge } from './crm-bridge';

async function verifySalesPro() {
  console.log('🚀 Verifying SalesPro 2.0 Features...\n');

  // 1. Verify CRM Bridge
  console.log('1. Testing CRM Bridge Aggregation...');
  const leads = await crmBridge.getAllLeads();
  console.log(`✅ Fetched ${leads.length} leads from disparate sources (HubSpot/Salesforce).`);
  if (leads.length > 0) {
    console.log(`   - Sample Lead: ${leads[0].firstName} ${leads[0].lastName} from ${leads[0].company} (Score: ${leads[0].score})`);
  }

  const opps = await crmBridge.getAllOpportunities();
  console.log(`✅ Fetched ${opps.length} opportunities.`);

  // 2. Verify AI Agent - Lead Qualification
  console.log('\n2. Testing AI Agent - Lead Qualification...');
  const hotLead = leads.find(l => (l.score || 0) > 80);
  if (hotLead) {
    const analysis = await salesAgent.qualifyLead(hotLead.id);
    console.log(`✅ Analysis for ${hotLead.firstName}:\n${analysis.text}`);
  } else {
    console.warn('⚠️ No hot leads found to test qualification.');
  }

  // 3. Verify AI Agent - Outreach Generation
  console.log('\n3. Testing AI Agent - Generative Outreach...');
  if (leads.length > 0) {
    const outreach = await salesAgent.generateOutreach(leads[0].id);
    console.log(`✅ Generated Email Draft (Snippet):\n${outreach.text.substring(0, 100)}...`);
  }

  // 4. Verify AI Agent - Chat Interface Logic
  console.log('\n4. Testing AI Agent - Chat Logic...');
  const chatResponse = await salesAgent.chatWithAgent('Who are my hottest leads?');
  console.log(`✅ Chat Response:\n${chatResponse.text}`);

  console.log('\n✨ SalesPro 2.0 Verification Complete.');
}

verifySalesPro();
