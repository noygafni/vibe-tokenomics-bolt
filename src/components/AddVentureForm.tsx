import React, { useState } from 'react';
import { useVentureStore } from '../store/useVentureStore';
import { ImageUpload } from './ImageUpload';
import type { MemberRole } from '../types/venture';

interface AddVentureFormProps {
  onClose: () => void;
}

const DEFAULT_MEMBER_ROLE: MemberRole = 'Co-Creator';
const DEFAULT_PERIOD_MONTHS = 12;
const DEFAULT_TOKENS = 1000000;

export const AddVentureForm: React.FC<AddVentureFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    ventureImage: '',
    periodInMonths: DEFAULT_PERIOD_MONTHS,
    totalTokens: DEFAULT_TOKENS,
    members: [{ id: 'temp-1', name: '', imageUrl: '', role: DEFAULT_MEMBER_ROLE }]
  });

  const addVenture = useVentureStore((state) => state.addVenture);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const members = formData.members
      .filter(member => member.name && member.imageUrl)
      .map((member, index) => ({
        id: `member-${Date.now()}-${index}`,
        name: member.name,
        imageUrl: member.imageUrl,
        role: member.role
      }));

    addVenture({
      name: formData.name,
      description: formData.description,
      category: formData.category,
      ventureImage: formData.ventureImage,
      periodInMonths: formData.periodInMonths,
      totalTokens: formData.totalTokens,
      members
    });

    onClose();
  };

  const addMemberField = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, { 
        id: `temp-${prev.members.length + 1}`,
        name: '', 
        imageUrl: '', 
        role: DEFAULT_MEMBER_ROLE 
      }]
    }));
  };

  const updateMember = (index: number, field: keyof typeof formData.members[0], value: string) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData(prev => ({ ...prev, members: newMembers }));
  };

  const handleMemberImageUpload = (index: number, imageUrl: string) => {
    updateMember(index, 'imageUrl', imageUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add New Venture</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Period (months)
        </label>
        <input
          type="number"
          min="1"
          value={formData.periodInMonths}
          onChange={(e) => setFormData(prev => ({ ...prev, periodInMonths: parseInt(e.target.value) || DEFAULT_PERIOD_MONTHS }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Total Tokens
        </label>
        <input
          type="number"
          min="1"
          value={formData.totalTokens}
          onChange={(e) => setFormData(prev => ({ ...prev, totalTokens: parseInt(e.target.value) || DEFAULT_TOKENS }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Venture Image
        </label>
        <div className="mt-1 flex items-center gap-4">
          {formData.ventureImage ? (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden">
              <img
                src={formData.ventureImage}
                alt="Venture preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, ventureImage: '' }))}
                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              >
                ×
              </button>
            </div>
          ) : (
            <ImageUpload
              onUpload={(imageUrl) => setFormData(prev => ({ ...prev, ventureImage: imageUrl }))}
              className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-orange-500 hover:text-orange-500"
            />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Members
        </label>
        {formData.members.map((member, index) => (
          <div key={member.id} className="flex gap-2">
            <input
              type="text"
              placeholder="Name"
              value={member.name}
              onChange={(e) => updateMember(index, 'name', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="flex-1">
              {member.imageUrl ? (
                <div className="relative h-10 w-10">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                  <button
                    type="button"
                    onClick={() => updateMember(index, 'imageUrl', '')}
                    className="absolute -top-1 -right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 text-xs"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <ImageUpload
                  onUpload={(imageUrl) => handleMemberImageUpload(index, imageUrl)}
                  className="h-10 px-3 py-2 border border-gray-300 rounded-md hover:border-orange-500 hover:text-orange-500"
                />
              )}
            </div>
            <select
              value={member.role}
              onChange={(e) => updateMember(index, 'role', e.target.value as MemberRole)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="Founder">Founder</option>
              <option value="Co-Creator">Co-Creator</option>
            </select>
          </div>
        ))}
        <button
          type="button"
          onClick={addMemberField}
          className="text-sm text-orange-500 hover:text-orange-600"
        >
          + Add Member
        </button>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-md"
        >
          Create Venture
        </button>
      </div>
    </form>
  );
};