import { useState, useEffect } from 'react';
import { useSupabase } from './useSupabase';
import { Venture, User } from '../types/models';

export const useVentures = () => {
  const supabase = useSupabase();
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVentures = async () => {
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
            const { data: userToVentureData, error: membersError } = await supabase
              .from('user_to_venture')
              .select(`
                user_id,
                users (
                  id,
                  name,
                  email,
                  image_url,
                  created_at,
                  role
                )
              `)
              .eq('venture_id', venture.id);

            if (membersError) throw membersError;

            const members = userToVentureData?.map((utv: any) => ({
              id: utv.users.id,
              name: utv.users.name,
              email: utv.users.email,
              image_url: utv.users.image_url,
              created_at: utv.users.created_at,
              role: utv.users.role
            })) || [];

            return {
              ...venture,
              members,
            } as Venture;
          })
        );

        setVentures(venturesWithMembers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching ventures');
      } finally {
        setLoading(false);
      }
    };

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
  }, [supabase]);

  return { ventures, loading, error };
}; 