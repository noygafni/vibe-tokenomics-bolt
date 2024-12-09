import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VentureCard } from './VentureCard';
import { useVentureStore } from '../store/useVentureStore';
import { useAuth } from '../hooks/useAuth';

export const VentureList: React.FC = () => {
  const ventures = useVentureStore((state) => state.ventures);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleVentureClick = (ventureId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/venture/${ventureId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-8 py-12">
      {ventures.map((venture) => (
        <VentureCard 
          key={venture.id} 
          venture={venture} 
          onClick={() => handleVentureClick(venture.id)}
        />
      ))}
    </div>
  );
};