
export interface IIngredient {
  id: string;
  name: string;
  costPerKg: number;
  caloriesPer100g: number;
  defaultQty?: number; // percentage or weight
}

export interface IRecipeItem {
  ingredient: IIngredient;
  quantity: number; // grams
}

export interface IRecipe {
  id: string;
  name: string;
  targetWeight: number; // grams
  items: IRecipeItem[];
}

// Mock Database of Ingredients
const INGREDIENT_DB: IIngredient[] = [
  { id: 'i1', name: 'Whey Protein Isolate', costPerKg: 15.50, caloriesPer100g: 370 },
  { id: 'i2', name: 'Oat Flour', costPerKg: 2.20, caloriesPer100g: 389 },
  { id: 'i3', name: 'Cocoa Powder', costPerKg: 8.90, caloriesPer100g: 228 },
  { id: 'i4', name: 'Stevia Extract', costPerKg: 45.00, caloriesPer100g: 0 },
  { id: 'i5', name: 'Taurine', costPerKg: 6.50, caloriesPer100g: 0 },
  { id: 'i6', name: 'Caffeine Anhydrous', costPerKg: 12.00, caloriesPer100g: 0 },
  { id: 'i7', name: 'Vitamin B12 Premix', costPerKg: 25.00, caloriesPer100g: 0 },
  { id: 'i8', name: 'Water', costPerKg: 0.01, caloriesPer100g: 0 },
  { id: 'i9', name: 'Citric Acid', costPerKg: 3.50, caloriesPer100g: 250 },
];

export class FormulaService {

  /**
   * Returns a list of all available ingredients
   */
  getIngredients(): IIngredient[] {
    return INGREDIENT_DB;
  }

  /**
   * Simulates AI suggesting ingredients based on product type
   */
  async suggestIngredients(productType: string): Promise<IIngredient[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const type = productType.toLowerCase();
    
    if (type.includes('protein')) {
      return INGREDIENT_DB.filter(i => ['i1', 'i2', 'i3', 'i4'].includes(i.id));
    }
    if (type.includes('energy') || type.includes('drink')) {
      return INGREDIENT_DB.filter(i => ['i5', 'i6', 'i7', 'i8', 'i9', 'i4'].includes(i.id));
    }
    
    // Default fallback
    return [INGREDIENT_DB[0], INGREDIENT_DB[7]]; 
  }

  /**
   * Calculates total cost of the recipe
   */
  calculateCost(items: IRecipeItem[]): number {
    return items.reduce((total, item) => {
      const cost = (item.quantity / 1000) * item.ingredient.costPerKg;
      return total + cost;
    }, 0);
  }

  /**
   * Calculates nutritional value (Calories)
   */
  calculateCalories(items: IRecipeItem[]): number {
     return items.reduce((total, item) => {
      const cals = (item.quantity / 100) * item.ingredient.caloriesPer100g;
      return total + cals;
    }, 0);
  }
}

export const formulaService = new FormulaService();
