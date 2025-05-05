import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from './useSupabase';
import { Venture, User } from '../types/models';

export const useVentures = () => {
  const supabase = useSupabase();
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVentures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch ventures
      const { data: venturesData, error: venturesError } = await supabase
        .from('ventures')
        .select('*')
        .order('created_at', { ascending: false });

      if (venturesError) throw venturesError;

      // For each venture, fetch its members
      const venturesWithMembers = await Promise.all(
        venturesData.map(async (venture: any) => {
          // First get user_to_venture data
          const { data: userToVentureData, error: membersError } = await supabase
            .from('user_to_venture')
            .select('user_id, type')
            .eq('venture_id', venture.id);

          if (membersError) throw membersError;

          // Then get profiles for each user
          const members = await Promise.all(
            userToVentureData?.map(async (utv: any) => {
              // Get the user's profile
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('name, avatar_url, role')
                .eq('id', utv.user_id)
                .single();

              if (profileError) {
                console.error('Error fetching profile:', profileError);
                return null;
              }

              if (!profileData) {
                console.warn('No profile found for user:', utv.user_id);
                return null;
              }

              return {
                id: utv.user_id,
                name: profileData.name,
                image_url: profileData.avatar_url,
                role: profileData.role,
                type: utv.type
              };
            }) || []
          );

          // Filter out any null members (failed profile fetches)
          const validMembers = members.filter(member => member !== null);

          return {
            ...venture,
            members: validMembers,
          } as Venture;
        })
      );

      setVentures(venturesWithMembers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching ventures');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchVentures();

    // Subscribe to changes in the ventures table
    const subscription = supabase
      .channel('ventures_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ventures',
        },
        () => {
          fetchVentures();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchVentures]);

  return { ventures, loading, error, refetch: fetchVentures };
}; 