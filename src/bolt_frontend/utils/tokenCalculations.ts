import type { SmartContract } from '../types/venture';

interface TokenTransaction {
  type: 'received' | 'spent';
  amount: number;
  contractId: string;
  contractName: string;
  date: Date;
}

interface TokenBalance {
  currentBalance: number;
  transactions: TokenTransaction[];
}

export const calculateTokenBalance = (
  userId: string,
  initialTokens: number,
  contracts: SmartContract[]
): TokenBalance => {
  let currentBalance = initialTokens;
  const transactions: TokenTransaction[] = [];

  // Process only signed contracts
  contracts
    .filter(contract => contract.signedAt)
    .sort((a, b) => a.signedAt!.getTime() - b.signedAt!.getTime())
    .forEach(contract => {
      // Add tokens if user is the contract owner
      if (contract.ownerId === userId) {
        currentBalance += contract.vTokens;
        transactions.push({
          type: 'received',
          amount: contract.vTokens,
          contractId: contract.id,
          contractName: contract.name,
          date: contract.signedAt!
        });
      }

      // Subtract tokens if user is a funder
      const funder = contract.funders.find(f => f.memberId === userId);
      if (funder) {
        currentBalance -= funder.tokens;
        transactions.push({
          type: 'spent',
          amount: funder.tokens,
          contractId: contract.id,
          contractName: contract.name,
          date: contract.signedAt!
        });
      }
    });

  return {
    currentBalance,
    transactions
  };
};

export const formatTokenAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(amount);
};