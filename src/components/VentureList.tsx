import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VentureCard } from './VentureCard';
import { useVentures } from '../hooks/useVentures';
import { useAuth } from '../hooks/useAuth';

export const VentureList: React.FC = () => {
  const { ventures, loading } = useVentures();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleVentureClick = (ventureId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/venture/${ventureId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-coral-500" />
      </div>
    );
  }

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