import React from 'react';
import { X } from 'lucide-react';
import { AddVentureForm } from '../AddVentureForm';

interface AddVentureDialogProps {
  onClose: () => void;
}

export const AddVentureDialog: React.FC<AddVentureDialogProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-8 bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-sage-100">
          <h2 className="text-2xl font-display font-semibold text-sage-900">Create New Venture</h2>
          <button
            onClick={onClose}
            className="text-sage-500 hover:text-sage-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <AddVentureForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
};