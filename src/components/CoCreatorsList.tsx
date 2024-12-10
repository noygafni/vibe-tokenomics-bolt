import React, { useState } from 'react';
import { useVentureMembers } from '../hooks/useVentureMembers';
import { TokenHolderTransactionsModal } from './TokenHolderTransactionsModal';
import { getMemberColor } from '../utils/colors';
import type { SmartContract } from '../types/venture';

interface CoCreatorsListProps {
  ventureId: string;
  smartContracts: SmartContract[];
}

export const CoCreatorsList: React.FC<CoCreatorsListProps> = ({ 
  ventureId,
  smartContracts
}) => {
  const { data: members, loading, error } = useVentureMembers(ventureId);
  const [selectedMember, setSelectedMember] = useState<{
    member: any;
    creator: any;
  } | null>(null);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-sage-200/50">
        <div className="animate-pulse flex flex-wrap gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sage-200" />
              <div className="h-4 bg-sage-200 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !members) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-sage-200/50">
        <div className="text-center text-sage-600">
          Failed to load co-creators. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-sage-200/50">
      <div className="flex flex-wrap gap-4">
        {members.map((member, index) => (
          <button
            key={member.id}
            onClick={() => setSelectedMember({
              member,
              creator: {
                id: member.id,
                firstName: member.name.split(' ')[0],
                lastName: member.name.split(' ')[1] || '',
                imageUrl: member.imageUrl,
                email: '',
                phone: '',
                bio: ''
              }
            })}
            className="flex items-center gap-2 px-3 py-1.5 bg-sage-50 rounded-full hover:bg-sage-100 transition-colors"
          >
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-8 h-8 rounded-full border-2"
              style={{ borderColor: getMemberColor(index) }}
            />
            <span className="text-sm font-medium text-sage-900">{member.name}</span>
            {member.role === 'Founder' && (
              <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                Founder
              </span>
            )}
          </button>
        ))}
      </div>

      {selectedMember && (
        <TokenHolderTransactionsModal
          member={selectedMember.member}
          creator={selectedMember.creator}
          ventureId={ventureId}
          smartContracts={smartContracts}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
};