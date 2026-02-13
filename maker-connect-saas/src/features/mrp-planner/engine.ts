
export interface IProduct {
  sku: string;
  name: string;
  bom: { ingredientId: string; quantity: number }[]; // quantity per unit
}

export interface IInventory {
  ingredientId: string;
  quantityOnHand: number;
}

export interface IProductionOrder {
  orderId: string;
  productSku: string;
  quantityToProduce: number;
}

export interface IMaterialNeed {
  ingredientId: string;
  required: number;
  onHand: number;
  shortage: number;
  status: 'OK' | 'SHORTAGE';
}

// Mock Data
const PRODUCTS: IProduct[] = [
  {
    sku: 'PRO-BAR-CHOCO',
    name: 'Chocolate Protein Bar',
    bom: [
      { ingredientId: 'i1', quantity: 20 }, // 20g Whey
      { ingredientId: 'i3', quantity: 10 }, // 10g Cocoa
    ]
  },
  {
    sku: 'ENG-DRINK-CITRUS',
    name: 'Citrus Energy Drink',
    bom: [
      { ingredientId: 'i9', quantity: 5 }, // 5g Citric Acid
      { ingredientId: 'i6', quantity: 0.2 }, // 200mg Caffeine
    ]
  }
];

const INVENTORY: IInventory[] = [
  { ingredientId: 'i1', quantityOnHand: 5000 }, // 5kg Whey
  { ingredientId: 'i3', quantityOnHand: 200 },  // 200g Cocoa (Low!)
  { ingredientId: 'i9', quantityOnHand: 1000 },
  { ingredientId: 'i6', quantityOnHand: 500 },
];

export class MRPEngine {
  
  /**
   * Explodes the BOM for a list of production orders and checks inventory
   */
  calculateNeeds(orders: IProductionOrder[]): IMaterialNeed[] {
    const totalNeeds: Record<string, number> = {};

    // 1. Calculate Aggregate Demand
    orders.forEach(order => {
      const product = PRODUCTS.find(p => p.sku === order.productSku);
      if (!product) return;

      product.bom.forEach(item => {
        const totalQty = item.quantity * order.quantityToProduce;
        totalNeeds[item.ingredientId] = (totalNeeds[item.ingredientId] || 0) + totalQty;
      });
    });

    // 2. Compare against Inventory
    return Object.entries(totalNeeds).map(([ingId, required]) => {
      const inv = INVENTORY.find(i => i.ingredientId === ingId);
      const onHand = inv ? inv.quantityOnHand : 0;
      const shortage = Math.max(0, required - onHand);

      return {
        ingredientId: ingId,
        required,
        onHand,
        shortage,
        status: shortage > 0 ? 'SHORTAGE' : 'OK'
      };
    });
  }

  getProductList() { return PRODUCTS; }
}

export const mrpEngine = new MRPEngine();
