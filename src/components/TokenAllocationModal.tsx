import React, { useState } from "react";
import { X, Loader2, Save } from "lucide-react";
// import { supabase } from '../lib/supabase';

interface TokenAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ventureCreator: {
    id: string;
    creator: {
      first_name: string;
      last_name: string;
    };
    v_tokens_allocation: number;
  };
  ventureTotalTokens: number;
  currentTotalAllocation: number;
  onSuccess: () => void;
}

export function TokenAllocationModal({
  isOpen,
  onClose,
  ventureCreator,
  ventureTotalTokens,
  currentTotalAllocation,
  onSuccess,
}: TokenAllocationModalProps) {
  const [allocation, setAllocation] = useState(
    ventureCreator.v_tokens_allocation
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableTokens =
    ventureTotalTokens -
    (currentTotalAllocation - ventureCreator.v_tokens_allocation);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (allocation < 0 || allocation > availableTokens) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // const { error: updateError } = await supabase
      //   .from('venture_creators')
      //   .update({ v_tokens_allocation: allocation })
      //   .eq('id', ventureCreator.id);

      // if (updateError) throw updateError;

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating token allocation:", err);
      setError("Failed to update token allocation");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Update Token Allocation</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Creator
            </label>
            <p className="text-gray-900">
              {`${ventureCreator.creator.first_name} ${ventureCreator.creator.last_name}`}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              V Tokens Allocation
            </label>
            <input
              type="number"
              min="0"
              max={availableTokens}
              value={allocation}
              onChange={(e) => setAllocation(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-600">
              Available: {availableTokens.toLocaleString()} tokens
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                isSubmitting || allocation < 0 || allocation > availableTokens
              }
              className="bg-[#FF5D3A] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#ff4d2a] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Allocation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
