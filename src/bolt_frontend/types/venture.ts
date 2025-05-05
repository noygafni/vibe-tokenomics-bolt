export type MemberRole = 'Founder' | 'Co-Creator';

export interface Member {
  id: string;
  name: string;
  imageUrl: string;
  role: MemberRole;
  vTokens: number;
  aTokens: number;
  initialTokens?: number; // Added for tracking initial token allocation
}

export interface SmartContractFunder {
  memberId: string;
  tokens: number;
}

export interface SmartContract {
  id: string;
  name: string;
  description: string;
  vTokens: number;
  endDate: string;
  exchangeDate: string;
  ownerId: string;
  funders: SmartContractFunder[];
  createdAt: Date;
  updatedAt: Date;
  signedAt?: Date;
}

export interface Venture {
  id: string;
  name: string;
  description: string;
  bannerUrl?: string;
  ventureImage?: string;
  members: Member[];
  category?: string;
  periodInMonths: number;
  totalTokens: number;
  vTokenTreasury: number;
  aTokenTreasury: number;
  smartContracts: SmartContract[];
  createdAt: Date;
  updatedAt: Date;
}