import React, { useState } from 'react';
import { Save, X, Wallet, Briefcase, Users } from 'lucide-react';
import { useVentureStore } from '../store/useVentureStore';
import type { Venture } from '../types/venture';
// import { ImageUpload } from './ImageUpload';
import { getMemberColor } from '../utils/colors';
import { FoundersListForm } from './FoundersListForm';

interface EditVentureFormProps {
  venture: Venture;
  onSave: () => void;
}

export const EditVentureForm: React.FC<EditVentureFormProps> = ({
  venture,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: venture.name,
    description: venture.description,
    category: venture.category || '',
    periodInMonths: venture.periodInMonths || 12,
    totalTokens: venture.totalTokens || 1000000,
    vTokenTreasury: venture.vTokenTreasury || 0,
    aTokenTreasury: venture.aTokenTreasury || 0,
    members: venture.members,
  });

  const [showFoundersForm, setShowFoundersForm] = useState(false);
  const { updateVenture, creators } = useVentureStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVenture(venture.id, formData);
    onSave();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-display font-bold text-mint-800">Edit Venture</h3>
          <button
            type="button"
            onClick={onSave}
            className="text-mint-600 hover:text-mint-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mint-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-mint-200 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mint-700 mb-1">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-mint-200 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mint-700 mb-1">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-mint-200 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-mint-700 mb-1">
                Period (months)
              </label>
              <input
                type="number"
                min="1"
                value={formData.periodInMonths}
                onChange={(e) => setFormData(prev => ({ ...prev, periodInMonths: parseInt(e.target.value) || 12 }))}
                className="w-full px-3 py-2 border border-mint-200 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mint-700 mb-1">
                Total Tokens
              </label>
              <input
                type="number"
                min="1"
                value={formData.totalTokens}
                onChange={(e) => setFormData(prev => ({ ...prev, totalTokens: parseInt(e.target.value) || 1000000 }))}
                className="w-full px-3 py-2 border border-mint-200 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-mint-700 mb-1">
                <div className="flex items-center gap-2">
                  <Wallet size={16} />
                  V Token Treasury (%)
                </div>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.vTokenTreasury}
                onChange={(e) => setFormData(prev => ({ ...prev, vTokenTreasury: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-mint-200 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mint-700 mb-1">
                <div className="flex items-center gap-2">
                  <Briefcase size={16} />
                  A Token Treasury (%)
                </div>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.aTokenTreasury}
                onChange={(e) => setFormData(prev => ({ ...prev, aTokenTreasury: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-mint-200 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Founders Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-mint-700">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  Founders
                </div>
              </label>
              <button
                type="button"
                onClick={() => setShowFoundersForm(true)}
                className="text-sm text-coral-500 hover:text-coral-600"
              >
                Manage Founders
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.members.map((member, index) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-mint-50 rounded-full"
                >
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-6 h-6 rounded-full border-2"
                    style={{ borderColor: getMemberColor(index) }}
                  />
                  <span className="text-sm text-mint-800">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 text-mint-600 hover:text-mint-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-full"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </form>

      {showFoundersForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4">
            <FoundersListForm
              creators={creators}
              currentMembers={formData.members}
              onUpdate={(members) => {
                setFormData(prev => ({ ...prev, members }));
                setShowFoundersForm(false);
              }}
              onClose={() => setShowFoundersForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};