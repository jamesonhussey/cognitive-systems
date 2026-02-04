/**
 * RELATIONSHIP EVENTS SYSTEM
 * 
 * Defines coordinated relationship events between pairs of characters.
 * These ensure realistic reciprocity (or intentional one-sidedness).
 * 
 * All settings here are easy to tweak!
 */

// ============================================
// CONFIGURATION - Easy to modify!
// ============================================

/**
 * How many special relationships to generate per office
 * Adjust these based on office size and desired drama level
 */
export const EVENT_COUNTS = {
  friendships: { min: 3, max: 6 },      // Total friendship events
  romances: { min: 1, max: 3 },         // Total romance events  
  rivalries: { min: 1, max: 3 }         // Total rivalry events
};

/**
 * Reciprocity rates - chance that a relationship is mutual vs one-sided
 * Higher = more mutual relationships
 */
export const RECIPROCITY_RATES = {
  friendship: 0.70,    // 70% of friendships are mutual
  romance: 0.30,       // 30% of romances are mutual (unrequited love is common)
  rivalry: 0.80        // 80% of rivalries are mutual
};

/**
 * Trust level pairings for mutual relationships
 * Format: [personA, personB] with weights
 */
export const MUTUAL_TRUST_PAIRINGS = {
  friendship: [
    { a: 'HIGH', b: 'HIGH', weight: 40 },
    { a: 'HIGH', b: 'MODERATE', weight: 35 },
    { a: 'MODERATE', b: 'MODERATE', weight: 25 }
  ],
  romance: [
    { a: 'HIGH', b: 'HIGH', weight: 30 },
    { a: 'HIGH', b: 'MODERATE', weight: 40 },
    { a: 'MODERATE', b: 'HIGH', weight: 20 },
    { a: 'MODERATE', b: 'MODERATE', weight: 10 }
  ],
  rivalry: [
    { a: 'LOW', b: 'LOW', weight: 50 },
    { a: 'LOW', b: 'NONE', weight: 30 },
    { a: 'NONE', b: 'LOW', weight: 20 }
  ]
};

/**
 * One-sided relationship configurations
 */
export const ONE_SIDED_CONFIG = {
  friendship: {
    initiator: { status: 'friend', trustOptions: ['HIGH', 'MODERATE'] },
    target: { status: 'colleague', trustOptions: ['MODERATE', 'LOW'] }
  },
  romance: {
    initiator: { status: 'love_interest', trustOptions: ['HIGH', 'MODERATE'] },
    target: { status: 'colleague', trustOptions: ['MODERATE', 'LOW'] }
  },
  rivalry: {
    initiator: { status: 'rival', trustOptions: ['LOW', 'NONE'] },
    target: { status: 'colleague', trustOptions: ['MODERATE', 'LOW'] }
  }
};

/**
 * Chance that a mutual relationship generates matching memories for both
 */
export const MATCHING_MEMORY_CHANCE = 0.60; // 60% chance of paired memories

// ============================================
// EVENT TYPES
// ============================================

export const EVENT_TYPES = {
  // Friendships
  MUTUAL_FRIENDSHIP: {
    id: 'mutual_friendship',
    category: 'friendship',
    description: 'Both consider each other friends',
    statusA: 'friend',
    statusB: 'friend'
  },
  CLOSE_MUTUAL_FRIENDSHIP: {
    id: 'close_mutual_friendship',
    category: 'friendship',
    description: 'Best friends, very close bond',
    statusA: 'close_friend',
    statusB: 'close_friend'
  },
  ONE_SIDED_FRIENDSHIP: {
    id: 'one_sided_friendship',
    category: 'friendship',
    description: 'A considers B a friend, B sees A as just a colleague',
    statusA: 'friend',
    statusB: 'colleague'
  },
  
  // Romance
  MUTUAL_ROMANCE: {
    id: 'mutual_romance',
    category: 'romance',
    description: 'Both have romantic feelings',
    statusA: 'love_interest',
    statusB: 'love_interest'
  },
  UNREQUITED_LOVE: {
    id: 'unrequited_love',
    category: 'romance',
    description: 'A has feelings, B is oblivious',
    statusA: 'love_interest',
    statusB: 'colleague'
  },
  
  // Rivalry
  MUTUAL_RIVALRY: {
    id: 'mutual_rivalry',
    category: 'rivalry',
    description: 'Both see each other as rivals',
    statusA: 'rival',
    statusB: 'rival'
  },
  ONE_SIDED_GRUDGE: {
    id: 'one_sided_grudge',
    category: 'rivalry',
    description: 'A resents B, B doesn\'t notice',
    statusA: 'rival',
    statusB: 'colleague'
  }
};

// ============================================
// PAIRED MEMORY TEMPLATES
// ============================================

/**
 * Memories generated for relationship events
 * Each has version A (for initiator) and version B (for target)
 * Sometimes only A gets a memory (one-sided)
 */
export const EVENT_MEMORIES = {
  mutual_friendship: {
    generateForBoth: true,
    memoryA: {
      title: 'friendship_formed',
      template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

When {other} became more than just a coworker.

We were both working late. Everyone else had gone home.
Started talking. Really talking. About life, about fears, about hopes.

It's rare to find someone you can be real with here.
I don't take it for granted.`
    },
    memoryB: {
      title: 'friendship_formed',
      template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

The night I found a real friend.

{other} and I ended up talking for hours.
No pretense. No corporate masks. Just... honesty.

I remember thinking: finally, someone I can trust.
That feeling hasn't faded.`
    }
  },
  
  close_mutual_friendship: {
    generateForBoth: true,
    memoryA: {
      title: 'best_friend_memory',
      template: `[MEMORY - CORE - HIGH EMOTIONAL WEIGHT]

{other} is the closest thing I have to family here.

We've been through things together. Covered for each other.
Shared secrets that could get us both in trouble.

I would do anything for them. I think they'd do the same.`
    },
    memoryB: {
      title: 'best_friend_memory',
      template: `[MEMORY - CORE - HIGH EMOTIONAL WEIGHT]

I don't know what I'd do without {other}.

This place would have broken me by now if not for them.
We look out for each other. Always.

Some bonds are stronger than blood.`
    }
  },
  
  one_sided_friendship: {
    generateForBoth: false,
    memoryA: {
      title: 'friendship_hope',
      template: `[MEMORY - RECENT - MODERATE EMOTIONAL WEIGHT]

I think {other} and I are becoming real friends.

We've had some good conversations lately.
They probably don't think about it as much as I do.

But I feel like we have a connection. I hope I'm not imagining it.`
    }
    // No memory for B - they don't think about it
  },
  
  mutual_romance: {
    generateForBoth: true,
    memoryA: {
      title: 'romance_blooming',
      template: `[MEMORY - CORE - HIGH EMOTIONAL WEIGHT]

The way {other} looks at me.

I've tried to ignore it. Tried to stay professional.
But there's something there. I see it in their eyes too.

This is dangerous. This is stupid.
I don't care.`
    },
    memoryB: {
      title: 'romance_blooming',
      template: `[MEMORY - CORE - HIGH EMOTIONAL WEIGHT]

I can't stop thinking about {other}.

Every meeting, every passing glance in the hallway.
My heart does something stupid every time.

I think they feel it too. God, I hope they feel it too.`
    }
  },
  
  unrequited_love: {
    generateForBoth: false,
    memoryA: {
      title: 'unrequited_feelings',
      template: `[MEMORY - CORE - HIGH EMOTIONAL WEIGHT]

I watch {other} more than I should.

The way they smile. The way they focus when they work.
They have no idea. They see me as just another coworker.

Maybe that's for the best. Maybe it's torture.
Either way, I can't help it.`
    }
    // No memory for B - they're oblivious
  },
  
  mutual_rivalry: {
    generateForBoth: true,
    memoryA: {
      title: 'rivalry_formed',
      template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

The moment I knew {other} was my enemy.

Something they said. Something they did.
Doesn't matter now. What matters is the score.

They want what I have. Or I want what they have.
Either way, only one of us can win.`
    },
    memoryB: {
      title: 'rivalry_formed',
      template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

{other} has had it out for me from the start.

I don't know what I did to deserve it.
But I see the way they look at me. The little undermines.

Fine. If that's how they want to play it.`
    }
  },
  
  one_sided_grudge: {
    generateForBoth: false,
    memoryA: {
      title: 'grudge_memory',
      template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

I can't forgive {other} for what they did.

They probably don't even remember. To them, it was nothing.
But I remember. I remember every detail.

Someday they'll understand. Someday the scales will balance.`
    }
    // No memory for B - they don't even know
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Pick a random trust pairing for a mutual relationship
 */
export function pickTrustPairing(category) {
  const pairings = MUTUAL_TRUST_PAIRINGS[category];
  if (!pairings) return { a: 'MODERATE', b: 'MODERATE' };
  
  const totalWeight = pairings.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * totalWeight;
  
  for (const pairing of pairings) {
    roll -= pairing.weight;
    if (roll <= 0) return { a: pairing.a, b: pairing.b };
  }
  
  return { a: 'MODERATE', b: 'MODERATE' };
}

/**
 * Pick a random trust level from an array
 */
export function pickTrust(options) {
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Determine if a relationship should be mutual or one-sided
 */
export function shouldBeMutual(category) {
  const rate = RECIPROCITY_RATES[category] || 0.5;
  return Math.random() < rate;
}

/**
 * Get random count within range
 */
export function getEventCount(category) {
  const range = EVENT_COUNTS[category];
  if (!range) return 2;
  return range.min + Math.floor(Math.random() * (range.max - range.min + 1));
}

/**
 * Should we generate matching memories for both parties?
 */
export function shouldGenerateMatchingMemory() {
  return Math.random() < MATCHING_MEMORY_CHANCE;
}
