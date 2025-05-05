import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  ArrowLeft,
  Edit2,
  Trash2,
  AlertCircle,
  Save,
  Camera,
  Plus,
  X,
} from "lucide-react";
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

function CreatorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { topBarColor } = studio;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    fetchCreator();
  }, [id]);

  const fetchCreator = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // const { data, error } = await supabase
      //   .from('creators')
      //   .select('*')
      //   .eq('id', id)
      //   .single();

      // if (error) throw error;
      // setCreator(data);
      // if (data.avatar_url) {
      //   setPreviewUrl(data.avatar_url);
      // }
    } catch (err) {
      console.error("Error fetching creator:", err);
      setError("Failed to load creator details");
    } finally {
      setIsLoading(false);
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) return true;
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    if (creator) {
      setCreator({ ...creator, phone });

      if (phone && !validatePhoneNumber(phone)) {
        setPhoneError(
          "Phone number must start with + and contain 2-15 digits (e.g., +1234567890)"
        );
      } else {
        setPhoneError(null);
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creator?.first_name.trim() || !creator?.last_name.trim()) return;
    if (creator.phone && !validatePhoneNumber(creator.phone)) {
      setPhoneError("Please enter a valid phone number or leave it empty");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let avatar_url = creator.avatar_url;
      // if (imageFile) {
      //   const fileExt = imageFile.name.split(".").pop();
      //   const fileName = `${Math.random()}.${fileExt}`;
      //   const { error: uploadError } = await supabase.storage
      //     .from("creator-avatars")
      //     .upload(fileName, imageFile);

      //   if (uploadError) throw uploadError;

      //   const {
      //     data: { publicUrl },
      //   } = supabase.storage.from("creator-avatars").getPublicUrl(fileName);

      //   avatar_url = publicUrl;
      // }

      // const { error: updateError } = await supabase
      //   .from("creators")
      //   .update({
      //     first_name: creator.first_name,
      //     last_name: creator.last_name,
      //     phone: creator.phone || null,
      //     country: creator.country || null,
      //     bio: creator.bio || null,
      //     avatar_url,
      //   })
      //   .eq("id", id);

      // if (updateError) throw updateError;

      setIsEditing(false);
      await fetchCreator();
    } catch (err) {
      console.error("Error updating creator:", err);
      setError("Failed to update creator profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this creator?"))
      return;

    try {
      // const { error } = await supabase.from("creators").delete().eq("id", id);

      // if (error) throw error;
      navigate("/creators");
    } catch (err) {
      console.error("Error deleting creator:", err);
      setError("Failed to delete creator");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
        <AlertCircle size={20} />
        <span>{error || "Creator not found"}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/creators")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Creator Details</h1>
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

      <div className="bg-white rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6" style={{ backgroundColor: topBarColor }}>
            <div className="flex items-center space-x-4">
              <div
                onClick={handleImageClick}
                className={`relative group ${
                  isEditing ? "cursor-pointer" : ""
                }`}
              >
                {creator && <CreatorAvatar creator={creator} size="lg" />}
                {isEditing && (
                  <>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-full flex items-center justify-center">
                      <Camera
                        className="text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                        size={32}
                      />
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </>
                )}
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={creator.first_name}
                      onChange={(e) =>
                        setCreator({ ...creator, first_name: e.target.value })
                      }
                      className="text-2xl font-bold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={creator.last_name}
                      onChange={(e) =>
                        setCreator({ ...creator, last_name: e.target.value })
                      }
                      className="text-2xl font-bold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      placeholder="Last Name"
                    />
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold">
                    {`${creator.first_name} ${creator.last_name}`}
                  </h2>
                )}
                <p className="text-gray-600">{creator.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{creator.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="tel"
                          value={creator.phone || ""}
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
                    ) : (
                      <p className="text-gray-900">
                        {creator.phone || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={creator.country || ""}
                        onChange={(e) =>
                          setCreator({ ...creator, country: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {creator.country || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Bio</h3>
                {isEditing ? (
                  <textarea
                    value={creator.bio || ""}
                    onChange={(e) =>
                      setCreator({ ...creator, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-700">
                    {creator.bio || "No bio provided"}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-2">
                Additional Information
              </h3>
              <p className="text-gray-600">
                Joined on {new Date(creator.created_at).toLocaleDateString()}
              </p>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !creator.first_name.trim() ||
                    !creator.last_name.trim() ||
                    !!phoneError
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
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatorDetails;
