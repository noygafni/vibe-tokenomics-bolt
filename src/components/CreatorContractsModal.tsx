import React from 'react';
import { X, ArrowUpRight, ArrowDownRight, Coins, User } from 'lucide-react';
import type { Creator } from '../types/creator';
import type { Venture } from '../types/venture';
import { calculateTokenBalance } from '../utils/tokenCalculations';
import { getMemberColor } from '../utils/colors';

interface CreatorContractsModalProps {
  creator: Creator;
  ventures: Venture[];
  onClose: () => void;
}

export const CreatorContractsModal: React.FC<CreatorContractsModalProps> = ({
  creator,
  ventures,
  onClose,
}) => {
  const getAllTransactions = () => {
    const transactions = [];

    ventures.forEach(venture => {
      const member = venture.members?.find(m => m.id === creator.id);
      
      // Add initial token allocation for founders
      if (member?.role === 'Founder' && member.initialTokens) {
        transactions.push({
          ventureId: venture.id,
          ventureName: venture.name,
          type: 'initial',
          amount: member.initialTokens,
          date: venture.createdAt,
          description: `Initial Token Allocation in ${venture.name}`,
        });
      }

      // Add contract transactions
      venture.smartContracts?.forEach(contract => {
        if (!contract.signedAt) return;

        // Tokens received as contract owner
        if (contract.ownerId === creator.id) {
          transactions.push({
            ventureId: venture.id,
            ventureName: venture.name,
            type: 'received',
            amount: contract.vTokens,
            date: contract.signedAt,
            description: `Received from contract: ${contract.name}`,
            contractName: contract.name,
            ownerName: member?.name || creator.firstName
          });
        }

        // Tokens spent as funder
        const funder = contract.funders.find(f => f.memberId === creator.id);
        if (funder) {
          const contractOwner = venture.members.find(m => m.id === contract.ownerId);
          transactions.push({
            ventureId: venture.id,
            ventureName: venture.name,
            type: 'spent',
            amount: funder.tokens,
            date: contract.signedAt,
            description: `Funded contract: ${contract.name}`,
            contractName: contract.name,
            ownerName: contractOwner?.name || 'Unknown'
          });
        }
      });
    });

    // Sort transactions by date
    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const getTotalBalance = () => {
    let total = 0;
    ventures.forEach(venture => {
      const member = venture.members?.find(m => m.id === creator.id);
      const balance = calculateTokenBalance(
        creator.id,
        member?.initialTokens || 0,
        venture.smartContracts || []
      );
      total += balance.currentBalance;
    });
    return total;
  };

  const transactions = getAllTransactions();
  const totalBalance = getTotalBalance();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-black/80 rounded-3xl p-8 max-w-3xl w-full mx-4 border border-white/10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img
              src={creator.imageUrl}
              alt={`${creator.firstName} ${creator.lastName}`}
              className="w-16 h-16 rounded-full border-2 border-white/20"
            />
            <div>
              <h2 className="text-2xl font-display text-white">
                {creator.firstName} {creator.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Coins size={16} className="text-white/60" />
                <span className="text-white/80">
                  Total Balance: {totalBalance.toLocaleString()} tokens
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {transactions.map((tx, index) => (
            <div
              key={index}
              className="bg-black/60 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {tx.type === 'initial' ? (
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Coins size={16} className="text-purple-400" />
                    </div>
                  ) : tx.type === 'received' ? (
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <ArrowUpRight size={16} className="text-green-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <ArrowDownRight size={16} className="text-orange-400" />
                    </div>
                  )}
                  <div>
                    <div className="text-white font-medium">{tx.description}</div>
                    <div className="text-white/60 text-sm mt-1">
                      {tx.ventureName}
                    </div>
                    {tx.ownerName && tx.type === 'spent' && (
                      <div className="flex items-center gap-1 text-white/60 text-sm mt-1">
                        <User size={12} />
                        Contract Owner: {tx.ownerName}
                      </div>
                    )}
                    <div className="text-white/60 text-sm mt-1">
                      {tx.date.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={`text-lg font-medium ${
                  tx.type === 'spent' ? 'text-orange-400' : 'text-green-400'
                }`}>
                  {tx.type === 'spent' ? '-' : '+'}{tx.amount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="text-center py-8 text-white/60">
              No transactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};