import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVentureStore } from '../store/useVentureStore';
import { getMemberColor } from '../utils/colors';

export const WalletPage: React.FC = () => {
  const navigate = useNavigate();
  const { ventures } = useVentureStore();
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);

  // Get all unique creators across ventures
  const allCreators = Array.from(new Set(
    ventures.flatMap(venture => venture.members)
  )).sort((a, b) => a.name.localeCompare(b.name));

  // Get all transactions for selected creator
  const creatorTransactions = selectedCreator ? ventures.flatMap(venture => {
    return (venture.smartContracts || []).map(contract => {
      const isOwner = contract.ownerId === selectedCreator;
      const funder = contract.funders.find(f => f.memberId === selectedCreator);
      
      if (!isOwner && !funder) return null;

      return {
        ventureId: venture.id,
        ventureName: venture.name,
        contractId: contract.id,
        contractName: contract.name,
        type: isOwner ? 'received' : 'sent',
        amount: isOwner ? contract.vTokens : (funder?.tokens || 0),
        date: contract.signedAt || contract.createdAt,
      };
    }).filter(Boolean);
  }) : [];

  return (
    <div className="min-h-screen bg-sage-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sage-600 hover:text-sage-800"
          >
            <ArrowLeft size={24} />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-light text-sage-900">My Wallet</h1>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {/* Creators List */}
          <div className="col-span-1 space-y-4">
            <h2 className="text-xl font-semibold text-sage-800 mb-6">Select Creator</h2>
            {allCreators.map((creator, index) => (
              <button
                key={creator.id}
                onClick={() => setSelectedCreator(creator.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                  selectedCreator === creator.id
                    ? 'bg-white shadow-lg scale-105'
                    : 'bg-white/50 hover:bg-white hover:shadow'
                }`}
              >
                <img
                  src={creator.imageUrl}
                  alt={creator.name}
                  className="w-10 h-10 rounded-full border-2"
                  style={{ borderColor: getMemberColor(index) }}
                />
                <div className="text-left">
                  <div className="font-medium text-sage-900">{creator.name}</div>
                  <div className="text-sm text-sage-600">{creator.role}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Transactions List */}
          <div className="col-span-3">
            {selectedCreator ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-sage-800 mb-6">Transactions</h2>
                {creatorTransactions.length > 0 ? (
                  creatorTransactions.map((tx, index) => (
                    <div
                      key={`${tx.ventureId}-${tx.contractId}`}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-sage-900">{tx.contractName}</h3>
                          <p className="text-sm text-sage-600">{tx.ventureName}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          tx.type === 'received'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {tx.type === 'received' ? 'Received' : 'Sent'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-sage-900">
                          {tx.amount.toLocaleString()} tokens
                        </span>
                        <span className="text-sm text-sage-600">
                          {new Date(tx.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-sage-600">
                    No transactions found
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-sage-600">
                Select a creator to view their transactions
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};