import React from 'react';
import { Edit2, Trash2, Check } from 'lucide-react';
import type { SmartContract, Member } from '../types/venture';
import { useVentureStore } from '../store/useVentureStore';
import { getMemberColor } from '../utils/colors';

interface SmartContractListProps {
  ventureId: string;
  contracts: SmartContract[];
  members: Member[];
  onEdit: (contract: SmartContract) => void;
  onDelete: (contractId: string) => void;
}

export const SmartContractList: React.FC<SmartContractListProps> = ({
  ventureId,
  contracts,
  members,
  onEdit,
  onDelete,
}) => {
  const signContract = useVentureStore((state) => state.signContract);

  const getMemberName = (memberId: string) => {
    return members.find(m => m.id === memberId)?.name || 'Unknown';
  };

  const getMemberIndex = (memberId: string) => {
    return members.findIndex(m => m.id === memberId);
  };

  return (
    <div className="space-y-4">
      {contracts.map(contract => (
        <div
          key={contract.id}
          className="backdrop-blur-md bg-black/20 rounded-xl border border-white/10 p-6"
          style={{
            borderColor: `${getMemberColor(getMemberIndex(contract.ownerId))}40`
          }}
        >
          {/* Contract content remains the same */}
        </div>
      ))}
    </div>
  );
};