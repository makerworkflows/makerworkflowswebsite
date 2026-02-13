
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Wand2, Plus, Trash2, Beaker } from 'lucide-react';
import { formulaService, IRecipeItem, IIngredient } from '../formulate-smart/service';

export function RecipeEditor() {
  const [productName, setProductName] = useState('New Formula');
  const [targetType, setTargetType] = useState('Protein Bar');
  const [items, setItems] = useState<IRecipeItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAISuggest = async () => {
    setLoading(true);
    try {
      const suggestions = await formulaService.suggestIngredients(targetType);
      
      // Auto-fill with some default quantities
      const newItems = suggestions.map(ing => ({
        ingredient: ing,
        quantity: ing.name === 'Water' ? 500 : 50 // simplistic default
      }));
      
      setItems(newItems);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (index: number, newQty: number) => {
    const newItems = [...items];
    newItems[index].quantity = newQty;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalCost = formulaService.calculateCost(items);
  const totalCals = formulaService.calculateCalories(items);
  const totalWeight = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Editor Panel */}
      <Card className="lg:col-span-2 border-slate-200">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Beaker className="w-5 h-5 text-purple-600" />
              Formula Editor
            </CardTitle>
            <div className="flex gap-2">
              <Input 
                className="w-48 bg-white" 
                value={targetType} 
                onChange={e => setTargetType(e.target.value)} 
                placeholder="Product Type (e.g. Energy Drink)"
              />
              <Button 
                onClick={handleAISuggest} 
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {loading ? 'Thinking...' : 'AI Suggest'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Formula Name</Label>
            <Input value={productName} onChange={e => setProductName(e.target.value)} />
          </div>

          <div className="space-y-4 mt-6">
             <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm font-semibold text-slate-500">Ingredient</span>
                <span className="text-sm font-semibold text-slate-500">Qty (g)</span>
             </div>
             
             {items.length === 0 && (
               <div className="text-center py-10 text-slate-400 border-2 border-dashed rounded-lg">
                 No ingredients. Use AI Suggest or add manually.
               </div>
             )}

             {items.map((item, idx) => (
               <div key={item.ingredient.id} className="flex items-center gap-4">
                 <div className="flex-1">
                   <div className="font-medium">{item.ingredient.name}</div>
                   <div className="text-xs text-slate-500">${item.ingredient.costPerKg.toFixed(2)}/kg</div>
                 </div>
                 <div className="w-32">
                   <Input 
                     type="number" 
                     value={item.quantity} 
                     onChange={e => updateQuantity(idx, parseFloat(e.target.value) || 0)} 
                   />
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600">
                   <Trash2 className="w-4 h-4" />
                 </Button>
               </div>
             ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Panel */}
      <Card className="h-fit bg-slate-900 text-white border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <div>
             <div className="text-slate-400 text-sm">Total Weight</div>
             <div className="text-3xl font-bold">{totalWeight.toFixed(1)} <span className="text-lg font-normal text-slate-500">g</span></div>
           </div>
           
           <Separator className="bg-slate-700" />
           
           <div>
             <div className="text-slate-400 text-sm">Estimated Cost</div>
             <div className="text-3xl font-bold text-green-400">${totalCost.toFixed(3)}</div>
             <div className="text-xs text-slate-500">per batch</div>
           </div>

           <Separator className="bg-slate-700" />

           <div>
             <div className="text-slate-400 text-sm">Nutritional Profile</div>
             <div className="flex justify-between items-center mt-2">
                <span>Calories</span>
                <span className="font-bold">{totalCals.toFixed(0)} kcal</span>
             </div>
           </div>
           
           <Button className="w-full mt-4 bg-white text-slate-900 hover:bg-slate-200">
             Save Formula
           </Button>
        </CardContent>
      </Card>

    </div>
  );
}
