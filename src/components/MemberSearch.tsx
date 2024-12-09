import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MemberSearchProps {
  onSelect: (member: { id: string; name: string; imageUrl: string }) => void;
  excludeIds: string[];
}

export const MemberSearch: React.FC<MemberSearchProps> = ({ onSelect, excludeIds }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{
    id: string;
    full_name: string;
    avatar_url: string;
    email: string;
  }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, email')
          .not('id', 'in', `(${excludeIds.join(',')})`)
          .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
          .limit(5);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [query, excludeIds]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full pl-10 pr-4 py-2 border border-sage-300 rounded-xl focus:ring-2 focus:ring-coral-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
      </div>

      {loading && (
        <div className="absolute inset-x-0 top-full mt-2 p-4 bg-white rounded-xl shadow-lg border border-sage-200 z-10">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-sage-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-sage-200 rounded w-3/4"></div>
              <div className="h-3 bg-sage-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute inset-x-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-sage-200 z-10">
          {results.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                onSelect({
                  id: user.id,
                  name: user.full_name,
                  imageUrl: user.avatar_url
                });
                setQuery('');
                setResults([]);
              }}
              className="flex items-center gap-3 w-full p-3 hover:bg-sage-50 transition-colors text-left"
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-sage-200" />
              )}
              <div>
                <div className="font-medium text-sage-900">{user.full_name}</div>
                <div className="text-sm text-sage-600">{user.email}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};