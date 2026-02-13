
import React from 'react';
import { RecipeEditor } from '@/features/rnd-hub/components/recipe-editor';

export default function RnDHubPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">R&D Innovate Hub</h1>
        <p className="text-slate-500">Design, analyze, and cost new product formulations with AI assistance.</p>
      </div>
      
      <RecipeEditor />
    </div>
  );
}
