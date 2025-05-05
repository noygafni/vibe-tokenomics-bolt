import React from 'react';
import { X } from 'lucide-react';
import type { SmartContract, Member } from '../types/venture';
import { getMemberColor } from '../utils/colors';

interface ContractDetailsPopupProps {
  contract: SmartContract;
  members: Member[];
  onClose: () => void;
  highlightedFunderId?: string;
}

export const ContractDetailsPopup: React.FC<ContractDetailsPopupProps> = ({
  contract,
  members,
  onClose,
  highlightedFunderId,
}) => {
  const owner = members.find(m => m.id === contract.ownerId);
  const ownerIndex = members.findIndex(m => m.id === contract.ownerId);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/30 p-8 rounded-3xl border border-white/10 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{contract.name}</h3>
            <p className="text-white/80">{contract.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <span className="text-white/60 text-sm block mb-1">Owner</span>
            <div className="flex items-center gap-3">
              <img
                src={owner?.imageUrl}
                alt={owner?.name}
                className="w-10 h-10 rounded-full"
                style={{
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: getMemberColor(ownerIndex)
                }}
              />
              <div>
                <span className="text-white font-medium">{owner?.name}</span>
                <span className="text-white/60 text-sm block">{owner?.role}</span>
              </div>
            </div>
          </div>
          <div>
            <span className="text-white/60 text-sm block mb-1">Total V Tokens</span>
            <span className="text-white text-xl font-medium">
              {contract.vTokens.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-white/60 text-sm block mb-1">End Date</span>
            <span className="text-white">
              {new Date(contract.endDate).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-white/60 text-sm block mb-1">Exchange Date</span>
            <span className="text-white">
              {new Date(contract.exchangeDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div>
          <span className="text-white/60 text-sm block mb-3">Funders</span>
          <div className="space-y-3">
            {contract.funders.map(funder => {
              const member = members.find(m => m.id === funder.memberId);
              const memberIndex = members.findIndex(m => m.id === funder.memberId);
              const isHighlighted = funder.memberId === highlightedFunderId;
              const memberColor = getMemberColor(memberIndex);

              return (
                <div
                  key={funder.memberId}
                  className="flex items-center justify-between p-3 rounded-xl transition-all duration-300"
                  style={{
                    backgroundColor: isHighlighted ? `${memberColor}20` : 'rgba(255, 255, 255, 0.05)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: isHighlighted ? memberColor : 'transparent'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member?.imageUrl}
                      alt={member?.name}
                      className="w-10 h-10 rounded-full"
                      style={{
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: memberColor
                      }}
                    />
                    <div>
                      <span className="text-white font-medium">{member?.name}</span>
                      <span className="text-white/60 text-sm block">{member?.role}</span>
                    </div>
                  </div>
                  <span 
                    className="font-medium"
                    style={{ color: isHighlighted ? memberColor : 'white' }}
                  >
                    {funder.tokens.toLocaleString()} tokens
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {contract.signedAt && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <span className="text-green-400">
              Signed on {new Date(contract.signedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};