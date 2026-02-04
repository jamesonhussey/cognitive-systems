/**
 * PRIORITY SYSTEM
 * 
 * Priorities drive character behavior in the simulation.
 * Each character has an ordered list of priorities with weights.
 * The simulation uses these to decide what a character does.
 * 
 * Priority Types:
 * - PERSON: A specific individual (romantic interest, rival, friend)
 * - AMBITION: Career/status goals
 * - SURVIVAL: Job security, money, safety
 * - SOCIAL: General social needs
 * - SELF: Personal health, hobbies, self-care
 * - FAMILY: External family relationships
 * - LEISURE: Fun, relaxation, hobbies
 * - ROMANTIC: Romantic pursuits
 * 
 * Weight: 0-100 scale determining how much this priority influences behavior
 * - 90-100: Obsessive (almost always acts on this)
 * - 70-89: High (frequently prioritizes)
 * - 50-69: Moderate (balanced consideration)
 * - 30-49: Low (occasional focus)
 * - 0-29: Dormant (rarely influences behavior)
 */

export const PRIORITY_TYPES = {
  PERSON: 'person',      // Specific individual
  AMBITION: 'ambition',  // Career advancement
  SURVIVAL: 'survival',  // Job security, money
  SOCIAL: 'social',      // Social connections
  SELF: 'self',          // Self-care, health
  FAMILY: 'family',      // External family
  LEISURE: 'leisure',    // Fun, hobbies
  ROMANTIC: 'romantic'   // Romantic pursuits
};

/**
 * Base priority templates that get personalized per character
 */
export const BASE_PRIORITIES = [
  {
    type: PRIORITY_TYPES.AMBITION,
    name: 'Career Advancement',
    baseWeight: { min: 40, max: 80 },
    description: 'Desire to climb the corporate ladder'
  },
  {
    type: PRIORITY_TYPES.SURVIVAL,
    name: 'Financial Security',
    baseWeight: { min: 50, max: 75 },
    description: 'Need for stable income and job security'
  },
  {
    type: PRIORITY_TYPES.SOCIAL,
    name: 'Social Connection',
    baseWeight: { min: 30, max: 70 },
    description: 'Need for friendship and belonging'
  },
  {
    type: PRIORITY_TYPES.SELF,
    name: 'Personal Health',
    baseWeight: { min: 20, max: 60 },
    description: 'Taking care of physical and mental wellbeing'
  },
  {
    type: PRIORITY_TYPES.FAMILY,
    name: 'Family Contact',
    baseWeight: { min: 10, max: 50 },
    description: 'Maintaining external family relationships'
  },
  {
    type: PRIORITY_TYPES.LEISURE,
    name: 'Hobbies & Relaxation',
    baseWeight: { min: 15, max: 45 },
    description: 'Personal interests and downtime'
  }
];

/**
 * Relationship-based priorities (added when character has strong relationships)
 */
export const RELATIONSHIP_PRIORITY_TEMPLATES = {
  romantic_interest: {
    type: PRIORITY_TYPES.ROMANTIC,
    nameTemplate: '{name}',
    baseWeight: { min: 60, max: 95 },
    description: 'Romantic feelings for this person'
  },
  close_friend: {
    type: PRIORITY_TYPES.PERSON,
    nameTemplate: 'Friendship - {name}',
    baseWeight: { min: 40, max: 70 },
    description: 'Valued friendship'
  },
  rival: {
    type: PRIORITY_TYPES.PERSON,
    nameTemplate: 'Rivalry - {name}',
    baseWeight: { min: 30, max: 60 },
    description: 'Competitive or antagonistic focus'
  },
  mentor: {
    type: PRIORITY_TYPES.PERSON,
    nameTemplate: 'Guidance from {name}',
    baseWeight: { min: 35, max: 55 },
    description: 'Seeking guidance and approval'
  }
};

/**
 * Generate priorities for a character based on their traits and relationships
 */
export function generatePriorities(traits, relationships = []) {
  const priorities = [];
  
  // Add base priorities with trait-modified weights
  for (const basePriority of BASE_PRIORITIES) {
    const weight = calculateWeight(basePriority.baseWeight, traits, basePriority.type);
    priorities.push({
      type: basePriority.type,
      name: basePriority.name,
      weight,
      targetId: null // No specific target for general priorities
    });
  }
  
  // Add person-specific priorities based on relationships
  for (const rel of relationships) {
    if (rel.status === 'love_interest' || rel.status === 'romantic') {
      const template = RELATIONSHIP_PRIORITY_TEMPLATES.romantic_interest;
      priorities.push({
        type: template.type,
        name: template.nameTemplate.replace('{name}', rel.name),
        weight: randomInRange(template.baseWeight),
        targetId: rel.id
      });
    } else if (rel.trustLevel === 'HIGH' && rel.status !== 'supervisor') {
      const template = RELATIONSHIP_PRIORITY_TEMPLATES.close_friend;
      priorities.push({
        type: template.type,
        name: template.nameTemplate.replace('{name}', rel.name),
        weight: randomInRange(template.baseWeight),
        targetId: rel.id
      });
    } else if (rel.status === 'rival' || rel.status === 'enemy') {
      const template = RELATIONSHIP_PRIORITY_TEMPLATES.rival;
      priorities.push({
        type: template.type,
        name: template.nameTemplate.replace('{name}', rel.name),
        weight: randomInRange(template.baseWeight),
        targetId: rel.id
      });
    }
  }
  
  // Sort by weight descending
  priorities.sort((a, b) => b.weight - a.weight);
  
  return priorities;
}

/**
 * Calculate weight with trait modifiers
 */
function calculateWeight(baseWeight, traits, priorityType) {
  let weight = randomInRange(baseWeight);
  
  // Apply trait biases
  for (const trait of traits) {
    if (trait.priorityBias && trait.priorityBias[priorityType]) {
      weight = Math.round(weight * trait.priorityBias[priorityType]);
    }
  }
  
  // Clamp to valid range
  return Math.max(0, Math.min(100, weight));
}

/**
 * Helper to get random number in range
 */
function randomInRange(range) {
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

/**
 * Format priorities as display text (for file generation)
 */
export function formatPrioritiesForFile(priorities) {
  const active = priorities.filter(p => p.weight >= 30);
  const dormant = priorities.filter(p => p.weight < 30);
  
  let output = '[PRIORITY INDEX - ACTIVE]\n';
  output += `Last Updated: ${new Date().toISOString().split('T')[0].replace(/-/g, '.')}\n\n`;
  
  active.forEach((p, i) => {
    const typeLabel = `[${p.type.toUpperCase()}]`;
    output += `${i + 1}. ${p.name.padEnd(25)} ${typeLabel.padEnd(12)} Weight: ${p.weight}\n`;
  });
  
  if (dormant.length > 0) {
    output += '\n[DORMANT PRIORITIES]\n';
    dormant.forEach(p => {
      const typeLabel = `[${p.type.toUpperCase()}]`;
      output += `- ${p.name.padEnd(25)} ${typeLabel.padEnd(12)} Weight: ${p.weight}\n`;
    });
  }
  
  return output;
}
