import React from 'react';
import { Calendar, User, Coins } from 'lucide-react';
import type { SmartContract, Member } from '../types/venture';
import { getMemberColor } from '../utils/colors';
import { useVentureStore } from '../store/useVentureStore';

interface SmartContractPreviewProps {
  contract: SmartContract;
  members: Member[];
  onClick: () => void;
}

export const SmartContractPreview: React.FC<SmartContractPreviewProps> = ({
  contract,
  members,
  onClick,
}) => {
  const creators = useVentureStore((state) => state.creators);
  const owner = creators.find(c => c.id === contract.ownerId);
  const ownerIndex = members.findIndex(m => m.id === contract.ownerId);

  // Calculate progress
  const startDate = contract.signedAt || new Date(contract.createdAt);
  const endDate = new Date(contract.endDate);
  const today = new Date();
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progress = Math.min(Math.max((daysElapsed / totalDays) * 100, 0), 100);
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Calculate progress color
  const getProgressColor = () => {
    if (progress >= 90) return 'bg-red-500';
    if (progress >= 70) return 'bg-orange-500';
    return 'bg-emerald-500';
  };

  if (!owner) return null;

  return (
    <div 
      onClick={onClick}
      className="backdrop-blur-md bg-black/50 rounded-xl border border-white/10 p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300"
    >
      <div className="flex items-start gap-4 mb-4">
        <img
          src={owner.imageUrl}
          alt={`${owner.firstName} ${owner.lastName}`}
          className="w-12 h-12 rounded-full border-2"
          style={{ borderColor: getMemberColor(ownerIndex) }}
        />
        <div>
          <h3 className="text-xl font-display text-white mb-2">{contract.name}</h3>
          <p className="text-white/80 text-sm line-clamp-2 mb-3">{contract.description}</p>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full">
              <User size={14} className="text-white/60" />
              <span className="text-white text-sm">
                {owner.firstName} {owner.lastName}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full">
              <Coins size={14} className="text-white/60" />
              <span className="text-white text-sm">
                {contract.vTokens.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-white/80" />
            <span className="text-white/80 text-sm">
              {daysRemaining} days remaining
            </span>
          </div>
          <span className="text-white/60 text-sm">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {contract.signedAt && (
        <div className="mt-4 text-sm text-green-400">
          Signed on {new Date(contract.signedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};