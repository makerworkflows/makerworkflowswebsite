
import { procureService } from './service';

async function verifyProcureTrack() {
  console.log('🛒 Verifying ProcureTrack AI...\n');

  // 1. Fetch Requisitions
  console.log('1. Fetching Requisitions...');
  const reqs = await procureService.getRequisitions();
  console.log(`✅ Loaded ${reqs.length} active requisitions.`);
  
  const pendingReq = reqs.find(r => r.status === 'PENDING');
  if (!pendingReq) {
      console.warn('⚠️ No PENDING requisitions to test PO generation.');
      return;
  }

  // 2. Test PO Generation
  console.log(`\n2. Generating PO for Requisition #${pendingReq.id}...`);
  const po = await procureService.generatePO(pendingReq.id);

  if (po && po.poNumber.startsWith('PO-')) {
      console.log(`✅ PO Generated: ${po.poNumber}`);
      console.log(`   - Vendor: ${po.vendorId}`);
      console.log(`   - Total: $${po.totalAmount.toFixed(2)}`);
      
      // Verify Status Update
      const updatedReqs = await procureService.getRequisitions();
      const updatedReq = updatedReqs.find(r => r.id === pendingReq.id);
      if (updatedReq?.status === 'PO_GENERATED') {
          console.log('✅ Requisition status updated to PO_GENERATED.');
      } else {
          console.error('❌ Requisition status NOT updated.');
      }

  } else {
      console.error('❌ Failed to generate PO.');
  }

  console.log('\n✨ ProcureTrack Verification Complete.');
}

verifyProcureTrack();
