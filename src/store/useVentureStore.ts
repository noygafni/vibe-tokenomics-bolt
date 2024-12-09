import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Venture } from '../types/venture';
import type { Creator } from '../types/creator';
import { StorageManager } from '../services/storageManager';
import { defaultVentures } from '../data/defaultVentures';

interface VentureStore {
  ventures: Venture[];
  creators: Creator[];
  backgroundImage: string;
  backgroundColor: string;
  addVenture: (venture: Omit<Venture, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVenture: (id: string, venture: Partial<Venture>) => void;
  deleteVenture: (id: string) => void;
  setBackgroundImage: (url: string) => void;
  setBackgroundColor: (color: string) => void;
  signContract: (ventureId: string, contractId: string) => void;
  importVentures: (data: { ventures: Venture[], creators: Creator[], backgroundImage: string, backgroundColor: string }) => void;
  addCreator: (creator: Omit<Creator, 'id'>) => void;
  updateCreator: (id: string, creator: Partial<Creator>) => void;
  deleteCreator: (id: string) => void;
}

const storageManager = StorageManager.getInstance();

export const useVentureStore = create<VentureStore>()(
  persist(
    (set) => ({
      ventures: defaultVentures,
      creators: [],
      backgroundImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80',
      backgroundColor: '#fcedda',
      
      addVenture: (ventureData) => {
        try {
          set((state) => {
            const newVentures = [...state.ventures, {
              ...ventureData,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date(),
              updatedAt: new Date(),
            }];
            storageManager.cleanupUnusedImages(newVentures);
            return { ventures: newVentures };
          });
        } catch (error) {
          console.error('Failed to add venture:', error);
          throw new Error('Failed to save venture. Please try with smaller images.');
        }
      },
      
      updateVenture: (id, ventureData) => {
        try {
          set((state) => {
            const newVentures = state.ventures.map((venture) =>
              venture.id === id
                ? { ...venture, ...ventureData, updatedAt: new Date() }
                : venture
            );
            storageManager.cleanupUnusedImages(newVentures);
            return { ventures: newVentures };
          });
        } catch (error) {
          console.error('Failed to update venture:', error);
          throw new Error('Failed to save changes. Please try with smaller images.');
        }
      },
      
      deleteVenture: (id) =>
        set((state) => {
          const newVentures = state.ventures.filter((venture) => venture.id !== id);
          storageManager.cleanupUnusedImages(newVentures);
          return { ventures: newVentures };
        }),
      
      setBackgroundImage: (url) =>
        set({ backgroundImage: url }),

      setBackgroundColor: (color) =>
        set({ backgroundColor: color }),

      importVentures: (data) => {
        try {
          set(() => {
            storageManager.cleanupUnusedImages(data.ventures);
            return {
              ventures: data.ventures,
              creators: data.creators,
              backgroundImage: data.backgroundImage,
              backgroundColor: data.backgroundColor
            };
          });
        } catch (error) {
          console.error('Failed to import data:', error);
          throw new Error('Failed to import data. Please try with a smaller file.');
        }
      },

      signContract: (ventureId, contractId) =>
        set((state) => {
          const newVentures = state.ventures.map((venture) => {
            if (venture.id !== ventureId) return venture;

            const contract = venture.smartContracts?.find(c => c.id === contractId);
            if (!contract || contract.signedAt) return venture;

            const updatedMembers = venture.members.map(member => {
              if (member.id === contract.ownerId) {
                return {
                  ...member,
                  vTokens: (member.vTokens || 0) + contract.vTokens
                };
              }
              
              const funder = contract.funders.find(f => f.memberId === member.id);
              if (funder) {
                return {
                  ...member,
                  vTokens: (member.vTokens || 0) - funder.tokens
                };
              }
              
              return member;
            });

            const updatedContracts = (venture.smartContracts || []).map(c =>
              c.id === contractId
                ? { ...c, signedAt: new Date() }
                : c
            );

            return {
              ...venture,
              members: updatedMembers,
              smartContracts: updatedContracts,
              updatedAt: new Date()
            };
          });

          return { ventures: newVentures };
        }),

      addCreator: (creatorData) =>
        set((state) => ({
          creators: [
            ...state.creators,
            {
              ...creatorData,
              id: Math.random().toString(36).substr(2, 9),
            },
          ],
        })),

      updateCreator: (id, creatorData) =>
        set((state) => ({
          creators: state.creators.map((creator) =>
            creator.id === id
              ? { ...creator, ...creatorData }
              : creator
          ),
        })),

      deleteCreator: (id) =>
        set((state) => ({
          creators: state.creators.filter((creator) => creator.id !== id),
        })),
    }),
    {
      name: 'venture-storage',
      partialize: (state) => ({
        ventures: state.ventures.map(venture => ({
          ...venture,
          createdAt: venture.createdAt.toISOString(),
          updatedAt: venture.updatedAt.toISOString(),
          smartContracts: venture.smartContracts?.map(contract => ({
            ...contract,
            createdAt: contract.createdAt.toISOString(),
            updatedAt: contract.updatedAt.toISOString(),
            signedAt: contract.signedAt?.toISOString(),
          }))
        })),
        creators: state.creators,
        backgroundImage: state.backgroundImage,
        backgroundColor: state.backgroundColor,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.ventures = state.ventures.map(venture => ({
            ...venture,
            createdAt: new Date(venture.createdAt),
            updatedAt: new Date(venture.updatedAt),
            smartContracts: venture.smartContracts?.map(contract => ({
              ...contract,
              createdAt: new Date(contract.createdAt),
              updatedAt: new Date(contract.updatedAt),
              signedAt: contract.signedAt ? new Date(contract.signedAt) : undefined,
            }))
          }));
        }
      },
    }
  )
);