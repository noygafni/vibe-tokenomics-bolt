import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { ImageUpload } from '../components/ImageUpload';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  email: string;
  bio: string;
  phone: string;
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile(data);
          setFullName(data.full_name || '');
          setAvatarUrl(data.avatar_url || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl,
        }
      });

      if (authError) throw authError;

      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update local profile state
      setProfile(prev => prev ? {
        ...prev,
        full_name: fullName,
        avatar_url: avatarUrl,
      } : null);

    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sage-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sage-700 hover:text-sage-900"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-2xl font-display font-semibold text-sage-900">Profile Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-sage-100">
            <div className="relative">
              {avatarUrl ? (
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-sage-200"
                  />
                  <ImageUpload
                    onUpload={setAvatarUrl}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-coral-500 text-white hover:bg-coral-600 flex items-center justify-center shadow-md"
                  >
                    <Camera size={14} />
                  </ImageUpload>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center border-2 border-sage-200">
                    <Camera size={24} className="text-sage-400" />
                  </div>
                  <ImageUpload
                    onUpload={setAvatarUrl}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-coral-500 text-white hover:bg-coral-600 flex items-center justify-center shadow-md"
                  >
                    <Camera size={14} />
                  </ImageUpload>
                </div>
              )}
            </div>
            <div>
              <h2 className="font-medium text-sage-900">{profile?.email || user?.email}</h2>
              <p className="text-sm text-sage-600">Update your profile information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-sage-200 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                placeholder="Enter your display name"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white text-sm rounded-lg hover:bg-coral-600 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};