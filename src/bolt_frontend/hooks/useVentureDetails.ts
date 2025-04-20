import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Venture } from '../types/venture';

export const useVentureDetails = (ventureId: string | undefined) => {
  const [venture, setVenture] = useState<Venture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVenture = async () => {
      if (!ventureId) {
        setError(new Error('No venture ID provided'));
        setLoading(false);
        return;
      }

      try {
        const { data, error: ventureError } = await supabase
          .from('ventures')
          .select('*, venture_members(*, profiles(*)), smart_contracts(*, contract_funders(*))')
          .eq('id', ventureId)
          .single();

        if (ventureError) throw ventureError;
        if (!data) throw new Error('Venture not found');

        const transformedVenture: Venture = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          bannerUrl: data.banner_url,
          ventureImage: data.venture_image,
          category: data.category,
          periodInMonths: data.period_in_months,
          totalTokens: data.total_tokens,
          vTokenTreasury: data.v_token_treasury,
          aTokenTreasury: data.a_token_treasury,
          members: data.venture_members.map(member => ({
            id: member.user_id,
            name: member.profiles.full_name,
            imageUrl: member.profiles.avatar_url,
            role: member.role,
            vTokens: member.v_tokens,
            aTokens: member.a_tokens,
            initialTokens: member.initial_tokens,
          })),
          smartContracts: data.smart_contracts.map(contract => ({
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
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        };

        setVenture(transformedVenture);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch venture'));
      } finally {
        setLoading(false);
      }
    };

    fetchVenture();
  }, [ventureId]);

  return { data: venture, loading, error };
};