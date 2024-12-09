import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { AddVentureForm } from './AddVentureForm';

export const FloatingMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      )}
      
      <div className="fixed bottom-8 right-8 z-50">
        {isOpen && (
          <div className="absolute bottom-16 right-0 mb-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-xl p-8 w-96 border border-white/20">
            <AddVentureForm onClose={() => setIsOpen(false)} />
          </div>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 flex items-center justify-center w-14 h-14"
        >
          {isOpen ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>
    </>
  );
};