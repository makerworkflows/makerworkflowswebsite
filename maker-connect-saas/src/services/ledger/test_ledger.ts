
import { ledgerService } from './service';

async function testLedger() {
  console.log('Testing LedgerService...');

  try {
    // 1. Record a test entry
    console.log('Recording entry 1...');
    const entry1 = await ledgerService.recordEntry({
      event: 'TEST_EVENT',
      details: 'First test entry',
      user: 'test_user_1'
    });
    console.log('Entry 1 recorded:', entry1.id);

    // 2. Record another entry
    console.log('Recording entry 2...');
    const entry2 = await ledgerService.recordEntry({
      event: 'TEST_EVENT_2',
      details: 'Second test entry',
      user: 'test_user_2'
    });
    console.log('Entry 2 recorded:', entry2.id);

    // 3. Verify chain
    console.log('Verifying chain...');
    const isValid = await ledgerService.verifyChain();
    if (isValid) {
      console.log('✅ Ledger chain is valid.');
    } else {
      console.error('❌ Ledger chain verification FAILED.');
      process.exit(1);
    }

    // 4. Print chain
    console.log('Current Chain:', JSON.stringify(ledgerService.getChain(), null, 2));

  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testLedger();
