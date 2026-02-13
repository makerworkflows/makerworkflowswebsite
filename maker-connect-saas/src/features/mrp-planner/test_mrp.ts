
import { mrpEngine, IProductionOrder } from './engine';

async function verifyMRP() {
  console.log('🏭 Verifying MRP Smart Planner...\n');

  // 1. Define Production Scenario
  const orders: IProductionOrder[] = [
      { orderId: 'o1', productSku: 'PRO-BAR-CHOCO', quantityToProduce: 100 }, // Needs 2000g Whey, 1000g Cocoa
      { orderId: 'o2', productSku: 'ENG-DRINK-CITRUS', quantityToProduce: 500 } // Needs 2500g Citric, 100g Caffeine
  ];

  console.log('1. Calculating Material Needs for:');
  orders.forEach(o => console.log(`   - ${o.productSku}: ${o.quantityToProduce} units`));

  // 2. Run Engine
  const needs = mrpEngine.calculateNeeds(orders);
  
  // 3. Verify Results
  console.log('\n2. Checking Inventory & Shortages...');
  
  // Check Whey (Should be OK)
  // 100 bars * 20g = 2000g required. On hand = 5000g.
  const whey = needs.find(n => n.ingredientId === 'i1');
  if (whey && whey.status === 'OK') {
      console.log(`✅ Whey Protein: Required ${whey.required}g, OnHand ${whey.onHand}g -> OK`);
  } else {
      console.error(`❌ Whey Protein Logic Failed: ${JSON.stringify(whey)}`);
  }

  // Check Cocoa (Should be SHORTAGE)
  // 100 bars * 10g = 1000g required. On hand = 200g. Shortage = 800g.
  const cocoa = needs.find(n => n.ingredientId === 'i3');
  if (cocoa && cocoa.status === 'SHORTAGE' && cocoa.shortage === 800) {
      console.log(`✅ Cocoa Powder: Required ${cocoa.required}g, OnHand ${cocoa.onHand}g -> SHORTAGE (-800g) detected.`);
  } else {
      console.error(`❌ Cocoa Powder Logic Failed: ${JSON.stringify(cocoa)}`);
  }

  console.log('\n✨ MRP Verification Complete.');
}

verifyMRP();
