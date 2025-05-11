import React, { useState, useEffect } from "react";
import { AlertCircle, Plus, X, Upload, Loader2, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Venture } from "../types/models.ts";
import bg1 from "../assets/bg1.png";
import profile from "../assets/asset12.png";
import aToken from "../assets/a-token.png";
import vToken from "../assets/v-token.png";
import { useVentures } from "../hooks/useVentures";
import { useSupabase } from "../hooks/useSupabase.ts";

import asset1 from "../assets/Asset1.png";
import asset2 from "../assets/Asset2.png";
import asset3 from "../assets/Asset3.png";
import asset4 from "../assets/Asset4.png";
import asset5 from "../assets/Asset5.png";

const assets = [
  asset1,
  asset2,
  asset3,
  asset4,
  asset5,
  asset5,
  asset5,
  asset5,
  asset5,
];

function Dashboard() {
  const navigate = useNavigate();
  const supabase = useSupabase();
  const { ventures, loading: isLoading, error: venturesError, refetch } = useVentures();
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(true); // TODO: FALSIFY
  // const [error, setError] = useState<string | null>(venturesError);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // TODO: FALSIFY
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: '',
    category: "",
    v_token_amount: 0,
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Default to 1 year from now
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      // setIsAuthenticated(!!session);
      setIsAuthenticated(!!session);
      // setIsAuthenticated(true);
    } catch (err) {
      console.error("Error checking auth:", err);
      setError("Authentication failed");
    }
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'alice@example.com',
        password: 'password123'
      });

      if (error) throw error;

      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error signing in:", err);
      setError("Failed to sign in");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      // if (!user) throw new Error("Not authenticated");

      let image_url = null;
      if (imageFile) {
        try {
          const fileExt = imageFile.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from("venture-images")
            .upload(fileName, imageFile);

          if (uploadError) {
            console.warn("Failed to upload image:", uploadError);
          } else {
            const {
              data: { publicUrl },
            } = supabase.storage.from("venture-images").getPublicUrl(fileName);
            image_url = publicUrl;
          }
        } catch (err) {
          console.warn("Error uploading image:", err);
        }
      }

      const { error: insertError } = await supabase
        .from("ventures")
        .insert({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          v_token_amount: formData.v_token_amount,
          end_date: formData.end_date,
          image_url,
        });

      if (insertError) throw insertError;

      await refetch();

      setIsCreating(false);
      setFormData({
        name: "",
        description: "",
        image_url: '',
        category: "",
        v_token_amount: 0,
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setImageFile(null);
      setPreviewUrl("");
    } catch (err) {
      console.error("Error creating venture:", err);
      setError("Failed to create venture");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-gray-600">Please sign in to view ventures</p>
        <button
          onClick={handleSignIn}
          className="bg-[#FF5D3A] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#ff4d2a] transition-colors"
        >
          <LogIn size={20} />
          <span>Sign In</span>
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div
      style={{ height: "calc(100vh - 50px)" }}
      className="relative overflow-hidden bg-gradient-to-b from-[#d0ddd6] via-[#d0ddd6]/30 to-transparent rounded-t-[50px] text-[#4d4d4d]"
    >
      {!isCreating ? (
        <>
          <div className="flex justify-between items-center p-7 border-b border-b-white">
            <h5 className="text-xl font-bold px-6 flex items-center">Logo</h5>
            <div className="relative">
              <input
                type="text"
                placeholder="Search everything..."
                className="py
                px-6 py-1 placeholder:text-xs border border-gray-200 rounded-full w-52 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {ventures.length === 0 ? (
            <><div className="text-center py-12">
              <p className="text-gray-600">
                No ventures yet. Create your first one!
              </p>
            </div>
            <div className="w-full flex justify-end">
                  <button
                    onClick={() => setIsCreating(true)}
                    className="fixed bottom-8 w-14 h-14 bg-[#FF5D3A] text-white rounded-full flex space-x-2 hover:bg-[#ff4d2a] border-2 border-[#FF5D3A] before:absolute before:inset-0 before:rounded-full before:border-2 before:border-red-50 transition-colors z-50 justify-center items-center"
                  >
                    <Plus size={30} />
                  </button>
                </div>
            </>
          ) : (
            <div className="flex overflow-hidden h-full">
              <div className="relative flex flex-wrap gap-6 px-10 justify-center items-center pt-10 overflow-y-auto pb-36">
                <div className="w-full flex justify-end">
                  <button
                    onClick={() => setIsCreating(true)}
                    className="fixed bottom-8 w-14 h-14 bg-[#FF5D3A] text-white rounded-full flex space-x-2 hover:bg-[#ff4d2a] border-2 border-[#FF5D3A] before:absolute before:inset-0 before:rounded-full before:border-2 before:border-red-50 transition-colors z-50 justify-center items-center"
                  >
                    <Plus size={30} />
                  </button>
                </div>
                {ventures.map((venture) => (
                  <div
                    key={venture.id}
                    onClick={() => navigate(`/ventures/${venture.id}`)}
                    className="group bg-[#2c2e29] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer h-[440px] w-72 rounded-full relative max-w-full hover:drop-shadow-xl border-b-2 hover:border-b-white border-t-2 hover:border-t-[32c2e29] duration-75"
                  >
                    <img
                      src={venture.image_url || bg1}
                      alt={venture.name}
                      className="w-full h-64 object-cover absolute top-0  transition-all duration-300 group-hover:filter group-hover:sepia group-hover:hue-rotate-[330deg] group-hover:saturate-[2] group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 w-full h-[70%] bg-gradient-to-t from-[#2c2e29] via-[#2c2e29] hover:from-[#3c362a] hover:via-[#3c362a] to-transparent">
                      <div className="p-4 z-10 absolute bottom-8 w-full flex flex-col justify-center items-center">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="flex -space-x-5">
                            {assets.slice(0, 5).map((image, i) => (
                              <div
                                key={i}
                                className={`w-10 h-10 rounded-full border-2 border-white`}
                                style={{
                                  backgroundImage: `url(${image})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  zIndex: assets.length - i,
                                }}
                              />
                            ))}
                            {venture.members?.length > 5 && (
                              <div className="text-xl font-extralight text-white absolute right-16 pt-1">
                                +
                              </div>
                            )}
                          </div>
                        </div>
                        {venture.members?.length > 3 && (
                          <div className="text-[11px] text-white font-extralight mt-0 pt-0">
                            {venture.members.length} creators
                          </div>
                        )}
                        <h2 className="text-xl font-semibold mb-0 mt-2 line-clamp-1 text-white w-[90%] text-center">
                          {venture.name}
                        </h2>
                        {/* <p className="text-white mb-3 text-sm line-clamp-2">
                      {venture.description}
                    </p> */}
                        <div className="flex items-center justify-center text-xs font-semibold text-[#ce8900] gap-1">
                          <div className="whitespace-nowrap flex justify-center items-center h-[20px]">
                            {new Date(venture.created_at)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "numeric",
                                year: "2-digit",
                              })
                              .replace(/\//g, ".")}
                          </div>
                          |
                          <div className="whitespace-nowrap flex justify-center items-center h-[20px]">
                            {venture.v_token_amount.toLocaleString()} tokens
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grow h-full bg-[#f2dfc6] border-l border-l-white relative">
                <div className="h-full overflow-y-auto px-8 pt-20 pb-36">
                  <div className="bg-[#a2c5bf] text-[#4d4d4d] rounded-3xl w-full p-4 flex flex-col items-center mb-6">
                    <img className=" w-32 h-32 mt-[-60px] mb-4" src={profile} />
                    <div className="">
                      <h4>Welcome back</h4>
                      <h1 className="text-3xl font-bold whitespace-nowrap opacity-80 my-2">
                        Natalie G.
                      </h1>
                      <h5 className="text-xs text-[#1a1a1a]">Ventures: 3</h5>
                      <h5 className="text-xs text-[#1a1a1a]">
                        Smart contracts: 4
                      </h5>
                      <button className="bg-[#e8e8db] hover:bg-white text-[#666666] w-full rounded-full my-4 text-xs py-2">
                        View more
                      </button>
                    </div>
                  </div>
                  <h2 className="text-lg font-bold mb-2">My Wallet</h2>
                  <div className="flex gap-1 items-center">
                    12,870 <img src={aToken} className="w-4 h-4" />
                  </div>
                  <div className="flex gap-1 items-center">
                    12,870 <img src={vToken} className="w-4 h-4" />
                  </div>

                  <h2 className="text-lg mb-3 mt-5">Latest Transactions</h2>
                  <div className="flex justify-between gap-2 pb-1">
                    <div className="flex gap-1">
                      <div className="w-8 h-8 bg-[#ed6f3e] rounded-full" />
                      <div className="flex flex-col gap-0">
                        <span className="mb-0 pb-0">Re-Nylon</span>{" "}
                        <span className=" text-black/40 font-extralight text-xs mt-0 pb-0">
                          Active Project
                        </span>
                      </div>
                    </div>
                    <span>$1,500</span>
                  </div>
                  <div className="flex justify-between gap-2 pb-1">
                    <div className="flex gap-1">
                      <div className="w-8 h-8 bg-[#ed6f3e] rounded-full" />
                      <div className="flex flex-col gap-0">
                        <span className="mb-0 pb-0 whitespace-nowrap">
                          Gaming Headsets
                        </span>{" "}
                        <span className=" text-black/40 font-extralight text-xs mt-0 pb-0">
                          Active Project
                        </span>
                      </div>
                    </div>
                    <span className=" whitespace-nowrap">$2,370</span>
                  </div>
                  <div className="flex justify-between gap-2 pb-1">
                    <div className="flex gap-1">
                      <div className="w-8 h-8 bg-[#eaa792] rounded-full" />
                      <div className="flex flex-col gap-0">
                        <span className="mb-0 pb-0">Wasteless Show</span>{" "}
                        <span className=" text-black/40 font-extralight text-xs mt-0 pb-0">
                          Smart Contract
                        </span>
                      </div>
                    </div>
                    <span>$900</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Create New Venture</h2>
            <button
              onClick={() => setIsCreating(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 h-[calc(100vh-200px)] overflow-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venture Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter venture name"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                placeholder="Describe your venture"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venture Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                {previewUrl ? (
                  <div className="space-y-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-64 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setPreviewUrl("");
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total V Tokens
              </label>
              <input
                type="number"
                min="0"
                value={formData.v_token_amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    v_token_amount: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim()}
                className="bg-[#FF5D3A] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#ff4d2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    <span>Create Venture</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
