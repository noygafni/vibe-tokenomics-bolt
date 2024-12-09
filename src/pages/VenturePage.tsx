import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Plus, Network, Coins, Clock, Users, Wallet, Briefcase } from 'lucide-react';
import { useVentureStore } from '../store/useVentureStore';
import { EditVentureForm } from '../components/EditVentureForm';
import { SmartContractForm } from '../components/SmartContractForm';
import { ContractVisualization } from '../components/ContractVisualization';
import { MemberTransactionsGraph } from '../components/MemberTransactionsGraph';
import { TokenDistributionModal } from '../components/TokenDistributionModal';
import { CoCreatorsList } from '../components/CoCreatorsList';
import { SmartContractPreview } from '../components/SmartContractPreview';
import type { SmartContract } from '../types/venture';

export const VenturePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);
  const [editingContract, setEditingContract] = useState<SmartContract | null>(null);
  const [showTransactionsGraph, setShowTransactionsGraph] = useState(false);
  const [showDistribution, setShowDistribution] = useState<'V' | 'A' | null>(null);
  const [selectedContract, setSelectedContract] = useState<SmartContract | null>(null);
  
  const { ventures, updateVenture, creators } = useVentureStore();
  const venture = ventures.find(v => v.id === id);

  if (!venture) {
    return (
      <div className="min-h-screen bg-sage-50">
        <div className="text-sage-900 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Venture not found</h2>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sage-700 hover:text-sage-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalContractTokens = venture.smartContracts?.reduce((sum, contract) => sum + contract.vTokens, 0) || 0;

  return (
    <div className="min-h-screen bg-sage-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-start gap-8 mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sage-700 hover:text-sage-900 transition-colors mt-2"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="flex gap-8 flex-1">
            <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border border-sage-200">
              {venture.ventureImage ? (
                <img
                  src={venture.ventureImage}
                  alt={venture.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-sage-100 flex items-center justify-center">
                  <Users size={32} className="text-sage-400" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-display font-light text-sage-900">{venture.name}</h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-sage-600 hover:text-sage-800 transition-colors"
                >
                  <Edit2 size={20} />
                  Edit
                </button>
              </div>
              <p className="text-sage-700 mb-6">{venture.description}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-sage-200/50 mb-8">
          <div className="flex gap-4 flex-wrap">
            {venture.category && (
              <span className="inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm border border-purple-200">
                {venture.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm border border-emerald-200">
              <Clock size={16} />
              {venture.periodInMonths || 12} months
            </span>
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
              <Coins size={16} />
              {(venture.totalTokens || 1000000).toLocaleString()} tokens
            </span>
            <button
              onClick={() => setShowDistribution('V')}
              className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm border border-orange-200 hover:bg-orange-200 transition-colors"
            >
              <Wallet size={16} />
              V Treasury: {venture.vTokenTreasury}%
            </button>
            <button
              onClick={() => setShowDistribution('A')}
              className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm border border-pink-200 hover:bg-pink-200 transition-colors"
            >
              <Briefcase size={16} />
              A Treasury: {venture.aTokenTreasury}%
            </button>
          </div>
        </div>

        {/* Co-Creators List */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-light text-sage-900 mb-6">Co-Creators</h2>
          <CoCreatorsList 
            venture={venture}
            creators={creators}
          />
        </div>

        {/* Smart Contracts */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-sage-200/50 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-light text-sage-900">Smart Contracts</h2>
              <p className="text-sage-600">
                {venture.smartContracts?.length || 0} contracts · {totalContractTokens.toLocaleString()} total tokens
              </p>
            </div>
            <button
              onClick={() => setShowContractForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-full"
            >
              <Plus size={20} />
              New Contract
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {(venture.smartContracts || []).map(contract => (
              <SmartContractPreview
                key={contract.id}
                contract={contract}
                members={venture.members}
                onClick={() => setSelectedContract(contract)}
              />
            ))}
          </div>
        </div>

        {/* Entanglement Graph */}
        <div className="bg-[#2a2f28] backdrop-blur-md rounded-3xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-light text-white">Entanglement Graph</h2>
            <button
              onClick={() => setShowTransactionsGraph(!showTransactionsGraph)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full"
            >
              <Network size={20} />
              {showTransactionsGraph ? 'Hide Graph' : 'View Graph'}
            </button>
          </div>

          {showTransactionsGraph && (
            <div className="mt-8">
              <MemberTransactionsGraph
                members={venture.members}
                contracts={venture.smartContracts || []}
                onClose={() => setShowTransactionsGraph(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4">
            <EditVentureForm
              venture={venture}
              onSave={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}

      {showContractForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            className="bg-[#dde3d7] rounded-3xl p-8 w-[80%] h-[80%] mx-4 overflow-hidden"
            style={{ maxHeight: '80vh' }}
          >
            <SmartContractForm
              ventureId={venture.id}
              members={venture.members}
              onSubmit={(contract) => {
                const updatedContracts = editingContract
                  ? (venture.smartContracts || []).map(c =>
                      c.id === editingContract.id
                        ? { ...editingContract, ...contract }
                        : c
                    )
                  : [
                      ...(venture.smartContracts || []),
                      {
                        ...contract,
                        id: Math.random().toString(36).substr(2, 9),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      },
                    ];

                updateVenture(venture.id, {
                  smartContracts: updatedContracts,
                });
                setShowContractForm(false);
                setEditingContract(null);
              }}
              onCancel={() => {
                setShowContractForm(false);
                setEditingContract(null);
              }}
              initialData={editingContract || undefined}
            />
          </div>
        </div>
      )}

      {selectedContract && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/30 rounded-3xl p-8 max-w-4xl w-full mx-4">
            <ContractVisualization
              contracts={[selectedContract]}
              members={venture.members}
              onEdit={(contract) => {
                setEditingContract(contract);
                setShowContractForm(true);
                setSelectedContract(null);
              }}
              onDelete={(contractId) => {
                if (window.confirm('Are you sure you want to delete this contract?')) {
                  const updatedContracts = venture.smartContracts.filter(c => c.id !== contractId);
                  updateVenture(venture.id, { smartContracts: updatedContracts });
                  setSelectedContract(null);
                }
              }}
              ventureId={venture.id}
            />
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedContract(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDistribution && (
        <TokenDistributionModal
          members={venture.members}
          vTokenTreasury={venture.vTokenTreasury}
          aTokenTreasury={venture.aTokenTreasury}
          totalTokens={venture.totalTokens}
          tokenType={showDistribution}
          onClose={() => setShowDistribution(null)}
        />
      )}
    </div>
  );
};