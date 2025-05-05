import React, { useState } from 'react';
import { Menu, X, User, Settings, LogOut, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-sage-600 hover:text-sage-800 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-sage-200 z-50">
            <div className="p-4 border-b border-sage-200">
              <div className="flex items-center gap-3">
                {user?.user_metadata.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.email || ''}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                    <User size={20} className="text-sage-600" />
                  </div>
                )}
                <div>
                  <div className="font-medium text-sage-900">
                    {user?.user_metadata.full_name || user?.email}
                  </div>
                  <div className="text-sm text-sage-600">{user?.email}</div>
                </div>
              </div>
            </div>

            <div className="py-2">
              <button
                onClick={() => handleNavigation('/profile')}
                className="flex items-center gap-3 w-full px-4 py-2 text-left text-sage-700 hover:bg-sage-50"
              >
                <User size={18} />
                Profile
              </button>
              <button
                onClick={() => handleNavigation('/wallet')}
                className="flex items-center gap-3 w-full px-4 py-2 text-left text-sage-700 hover:bg-sage-50"
              >
                <Wallet size={18} />
                Wallet
              </button>
              <button
                onClick={() => handleNavigation('/settings')}
                className="flex items-center gap-3 w-full px-4 py-2 text-left text-sage-700 hover:bg-sage-50"
              >
                <Settings size={18} />
                Settings
              </button>
            </div>

            <div className="border-t border-sage-200 py-2">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}