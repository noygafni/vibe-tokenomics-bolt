import React from 'react';
import { X } from 'lucide-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-sage-600 hover:text-sage-800"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-display font-semibold text-sage-900 mb-6">
          Welcome to Vibe Studio
        </h2>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#ff5533',
                  brandAccent: '#ff2b0a',
                }
              }
            }
          }}
          providers={['google']}
          redirectTo={window.location.origin}
        />
      </div>
    </div>
  );
};