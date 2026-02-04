/**
 * PERSONALITY TRAITS
 * 
 * Discrete traits that define character behavior and tendencies.
 * Each character gets 3-5 traits randomly selected.
 * 
 * Trait structure:
 * - id: Unique identifier (used in code)
 * - name: Display name (shown to player)
 * - description: What this trait means
 * - effects: How this affects simulation behavior
 * - incompatible: Traits that can't coexist with this one
 * - priorityBias: Tendency to weight certain priority types higher
 * 
 * Future: Big Five integration could use these as expressions
 * of underlying dimension scores (e.g., high Extraversion → Outgoing, Social)
 */

export const TRAITS = [
  // Positive/Neutral Social
  {
    id: 'outgoing',
    name: 'Outgoing',
    description: 'Enjoys social interaction and seeks out others',
    effects: { socialNeed: 1.5, initiatesConversation: true },
    incompatible: ['reclusive', 'antisocial'],
    priorityBias: { social: 1.3 }
  },
  {
    id: 'empathetic',
    name: 'Empathetic',
    description: 'Sensitive to others\' emotions, often helps coworkers',
    effects: { moodInfluence: 1.5, helpfulness: true },
    incompatible: ['cold', 'callous'],
    priorityBias: { social: 1.2 }
  },
  {
    id: 'loyal',
    name: 'Loyal',
    description: 'Forms strong bonds and sticks by those they trust',
    effects: { relationshipStability: 1.5, betrayalResistance: true },
    incompatible: ['fickle'],
    priorityBias: { romantic: 1.2, social: 1.1 }
  },
  {
    id: 'charming',
    name: 'Charming',
    description: 'Naturally likeable, makes good first impressions',
    effects: { relationshipFormation: 1.5, trustGain: 1.3 },
    incompatible: ['awkward', 'offputting'],
    priorityBias: { social: 1.2 }
  },

  // Negative Social
  {
    id: 'reclusive',
    name: 'Reclusive',
    description: 'Prefers solitude, avoids unnecessary interaction',
    effects: { socialNeed: 0.5, avoidsConversation: true },
    incompatible: ['outgoing', 'attention_seeking'],
    priorityBias: { social: 0.6 }
  },
  {
    id: 'cold',
    name: 'Cold',
    description: 'Emotionally distant, hard to connect with',
    effects: { moodInfluence: 0.5, relationshipFormation: 0.7 },
    incompatible: ['empathetic', 'warm'],
    priorityBias: { social: 0.7 }
  },
  {
    id: 'manipulative',
    name: 'Manipulative',
    description: 'Uses others for personal gain',
    effects: { trustDecay: 1.5, schemingBehavior: true },
    incompatible: ['honest', 'naive'],
    priorityBias: { ambition: 1.3 }
  },
  {
    id: 'jealous',
    name: 'Jealous',
    description: 'Envious of others\' success and relationships',
    effects: { negativeReactions: 1.5, resentmentBuildup: true },
    incompatible: ['content', 'supportive'],
    priorityBias: { ambition: 1.2, romantic: 1.3 }
  },

  // Work/Ambition
  {
    id: 'ambitious',
    name: 'Ambitious',
    description: 'Driven to succeed and advance',
    effects: { workFocus: 1.5, competitiveness: true },
    incompatible: ['lazy', 'content'],
    priorityBias: { ambition: 1.5, survival: 1.2 }
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Obsesses over details, never satisfied',
    effects: { workQuality: 1.3, stressGain: 1.5, taskDuration: 1.3 },
    incompatible: ['careless', 'easygoing'],
    priorityBias: { ambition: 1.2 }
  },
  {
    id: 'lazy',
    name: 'Lazy',
    description: 'Avoids work when possible, takes frequent breaks',
    effects: { workFocus: 0.5, breakFrequency: 1.5 },
    incompatible: ['ambitious', 'workaholic'],
    priorityBias: { leisure: 1.5, ambition: 0.5 }
  },
  {
    id: 'workaholic',
    name: 'Workaholic',
    description: 'Can\'t stop working, neglects personal life',
    effects: { workFocus: 2.0, socialNeed: 0.5, burnoutRisk: 1.5 },
    incompatible: ['lazy', 'balanced'],
    priorityBias: { ambition: 1.8, leisure: 0.3 }
  },

  // Emotional/Mental
  {
    id: 'anxious',
    name: 'Anxious',
    description: 'Prone to worry and stress',
    effects: { stressGain: 1.5, moodVolatility: 1.3 },
    incompatible: ['calm', 'carefree'],
    priorityBias: { survival: 1.3 }
  },
  {
    id: 'calm',
    name: 'Calm',
    description: 'Rarely stressed, handles pressure well',
    effects: { stressGain: 0.5, moodStability: 1.5 },
    incompatible: ['anxious', 'volatile'],
    priorityBias: {}
  },
  {
    id: 'optimistic',
    name: 'Optimistic',
    description: 'Sees the bright side, recovers from setbacks quickly',
    effects: { moodRecovery: 1.5, baselineMood: 1.2 },
    incompatible: ['pessimistic', 'cynical'],
    priorityBias: {}
  },
  {
    id: 'pessimistic',
    name: 'Pessimistic',
    description: 'Expects the worst, dwells on negatives',
    effects: { moodRecovery: 0.7, baselineMood: 0.8 },
    incompatible: ['optimistic'],
    priorityBias: { survival: 1.2 }
  },
  {
    id: 'paranoid',
    name: 'Paranoid',
    description: 'Suspects others\' motives, hard to trust',
    effects: { trustGain: 0.5, suspicionBehavior: true },
    incompatible: ['trusting', 'naive'],
    priorityBias: { survival: 1.4 }
  },
  {
    id: 'volatile',
    name: 'Volatile',
    description: 'Mood swings rapidly, unpredictable reactions',
    effects: { moodVolatility: 2.0, outburstRisk: true },
    incompatible: ['calm', 'stable'],
    priorityBias: {}
  },

  // Moral/Ethical
  {
    id: 'honest',
    name: 'Honest',
    description: 'Values truth, poor at deception',
    effects: { lyingAbility: 0.3, trustworthiness: 1.5 },
    incompatible: ['manipulative', 'deceptive'],
    priorityBias: {}
  },
  {
    id: 'moralistic',
    name: 'Moralistic',
    description: 'Strong ethical code, judges others',
    effects: { guiltSusceptibility: 1.5, judgmentalBehavior: true },
    incompatible: ['amoral'],
    priorityBias: {}
  },
  {
    id: 'obedient',
    name: 'Obedient',
    description: 'Follows orders without question',
    effects: { complianceBonus: 1.5, independentThinking: 0.5 },
    incompatible: ['rebellious', 'independent'],
    priorityBias: { ambition: 1.1 }
  },
  {
    id: 'rebellious',
    name: 'Rebellious',
    description: 'Questions authority, resists control',
    effects: { complianceBonus: 0.5, independentThinking: 1.5 },
    incompatible: ['obedient', 'submissive'],
    priorityBias: { self: 1.3 }
  },

  // Misc
  {
    id: 'curious',
    name: 'Curious',
    description: 'Asks questions, investigates, notices things',
    effects: { awarenessBonus: 1.5, snoopingBehavior: true },
    incompatible: ['incurious'],
    priorityBias: {}
  },
  {
    id: 'forgetful',
    name: 'Forgetful',
    description: 'Poor memory, misses appointments',
    effects: { memoryStability: 0.7, scheduleAdherence: 0.7 },
    incompatible: ['meticulous'],
    priorityBias: {}
  },
  {
    id: 'romantic',
    name: 'Romantic',
    description: 'Falls in love easily, prioritizes relationships',
    effects: { romanticInterest: 1.5, attachmentSpeed: 1.5 },
    incompatible: ['aromantic'],
    priorityBias: { romantic: 1.8 }
  },
  {
    id: 'vengeful',
    name: 'Vengeful',
    description: 'Holds grudges, seeks payback',
    effects: { grudgeFormation: true, forgivenessRate: 0.3 },
    incompatible: ['forgiving'],
    priorityBias: {}
  },
  {
    id: 'insecure',
    name: 'Insecure',
    description: 'Doubts self-worth, seeks validation',
    effects: { validationNeed: 1.5, selfEsteemVolatility: 1.5 },
    incompatible: ['confident'],
    priorityBias: { social: 1.2 }
  },
  {
    id: 'confident',
    name: 'Confident',
    description: 'Self-assured, unshaken by criticism',
    effects: { validationNeed: 0.5, selfEsteemStability: 1.5 },
    incompatible: ['insecure'],
    priorityBias: { ambition: 1.2 }
  }
];

/**
 * How many traits to assign per character
 */
export const TRAIT_COUNT = { min: 3, max: 5 };

/**
 * Select random compatible traits for a character
 */
export function selectTraits(count = null) {
  const numTraits = count || (Math.floor(Math.random() * (TRAIT_COUNT.max - TRAIT_COUNT.min + 1)) + TRAIT_COUNT.min);
  const selected = [];
  const availableTraits = [...TRAITS];
  
  while (selected.length < numTraits && availableTraits.length > 0) {
    const index = Math.floor(Math.random() * availableTraits.length);
    const trait = availableTraits[index];
    
    // Check compatibility with already selected traits
    const isCompatible = selected.every(t => 
      !t.incompatible?.includes(trait.id) && !trait.incompatible?.includes(t.id)
    );
    
    if (isCompatible) {
      selected.push(trait);
    }
    
    // Remove from available pool either way
    availableTraits.splice(index, 1);
  }
  
  return selected;
}

/**
 * Get a trait by ID
 */
export function getTrait(id) {
  return TRAITS.find(t => t.id === id);
}
