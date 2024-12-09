import React from 'react';
import { Users } from 'lucide-react';
import type { Venture } from '../types/venture';
import { getMemberColor } from '../utils/colors';
import { useVentureStore } from '../store/useVentureStore';
import { getActiveMembers } from '../utils/memberUtils';

interface VentureCardProps {
  venture: Venture;
  onClick: () => void;
}

export const VentureCard: React.FC<VentureCardProps> = ({ venture, onClick }) => {
  const creators = useVentureStore((state) => state.creators);
  const activeMembers = getActiveMembers(venture, creators);
  const displayMembers = activeMembers.slice(0, 3);
  const remainingCount = Math.max(0, activeMembers.length - 3);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer backdrop-blur-md bg-black/30 dark:bg-gray-800/30 rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] border border-white/10"
    >
      <div className="flex flex-col h-full">
        <div className="mb-6 h-48 rounded-2xl overflow-hidden">
          {venture.bannerUrl ? (
            <img
              src={venture.bannerUrl}
              alt={venture.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : venture.ventureImage ? (
            <img
              src={venture.ventureImage}
              alt={venture.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20" />
          )}
        </div>
        
        <div className="flex items-center mb-6">
          <div className="flex -space-x-3">
            {displayMembers.map((creator, index) => (
              <div
                key={creator.id}
                className="w-12 h-12 rounded-full overflow-hidden relative"
                style={{
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: getMemberColor(index),
                  zIndex: displayMembers.length - index
                }}
              >
                <img
                  src={creator.imageUrl}
                  alt={`${creator.firstName} ${creator.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {remainingCount > 0 && (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center bg-black/50 border-2 border-white/20 text-white text-sm font-medium relative"
                style={{ zIndex: 0 }}
              >
                +{remainingCount}
              </div>
            )}
          </div>
          <div className="ml-4 flex items-center text-white/80 text-sm">
            <Users size={16} className="mr-1" />
            <span>{activeMembers.length} active members</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-display font-light mb-3 text-white">{venture.name}</h2>
        <p className="text-white/80 text-sm leading-relaxed">{venture.description}</p>
      </div>
    </div>
  );
};