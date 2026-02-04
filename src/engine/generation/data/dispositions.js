/**
 * COMPANY DISPOSITION SYSTEM
 * 
 * Determines how a character feels about Verity Systems and their work.
 * This affects memory tone, self-image, relationship notes, and behavior.
 * 
 * Dispositions are assigned at generation but can evolve during gameplay
 * based on what the character witnesses or experiences.
 */

export const DISPOSITIONS = [
  {
    id: 'true_believer',
    name: 'True Believer',
    weight: 20, // 20% chance
    description: 'Genuinely believes in the company mission, loves their work',
    memoryTone: 'positive',
    selfImageTone: 'confident_positive',
    workAttitude: 'enthusiastic',
    suspicionLevel: 0,
    traits: {
      prefer: ['loyal', 'obedient', 'optimistic', 'confident'],
      avoid: ['paranoid', 'rebellious', 'pessimistic']
    }
  },
  {
    id: 'content',
    name: 'Content',
    weight: 25, // 25% chance
    description: 'Happy with their job, doesn\'t think too deeply about implications',
    memoryTone: 'neutral_positive',
    selfImageTone: 'stable',
    workAttitude: 'satisfied',
    suspicionLevel: 1,
    traits: {
      prefer: ['calm', 'optimistic'],
      avoid: ['paranoid', 'curious']
    }
  },
  {
    id: 'neutral',
    name: 'Neutral',
    weight: 25, // 25% chance
    description: 'It\'s a job, pays the bills, doesn\'t feel strongly either way',
    memoryTone: 'neutral',
    selfImageTone: 'pragmatic',
    workAttitude: 'professional',
    suspicionLevel: 2,
    traits: {
      prefer: [],
      avoid: []
    }
  },
  {
    id: 'skeptical',
    name: 'Skeptical',
    weight: 20, // 20% chance
    description: 'Has doubts, notices inconsistencies, keeps questions to self',
    memoryTone: 'neutral_negative',
    selfImageTone: 'uncertain',
    workAttitude: 'cautious',
    suspicionLevel: 3,
    traits: {
      prefer: ['curious', 'paranoid', 'anxious'],
      avoid: ['obedient', 'loyal']
    }
  },
  {
    id: 'suspicious',
    name: 'Suspicious',
    weight: 10, // 10% chance
    description: 'Knows something is wrong, keeps head down to survive',
    memoryTone: 'negative',
    selfImageTone: 'survival',
    workAttitude: 'guarded',
    suspicionLevel: 4,
    traits: {
      prefer: ['paranoid', 'anxious', 'reclusive'],
      avoid: ['trusting', 'outgoing', 'loyal']
    }
  }
];

/**
 * Select a disposition based on weights and trait compatibility
 */
export function selectDisposition(traits = []) {
  const traitIds = traits.map(t => t.id);
  
  // Calculate adjusted weights based on trait compatibility
  const adjustedDispositions = DISPOSITIONS.map(disp => {
    let weight = disp.weight;
    
    // Boost weight if character has preferred traits
    const preferredMatches = disp.traits.prefer.filter(t => traitIds.includes(t)).length;
    weight += preferredMatches * 10;
    
    // Reduce weight if character has avoided traits
    const avoidedMatches = disp.traits.avoid.filter(t => traitIds.includes(t)).length;
    weight -= avoidedMatches * 15;
    
    return { ...disp, adjustedWeight: Math.max(weight, 5) }; // Minimum 5% chance
  });
  
  // Weighted random selection
  const totalWeight = adjustedDispositions.reduce((sum, d) => sum + d.adjustedWeight, 0);
  let roll = Math.random() * totalWeight;
  
  for (const disp of adjustedDispositions) {
    roll -= disp.adjustedWeight;
    if (roll <= 0) {
      return disp;
    }
  }
  
  return DISPOSITIONS[2]; // Default to neutral
}

/**
 * Get disposition by ID
 */
export function getDisposition(id) {
  return DISPOSITIONS.find(d => d.id === id);
}
