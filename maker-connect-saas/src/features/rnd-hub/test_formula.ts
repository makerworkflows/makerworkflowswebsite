
import { formulaService } from './formulate-smart/service';

async function verifyFormulateSmart() {
  console.log('🧪 Verifying FormulateSmart AI...\n');

  // 1. Test AI Suggestions
  console.log('1. Testing AI Ingredient Suggestions...');
  const proteinSuggestions = await formulaService.suggestIngredients('Protein Bar');
  console.log(`- Request: "Protein Bar" -> Suggestions: ${proteinSuggestions.map(i => i.name).join(', ')}`);
  
  if (proteinSuggestions.some(i => i.name === 'Whey Protein Isolate')) {
      console.log('✅ AI correctly suggested Whey Protein.');
  } else {
      console.error('❌ AI failed to suggest relevant ingredients.');
  }

  const energySuggestions = await formulaService.suggestIngredients('Energy Drink');
  console.log(`- Request: "Energy Drink" -> Suggestions: ${energySuggestions.map(i => i.name).join(', ')}`);

  // 2. Test Calculations
  console.log('\n2. Testing Math Engine...');
  
  // Mock Recipe: 100g Whey ($15.50/kg) + 50g Cocoa ($8.90/kg)
  // Cost: (0.1 * 15.50) + (0.05 * 8.90) = 1.55 + 0.445 = 1.995
  const mockItems = [
      { ingredient: { id: 'i1', name: 'Whey', costPerKg: 15.50, caloriesPer100g: 370 }, quantity: 100 },
      { ingredient: { id: 'i3', name: 'Cocoa', costPerKg: 8.90, caloriesPer100g: 228 }, quantity: 50 }
  ];

  const value = formulaService.calculateCost(mockItems as any);
  console.log(`- Calculated Cost: $${value.toFixed(3)} (Expected: ~$1.995)`);

  if (Math.abs(value - 1.995) < 0.01) {
      console.log('✅ Cost calculation is accurate.');
  } else {
      console.error('❌ Cost calculation is WRONG.');
  }

  console.log('\n✨ FormulateSmart Verification Complete.');
}

verifyFormulateSmart();
