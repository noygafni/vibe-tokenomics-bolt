import React, { useState, useEffect } from "react";
import { Loader2, UserPlus, Camera, Plus, AlertCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { supabase } from '../lib/supabase';
// import { useStudioStore } from "../lib/store";
import { CreatorAvatar } from "../components/CreatorAvatar";
import { studio } from "../../mock-data";

interface Creator {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  country: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface CreatorFormData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  bio: string;
  avatar_url: string;
}

function Creators() {
  const navigate = useNavigate();
  const { topBarColor } = studio;
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreatorFormData>({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    country: "",
    bio: "",
    avatar_url: "",
  });

  useEffect(() => {
    fetchCreators();
  }, []);

  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) return true;
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setFormData({ ...formData, phone });

    if (phone && !validatePhoneNumber(phone)) {
      setPhoneError(
        "Phone number must start with + and contain 2-15 digits (e.g., +1234567890)"
      );
    } else {
      setPhoneError(null);
    }
  };

  const fetchCreators = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // const { data, error } = await supabase
      //   .from('creators')
      //   .select('*')
      //   .order('created_at', { ascending: false });

      // if (error) throw error;
      // setCreators(data || []);
    } catch (err) {
      console.error("Error fetching creators:", err);
      setError("Failed to load creators. Please try again.");
    } finally {
      setIsLoading(false);
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
    if (
      !formData.first_name.trim() ||
      !formData.last_name.trim() ||
      !formData.email.trim()
    )
      return;
    if (formData.phone && !validatePhoneNumber(formData.phone)) {
      setPhoneError("Please enter a valid phone number or leave it empty");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let avatar_url = formData.avatar_url;
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        // const { error: uploadError } = await supabase.storage
        //   .from("creator-avatars")
        //   .upload(fileName, imageFile);

        // if (uploadError) throw uploadError;

        // const {
        //   data: { publicUrl },
        // } = supabase.storage.from("creator-avatars").getPublicUrl(fileName);

        // avatar_url = publicUrl;
      }

      // const { data: existingCreator } = await supabase
      //   .from("creators")
      //   .select("id")
      //   .eq("email", formData.email)
      //   .single();

      // if (existingCreator) {
      //   throw new Error("A creator with this email already exists");
      // }

      // const { error: insertError } = await supabase.from("creators").insert({
      //   email: formData.email,
      //   first_name: formData.first_name,
      //   last_name: formData.last_name,
      //   phone: formData.phone || null,
      //   country: formData.country || null,
      //   bio: formData.bio || null,
      //   avatar_url,
      // });

      // if (insertError) throw insertError;

      setIsCreating(false);
      await fetchCreators();
      resetForm();
    } catch (err) {
      console.error("Error creating creator:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save creator profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      country: "",
      bio: "",
      avatar_url: "",
    });
    setImageFile(null);
    setPreviewUrl("");
    setPhoneError(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Creators</h1>
        <button
          onClick={() => {
            setIsCreating(true);
            resetForm();
          }}
          className="bg-[#FF5D3A] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#ff4d2a] transition-colors"
        >
          <UserPlus size={20} />
          <span>Add Creator</span>
        </button>
      </div>

      {isCreating ? (
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Add New Creator</h2>
            <button
              onClick={() => {
                setIsCreating(false);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-[#FF5D3A] text-white p-2 rounded-full cursor-pointer hover:bg-[#ff4d2a] transition-colors">
                  <Plus size={20} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="+1234567890"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    phoneError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {phoneError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.first_name.trim() ||
                  !formData.last_name.trim() ||
                  !formData.email.trim() ||
                  !!phoneError
                }
                className="bg-[#FF5D3A] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#ff4d2a] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    <span>Create Creator</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {creators.map((creator) => (
              <div
                key={creator.id}
                onClick={() => navigate(`/creators/${creator.id}`)}
                className="flex flex-col rounded-lg overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                style={{ backgroundColor: topBarColor }}
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <CreatorAvatar creator={creator} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-lg truncate">
                        {`${creator.first_name} ${creator.last_name}`}
                      </h3>
                      <p className="text-gray-600 truncate">{creator.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mt-4">
                    {creator.phone && (
                      <p className="truncate">📱 {creator.phone}</p>
                    )}
                    {creator.country && (
                      <p className="truncate">🌍 {creator.country}</p>
                    )}
                    {creator.bio && (
                      <p className="line-clamp-3">📝 {creator.bio}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Joined {new Date(creator.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Creators;
