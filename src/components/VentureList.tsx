import React from 'react';
import { VentureCard } from './VentureCard';
import { useVentureStore } from '../store/useVentureStore';

export const VentureList: React.FC = () => {
  const ventures = useVentureStore((state) => state.ventures);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-8 py-12">
      {ventures.map((venture) => (
        <VentureCard key={venture.id} venture={venture} />
      ))}
    </div>
  );
};