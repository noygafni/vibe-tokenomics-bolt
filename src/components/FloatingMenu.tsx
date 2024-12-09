import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AddVentureDialog } from './dialogs/AddVentureDialog';

export const FloatingMenu: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      {showDialog && (
        <AddVentureDialog onClose={() => setShowDialog(false)} />
      )}
      
      <div className="fixed bottom-8 right-8" style={{ zIndex: 40 }}>
        <div className="relative">
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-2 bg-sage-900 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap">
              Create new venture
              <div className="absolute -bottom-1 right-4 w-2 h-2 bg-sage-900 transform rotate-45" />
            </div>
          )}
          
          <button
            onClick={() => setShowDialog(true)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 flex items-center justify-center w-14 h-14"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    </>
  );
};