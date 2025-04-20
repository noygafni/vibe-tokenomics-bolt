import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Plus, Network, Coins, Clock, Users, Wallet, Briefcase } from 'lucide-react';
import { EditVentureForm } from '../components/EditVentureForm';
import { NewSmartContractDialog } from '../components/dialogs/NewSmartContractDialog';
import { ContractVisualization } from '../components/ContractVisualization';
import { MemberTransactionsGraph } from '../components/MemberTransactionsGraph';
import { TokenDistributionModal } from '../components/TokenDistributionModal';
import { CoCreatorsList } from '../components/CoCreatorsList';
import { SmartContractPreview } from '../components/SmartContractPreview';
import { useVentureDetails } from '../hooks/useVentureDetails';
import { useAuth } from '../hooks/useAuth';

export const VenturePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: venture, loading, error } = useVentureDetails(id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);
  const [showTransactionsGraph, setShowTransactionsGraph] = useState(false);
  const [showDistribution, setShowDistribution] = useState<'V' | 'A' | null>(null);
  const [selectedContract, setSelectedContract] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-coral-500" />
      </div>
    );
  }

  if (error || !venture) {
    return (
      <div className="min-h-screen bg-sage-50 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-display font-bold text-sage-900">Venture not found</h2>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-full hover:bg-coral-600"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
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
                {user && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-sage-600 hover:text-sage-800 transition-colors"
                  >
                    <Edit2 size={20} />
                    Edit
                  </button>
                )}
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
              {venture.periodInMonths} months
            </span>
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
              <Coins size={16} />
              {venture.totalTokens.toLocaleString()} tokens
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
            ventureId={venture.id}
            smartContracts={venture.smartContracts}
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
            {user && (
              <button
                onClick={() => setShowContractForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-full"
              >
                <Plus size={20} />
                New Contract
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {venture.smartContracts.map(contract => (
              <SmartContractPreview
                key={contract.id}
                contract={contract}
                members={venture.members}
                onClick={() => setSelectedContract(contract.id)}
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
                contracts={venture.smartContracts}
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
        <NewSmartContractDialog
          ventureId={venture.id}
          onClose={() => setShowContractForm(false)}
          onSuccess={() => {
            setShowContractForm(false);
            // Refresh venture data
          }}
        />
      )}

      {selectedContract && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/30 rounded-3xl p-8 max-w-4xl w-full mx-4">
            <ContractVisualization
              contracts={[venture.smartContracts.find(c => c.id === selectedContract)!]}
              members={venture.members}
              onEdit={() => {
                // Handle edit
                setSelectedContract(null);
              }}
              onDelete={() => {
                // Handle delete
                setSelectedContract(null);
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