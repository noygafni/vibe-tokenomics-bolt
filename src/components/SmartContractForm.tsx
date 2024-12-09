import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Member, SmartContract, SmartContractFunder } from '../types/venture';
import { useVentureStore } from '../store/useVentureStore';
import { getMemberColor } from '../utils/colors';
import { calculateTokenBalance } from '../utils/tokenCalculations';

interface SmartContractFormProps {
  ventureId: string;
  members: Member[];
  onSubmit: (contract: Omit<SmartContract, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  initialData?: SmartContract;
}

export const SmartContractForm: React.FC<SmartContractFormProps> = ({
  ventureId,
  members,
  onSubmit,
  onCancel,
  initialData,
}) => {
  const { ventures, creators } = useVentureStore();
  const venture = ventures.find(v => v.id === ventureId);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    vTokens: initialData?.vTokens || 0,
    endDate: initialData?.endDate || '',
    exchangeDate: initialData?.exchangeDate || '',
    ownerId: initialData?.ownerId || '',
    funders: initialData?.funders || [],
    signedAt: initialData?.signedAt,
  });

  const [error, setError] = useState<string | null>(null);

  // Get token holders (excluding the selected owner)
  const getAvailableFunders = () => {
    if (!venture) return [];

    return creators.filter(creator => {
      // Skip if creator is the selected owner
      if (creator.id === formData.ownerId) return false;

      // Check if creator has tokens in the venture
      const member = venture.members.find(m => m.id === creator.id);
      if (!member) return false;

      const balance = calculateTokenBalance(
        creator.id,
        member.initialTokens || 0,
        venture.smartContracts || []
      );

      return balance.currentBalance > 0;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!venture) {
      setError('Venture not found');
      return;
    }

    if (!formData.name.trim()) {
      setError('Contract name is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Contract description is required');
      return;
    }

    if (formData.vTokens <= 0) {
      setError('Token amount must be greater than 0');
      return;
    }

    if (!formData.ownerId) {
      setError('Please select a contract owner');
      return;
    }

    // Validate total funding doesn't exceed contract tokens
    const totalFunding = formData.funders.reduce((sum, funder) => sum + funder.tokens, 0);
    if (totalFunding > formData.vTokens) {
      setError('Total funding cannot exceed contract tokens');
      return;
    }

    // Validate no funder exceeds 50%
    const maxAllowed = formData.vTokens * 0.5;
    const exceedingFunder = formData.funders.find(f => f.tokens > maxAllowed);
    if (exceedingFunder) {
      const creator = creators.find(c => c.id === exceedingFunder.memberId);
      setError(`${creator?.firstName} cannot fund more than 50% of tokens`);
      return;
    }

    onSubmit(formData);
  };

  const updateFunder = (memberId: string, tokens: number) => {
    setFormData(prev => ({
      ...prev,
      funders: [
        ...prev.funders.filter(f => f.memberId !== memberId),
        { memberId, tokens },
      ].filter(f => f.tokens > 0),
    }));
    setError(null);
  };

  const availableFunders = getAvailableFunders();

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <div className="flex justify-between items-center sticky top-0 bg-[#dde3d7] p-4 -m-4 mb-6 border-b border-sage-200">
        <h3 className="text-2xl font-display font-bold text-sage-900">
          {initialData ? 'Edit Smart Contract' : 'New Smart Contract'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-sage-600 hover:text-sage-800"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-sage-800 mb-2">
              Contract Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-sage-300 rounded-xl focus:ring-2 focus:ring-mint-500 focus:border-transparent"
              placeholder="Enter contract name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-800 mb-2">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-sage-300 rounded-xl focus:ring-2 focus:ring-mint-500 focus:border-transparent"
              rows={3}
              placeholder="Describe the contract purpose"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-800 mb-2">
              Total V Tokens
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.vTokens}
              onChange={(e) => setFormData(prev => ({ ...prev, vTokens: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 bg-white border border-sage-300 rounded-xl focus:ring-2 focus:ring-mint-500 focus:border-transparent"
              placeholder="Enter token amount"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-sage-800 mb-2">
                End Date
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-sage-300 rounded-xl focus:ring-2 focus:ring-mint-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-800 mb-2">
                Exchange Date
              </label>
              <input
                type="date"
                required
                value={formData.exchangeDate}
                onChange={(e) => setFormData(prev => ({ ...prev, exchangeDate: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-sage-300 rounded-xl focus:ring-2 focus:ring-mint-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-800 mb-2">
              Contract Owner
            </label>
            <select
              required
              value={formData.ownerId}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  ownerId: e.target.value,
                  funders: prev.funders.filter(f => f.memberId !== e.target.value)
                }));
              }}
              className="w-full px-4 py-3 bg-white border border-sage-300 rounded-xl focus:ring-2 focus:ring-mint-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">Select owner</option>
              {creators.map((creator, index) => (
                <option key={creator.id} value={creator.id} className="py-2">
                  {creator.firstName} {creator.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-800 mb-4">
              Funders
            </label>
            <div className="space-y-3">
              {availableFunders.map((creator, index) => {
                const funder = formData.funders.find(f => f.memberId === creator.id);
                
                return (
                  <div key={creator.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-sage-200">
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={creator.imageUrl}
                        alt={`${creator.firstName} ${creator.lastName}`}
                        className="w-10 h-10 rounded-full border-2"
                        style={{ borderColor: getMemberColor(index) }}
                      />
                      <div>
                        <div className="font-medium text-sage-900">
                          {creator.firstName} {creator.lastName}
                        </div>
                      </div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={funder?.tokens || ''}
                      onChange={(e) => updateFunder(creator.id, parseInt(e.target.value) || 0)}
                      placeholder="Tokens"
                      className="w-32 px-4 py-2 bg-sage-50 border border-sage-200 rounded-xl focus:ring-2 focus:ring-mint-500 focus:border-transparent"
                    />
                  </div>
                );
              })}

              {availableFunders.length === 0 && (
                <div className="text-center py-4 text-sage-600 bg-sage-50 rounded-xl">
                  No available funders with tokens
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 flex justify-end gap-4 bg-[#dde3d7] p-4 -m-4 mt-6 border-t border-sage-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-sage-700 hover:text-sage-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-mint-600 hover:bg-mint-700 text-white rounded-xl"
        >
          {initialData ? 'Save Changes' : 'Create Contract'}
        </button>
      </div>
    </form>
  );
};