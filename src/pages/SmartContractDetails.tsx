import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { supabase } from '../lib/supabase';
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { CreatorAvatar } from "../components/CreatorAvatar";
import { ContractOwnershipModal } from "../components/ContractOwnershipModal";
import { data } from "../../mock-data";

interface SmartContract {
  id: string;
  name: string;
  description: string;
  v_tokens_price: number;
  funded_tokens: number;
  creator: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  owner_id: string | null;
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  status: string;
  created_at: string;
  venture_id: string;
}

interface Creator {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

function SmartContractDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<SmartContract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showOwnershipModal, setShowOwnershipModal] = useState(false);
  const [availableCreators, setAvailableCreators] = useState<Creator[]>([]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "New Contract":
        return "bg-blue-100 text-blue-800";
      case "Waiting for Funding":
        return "bg-purple-100 text-purple-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  useEffect(() => {
    fetchContract();
  }, [id]);

  const fetchContract = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // const { data, error } = await supabase
      //   .from("smart_contracts")
      //   .select(
      //     `
      //     *,
      //     creator:creator_id (
      //       id,
      //       first_name,
      //       last_name,
      //       avatar_url
      //     ),
      //     owner:owner_id (
      //       id,
      //       first_name,
      //       last_name,
      //       avatar_url
      //     )
      //   `
      //   )
      //   .eq("id", id)
      //   .single();

      // if (error) throw error;
      // setContract(data);

      // if (data.status === "New Contract") {
      //   fetchAvailableCreators(data.venture_id, data.creator.id);
      // }
    } catch (err) {
      console.error("Error fetching contract:", err);
      setError("Failed to load contract details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableCreators = async (
    ventureId: string,
    creatorId: string
  ) => {
    try {
      // const { data, error } = await supabase
      //   .from("venture_creators")
      //   .select(
      //     `
      //     creator:creator_id (
      //       id,
      //       first_name,
      //       last_name,
      //       avatar_url
      //     )
      //   `
      //   )
      //   .eq("venture_id", ventureId);
      // if (error) throw error;
      // setAvailableCreators(
      //   data
      //     .map((vc) => vc.creator)
      //     .filter((creator) => creator.id !== creatorId)
      // );
    } catch (err) {
      console.error("Error fetching available creators:", err);
    }
  };

  const handleDelete = async () => {
    if (
      !contract ||
      !window.confirm("Are you sure you want to delete this contract?")
    )
      return;

    try {
      setIsDeleting(true);
      setError(null);

      // const { error } = await supabase
      //   .from("smart_contracts")
      //   .delete()
      //   .eq("id", id);

      // if (error) throw error;

      navigate(`/ventures/${contract.venture_id}`);
    } catch (err) {
      console.error("Error deleting contract:", err);
      setError("Failed to delete contract");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        {error || "Contract not found"}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/ventures/${contract.venture_id}`)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">{contract.name}</h1>
        </div>
        <div className="flex gap-2">
          {contract.status === "New Contract" && (
            <button
              onClick={() => setShowOwnershipModal(true)}
              className="bg-[#FF5D3A] text-white px-4 py-2 rounded-lg hover:bg-[#ff4d2a] transition-colors"
            >
              Assign Owner
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 p-2 rounded-lg disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Trash2 size={20} />
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CreatorAvatar creator={contract.creator} size="md" />
            <div>
              <h3 className="font-medium">
                {`${contract.creator.first_name} ${contract.creator.last_name}`}
              </h3>
              <p className="text-sm text-gray-600">Initiator</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
              contract.status
            )}`}
          >
            {contract.status}
          </span>
        </div>

        {contract.owner && (
          <div className="flex items-center space-x-4 pt-4 border-t">
            <CreatorAvatar creator={contract.owner} size="md" />
            <div>
              <h3 className="font-medium">
                {`${contract.owner.first_name} ${contract.owner.last_name}`}
              </h3>
              <p className="text-sm text-gray-600">Owner</p>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700">
            {contract.description || "No description provided"}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Contract Value</h3>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-[#FF5D3A]">
              {contract.v_tokens_price.toLocaleString()} V Tokens
            </p>
            <p className="text-gray-600">
              Funded: {contract.funded_tokens.toLocaleString()} V Tokens
            </p>
          </div>
        </div>

        <div className="pt-6 border-t">
          <p className="text-sm text-gray-600">
            Created on {new Date(contract.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {showOwnershipModal && contract && (
        <ContractOwnershipModal
          isOpen={true}
          onClose={() => setShowOwnershipModal(false)}
          contract={contract}
          availableCreators={availableCreators}
          onSuccess={fetchContract}
        />
      )}
    </div>
  );
}

export default SmartContractDetails;
