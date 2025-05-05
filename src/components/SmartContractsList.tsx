import React from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { CreatorAvatar } from "./CreatorAvatar";
import { useNavigate } from "react-router-dom";

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
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  status: string;
}

interface SmartContractsListProps {
  contracts: SmartContract[];
  isLoading: boolean;
  error: string | null;
  onDelete?: (contractId: string) => void;
  onEdit?: (contract: SmartContract) => void;
}

export function SmartContractsList({
  contracts,
  isLoading,
  error,
}: SmartContractsListProps) {
  const navigate = useNavigate();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">No smart contracts yet</p>
    );
  }

  return (
    <div className="space-y-6">
      {contracts.map((contract) => (
        <div
          key={contract.id}
          onClick={() => navigate(`/contracts/${contract.id}`)}
          className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{contract.name}</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                contract.status
              )}`}
            >
              {contract.status}
            </span>
          </div>

          {contract.description && (
            <p className="text-gray-600 mb-4">{contract.description}</p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <CreatorAvatar creator={contract.creator} size="md" />
                <div>
                  <span>{`${contract.creator.first_name} ${contract.creator.last_name}`}</span>
                  <p className="text-xs text-gray-500">Initiator</p>
                </div>
              </div>
              {contract.owner && (
                <div className="flex items-center space-x-2">
                  <CreatorAvatar creator={contract.owner} size="md" />
                  <div>
                    <span>{`${contract.owner.first_name} ${contract.owner.last_name}`}</span>
                    <p className="text-xs text-gray-500">Owner</p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-1 text-right">
              <div>
                Contract Value:{" "}
                <span className="font-medium">
                  {contract.v_tokens_price.toLocaleString()} V Tokens
                </span>
              </div>
              <div>
                Funded:{" "}
                <span className="font-medium">
                  {contract.funded_tokens.toLocaleString()} V Tokens
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
