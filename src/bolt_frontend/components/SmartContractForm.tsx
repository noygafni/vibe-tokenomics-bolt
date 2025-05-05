import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Member, SmartContract, SmartContractFunder } from '../types/venture';
import { useSmartContracts } from '../hooks/useSmartContracts';
import { getMemberColor } from '../utils/colors';

interface SmartContractFormProps {
  ventureId: string;
  members: Member[];
  onSubmit: (contract: Omit<SmartContract, 'id' | 'createdAt' | 'updatedAt' | 'signedAt'>) => void;
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
  const { createSmartContract, updateSmartContract, loading } = useSmartContracts(ventureId);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    vTokens: initialData?.vTokens || 0,
    endDate: initialData?.endDate || '',
    exchangeDate: initialData?.exchangeDate || '',
    ownerId: initialData?.ownerId || '',
    funders: initialData?.funders || [] as SmartContractFunder[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!formData.name.trim()) throw new Error('Contract name is required');
      if (!formData.description.trim()) throw new Error('Contract description is required');
      if (formData.vTokens <= 0) throw new Error('Token amount must be greater than 0');
      if (!formData.ownerId) throw new Error('Please select a contract owner');

      // Validate total funding doesn't exceed contract tokens
      const totalFunding = formData.funders.reduce((sum, funder) => sum + funder.tokens, 0);
      if (totalFunding > formData.vTokens) {
        throw new Error('Total funding cannot exceed contract tokens');
      }

      // Validate no funder exceeds 50%
      const maxAllowed = formData.vTokens * 0.5;
      const exceedingFunder = formData.funders.find(f => f.tokens > maxAllowed);
      if (exceedingFunder) {
        const member = members.find(m => m.id === exceedingFunder.memberId);
        throw new Error(`${member?.name} cannot fund more than 50% of tokens`);
      }

      if (initialData) {
        await updateSmartContract(initialData.id, formData);
      } else {
        await createSmartContract(formData);
      }

      onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save contract');
    }
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

  // Get available funders (excluding the selected owner)
  const availableFunders = members.filter(member => 
    member.id !== formData.ownerId && member.vTokens > 0
  );

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col bg-black/90">
      <div className="flex justify-between items-center sticky top-0 bg-black/30 p-4 -m-4 mb-6 border-b border-white/10">
        <h3 className="text-2xl font-display font-bold text-white">
          {initialData ? 'Edit Smart Contract' : 'New Smart Contract'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Contract Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent text-white placeholder-white/40"
              placeholder="Enter contract name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent text-white placeholder-white/40"
              rows={3}
              placeholder="Describe the contract purpose"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Total V Tokens
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.vTokens}
              onChange={(e) => setFormData(prev => ({ ...prev, vTokens: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent text-white placeholder-white/40"
              placeholder="Enter token amount"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                End Date
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Exchange Date
              </label>
              <input
                type="date"
                required
                value={formData.exchangeDate}
                onChange={(e) => setFormData(prev => ({ ...prev, exchangeDate: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
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
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent text-white appearance-none cursor-pointer"
            >
              <option value="">Select owner</option>
              {members.map((member, index) => (
                <option key={member.id} value={member.id} className="bg-gray-900">
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-4">
              Funders
            </label>
            <div className="space-y-3">
              {availableFunders.map((member, index) => {
                const funder = formData.funders.find(f => f.memberId === member.id);
                
                return (
                  <div key={member.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-10 h-10 rounded-full border-2"
                        style={{ borderColor: getMemberColor(index) }}
                      />
                      <div>
                        <div className="font-medium text-white">
                          {member.name}
                        </div>
                        <div className="text-sm text-white/60">
                          Available: {member.vTokens.toLocaleString()} tokens
                        </div>
                      </div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max={member.vTokens}
                      value={funder?.tokens || ''}
                      onChange={(e) => updateFunder(member.id, parseInt(e.target.value) || 0)}
                      placeholder="Tokens"
                      className="w-32 px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent text-white placeholder-white/40"
                    />
                  </div>
                );
              })}

              {availableFunders.length === 0 && (
                <div className="text-center py-4 text-white/60 bg-white/5 rounded-xl">
                  No available funders with tokens
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-950/50 p-3 rounded-xl border border-red-500/50">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 flex justify-end gap-4 bg-black/30 p-4 -m-4 mt-6 border-t border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-white/80 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-xl disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto" />
          ) : (
            initialData ? 'Save Changes' : 'Create Contract'
          )}
        </button>
      </div>
    </form>
  );
};