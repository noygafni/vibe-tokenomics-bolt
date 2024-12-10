import React from 'react';
import { X } from 'lucide-react';
import { SmartContractForm } from '../forms/SmartContractForm';
import type { SmartContract } from '../../types/venture';

interface NewSmartContractDialogProps {
  ventureId: string;
  onClose: () => void;
  onSuccess: (contract: SmartContract) => void;
}

export const NewSmartContractDialog: React.FC<NewSmartContractDialogProps> = ({
  ventureId,
  onClose,
  onSuccess,
}) => {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-8 bg-black/90 rounded-3xl shadow-xl overflow-hidden flex flex-col">
        <SmartContractForm
          ventureId={ventureId}
          onCancel={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
};