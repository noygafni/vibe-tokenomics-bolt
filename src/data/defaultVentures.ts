import type { Venture } from '../types/venture';

export const defaultVentures: Venture[] = [
  {
    id: '1',
    name: 'Vibe Tokenomics',
    description: 'A decentralized platform revolutionizing co-creation through innovative tokenomics, enabling transparent and fair collaboration between founders and creators.',
    ventureImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80',
    members: [
      { 
        id: '1', 
        name: 'Ronen', 
        role: 'Founder',
        vTokens: 250000,
        aTokens: 0,
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80' 
      },
      { 
        id: '2', 
        name: 'Adi', 
        role: 'Co-Creator',
        vTokens: 100000,
        aTokens: 0,
        imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80' 
      },
      { 
        id: '3', 
        name: 'Moran', 
        role: 'Co-Creator',
        vTokens: 100000,
        aTokens: 0,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80' 
      },
      { 
        id: '4', 
        name: 'Noy', 
        role: 'Co-Creator',
        vTokens: 100000,
        aTokens: 0,
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80' 
      },
    ],
    category: 'Web3',
    periodInMonths: 12,
    totalTokens: 1000000,
    vTokenTreasury: 20,
    aTokenTreasury: 15,
    smartContracts: [
      {
        id: 'contract-1',
        name: 'Initial Token Distribution',
        description: 'Distribution of tokens to founding team members based on their roles and contributions.',
        vTokens: 100000,
        endDate: '2024-12-31',
        exchangeDate: '2025-01-31',
        ownerId: '1',
        funders: [
          { memberId: '2', tokens: 30000 },
          { memberId: '3', tokens: 35000 },
          { memberId: '4', tokens: 35000 }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        signedAt: new Date('2024-01-02')
      },
      {
        id: 'contract-2',
        name: 'Platform Development Phase 1',
        description: 'Token allocation for the initial development phase of the platform.',
        vTokens: 150000,
        endDate: '2024-06-30',
        exchangeDate: '2024-07-31',
        ownerId: '2',
        funders: [
          { memberId: '1', tokens: 75000 },
          { memberId: '3', tokens: 35000 },
          { memberId: '4', tokens: 40000 }
        ],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        signedAt: new Date('2024-01-16')
      }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '2',
    name: 'DeFi Analytics Hub',
    description: 'Advanced analytics platform for decentralized finance, providing real-time insights and market analysis.',
    ventureImage: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80',
    members: [
      {
        id: '5',
        name: 'Sarah',
        role: 'Founder',
        vTokens: 300000,
        aTokens: 0,
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'
      },
      {
        id: '6',
        name: 'Michael',
        role: 'Co-Creator',
        vTokens: 200000,
        aTokens: 0,
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80'
      },
      {
        id: '7',
        name: 'Elena',
        role: 'Co-Creator',
        vTokens: 150000,
        aTokens: 0,
        imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80'
      }
    ],
    category: 'Analytics',
    periodInMonths: 18,
    totalTokens: 1500000,
    vTokenTreasury: 25,
    aTokenTreasury: 20,
    smartContracts: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  }
];