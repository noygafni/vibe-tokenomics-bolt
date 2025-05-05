import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import {useSupabase} from '../../hooks/useSupabase';
import { useAuth } from '../../hooks/useAuth';

export const SignInForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabase()
  const {setUserDetails} = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setUserDetails(data.user)
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-sage-700 mb-1">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-sage-300 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-sage-700 mb-1">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-sage-300 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2 bg-blue-gray-400 text-white rounded-xl hover:bg-coral-600 disabled:opacity-50"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
        ) : (
          <>
            <LogIn size={18} />
            Sign In
          </>
        )}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-sage-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-sage-500">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
        className="w-full py-2 px-4 border border-sage-300 rounded-xl text-sage-700 hover:bg-sage-50 flex items-center justify-center gap-2"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
        Google
      </button>
    </form>
  );
};