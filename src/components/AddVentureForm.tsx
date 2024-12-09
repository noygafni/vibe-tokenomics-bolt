import React, { useState } from 'react';
import { useVentures } from '../hooks/useVentures';
import { ImageUpload } from './ImageUpload';
import { MemberSearch } from './MemberSearch';
import type { MemberRole } from '../types/venture';
import { useAuth } from '../hooks/useAuth';
import { Camera } from 'lucide-react';

interface AddVentureFormProps {
  onClose: () => void;
}

const DEFAULT_PERIOD_MONTHS = 12;
const DEFAULT_TOKENS = 1000000;

export const AddVentureForm: React.FC<AddVentureFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { addVenture } = useVentures();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    ventureImage: '',
    periodInMonths: DEFAULT_PERIOD_MONTHS,
    totalTokens: DEFAULT_TOKENS,
    members: [] as Array<{
      id: string;
      name: string;
      imageUrl: string;
      role: MemberRole;
      vTokens: number;
      aTokens: number;
      initialTokens: number;
    }>
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await addVenture({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        ventureImage: formData.ventureImage,
        periodInMonths: formData.periodInMonths,
        totalTokens: formData.totalTokens,
        vTokenTreasury: 20,
        aTokenTreasury: 15,
        members: formData.members,
        smartContracts: []
      });

      onClose();
    } catch (error) {
      console.error('Error creating venture:', error);
      alert('Failed to create venture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = (member: { id: string; name: string; imageUrl: string }) => {
    if (!formData.members.find(m => m.id === member.id)) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, {
          ...member,
          role: 'Co-Creator',
          vTokens: 0,
          aTokens: 0,
          initialTokens: 0
        }]
      }));
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== memberId)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-sage-700 mb-2">
          Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2 border border-sage-300 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          placeholder="Enter venture name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-sage-700 mb-2">
          Description *
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-2 border border-sage-300 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          rows={4}
          placeholder="Describe your venture"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-sage-700 mb-2">
          Venture Image
        </label>
        <div className="mt-1">
          {formData.ventureImage ? (
            <div className="relative w-32 h-32 rounded-xl overflow-hidden group">
              <img
                src={formData.ventureImage}
                alt="Venture preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ImageUpload
                  onUpload={(url) => setFormData(prev => ({ ...prev, ventureImage: url }))}
                  className="text-white hover:text-coral-300 transition-colors"
                >
                  <Camera size={24} />
                </ImageUpload>
              </div>
            </div>
          ) : (
            <ImageUpload
              onUpload={(url) => setFormData(prev => ({ ...prev, ventureImage: url }))}
              className="w-32 h-32 border-2 border-dashed border-sage-300 rounded-xl flex flex-col items-center justify-center text-sage-500 hover:border-coral-500 hover:text-coral-500"
            >
              <Camera size={24} className="mb-2" />
              <span className="text-sm">Add Image</span>
            </ImageUpload>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-sage-700 mb-2">
          Category
        </label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-4 py-2 border border-sage-300 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          placeholder="e.g., Web3, DeFi, NFT"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-2">
            Period (months)
          </label>
          <input
            type="number"
            min="1"
            value={formData.periodInMonths}
            onChange={(e) => setFormData(prev => ({ ...prev, periodInMonths: parseInt(e.target.value) || DEFAULT_PERIOD_MONTHS }))}
            className="w-full px-4 py-2 border border-sage-300 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-sage-700 mb-2">
            Total Tokens
          </label>
          <input
            type="number"
            min="1"
            value={formData.totalTokens}
            onChange={(e) => setFormData(prev => ({ ...prev, totalTokens: parseInt(e.target.value) || DEFAULT_TOKENS }))}
            className="w-full px-4 py-2 border border-sage-300 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-sage-700 mb-4">
          Add Members
        </label>
        <div className="space-y-4">
          {formData.members.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-sage-100 rounded-full"
                >
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-sage-300" />
                  )}
                  <span className="text-sm text-sage-800">{member.name}</span>
                  <span className="text-xs text-sage-600">({member.role})</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-sage-500 hover:text-sage-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <MemberSearch 
            onSelect={handleAddMember} 
            excludeIds={[user?.id || '', ...formData.members.map(m => m.id)]} 
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sage-600 hover:text-sage-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-coral-500 text-white rounded-xl hover:bg-coral-600 disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto" />
          ) : (
            'Create Venture'
          )}
        </button>
      </div>
    </form>
  );
};