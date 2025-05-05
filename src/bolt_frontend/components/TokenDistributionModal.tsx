import React from 'react';
import { X } from 'lucide-react';
import { TokenDistributionChart } from './TokenDistributionChart';
import type { Member } from '../types/venture';

interface TokenDistributionModalProps {
  members: Member[];
  vTokenTreasury: number;
  aTokenTreasury: number;
  totalTokens: number;
  tokenType: 'V' | 'A';
  onClose: () => void;
}

export const TokenDistributionModal: React.FC<TokenDistributionModalProps> = ({
  members,
  vTokenTreasury,
  aTokenTreasury,
  totalTokens,
  tokenType,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/30 p-8 rounded-3xl border border-white/10 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            {tokenType} Token Distribution
          </h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <TokenDistributionChart
          members={members}
          vTokenTreasury={vTokenTreasury}
          aTokenTreasury={aTokenTreasury}
          totalTokens={totalTokens}
          tokenType={tokenType}
        />
      </div>
    </div>
  );
};