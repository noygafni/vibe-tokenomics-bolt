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
      const { data, error: venturesError } = await supabase
        .from('venture_members_with_profiles')
        .select(`
          venture_id,
          user_id,
          role,
          v_tokens,
          a_tokens,
          initial_tokens,
          full_name,
          avatar_url,
          ventures (
            id,
            name,
            description,
            banner_url,
            venture_image,
            category,
            period_in_months,
            total_tokens,
            v_token_treasury,
            a_token_treasury,
            created_at,
            updated_at,
            smart_contracts (
              id,
              name,
              description,
              v_tokens,
              end_date,
              exchange_date,
              owner_id,
              signed_at,
              created_at,
              updated_at,
              contract_funders (
                user_id,
                tokens
              )
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (venturesError) throw venturesError;

      // Group members by venture
      const ventureMap = new Map<string, Venture>();
      
      data?.forEach(row => {
        const venture = row.ventures;
        if (!venture) return;

        if (!ventureMap.has(venture.id)) {
          ventureMap.set(venture.id, {
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
            members: [],
            smartContracts: venture.smart_contracts.map(contract => ({
              id: contract.id,
              name: contract.name,
              description: contract.description || '',
              vTokens: contract.v_tokens,
              endDate: contract.end_date,
              exchangeDate: contract.exchange_date,
              ownerId: contract.owner_id,
              funders: contract.contract_funders.map(funder => ({
                memberId: funder.user_id,
                tokens: funder.tokens,
              })),
              createdAt: new Date(contract.created_at),
              updatedAt: new Date(contract.updated_at),
              signedAt: contract.signed_at ? new Date(contract.signed_at) : undefined,
            })),
            createdAt: new Date(venture.created_at),
            updatedAt: new Date(venture.updated_at),
          });
        }

        const currentVenture = ventureMap.get(venture.id)!;
        currentVenture.members.push({
          id: row.user_id,
          name: row.full_name,
          imageUrl: row.avatar_url,
          role: row.role,
          vTokens: row.v_tokens,
          aTokens: row.a_tokens,
          initialTokens: row.initial_tokens,
        });
      });

      setVentures(Array.from(ventureMap.values()));
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
      // Insert venture
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

      // Insert venture members
      const { error: membersError } = await supabase
        .from('venture_members')
        .insert(
          ventureData.members.map(member => ({
            venture_id: venture.id,
            user_id: member.id,
            role: member.role,
            v_tokens: member.vTokens,
            a_tokens: member.aTokens,
            initial_tokens: member.initialTokens,
          }))
        );

      if (membersError) throw membersError;

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