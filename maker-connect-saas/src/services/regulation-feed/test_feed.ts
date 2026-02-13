
import { regulationFeed } from './service';

async function verifyCompliancePulse() {
  console.log('🛡️ Verifying Compliance Pulse...\n');

  // 1. Fetch Updates
  console.log('1. Fetching Regulatory Updates...');
  const updates = await regulationFeed.getLatestUpdates();
  
  if (updates.length > 0) {
    console.log(`✅ Successfully fetched ${updates.length} updates.`);
    console.log(`   - Latest: ${updates[0].title} (${updates[0].source})`);
  } else {
    console.error('❌ Failed to fetch updates.');
    process.exit(1);
  }

  // 2. Test Filters
  console.log('\n2. Testing Category Filter...');
  const foodUpdates = await regulationFeed.getUpdatesByCategory('Food');
  console.log(`✅ Parsed ${foodUpdates.length} 'Food' validation rules.`);
  
  if (foodUpdates.every(u => u.category === 'Food')) {
     console.log('   - Filter logic correct.');
  } else {
     console.error('❌ Filter logic incorrect.');
  }

  console.log('\n✨ Compliance Pulse Verification Complete.');
}

verifyCompliancePulse();
