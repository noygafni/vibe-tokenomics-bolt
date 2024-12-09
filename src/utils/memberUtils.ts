import type { Venture } from '../types/venture';
import type { Creator } from '../types/creator';

export const getActiveMembers = (venture: Venture, creators: Creator[]) => {
  const activeMembers = new Set<string>();

  // Add founders
  venture.members
    .filter(member => member.role === 'Founder')
    .forEach(member => activeMembers.add(member.id));

  // Add active contract participants
  venture.smartContracts?.forEach(contract => {
    // Add contract owner
    activeMembers.add(contract.ownerId);
    // Add funders
    contract.funders.forEach(funder => activeMembers.add(funder.memberId));
  });

  // Map to creator objects
  return Array.from(activeMembers)
    .map(id => creators.find(creator => creator.id === id))
    .filter((creator): creator is Creator => creator !== undefined);
};