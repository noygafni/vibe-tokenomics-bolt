import React, { useState } from 'react';
import { X, Calendar, Coins, User, AlertCircle } from 'lucide-react';
import { useSmartContracts } from '../../hooks/useSmartContracts';
import { useVentureMembers } from '../../hooks/useVentureMembers';
import { getMemberColor } from '../../utils/colors';
import type { SmartContract } from '../../types/venture';

interface SmartContractFormProps {
  ventureId: string;
  onCancel: () => void;
  onSuccess: (contract: SmartContract) => void;
}

export const SmartContractForm: React.FC<SmartContractFormProps> = ({
  ventureId,
  onCancel,
  onSuccess,
}) => {
  const { createSmartContract, loading } = useSmartContracts(ventureId);
  const { data: members, loading: loadingMembers } = useVentureMembers(ventureId);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    vTokens: 0,
    endDate: '',
    exchangeDate: '',
    ownerId: '',
    funders: [] as Array<{ memberId: string; tokens: number }>,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!formData.name.trim()) throw new Error('Contract name is required');
      if (!formData.description.trim()) throw new Error('Contract description is required');
      if (formData.vTokens <= 0) throw new Error('Token amount must be greater than 0');
      if (!formData.ownerId) throw new Error('Please select a contract owner');
      if (!formData.endDate) throw new Error('End date is required');
      if (!formData.exchangeDate) throw new Error('Exchange date is required');

      // Validate total funding doesn't exceed contract tokens
      const totalFunding = formData.funders.reduce((sum, funder) => sum + funder.tokens, 0);
      if (totalFunding > formData.vTokens) {
        throw new Error('Total funding cannot exceed contract tokens');
      }

      // Validate no funder exceeds 50%
      const maxAllowed = formData.vTokens * 0.5;
      const exceedingFunder = formData.funders.find(f => f.tokens > maxAllowed);
      if (exceedingFunder) {
        const member = members?.find(m => m.id === exceedingFunder.memberId);
        throw new Error(`${member?.name} cannot fund more than 50% of tokens`);
      }

      const contract = await createSmartContract(formData);
      onSuccess(contract);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contract');
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
  const availableFunders = members?.filter(member => 
    member.id !== formData.ownerId && member.vTokens > 0
  ) || [];

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <div className="flex justify-between items-center p-6 border-b border-white/10">
        <h2 className="text-2xl font-display font-semibold text-white">
          New Smart Contract
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <div className="flex items-center gap-2">
                  <Coins size={16} className="text-coral-400" />
                  Total V Tokens
                </div>
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

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-emerald-400" />
                  End Date
                </div>
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
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-purple-400" />
                  Exchange Date
                </div>
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
              <div className="flex items-center gap-2">
                <User size={16} className="text-blue-400" />
                Contract Owner
              </div>
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
              {members?.map((member, index) => (
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
              {loadingMembers ? (
                <div className="text-center py-4 text-white/60">
                  Loading members...
                </div>
              ) : availableFunders.length > 0 ? (
                availableFunders.map((member, index) => {
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
                })
              ) : (
                <div className="text-center py-4 text-white/60 bg-white/5 rounded-xl">
                  No available funders with tokens
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/50 p-4 rounded-xl border border-red-500/50">
              <AlertCircle size={16} className="flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 p-6 border-t border-white/10">
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
            'Create Contract'
          )}
        </button>
      </div>
    </form>
  );
};