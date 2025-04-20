import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Member } from '../types/venture';

export const useVentureMembers = (ventureId: string) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error: membersError } = await supabase
          .from('venture_members_with_profiles')
          .select('*')
          .eq('venture_id', ventureId);

        if (membersError) throw membersError;

        const transformedMembers: Member[] = (data || []).map(member => ({
          id: member.user_id,
          name: member.full_name,
          imageUrl: member.avatar_url,
          role: member.role,
          vTokens: member.v_tokens,
          aTokens: member.a_tokens,
          initialTokens: member.initial_tokens,
        }));

        setMembers(transformedMembers);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch members'));
      } finally {
        setLoading(false);
      }
    };

    if (ventureId) {
      fetchMembers();
    }
  }, [ventureId]);

  return {
    data: members,
    loading,
    error,
  };
};