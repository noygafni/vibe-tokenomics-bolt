import React from 'react';
import type { SmartContract, Member } from '../types/venture';
import { SmartContractCard } from './SmartContractCard';

interface ContractVisualizationProps {
  contracts: SmartContract[];
  members: Member[];
  onEdit: (contract: SmartContract) => void;
  onDelete: (contractId: string) => void;
  ventureId: string;
}

export const ContractVisualization: React.FC<ContractVisualizationProps> = ({
  contracts,
  members,
  onEdit,
  onDelete,
  ventureId,
}) => {
  return (
    <div className="space-y-6">
      {contracts.map(contract => (
        <SmartContractCard
          key={contract.id}
          contract={contract}
          members={members}
          onEdit={onEdit}
          onDelete={onDelete}
          ventureId={ventureId}
        />
      ))}
    </div>
  );
};