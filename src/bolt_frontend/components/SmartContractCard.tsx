import React, { useState } from 'react';
import { Edit2, Trash2, Check, User, Coins, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import type { SmartContract, Member } from '../types/venture';
import { useVentureStore } from '../store/useVentureStore';
import { getMemberColor } from '../utils/colors';

interface SmartContractCardProps {
  contract: SmartContract;
  members: Member[];
  onEdit: (contract: SmartContract) => void;
  onDelete: (contractId: string) => void;
  ventureId: string;
}

export const SmartContractCard: React.FC<SmartContractCardProps> = ({
  contract,
  members,
  onEdit,
  onDelete,
  ventureId,
}) => {
  const [showFunders, setShowFunders] = useState(false);
  const signContract = useVentureStore((state) => state.signContract);
  const creators = useVentureStore((state) => state.creators);
  
  const owner = creators.find(c => c.id === contract.ownerId);
  const ownerIndex = members.findIndex(m => m.id === contract.ownerId);

  // Calculate progress for end date
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
    <div className="backdrop-blur-md bg-black/50 rounded-xl border border-white/10">
      {/* Header Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <img
              src={owner.imageUrl}
              alt={`${owner.firstName} ${owner.lastName}`}
              className="w-12 h-12 rounded-full border-2"
              style={{ borderColor: getMemberColor(ownerIndex) }}
            />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{contract.name}</h3>
              <p className="text-white/80 mb-4">{contract.description}</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full">
                  <User size={16} className="text-white/60" />
                  <span className="text-white text-sm">
                    Owner: {owner.firstName} {owner.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full">
                  <Coins size={16} className="text-white/60" />
                  <span className="text-white text-sm">
                    {contract.vTokens.toLocaleString()} tokens
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(contract)}
              className="p-2 text-white/80 hover:text-white transition-colors"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(contract.id)}
              className="p-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-white/80" />
            <span className="text-white/80 text-sm">
              {daysRemaining} days remaining
            </span>
          </div>
          <span className="text-white/60 text-sm">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Funders Section */}
      <div className="p-6">
        <button
          onClick={() => setShowFunders(!showFunders)}
          className="flex items-center justify-between w-full text-sm font-medium text-white/80 uppercase tracking-wider mb-4 hover:text-white transition-colors"
        >
          <span>Funders ({contract.funders.length})</span>
          {showFunders ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showFunders && (
          <div className="space-y-4">
            {contract.funders.map(funder => {
              const creator = creators.find(c => c.id === funder.memberId);
              const memberIndex = members.findIndex(m => m.id === funder.memberId);
              const memberColor = getMemberColor(memberIndex);

              if (!creator) return null;

              return (
                <div
                  key={funder.memberId}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/30 hover:bg-black/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={creator.imageUrl}
                      alt={`${creator.firstName} ${creator.lastName}`}
                      className="w-10 h-10 rounded-full border-2"
                      style={{ borderColor: memberColor }}
                    />
                    <div>
                      <span className="text-white font-medium">
                        {creator.firstName} {creator.lastName}
                      </span>
                    </div>
                  </div>
                  <span className="font-medium text-white">
                    {funder.tokens.toLocaleString()} tokens
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {!contract.signedAt && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => signContract(ventureId, contract.id)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
            >
              <Check size={16} />
              Sign Contract
            </button>
          </div>
        )}

        {contract.signedAt && (
          <div className="mt-6 flex items-center gap-2 text-green-400">
            <Check size={16} />
            <span className="text-sm">
              Signed on {new Date(contract.signedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};