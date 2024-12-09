import React, { useState } from 'react';
import type { Member, SmartContract } from '../types/venture';
import { ContractDetailsPopup } from './ContractDetailsPopup';
import { getMemberColor } from '../utils/colors';

interface MemberTransactionsGraphProps {
  members: Member[];
  contracts: SmartContract[];
  onClose: () => void;
}

export const MemberTransactionsGraph: React.FC<MemberTransactionsGraphProps> = ({
  members,
  contracts,
  onClose,
}) => {
  const [selectedContract, setSelectedContract] = useState<SmartContract | null>(null);
  const [selectedFunderId, setSelectedFunderId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  // Filter to only show members with active contracts
  const activeMembers = members.filter(member => {
    return contracts.some(contract => 
      contract.signedAt && (
        contract.ownerId === member.id ||
        contract.funders.some(f => f.memberId === member.id)
      )
    );
  });
  
  const signedContracts = contracts.filter(contract => contract.signedAt);
  
  if (signedContracts.length === 0) {
    return (
      <div className="text-center py-8 text-white/60">
        No signed contracts to visualize
      </div>
    );
  }

  const RADIUS = 350;
  const MEMBER_CIRCLE_SIZE = 80;
  const SPACING = 20;
  const center = { x: RADIUS + MEMBER_CIRCLE_SIZE, y: RADIUS + MEMBER_CIRCLE_SIZE };
  const positions = new Map<string, { x: number, y: number }>();
  
  activeMembers.forEach((member, index) => {
    const angle = (2 * Math.PI * index) / activeMembers.length - Math.PI / 2;
    positions.set(member.id, {
      x: center.x + RADIUS * Math.cos(angle),
      y: center.y + RADIUS * Math.sin(angle),
    });
  });

  const maxTransaction = Math.max(
    ...signedContracts.flatMap(contract => 
      contract.funders.map(funder => funder.tokens)
    )
  );

  const MIN_DOT_SIZE = 3;
  const MAX_DOT_SIZE = 8;

  const calculateDotSize = (tokens: number) => {
    return MIN_DOT_SIZE + (tokens / maxTransaction) * (MAX_DOT_SIZE - MIN_DOT_SIZE);
  };

  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(0.5, prev + delta), 2));
  };

  return (
    <div className="w-full h-[800px] relative overflow-hidden">
      <div className="absolute top-4 right-4 space-x-2 z-10">
        <button
          onClick={() => handleZoom(0.1)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full"
        >
          Zoom In
        </button>
        <button
          onClick={() => handleZoom(-0.1)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full"
        >
          Zoom Out
        </button>
      </div>

      <div 
        className="relative w-full h-full transition-transform duration-300"
        style={{ 
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        <svg 
          width="100%" 
          height="100%" 
          className="absolute inset-0"
        >
          {signedContracts.map(contract => {
            const toPos = positions.get(contract.ownerId);
            if (!toPos) return null;

            return contract.funders.map(funder => {
              const fromPos = positions.get(funder.memberId);
              if (!fromPos) return null;

              const memberIndex = activeMembers.findIndex(m => m.id === funder.memberId);
              const memberColor = getMemberColor(memberIndex);
              const dotSize = calculateDotSize(funder.tokens);

              const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
              const startX = fromPos.x + (MEMBER_CIRCLE_SIZE/2 + SPACING) * Math.cos(angle);
              const startY = fromPos.y + (MEMBER_CIRCLE_SIZE/2 + SPACING) * Math.sin(angle);
              const endX = toPos.x - (MEMBER_CIRCLE_SIZE/2 + SPACING) * Math.cos(angle);
              const endY = toPos.y - (MEMBER_CIRCLE_SIZE/2 + SPACING) * Math.sin(angle);

              const midX = (startX + endX) / 2;
              const midY = (startY + endY) / 2;
              const curveFactor = 50;
              const dx = endX - startX;
              const dy = endY - startY;
              const normalX = -dy / Math.sqrt(dx * dx + dy * dy) * curveFactor;
              const normalY = dx / Math.sqrt(dx * dx + dy * dy) * curveFactor;

              const pathD = `M ${startX} ${startY} Q ${midX + normalX} ${midY + normalY} ${endX} ${endY}`;

              return (
                <g key={`${contract.id}-${funder.memberId}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={memberColor}
                    strokeWidth="2"
                    opacity="0.3"
                    className="transition-all duration-300"
                  />
                  <circle r={dotSize} fill={memberColor}>
                    <animateMotion
                      dur="8s"
                      repeatCount="indefinite"
                      path={pathD}
                    />
                  </circle>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="20"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedContract(contract);
                      setSelectedFunderId(funder.memberId);
                    }}
                  />
                </g>
              );
            });
          })}
        </svg>

        {activeMembers.map((member, index) => {
          const pos = positions.get(member.id);
          if (!pos) return null;

          const memberColor = getMemberColor(index);

          return (
            <div
              key={member.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{
                left: pos.x,
                top: pos.y,
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <div className="relative">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="rounded-full object-cover transition-transform duration-300"
                  style={{
                    width: `${MEMBER_CIRCLE_SIZE}px`,
                    height: `${MEMBER_CIRCLE_SIZE}px`,
                    borderWidth: '3px',
                    borderStyle: 'solid',
                    borderColor: memberColor
                  }}
                />
              </div>
              <div className="mt-2 text-center">
                <div className="font-medium text-white text-lg">{member.name}</div>
                <div className="text-white/60">
                  {member.vTokens?.toLocaleString() || '0'} tokens
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedContract && (
        <ContractDetailsPopup
          contract={selectedContract}
          members={members}
          onClose={() => {
            setSelectedContract(null);
            setSelectedFunderId(null);
          }}
          highlightedFunderId={selectedFunderId || undefined}
        />
      )}
    </div>
  );
};