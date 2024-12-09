import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVentureStore } from '../store/useVentureStore';
import { CreatorForm } from '../components/CreatorForm';
import { CreatorContractsModal } from '../components/CreatorContractsModal';
import { getMemberColor } from '../utils/colors';
import { calculateTokenBalance } from '../utils/tokenCalculations';
import type { Creator } from '../types/creator';

export const CreatorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { creators, ventures, addCreator, updateCreator, deleteCreator } = useVentureStore();
  const [showForm, setShowForm] = useState(false);
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  const handleEdit = (creator: Creator) => {
    setEditingCreator(creator);
    setShowForm(true);
  };

  const handleDelete = (creatorId: string) => {
    if (window.confirm('Are you sure you want to delete this creator?')) {
      deleteCreator(creatorId);
    }
  };

  const getCreatorStats = (creatorId: string) => {
    let totalVTokens = 0;
    let totalTransactions = 0;
    let activeVentures = 0;

    ventures.forEach(venture => {
      const member = venture.members.find(m => m.id === creatorId);
      const balance = calculateTokenBalance(
        creatorId,
        member?.initialTokens || 0,
        venture.smartContracts || []
      );

      totalVTokens += balance.currentBalance;
      totalTransactions += balance.transactions.length;

      // Check if creator is active in this venture
      const isActive = venture.members.some(m => m.id === creatorId) ||
        venture.smartContracts?.some(contract => 
          contract.ownerId === creatorId ||
          contract.funders?.some(f => f.memberId === creatorId)
        );

      if (isActive) {
        activeVentures++;
      }
    });

    return {
      totalVTokens,
      totalTransactions,
      activeVentures
    };
  };

  return (
    <div className="min-h-screen bg-sage-50">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sage-700 hover:text-sage-900"
            >
              <ArrowLeft size={24} />
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-display font-light text-sage-900">Creators</h1>
          </div>
          <button
            onClick={() => {
              setEditingCreator(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white hover:bg-coral-600 rounded-full"
          >
            <Plus size={20} />
            Add Creator
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator, index) => {
            const stats = getCreatorStats(creator.id);
            
            return (
              <div
                key={creator.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={creator.imageUrl}
                      alt={`${creator.firstName} ${creator.lastName}`}
                      className="w-16 h-16 rounded-full object-cover border-2"
                      style={{ borderColor: getMemberColor(index) }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-sage-900">
                        {creator.firstName} {creator.lastName}
                      </h3>
                      <p className="text-sage-600">{creator.email}</p>
                      <p className="text-sage-600">{creator.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(creator)}
                      className="p-2 text-sage-600 hover:text-sage-800"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(creator.id)}
                      className="p-2 text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-sage-700 line-clamp-3 mb-4">{creator.bio}</p>

                {stats.activeVentures > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-sage-600">Active Ventures</span>
                      <span className="font-medium text-sage-900">{stats.activeVentures}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-sage-600">Total Transactions</span>
                      <span className="font-medium text-sage-900">{stats.totalTransactions}</span>
                    </div>
                    <button
                      onClick={() => setSelectedCreator(creator)}
                      className="w-full mt-4 px-4 py-2 bg-sage-100 text-sage-700 hover:bg-sage-200 rounded-xl transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
            <CreatorForm
              initialData={editingCreator}
              onSubmit={(data) => {
                if (editingCreator) {
                  updateCreator(editingCreator.id, data);
                } else {
                  addCreator(data);
                }
                setShowForm(false);
                setEditingCreator(null);
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingCreator(null);
              }}
            />
          </div>
        </div>
      )}

      {selectedCreator && (
        <CreatorContractsModal
          creator={selectedCreator}
          ventures={ventures}
          onClose={() => setSelectedCreator(null)}
        />
      )}
    </div>
  );
};