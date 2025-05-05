import React from 'react';
import { Coins, Wallet, Briefcase } from 'lucide-react';
import type { Member } from '../types/venture';
import type { Creator } from '../types/creator';
import { getMemberColor } from '../utils/colors';

interface MembersListProps {
  members: Member[];
  creators: Creator[];
}

export const MembersList: React.FC<MembersListProps> = ({ members, creators }) => {
  const getCreatorDetails = (memberId: string) => {
    return creators.find(c => c.id === memberId);
  };

  return (
    <div className="bg-mint-50 rounded-3xl p-8 mb-8 shadow-sm">
      <h2 className="text-2xl font-display font-bold text-mint-800 mb-6">Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member, index) => {
          const creator = getCreatorDetails(member.id);
          if (!creator) return null;

          return (
            <div
              key={member.id}
              className="bg-white rounded-xl p-4 border border-mint-100"
            >
              <div className="flex items-start gap-4">
                <img
                  src={creator.imageUrl}
                  alt={`${creator.firstName} ${creator.lastName}`}
                  className="w-16 h-16 rounded-full border-2"
                  style={{ borderColor: getMemberColor(index) }}
                />
                <div className="flex-1">
                  <h3 className="font-medium text-mint-800">
                    {creator.firstName} {creator.lastName}
                  </h3>
                  <span className="text-sm text-mint-600 block mb-2">{member.role}</span>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Wallet size={14} className="text-coral-500" />
                      <span className="text-mint-700">
                        {member.vTokens?.toLocaleString() || '0'} V Tokens
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase size={14} className="text-sand-500" />
                      <span className="text-mint-700">
                        {member.aTokens?.toLocaleString() || '0'} A Tokens
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};