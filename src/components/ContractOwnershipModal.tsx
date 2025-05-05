import React, { useState } from "react";
import { X, Loader2, Save } from "lucide-react";
// import { supabase } from '../lib/supabase';
import { CreatorAvatar } from "./CreatorAvatar";

interface Creator {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

interface ContractOwnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: {
    id: string;
    name: string;
    description: string;
    v_tokens_price: number;
    funded_tokens: number;
    creator: Creator;
  };
  availableCreators: Creator[];
  onSuccess: () => void;
}

export function ContractOwnershipModal({
  isOpen,
  onClose,
  contract,
  availableCreators,
  onSuccess,
}: ContractOwnershipModalProps) {
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOwnerId) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // const { error: updateError } = await supabase
      //   .from('smart_contracts')
      //   .update({
      //     owner_id: selectedOwnerId,
      //     status: 'Waiting for Funding'
      //   })
      //   .eq('id', contract.id);

      // if (updateError) throw updateError;

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error assigning contract owner:", err);
      setError("Failed to assign contract owner");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Assign Contract Owner</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Contract Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-lg mb-2">{contract.name}</p>
            {contract.description && (
              <p className="text-gray-600 text-sm mb-4">
                {contract.description}
              </p>
            )}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <CreatorAvatar creator={contract.creator} size="md" />
                <div>
                  <p className="font-medium">{`${contract.creator.first_name} ${contract.creator.last_name}`}</p>
                  <p className="text-gray-600">Initiator</p>
                </div>
              </div>
              <div className="text-right">
                <p>
                  Value: {contract.v_tokens_price.toLocaleString()} V Tokens
                </p>
                <p>
                  Funded: {contract.funded_tokens.toLocaleString()} V Tokens
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Owner *
            </label>
            <select
              required
              value={selectedOwnerId}
              onChange={(e) => setSelectedOwnerId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose an owner...</option>
              {availableCreators
                .filter((creator) => creator.id !== contract.creator.id)
                .map((creator) => (
                  <option key={creator.id} value={creator.id}>
                    {`${creator.first_name} ${creator.last_name}`}
                  </option>
                ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !selectedOwnerId}
              className="bg-[#FF5D3A] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#ff4d2a] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Assigning...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Assign Owner</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
