import React, { useState } from 'react';
import { Coins, Wallet, Briefcase } from 'lucide-react';
import type { Member, SmartContract, Venture } from '../types/venture';
import type { Creator } from '../types/creator';
import { getMemberColor } from '../utils/colors';
import { calculateTokenBalance, formatTokenAmount } from '../utils/tokenCalculations';
import { TokenHolderTransactionsModal } from './TokenHolderTransactionsModal';

interface CoCreatorsListProps {
  venture: Venture;
  creators: Creator[];
}

export const CoCreatorsList: React.FC<CoCreatorsListProps> = ({ venture, creators }) => {
  const [selectedMember, setSelectedMember] = useState<{member: Member, creator: Creator} | null>(null);

  const getTokenHolders = () => {
    const holderMap = new Map<string, {
      creator: Creator;
      isFounder: boolean;
      isContractOwner: boolean;
      vTokens: number;
      aTokens: number;
      member: Member;
    }>();

    // Add all members first
    venture.members.forEach(member => {
      const creator = creators.find(c => c.id === member.id);
      if (!creator) return;

      const vTokenBalance = calculateTokenBalance(
        member.id,
        member.initialTokens || 0,
        venture.smartContracts || []
      );

      holderMap.set(member.id, {
        creator,
        isFounder: member.role === 'Founder',
        isContractOwner: false,
        vTokens: vTokenBalance.currentBalance,
        aTokens: member.aTokens || 0,
        member
      });
    });

    // Update contract owners
    (venture.smartContracts || []).forEach(contract => {
      if (!contract.signedAt) return;

      const owner = creators.find(c => c.id === contract.ownerId);
      if (!owner) return;

      if (!holderMap.has(contract.ownerId)) {
        // Create new member if not exists
        const newMember: Member = {
          id: owner.id,
          name: `${owner.firstName} ${owner.lastName}`,
          imageUrl: owner.imageUrl,
          role: 'Co-Creator',
          vTokens: 0,
          aTokens: 0
        };
        venture.members.push(newMember);

        const vTokenBalance = calculateTokenBalance(
          owner.id,
          0,
          venture.smartContracts || []
        );

        holderMap.set(owner.id, {
          creator: owner,
          isFounder: false,
          isContractOwner: true,
          vTokens: vTokenBalance.currentBalance,
          aTokens: 0,
          member: newMember
        });
      } else {
        const holder = holderMap.get(contract.ownerId)!;
        holder.isContractOwner = true;
      }
    });

    // Filter out holders with no tokens
    return Array.from(holderMap.values()).filter(holder => 
      holder.vTokens > 0 || holder.aTokens > 0 || holder.isFounder
    );
  };

  const tokenHolders = getTokenHolders();

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-sage-200/50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tokenHolders.map((holder, index) => (
          <div
            key={holder.creator.id}
            onClick={() => setSelectedMember({ member: holder.member, creator: holder.creator })}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-sage-100 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <img
                src={holder.creator.imageUrl}
                alt={`${holder.creator.firstName} ${holder.creator.lastName}`}
                className="w-16 h-16 rounded-full border-2"
                style={{ borderColor: getMemberColor(index) }}
              />
              <div className="flex-1">
                <h3 className="font-medium text-sage-900">
                  {holder.creator.firstName} {holder.creator.lastName}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {holder.isFounder && (
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      Founder
                    </span>
                  )}
                  {holder.isContractOwner && (
                    <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                      Contract Owner
                    </span>
                  )}
                </div>
                
                <div className="space-y-2">
                  {holder.vTokens > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Wallet size={14} className="text-coral-500" />
                      <span className="text-sage-700">
                        {formatTokenAmount(holder.vTokens)} V Tokens
                      </span>
                    </div>
                  )}
                  {holder.aTokens > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase size={14} className="text-sand-500" />
                      <span className="text-sage-700">
                        {formatTokenAmount(holder.aTokens)} A Tokens
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMember && (
        <TokenHolderTransactionsModal
          member={selectedMember.member}
          creator={selectedMember.creator}
          venture={venture}
          creators={creators}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
};