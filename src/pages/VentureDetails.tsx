import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { supabase } from '../lib/supabase';
import {
  Loader2,
  Save,
  Trash2,
  ArrowLeft,
  Upload,
  Camera,
  Edit2,
  X,
  Plus,
  UserPlus,
} from "lucide-react";
import { CreatorAvatar } from "../components/CreatorAvatar";
import { SmartContractForm } from "../components/SmartContractForm";
import { SmartContractsList } from "../components/SmartContractsList";
import { TokenAllocationModal } from "../components/TokenAllocationModal";

interface Venture {
  id: string;
  name: string;
  description: string;
  total_tokens: number;
  image_url: string;
  created_by: string;
  founders_tokens_treasury_percentage: number;
  v_tokens_treasury_percentage: number;
  a_tokens_treasury_percentage: number;
  category: string;
}

interface Creator {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
}

interface VentureCreator {
  id: string;
  creator: Creator;
  role: "Founder" | "Co-Creator";
  v_tokens_allocation: number;
}

interface SmartContract {
  id: string;
  name: string;
  description: string;
  v_tokens_price: number;
  creator: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  status: string;
  funded_tokens: number;
}

function VentureDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [venture, setVenture] = useState<Venture | null>(null);
  const [ventureCreators, setVentureCreators] = useState<VentureCreator[]>([]);
  const [availableCreators, setAvailableCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingCreator, setIsAddingCreator] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<"Founder" | "Co-Creator">(
    "Co-Creator"
  );
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const [isLoadingContracts, setIsLoadingContracts] = useState(true);
  const [contractsError, setContractsError] = useState<string | null>(null);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [selectedVentureCreator, setSelectedVentureCreator] =
    useState<VentureCreator | null>(null);
  const [editingContract, setEditingContract] = useState<SmartContract | null>(
    null
  );

  useEffect(() => {
    if (id) {
      fetchVenture();
      fetchVentureCreators();
      fetchSmartContracts();
    }
  }, [id]);

  const fetchVenture = async () => {
    try {
      setIsLoading(true);
      // const { data, error } = await supabase
      //   .from('ventures')
      //   .select('*')
      //   .eq('id', id)
      //   .single();

      // if (error) throw error;
      // setVenture(data);
      // if (data.image_url) {
      //   setPreviewUrl(data.image_url);
      // }
    } catch (err) {
      console.error("Error fetching venture:", err);
      setError("Failed to load venture details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVentureCreators = async () => {
    try {
      // const { data, error } = await supabase
      //   .from("venture_creators")
      //   .select(
      //     `
      //     id,
      //     role,
      //     v_tokens_allocation,
      //     creator:creator_id (
      //       id,
      //       first_name,
      //       last_name,
      //       email,
      //       avatar_url
      //     )
      //   `
      //   )
      //   .eq("venture_id", id);
      // if (error) throw error;
      // setVentureCreators(data || []);
    } catch (err) {
      console.error("Error fetching venture creators:", err);
    }
  };

  const fetchAvailableCreators = async () => {
    try {
      // const { data, error } = await supabase
      //   .from("creators")
      //   .select("*")
      //   .order("first_name");
      // if (error) throw error;
      // setAvailableCreators(data || []);
    } catch (err) {
      console.error("Error fetching available creators:", err);
    }
  };

  const fetchSmartContracts = async () => {
    try {
      setIsLoadingContracts(true);
      setContractsError(null);

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
      //     )
      //   `
      //   )
      //   .eq("venture_id", id)
      //   .order("created_at", { ascending: false });

      // if (error) throw error;
      // setContracts(data || []);
    } catch (err) {
      console.error("Error fetching smart contracts:", err);
      setContractsError("Failed to load smart contracts");
    } finally {
      setIsLoadingContracts(false);
    }
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const validatePercentages = () => {
    if (!venture) return false;

    const total =
      (venture.founders_tokens_treasury_percentage || 0) +
      (venture.v_tokens_treasury_percentage || 0) +
      (venture.a_tokens_treasury_percentage || 0);

    return total <= 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venture?.name.trim() || !validatePercentages()) return;

    try {
      setIsSubmitting(true);

      let image_url = venture.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        // const { error: uploadError } = await supabase.storage
        //   .from("venture-images")
        //   .upload(fileName, imageFile);

        // if (uploadError) throw uploadError;

        // const {
        //   data: { publicUrl },
        // } = supabase.storage.from("venture-images").getPublicUrl(fileName);

        // image_url = publicUrl;
      }

      // const { error } = await supabase
      //   .from("ventures")
      //   .update({
      //     name: venture.name,
      //     description: venture.description,
      //     total_tokens: venture.total_tokens,
      //     image_url,
      //     founders_tokens_treasury_percentage:
      //       venture.founders_tokens_treasury_percentage,
      //     v_tokens_treasury_percentage: venture.v_tokens_treasury_percentage,
      //     a_tokens_treasury_percentage: venture.a_tokens_treasury_percentage,
      //     category: venture.category,
      //   })
      //   .eq("id", id);

      // if (error) throw error;
      setIsEditing(false);
      fetchVenture();
    } catch (err) {
      console.error("Error updating venture:", err);
      setError("Failed to update venture");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this venture?"))
      return;

    try {
      setIsSubmitting(true);
      // const { error } = await supabase.from("ventures").delete().eq("id", id);

      // if (error) throw error;
      navigate("/");
    } catch (err) {
      console.error("Error deleting venture:", err);
      setError("Failed to delete venture");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCreator = async () => {
    if (!selectedCreator || !selectedRole) return;

    try {
      setIsSubmitting(true);
      // const { error } = await supabase.from("venture_creators").insert({
      //   venture_id: id,
      //   creator_id: selectedCreator,
      //   role: selectedRole,
      //   v_tokens_allocation: 0,
      // });

      // if (error) throw error;

      setIsAddingCreator(false);
      setSelectedCreator("");
      setSelectedRole("Co-Creator");
      await fetchVentureCreators();
    } catch (err) {
      console.error("Error adding creator:", err);
      setError("Failed to add creator");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCreator = async (creatorId: string) => {
    if (!window.confirm("Are you sure you want to remove this creator?"))
      return;

    try {
      // const { error } = await supabase
      //   .from("venture_creators")
      //   .delete()
      //   .eq("id", creatorId);

      // if (error) throw error;
      await fetchVentureCreators();
    } catch (err) {
      console.error("Error removing creator:", err);
      setError("Failed to remove creator");
    }
  };

  const handleDeleteContract = (contractId: string) => {
    setContracts(contracts.filter((c) => c.id !== contractId));
  };

  const getCurrentTotalAllocation = () => {
    return ventureCreators.reduce(
      (total, vc) => total + (vc.v_tokens_allocation || 0),
      0
    );
  };

  const handleCreatorClick = (ventureCreator: VentureCreator) => {
    setSelectedVentureCreator(ventureCreator);
  };

  const handleEditContract = (contract: SmartContract) => {
    setEditingContract(contract);
    setIsCreatingContract(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (error || !venture) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        {error || "Venture not found"}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">{venture.name}</h1>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg"
            >
              <X size={20} />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg"
            >
              <Edit2 size={20} />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 p-2 rounded-lg"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venture Image
                </label>
                <div
                  onClick={handleImageClick}
                  className={`relative group ${
                    isEditing ? "cursor-pointer" : ""
                  }`}
                >
                  <div className="w-full h-48 rounded-lg overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Venture"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Upload className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <Camera
                        className="text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                        size={32}
                      />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venture Name *
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      required
                      value={venture.name}
                      onChange={(e) =>
                        setVenture({ ...venture, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{venture.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={venture.category || ""}
                      onChange={(e) =>
                        setVenture({ ...venture, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Technology, Finance, Healthcare"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {venture.category || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={venture.description}
                      onChange={(e) =>
                        setVenture({ ...venture, description: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    />
                  ) : (
                    <p className="text-gray-900">{venture.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total V Tokens
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={venture.total_tokens}
                      onChange={(e) =>
                        setVenture({
                          ...venture,
                          total_tokens: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {venture.total_tokens.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Treasury Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Founders Tokens Treasury (%)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={venture.founders_tokens_treasury_percentage || 0}
                        onChange={(e) =>
                          setVenture({
                            ...venture,
                            founders_tokens_treasury_percentage:
                              parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {venture.founders_tokens_treasury_percentage || 0}%
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      V Tokens Treasury (%)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={venture.v_tokens_treasury_percentage || 0}
                        onChange={(e) =>
                          setVenture({
                            ...venture,
                            v_tokens_treasury_percentage:
                              parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {venture.v_tokens_treasury_percentage || 0}%
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      A Tokens Treasury (%)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={venture.a_tokens_treasury_percentage || 0}
                        onChange={(e) =>
                          setVenture({
                            ...venture,
                            a_tokens_treasury_percentage:
                              parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {venture.a_tokens_treasury_percentage || 0}%
                      </p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${
                            (venture.founders_tokens_treasury_percentage || 0) +
                            (venture.v_tokens_treasury_percentage || 0) +
                            (venture.a_tokens_treasury_percentage || 0)
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Total allocation:{" "}
                      {(venture.founders_tokens_treasury_percentage || 0) +
                        (venture.v_tokens_treasury_percentage || 0) +
                        (venture.a_tokens_treasury_percentage || 0)}
                      %
                    </p>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !venture.name.trim() ||
                      !validatePercentages()
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
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="w-96">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Creators Team</h2>
              <button
                onClick={() => {
                  setIsAddingCreator(true);
                  fetchAvailableCreators();
                }}
                className="bg-[#FF5D3A] text-white px-3 py-1.5 rounded-lg flex items-center space-x-2 hover:bg-[#ff4d2a] transition-colors text-sm"
              >
                <UserPlus size={16} />
                <span>Add Creator</span>
              </button>
            </div>

            {isAddingCreator ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Creator
                  </label>
                  <select
                    value={selectedCreator}
                    onChange={(e) => setSelectedCreator(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a creator...</option>
                    {availableCreators
                      .filter(
                        (creator) =>
                          !ventureCreators.some(
                            (vc) => vc.creator.id === creator.id
                          )
                      )
                      .map((creator) => (
                        <option key={creator.id} value={creator.id}>
                          {`${creator.first_name} ${creator.last_name}`}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) =>
                      setSelectedRole(
                        e.target.value as "Founder" | "Co-Creator"
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Founder">Founder</option>
                    <option value="Co-Creator">Co-Creator</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsAddingCreator(false)}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCreator}
                    disabled={!selectedCreator || isSubmitting}
                    className="bg-[#FF5D3A] text-white px-3 py-1.5 rounded-lg flex items-center space-x-2 hover:bg-[#ff4d2a] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {ventureCreators.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No team members yet
                  </p>
                ) : (
                  ventureCreators.map((ventureCreator) => (
                    <div
                      key={ventureCreator.id}
                      onClick={() => handleCreatorClick(ventureCreator)}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <CreatorAvatar
                          creator={ventureCreator.creator}
                          size="xl"
                        />
                        <div>
                          <p className="font-medium">
                            {`${ventureCreator.creator.first_name} ${ventureCreator.creator.last_name}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {ventureCreator.role}
                          </p>
                          <p className="text-sm text-gray-600">
                            {ventureCreator.v_tokens_allocation.toLocaleString()}{" "}
                            V Tokens
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCreator(ventureCreator.id);
                        }}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 w-[90%]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Smart Contracts</h2>
          <button
            onClick={() => {
              setEditingContract(null);
              setIsCreatingContract(true);
            }}
            className="bg-[#FF5D3A] text-white px-3 py-1.5 rounded-lg flex items-center space-x-2 hover:bg-[#ff4d2a] transition-colors text-sm"
          >
            <Plus size={16} />
            <span>New Contract</span>
          </button>
        </div>

        <div className="bg-white rounded-lg p-6">
          {isCreatingContract ? (
            <SmartContractForm
              ventureId={id!}
              creators={ventureCreators.map((vc) => ({
                ...vc.creator,
                v_tokens_allocation: vc.v_tokens_allocation,
              }))}
              initialData={
                editingContract
                  ? {
                      id: editingContract.id,
                      name: editingContract.name,
                      description: editingContract.description,
                      v_tokens_price: editingContract.v_tokens_price,
                      creator_id: editingContract.creator.id,
                      funded_tokens: editingContract.funded_tokens,
                    }
                  : undefined
              }
              onCancel={() => {
                setIsCreatingContract(false);
                setEditingContract(null);
              }}
              onSuccess={() => {
                setIsCreatingContract(false);
                setEditingContract(null);
                fetchSmartContracts();
              }}
            />
          ) : (
            <SmartContractsList
              contracts={contracts}
              isLoading={isLoadingContracts}
              error={contractsError}
              onDelete={handleDeleteContract}
              onEdit={handleEditContract}
            />
          )}
        </div>
      </div>

      {selectedVentureCreator && venture && (
        <TokenAllocationModal
          isOpen={true}
          onClose={() => setSelectedVentureCreator(null)}
          ventureCreator={selectedVentureCreator}
          ventureTotalTokens={venture.total_tokens}
          currentTotalAllocation={getCurrentTotalAllocation()}
          onSuccess={fetchVentureCreators}
        />
      )}
    </div>
  );
}

export default VentureDetails;
