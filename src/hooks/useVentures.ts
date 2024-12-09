import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Venture } from '../types/venture';
import { useAuth } from './useAuth';

export const useVentures = () => {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchVentures();
  }, []);

  const fetchVentures = async () => {
    try {
      const { data: venturesData, error: venturesError } = await supabase
        .from('ventures')
        .select(`
          *,
          venture_members (
            user_id,
            role,
            v_tokens,
            a_tokens,
            initial_tokens
          ),
          smart_contracts (
            *,
            contract_funders (
              user_id,
              tokens
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (venturesError) throw venturesError;

      // Get all unique user IDs from ventures, members, and contracts
      const userIds = new Set<string>();
      venturesData?.forEach(venture => {
        userIds.add(venture.created_by);
        venture.venture_members?.forEach(member => userIds.add(member.user_id));
        venture.smart_contracts?.forEach(contract => {
          userIds.add(contract.owner_id);
          contract.contract_funders?.forEach(funder => userIds.add(funder.user_id));
        });
      });

      // Fetch user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', Array.from(userIds));

      if (profilesError) throw profilesError;

      // Transform data to match Venture type
      const transformedVentures: Venture[] = venturesData?.map(venture => ({
        id: venture.id,
        name: venture.name,
        description: venture.description || '',
        bannerUrl: venture.banner_url,
        ventureImage: venture.venture_image,
        category: venture.category,
        periodInMonths: venture.period_in_months,
        totalTokens: venture.total_tokens,
        vTokenTreasury: venture.v_token_treasury,
        aTokenTreasury: venture.a_token_treasury,
        members: venture.venture_members?.map(member => {
          const profile = profiles?.find(p => p.id === member.user_id);
          return {
            id: member.user_id,
            name: profile?.full_name || 'Unknown',
            imageUrl: profile?.avatar_url || '',
            role: member.role,
            vTokens: member.v_tokens,
            aTokens: member.a_tokens,
            initialTokens: member.initial_tokens,
          };
        }) || [],
        smartContracts: venture.smart_contracts?.map(contract => ({
          id: contract.id,
          name: contract.name,
          description: contract.description || '',
          vTokens: contract.v_tokens,
          endDate: contract.end_date,
          exchangeDate: contract.exchange_date,
          ownerId: contract.owner_id,
          funders: contract.contract_funders?.map(funder => ({
            memberId: funder.user_id,
            tokens: funder.tokens,
          })) || [],
          createdAt: new Date(contract.created_at),
          updatedAt: new Date(contract.updated_at),
          signedAt: contract.signed_at ? new Date(contract.signed_at) : undefined,
        })) || [],
        createdAt: new Date(venture.created_at),
        updatedAt: new Date(venture.updated_at),
      })) || [];

      setVentures(transformedVentures);
    } catch (error: any) {
      console.error('Error fetching ventures:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addVenture = async (ventureData: Omit<Venture, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      throw new Error('User must be logged in to create a venture');
    }

    try {
      // First, insert the venture
      const { data: venture, error: ventureError } = await supabase
        .from('ventures')
        .insert({
          name: ventureData.name,
          description: ventureData.description,
          banner_url: ventureData.bannerUrl,
          venture_image: ventureData.ventureImage,
          category: ventureData.category,
          period_in_months: ventureData.periodInMonths,
          total_tokens: ventureData.totalTokens,
          v_token_treasury: ventureData.vTokenTreasury,
          a_token_treasury: ventureData.aTokenTreasury,
          created_by: user.id
        })
        .select()
        .single();

      if (ventureError) throw ventureError;
      if (!venture) throw new Error('Failed to create venture');

      // Add the creator as a founder
      const members = [
        {
          venture_id: venture.id,
          user_id: user.id,
          role: 'Founder' as const,
          v_tokens: 0,
          a_tokens: 0,
          initial_tokens: 0,
        },
        // Add other members
        ...ventureData.members
          .filter(member => member.id !== user.id) // Exclude the creator as they're already added
          .map(member => ({
            venture_id: venture.id,
            user_id: member.id,
            role: member.role,
            v_tokens: member.vTokens,
            a_tokens: member.aTokens,
            initial_tokens: member.initialTokens,
          }))
      ];

      // Insert all members
      const { error: membersError } = await supabase
        .from('venture_members')
        .insert(members);

      if (membersError) throw membersError;

      // Refresh ventures list
      await fetchVentures();
    } catch (error: any) {
      console.error('Error adding venture:', error);
      throw error;
    }
  };

  return {
    ventures,
    loading,
    error,
    addVenture,
    refreshVentures: fetchVentures,
  };
};