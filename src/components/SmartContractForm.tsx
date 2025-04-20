import React, { useState, useEffect } from "react";
import { Loader2, Plus, AlertCircle } from "lucide-react";
// import { supabase } from '../lib/supabase';

interface SmartContractFormProps {
  ventureId: string;
  creators: Array<{
    id: string;
    first_name: string;
    last_name: string;
    v_tokens_allocation: number;
  }>;
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: {
    id: string;
    name: string;
    description: string;
    v_tokens_price: number;
    creator_id: string;
    funded_tokens: number;
  };
}

export function SmartContractForm({
  ventureId,
  creators,
  onCancel,
  onSuccess,
  initialData,
}: SmartContractFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    v_tokens_price: initialData?.v_tokens_price || 0,
    creator_id: initialData?.creator_id || "",
    funded_tokens: initialData?.funded_tokens || 0,
  });

  // Calculate minimum and maximum funding based on contract value
  const minFunding = Math.ceil(formData.v_tokens_price * 0.2);
  const maxFunding = Math.floor(formData.v_tokens_price * 0.5);

  // Get selected creator's available tokens
  const selectedCreator = creators.find((c) => c.id === formData.creator_id);
  const availableTokens = selectedCreator?.v_tokens_allocation || 0;

  useEffect(() => {
    // Set default funding to minimum (20%) when contract value changes
    if (formData.v_tokens_price > 0 && !initialData) {
      setFormData((prev) => ({
        ...prev,
        funded_tokens: minFunding,
      }));
    }
  }, [formData.v_tokens_price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.creator_id ||
      formData.v_tokens_price <= 0
    )
      return;
    if (
      formData.funded_tokens < minFunding ||
      formData.funded_tokens > maxFunding
    )
      return;
    if (formData.funded_tokens > availableTokens) return;

    try {
      setIsSubmitting(true);
      setError(null);

      if (initialData) {
        // Update existing contract
        // const { error } = await supabase
        //   .from('smart_contracts')
        //   .update({
        //     name: formData.name,
        //     description: formData.description,
        //     v_tokens_price: formData.v_tokens_price,
        //     creator_id: formData.creator_id,
        //     funded_tokens: formData.funded_tokens
        //   })
        //   .eq('id', initialData.id);
        // if (error) throw error;
      } else {
        // Create new contract
        // const { error } = await supabase.from("smart_contracts").insert({
        //   venture_id: ventureId,
        //   name: formData.name,
        //   description: formData.description,
        //   v_tokens_price: formData.v_tokens_price,
        //   creator_id: formData.creator_id,
        //   funded_tokens: formData.funded_tokens,
        // });
        // if (error) throw error;
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving contract:", err);
      setError("Failed to save contract");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter creators to only show those with available tokens
  const availableCreators = creators.filter(
    (creator) => creator.v_tokens_allocation > 0
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contract Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter contract name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the contract"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contract Value in V Tokens *
        </label>
        <input
          type="number"
          required
          min="1"
          value={formData.v_tokens_price}
          onChange={(e) =>
            setFormData({
              ...formData,
              v_tokens_price: parseInt(e.target.value) || 0,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Initiator *
        </label>
        <select
          required
          value={formData.creator_id}
          onChange={(e) =>
            setFormData({ ...formData, creator_id: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!!initialData} // Disable if editing
        >
          <option value="">Select initiator...</option>
          {availableCreators.map((creator) => (
            <option key={creator.id} value={creator.id}>
              {`${creator.first_name} ${
                creator.last_name
              } (${creator.v_tokens_allocation.toLocaleString()} tokens available)`}
            </option>
          ))}
        </select>
      </div>

      {formData.creator_id && formData.v_tokens_price > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Funding Amount *
          </label>
          <input
            type="number"
            required
            min={minFunding}
            max={Math.min(maxFunding, availableTokens)}
            value={formData.funded_tokens}
            onChange={(e) =>
              setFormData({
                ...formData,
                funded_tokens: parseInt(e.target.value) || 0,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-1 text-sm">
            <p className="text-gray-600">
              Required funding: {minFunding.toLocaleString()} -{" "}
              {maxFunding.toLocaleString()} tokens (20-50%)
            </p>
            <p className="text-gray-600">
              Available tokens: {availableTokens.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </p>
      )}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={
            isSubmitting ||
            !formData.name.trim() ||
            !formData.creator_id ||
            formData.v_tokens_price <= 0 ||
            formData.funded_tokens < minFunding ||
            formData.funded_tokens > maxFunding ||
            formData.funded_tokens > availableTokens
          }
          className="bg-[#FF5D3A] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#ff4d2a] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>{initialData ? "Updating..." : "Creating..."}</span>
            </>
          ) : (
            <>
              <Plus size={20} />
              <span>{initialData ? "Update Contract" : "Create Contract"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
