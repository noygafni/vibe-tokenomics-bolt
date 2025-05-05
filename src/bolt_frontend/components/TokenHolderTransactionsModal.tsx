import React from 'react';
import { X, ArrowUpRight, ArrowDownRight, Coins, User } from 'lucide-react';
import type { Member, SmartContract } from '../types/venture';
import type { Creator } from '../types/creator';
import { getMemberColor } from '../utils/colors';
import { calculateTokenBalance } from '../utils/tokenCalculations';

interface TokenHolderTransactionsModalProps {
  member: Member;
  creator: Creator;
  ventureId: string;
  smartContracts: SmartContract[];
  onClose: () => void;
}

export const TokenHolderTransactionsModal: React.FC<TokenHolderTransactionsModalProps> = ({
  member,
  creator,
  smartContracts,
  onClose,
}) => {
  const transactions = [];

  // Add initial token allocation for founders
  if (member.role === 'Founder' && member.initialTokens) {
    transactions.push({
      type: 'initial',
      amount: member.initialTokens,
      date: new Date(),
      description: 'Initial Token Allocation',
    });
  }

  // Add contract transactions
  smartContracts.forEach(contract => {
    if (!contract.signedAt) return;

    // Tokens received as contract owner
    if (contract.ownerId === member.id) {
      transactions.push({
        type: 'received',
        amount: contract.vTokens,
        date: contract.signedAt,
        description: `Received from contract: ${contract.name}`,
        contract,
      });
    }

    // Tokens spent as funder
    const funder = contract.funders.find(f => f.memberId === member.id);
    if (funder) {
      transactions.push({
        type: 'spent',
        amount: funder.tokens,
        date: contract.signedAt,
        description: `Funded contract: ${contract.name}`,
        contract,
      });
    }
  });

  // Sort transactions by date
  transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

  const balance = calculateTokenBalance(member.id, member.initialTokens || 0, smartContracts);

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 1000 }}>
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
                  Current Balance: {balance.currentBalance.toLocaleString()} tokens
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