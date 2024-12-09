import React from 'react';
import { Search, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { HamburgerMenu } from './navigation/HamburgerMenu';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sage-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 
              onClick={() => navigate('/')}
              className="text-2xl font-display font-semibold text-sage-900 cursor-pointer"
            >
              Vibe Studio
            </h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search everything..."
                className="w-80 pl-10 pr-4 py-2 bg-sage-50/50 border border-sage-200/50 rounded-full text-sm focus:outline-none focus:border-coral-500 focus:ring-1 focus:ring-coral-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400 w-4 h-4" />
            </div>
          </div>
          
          <nav className="flex items-center gap-6">
            {user ? (
              <HamburgerMenu />
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white hover:bg-coral-600 rounded-full font-medium transition-all duration-200"
              >
                <LogIn size={18} />
                Sign In
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}