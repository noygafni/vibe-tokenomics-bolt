import React from 'react';
import type { Member } from '../types/venture';
import { getMemberColor } from '../utils/colors';

interface TokenDistributionChartProps {
  members: Member[];
  vTokenTreasury: number;
  aTokenTreasury: number;
  totalTokens: number;
  tokenType: 'V' | 'A';
}

export const TokenDistributionChart: React.FC<TokenDistributionChartProps> = ({
  members,
  tokenType,
  totalTokens,
}) => {
  const calculatePercentage = (value: number) => ((value / totalTokens) * 100).toFixed(1);

  // Filter members with tokens
  const membersWithTokens = members
    .filter(member => tokenType === 'V' ? member.vTokens > 0 : member.aTokens > 0)
    .map((member, index) => ({
      name: member.name,
      value: tokenType === 'V' ? member.vTokens : member.aTokens,
      color: getMemberColor(index),
      imageUrl: member.imageUrl,
    }));

  // Calculate total tokens for percentage calculation
  const totalMemberTokens = membersWithTokens.reduce((sum, member) => sum + member.value, 0);
  let currentAngle = 0;

  return (
    <div className="flex flex-col items-center">
      {/* Pie Chart */}
      <div className="relative w-96 h-96 mb-8">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {membersWithTokens.map((member) => {
            const percentage = (member.value / totalMemberTokens) * 100;
            const angle = (percentage * 360) / 100;
            
            // Calculate the SVG arc path
            const x1 = 50 + 45 * Math.cos((currentAngle * Math.PI) / 180);
            const y1 = 50 + 45 * Math.sin((currentAngle * Math.PI) / 180);
            const x2 = 50 + 45 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 = 50 + 45 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            const path = `
              M 50 50
              L ${x1} ${y1}
              A 45 45 0 ${largeArcFlag} 1 ${x2} ${y2}
              Z
            `;

            const result = (
              <path
                key={member.name}
                d={path}
                fill={member.color}
                className="transition-all duration-300 hover:opacity-80"
              />
            );

            currentAngle += angle;
            return result;
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {membersWithTokens.map((member) => (
          <div
            key={member.name}
            className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/10"
          >
            <img
              src={member.imageUrl}
              alt={member.name}
              className="w-10 h-10 rounded-full border-2"
              style={{ borderColor: member.color }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{member.name}</div>
              <div className="text-sm text-white/80">
                {member.value.toLocaleString()} ({calculatePercentage(member.value)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};