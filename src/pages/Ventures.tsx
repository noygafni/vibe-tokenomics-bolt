import React, { useState, useEffect } from "react";
import { Plus, X, Upload, Loader2, LogIn } from "lucide-react";
// import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Venture } from "../types/models.ts";

function Ventures() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Venture>({
    id: "-1",
    name: "",
    description: "",
    image_url: "",
    v_token_amount: 0,
    end_date: "",
    category: "",
    created_at: "",
    members: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    checkAuth();
    fetchVentures();
  }, []);

  const checkAuth = async () => {
    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();
    // setIsAuthenticated(!!user);
  };

  const fetchVentures = async () => {
    try {
      setIsLoading(true);
      // const { data, error } = await supabase
      //   .from("ventures")
      //   .select(
      //     `
      //     *,
      //     members:venture_members(count)
      //   `
      //   )
      //   .order("name", { ascending: true });

      // if (error) throw error;
      // setVentures(data || []);
    } catch (err) {
      console.error("Error fetching ventures:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email: 'test@example.com',
    //   password: 'test123'
    // });

    const data = [];
    const error = "";

    if (error) {
      console.error("Error signing in:", error);
      return;
    }

    setIsAuthenticated(true);
    fetchVentures();
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
    if (!formData?.name.trim()) return;

    try {
      setIsSubmitting(true);

      // const {
      //   data: { user },
      // } = await supabase.auth.getUser();
      // if (!user) {
      //   throw new Error("User not authenticated");
      // }

      let image_url = formData.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        // const { error: uploadError, data } = await supabase.storage
        //   .from("venture-images")
        //   .upload(fileName, imageFile);

        // if (uploadError) throw uploadError;

        // const {
        //   data: { publicUrl },
        // } = supabase.storage.from("venture-images").getPublicUrl(fileName);

        // image_url = publicUrl;
      }

      // const { error, data } = await supabase
      //   .from("ventures")
      //   .insert({
      //     ...formData,
      //     image_url,
      //     created_by: user.id,
      //   })
      //   .select()
      //   .single();

      // if (error) throw error;

      const data: Venture[] = [
        {
          id: "1",
          name: "Ronen Gafni",
          description: "",
          image_url: "",
          created_at: new Date().toISOString(),
          members: [],
          v_token_amount: 2000,
          end_date: new Date().toISOString(),
          category: "",
        },
      ];
      // setVentures([...ventures, { ...[data], members: [] }]);
      setVentures(data);
      setIsCreating(false);
      setFormData({
        id: "-1",
        name: "",
        description: "",
        image_url: "",
        v_token_amount: 0,
        end_date: "",
        category: "",
        created_at: Date.now().toLocaleString(),
        members: [],
      });
      setImageFile(null);
      setPreviewUrl("");
    } catch (error) {
      console.error("Error creating venture:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-gray-600">
          Please sign in to create and manage ventures
        </p>
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

  return (
    <div className="relative min-h-full">
      <h1 className="text-2xl font-bold mb-8">Ventures</h1>

      {!isCreating ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ventures.map((venture) => (
            <div
              key={venture.id}
              onClick={() => navigate(`/ventures/${venture.id}`)}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <img
                src={
                  venture.image_url ||
                  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80"
                }
                alt={venture.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
                      />
                    ))}
                  </div>
                  {venture.members?.length > 3 && (
                    <span className="text-sm text-gray-600">
                      +{venture.members?.length - 3}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-1">{venture.name}</h3>
                <p className="text-gray-600 mb-4">{venture.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{venture.members?.length || 0} active members</span>
                  <span>{venture.v_token_amount.toLocaleString()} tokens</span>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Created {new Date(venture.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venture Name *
              </label>
              <input
                type="text"
                required
                value={formData?.name}
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
                value={formData?.description}
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
                value={formData?.v_token_amount}
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

      {!isCreating && (
        <button
          onClick={() => setIsCreating(true)}
          className="fixed bottom-8 right-8 bg-[#FF5D3A] text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg hover:bg-[#ff4d2a] transition-colors"
        >
          <Plus size={20} />
          <span>New Venture</span>
        </button>
      )}
    </div>
  );
}

export default Ventures;
