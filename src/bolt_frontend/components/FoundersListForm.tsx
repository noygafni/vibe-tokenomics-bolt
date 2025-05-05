import React, { useState } from 'react';
import { Plus, X, Coins, Save } from 'lucide-react';
import type { Creator } from '../types/creator';
import type { Member } from '../types/venture';
import { getMemberColor } from '../utils/colors';

interface FoundersListFormProps {
  creators: Creator[];
  currentMembers: Member[];
  onUpdate: (members: Member[]) => void;
  onClose: () => void;
}

export const FoundersListForm: React.FC<FoundersListFormProps> = ({
  creators,
  currentMembers,
  onUpdate,
  onClose,
}) => {
  const [members, setMembers] = useState<Member[]>(currentMembers);

  const handleAddMember = (creator: Creator) => {
    if (!members.find(m => m.id === creator.id)) {
      setMembers([
        ...members,
        {
          id: creator.id,
          name: `${creator.firstName} ${creator.lastName}`,
          imageUrl: creator.imageUrl,
          role: 'Founder',
          vTokens: 0,
          aTokens: 0,
          initialTokens: 0
        },
      ]);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  const handleUpdateTokens = (memberId: string, field: 'vTokens' | 'initialTokens', value: number) => {
    setMembers(
      members.map(member =>
        member.id === memberId
          ? { ...member, [field]: value }
          : member
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(members);
  };

  const availableCreators = creators.filter(
    creator => !members.find(m => m.id === creator.id)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-display font-bold text-mint-800">Manage Founders</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-mint-600 hover:text-mint-700"
        >
          <X size={20} />
        </button>
      </div>

      {/* Current Founders */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-mint-700">Current Founders</h4>
        <div className="space-y-2">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-mint-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-10 h-10 rounded-full border-2"
                  style={{ borderColor: getMemberColor(index) }}
                />
                <div>
                  <span className="font-medium text-mint-800">{member.name}</span>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Coins size={14} className="text-mint-600" />
                      <input
                        type="number"
                        min="0"
                        value={member.initialTokens || 0}
                        onChange={(e) => handleUpdateTokens(member.id, 'initialTokens', parseInt(e.target.value) || 0)}
                        className="w-32 px-2 py-1 text-sm bg-white border border-mint-200 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                        placeholder="Initial Tokens"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins size={14} className="text-coral-500" />
                      <input
                        type="number"
                        min="0"
                        value={member.vTokens || 0}
                        onChange={(e) => handleUpdateTokens(member.id, 'vTokens', parseInt(e.target.value) || 0)}
                        className="w-32 px-2 py-1 text-sm bg-white border border-mint-200 rounded-md focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                        placeholder="Current V Tokens"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMember(member.id)}
                className="text-red-500 hover:text-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Total V Tokens */}
      <div className="p-4 bg-mint-100 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-mint-700">Total Initial Tokens</span>
          <span className="font-medium text-mint-800">
            {members.reduce((sum, member) => sum + (member.initialTokens || 0), 0).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-medium text-mint-700">Total Current V Tokens</span>
          <span className="font-medium text-mint-800">
            {members.reduce((sum, member) => sum + (member.vTokens || 0), 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Available Creators */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-mint-700">Add Founders</h4>
        <div className="space-y-2">
          {availableCreators.map((creator, index) => (
            <div
              key={creator.id}
              className="flex items-center justify-between p-3 bg-white rounded-xl hover:bg-mint-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={creator.imageUrl}
                  alt={`${creator.firstName} ${creator.lastName}`}
                  className="w-10 h-10 rounded-full border-2"
                  style={{ borderColor: getMemberColor(index) }}
                />
                <div>
                  <div className="font-medium text-mint-800">
                    {creator.firstName} {creator.lastName}
                  </div>
                  <div className="text-sm text-mint-600">{creator.email}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAddMember(creator)}
                className="text-mint-600 hover:text-mint-700"
              >
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
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
  );
};