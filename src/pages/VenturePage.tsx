import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Plus, Network, Coins, Clock, Users, Wallet, Briefcase } from 'lucide-react';
import { useVentures } from '../hooks/useVentures';
import { EditVentureForm } from '../components/EditVentureForm';
import { SmartContractForm } from '../components/SmartContractForm';
import { ContractVisualization } from '../components/ContractVisualization';
import { MemberTransactionsGraph } from '../components/MemberTransactionsGraph';
import { TokenDistributionModal } from '../components/TokenDistributionModal';
import { CoCreatorsList } from '../components/CoCreatorsList';
import { SmartContractPreview } from '../components/SmartContractPreview';
import { useQuery } from '../hooks/useQuery';
import { supabase } from '../lib/supabase';
import type { SmartContract, Venture } from '../types/venture';
import { useAuth } from '../hooks/useAuth';

export const VenturePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);
  const [editingContract, setEditingContract] = useState<SmartContract | null>(null);
  const [showTransactionsGraph, setShowTransactionsGraph] = useState(false);
  const [showDistribution, setShowDistribution] = useState<'V' | 'A' | null>(null);
  const [selectedContract, setSelectedContract] = useState<SmartContract | null>(null);

  const { data: venture, loading, error } = useQuery<Venture>(
    ['venture', id],
    async () => {
      if (!id) throw new Error('No venture ID provided');

      // Fetch venture data
      const { data: ventureData, error: ventureError } = await supabase
        .from('ventures')
        .select(`
          *,
          venture_members (
            user_id,
            role,
            v_tokens,
            a_tokens,
            initial_tokens
          ),
          smart_contracts (
            *,
            contract_funders (
              user_id,
              tokens
            )
          )
        `)
        .eq('id', id)
        .single();

      if (ventureError) throw ventureError;
      if (!ventureData) throw new Error('Venture not found');

      // Get all unique user IDs
      const userIds = new Set<string>();
      userIds.add(ventureData.created_by);
      ventureData.venture_members?.forEach(member => userIds.add(member.user_id));
      ventureData.smart_contracts?.forEach(contract => {
        userIds.add(contract.owner_id);
        contract.contract_funders?.forEach(funder => userIds.add(funder.user_id));
      });

      // Fetch user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', Array.from(userIds));

      if (profilesError) throw profilesError;

      // Transform data to match Venture type
      return {
        id: ventureData.id,
        name: ventureData.name,
        description: ventureData.description || '',
        bannerUrl: ventureData.banner_url,
        ventureImage: ventureData.venture_image,
        category: ventureData.category,
        periodInMonths: ventureData.period_in_months,
        totalTokens: ventureData.total_tokens,
        vTokenTreasury: ventureData.v_token_treasury,
        aTokenTreasury: ventureData.a_token_treasury,
        members: ventureData.venture_members?.map(member => {
          const profile = profiles?.find(p => p.id === member.user_id);
          return {
            id: member.user_id,
            name: profile?.full_name || 'Unknown',
            imageUrl: profile?.avatar_url || '',
            role: member.role,
            vTokens: member.v_tokens,
            aTokens: member.a_tokens,
            initialTokens: member.initial_tokens,
          };
        }) || [],
        smartContracts: ventureData.smart_contracts?.map(contract => ({
          id: contract.id,
          name: contract.name,
          description: contract.description || '',
          vTokens: contract.v_tokens,
          endDate: contract.end_date,
          exchangeDate: contract.exchange_date,
          ownerId: contract.owner_id,
          funders: contract.contract_funders?.map(funder => ({
            memberId: funder.user_id,
            tokens: funder.tokens,
          })) || [],
          createdAt: new Date(contract.created_at),
          updatedAt: new Date(contract.updated_at),
          signedAt: contract.signed_at ? new Date(contract.signed_at) : undefined,
        })) || [],
        createdAt: new Date(ventureData.created_at),
        updatedAt: new Date(ventureData.updated_at),
      };
    }
  );

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
            creators={venture.members}
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
                // Handle contract submission
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
                  // Handle contract deletion
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