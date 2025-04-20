import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { SmartContract } from '../types/venture';

export const useSmartContracts = (ventureId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSmartContract = async (contractData: Omit<SmartContract, 'id' | 'createdAt' | 'updatedAt' | 'signedAt'>) => {
    setLoading(true);
    try {
      // Insert the smart contract
      const { data: contract, error: contractError } = await supabase
        .from('smart_contracts')
        .insert({
          venture_id: ventureId,
          name: contractData.name,
          description: contractData.description,
          v_tokens: contractData.vTokens,
          end_date: contractData.endDate,
          exchange_date: contractData.exchangeDate,
          owner_id: contractData.ownerId,
        })
        .select()
        .single();

      if (contractError) throw contractError;
      if (!contract) throw new Error('Failed to create contract');

      // Insert contract funders
      if (contractData.funders.length > 0) {
        const { error: fundersError } = await supabase
          .from('contract_funders')
          .insert(
            contractData.funders.map(funder => ({
              contract_id: contract.id,
              user_id: funder.memberId,
              tokens: funder.tokens,
            }))
          );

        if (fundersError) throw fundersError;
      }

      return contract;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create smart contract');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSmartContract = async (
    contractId: string,
    contractData: Partial<Omit<SmartContract, 'id' | 'createdAt' | 'updatedAt' | 'signedAt'>>
  ) => {
    setLoading(true);
    try {
      // Update the smart contract
      const { error: contractError } = await supabase
        .from('smart_contracts')
        .update({
          name: contractData.name,
          description: contractData.description,
          v_tokens: contractData.vTokens,
          end_date: contractData.endDate,
          exchange_date: contractData.exchangeDate,
          owner_id: contractData.ownerId,
        })
        .eq('id', contractId);

      if (contractError) throw contractError;

      // Update funders if provided
      if (contractData.funders) {
        // Delete existing funders
        const { error: deleteError } = await supabase
          .from('contract_funders')
          .delete()
          .eq('contract_id', contractId);

        if (deleteError) throw deleteError;

        // Insert new funders
        if (contractData.funders.length > 0) {
          const { error: fundersError } = await supabase
            .from('contract_funders')
            .insert(
              contractData.funders.map(funder => ({
                contract_id: contractId,
                user_id: funder.memberId,
                tokens: funder.tokens,
              }))
            );

          if (fundersError) throw fundersError;
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update smart contract');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSmartContract,
    updateSmartContract,
    loading,
    error,
  };
};