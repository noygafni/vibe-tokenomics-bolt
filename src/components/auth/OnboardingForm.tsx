import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ImageUpload } from '../ImageUpload';

interface OnboardingFormProps {
  onComplete: () => void;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase.auth.updateUser({
        data: {
          username,
          avatar_url: avatarUrl,
          full_name: username,
        }
      });

      if (error) throw error;

      // Update profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: username,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <h2 className="text-2xl font-display font-semibold text-sage-900 mb-2">
        Complete Your Profile
      </h2>
      <p className="text-sage-600 mb-6">
        Choose a username to get started
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4">
            {avatarUrl ? (
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs"
                >
                  ×
                </button>
              </div>
            ) : (
              <ImageUpload
                onUpload={setAvatarUrl}
                className="w-20 h-20 rounded-full bg-sage-100 flex flex-col items-center justify-center text-sage-500 hover:text-sage-600 hover:bg-sage-200 transition-colors cursor-pointer"
              >
                <Camera size={16} className="mb-1" />
                <span className="text-xs">Add Photo</span>
              </ImageUpload>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-sage-700 mb-2">
            Username *
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-sage-300 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            placeholder="Choose a username"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="w-full py-2 bg-coral-500 text-white rounded-xl hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto" />
          ) : (
            'Complete Profile'
          )}
        </button>
      </form>
    </div>
  );
};