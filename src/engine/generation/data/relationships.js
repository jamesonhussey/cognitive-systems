/**
 * RELATIONSHIP SYSTEM
 * 
 * Defines relationship types, statuses, and templates for generation.
 * Relationships are dynamic and can change during simulation.
 * 
 * Key concepts:
 * - Status: The nature of the relationship (supervisor, friend, rival, etc.)
 * - Trust Level: How much they trust this person (NONE, LOW, MODERATE, HIGH, ABSOLUTE)
 * - Notes: Generated text describing the relationship
 */

/**
 * Relationship statuses (editable by player)
 */
export const RELATIONSHIP_STATUSES = [
  { id: 'supervisor', name: 'Supervisor', category: 'professional' },
  { id: 'subordinate', name: 'Subordinate', category: 'professional' },
  { id: 'colleague', name: 'Colleague', category: 'professional' },
  { id: 'mentor', name: 'Mentor', category: 'professional' },
  { id: 'mentee', name: 'Mentee', category: 'professional' },
  { id: 'friend', name: 'Friend', category: 'personal' },
  { id: 'close_friend', name: 'Close Friend', category: 'personal' },
  { id: 'acquaintance', name: 'Acquaintance', category: 'personal' },
  { id: 'stranger', name: 'Stranger', category: 'personal' },
  { id: 'love_interest', name: 'Love Interest', category: 'romantic' },
  { id: 'partner', name: 'Partner', category: 'romantic' },
  { id: 'ex_partner', name: 'Ex-Partner', category: 'romantic' },
  { id: 'rival', name: 'Rival', category: 'negative' },
  { id: 'enemy', name: 'Enemy', category: 'negative' },
  { id: 'distrusted', name: 'Distrusted', category: 'negative' }
];

/**
 * Trust levels (editable by player)
 */
export const TRUST_LEVELS = [
  { id: 'NONE', name: 'None', value: 0 },
  { id: 'LOW', name: 'Low', value: 25 },
  { id: 'MODERATE', name: 'Moderate', value: 50 },
  { id: 'HIGH', name: 'High', value: 75 },
  { id: 'ABSOLUTE', name: 'Absolute', value: 100 }
];

/**
 * Note templates based on status + trust combinations
 * {name} is replaced with the person's name
 * 
 * Add more variants for variety in generation
 */
export const NOTE_TEMPLATES = {
  // Professional relationships
  'supervisor_NONE': [
    'Authority figure. Keep distance.',
    'Do not trust. Watches everything.',
    'Dangerous. Follow orders, nothing more.'
  ],
  'supervisor_LOW': [
    'Keeps a professional distance. Hard to read.',
    'Authority figure. Trust is limited.',
    'Knows more than they say. Watches me sometimes.'
  ],
  'supervisor_MODERATE': [
    'Fair manager. Does their job.',
    'Professional relationship. Mutual respect.',
    'Competent leader. Could be worse.'
  ],
  'supervisor_HIGH': [
    'Good boss. Actually seems to care.',
    'Trusts my judgment. Supportive.',
    'Mentor-like. Looking out for me.'
  ],
  'supervisor_ABSOLUTE': [
    'Would follow anywhere. Complete trust.',
    'Like a second parent. Invaluable guidance.',
    'Best boss imaginable. Lucky to work here.'
  ],
  
  'colleague_NONE': [
    'Avoid. Something off about them.',
    'Cannot be trusted. Stay away.',
    'Dangerous coworker. Watch your back.'
  ],
  'colleague_LOW': [
    'Work acquaintance. Nothing more.',
    'Keep it professional. No deeper connection.',
    'Fine to work with. Would not confide in.'
  ],
  'colleague_MODERATE': [
    'Decent coworker. Chat sometimes.',
    'Friendly enough. Good working relationship.',
    'Reliable colleague. Pleasant interactions.'
  ],
  'colleague_HIGH': [
    'Good friend at work. Can count on them.',
    'Trusted ally. Watch each other\'s backs.',
    'Work wouldn\'t be the same without them.'
  ],
  
  'friend_LOW': [
    'Casual friend. Not very close.',
    'Hang out sometimes. Keep things light.',
    'Friend of convenience. Work proximity.'
  ],
  'friend_MODERATE': [
    'Good friend. Enjoy their company.',
    'Someone I can talk to. Valued relationship.',
    'Makes the workday better.'
  ],
  'friend_HIGH': [
    'Close friend. Would do anything for them.',
    'One of the few I truly trust here.',
    'Real connection. Rare in this place.'
  ],
  
  'close_friend_HIGH': [
    'Best friend. Can tell them anything.',
    'Soul connection. Understand each other completely.',
    'The most important person in my life here.'
  ],
  'close_friend_ABSOLUTE': [
    'Inseparable. They are my person.',
    'Would die for them. No question.',
    'The only real thing in this place.'
  ],
  
  'love_interest_LOW': [
    'Attracted to them. Keep it hidden.',
    'Something there. Too risky to pursue.',
    'Can\'t stop noticing them. Probably nothing.'
  ],
  'love_interest_MODERATE': [
    'Feelings growing. Not sure what to do.',
    'Think about them constantly. Is it mutual?',
    'Connection building. Exciting and terrifying.'
  ],
  'love_interest_HIGH': [
    'In love. Everything else fades around them.',
    'The way they smile changes everything.',
    'Can\'t imagine being without them now.'
  ],
  'love_interest_ABSOLUTE': [
    'Completely devoted. They are everything.',
    'Would burn it all down for them.',
    'Love beyond reason. Obsessive, maybe. Don\'t care.'
  ],
  
  'rival_LOW': [
    'Competitor. Mild annoyance.',
    'Always trying to one-up. Tedious.',
    'Professional friction. Manageable.'
  ],
  'rival_MODERATE': [
    'Serious competitor. Watch them closely.',
    'Tension whenever we interact.',
    'They want what I have. Won\'t give it up.'
  ],
  'rival_HIGH': [
    'Bitter rivalry. This is personal.',
    'One of us will break eventually.',
    'Hate everything about them.'
  ],
  
  'enemy_NONE': [
    'Pure hatred. Dangerous if crossed.',
    'Would destroy them if I could.',
    'Threat to everything. Eliminate if possible.'
  ],
  'enemy_LOW': [
    'Enemy. Avoid at all costs.',
    'Nothing good can come from interaction.',
    'Every encounter is a battle.'
  ],
  
  'stranger_NONE': [
    'No connection. Just a face.',
    'Don\'t know them. Don\'t want to.',
    'Background noise. Irrelevant.'
  ],
  
  // Default fallbacks
  'default_LOW': [
    'Distant relationship. Minimal interaction.',
    'Know of them. That\'s about it.',
    'No strong feelings either way.'
  ],
  'default_MODERATE': [
    'Neutral relationship. Fine.',
    'Normal interaction. Nothing notable.',
    'Adequate connection.'
  ],
  'default_HIGH': [
    'Positive relationship. Value this person.',
    'Good connection. Trusted.',
    'Important to me.'
  ]
};

/**
 * Get a random note for a status/trust combination
 */
export function generateNote(status, trustLevel) {
  const key = `${status}_${trustLevel}`;
  let templates = NOTE_TEMPLATES[key];
  
  // Fall back to default if no specific template
  if (!templates) {
    templates = NOTE_TEMPLATES[`default_${trustLevel}`] || NOTE_TEMPLATES['default_MODERATE'];
  }
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Determine initial relationship status based on roles
 */
export function determineInitialStatus(char1Role, char2Role) {
  // Same department hierarchy
  if (char1Role.seniority > char2Role.seniority && char1Role.departmentId === char2Role.departmentId) {
    return 'subordinate';
  }
  if (char1Role.seniority < char2Role.seniority && char1Role.departmentId === char2Role.departmentId) {
    return 'supervisor';
  }
  
  // Same department, same level
  if (char1Role.departmentId === char2Role.departmentId) {
    return Math.random() > 0.3 ? 'colleague' : 'acquaintance';
  }
  
  // Different department
  return Math.random() > 0.5 ? 'acquaintance' : 'stranger';
}

/**
 * Determine initial trust level based on status and chance
 */
export function determineInitialTrust(status) {
  const trustChances = {
    supervisor: { NONE: 0.05, LOW: 0.4, MODERATE: 0.4, HIGH: 0.14, ABSOLUTE: 0.01 },
    subordinate: { NONE: 0.05, LOW: 0.3, MODERATE: 0.45, HIGH: 0.18, ABSOLUTE: 0.02 },
    colleague: { NONE: 0.02, LOW: 0.2, MODERATE: 0.5, HIGH: 0.25, ABSOLUTE: 0.03 },
    acquaintance: { NONE: 0.1, LOW: 0.5, MODERATE: 0.35, HIGH: 0.05, ABSOLUTE: 0 },
    stranger: { NONE: 0.3, LOW: 0.5, MODERATE: 0.2, HIGH: 0, ABSOLUTE: 0 },
    friend: { NONE: 0, LOW: 0.1, MODERATE: 0.4, HIGH: 0.45, ABSOLUTE: 0.05 },
    rival: { NONE: 0.3, LOW: 0.5, MODERATE: 0.2, HIGH: 0, ABSOLUTE: 0 }
  };
  
  const chances = trustChances[status] || trustChances.acquaintance;
  const roll = Math.random();
  let cumulative = 0;
  
  for (const [level, prob] of Object.entries(chances)) {
    cumulative += prob;
    if (roll < cumulative) return level;
  }
  
  return 'MODERATE';
}

/**
 * Format a single relationship entry for file display
 */
export function formatRelationshipEntry(rel) {
  let output = `${rel.name.toUpperCase()}\n`;
  output += `- Role: ${rel.role}\n`;
  output += `- Status: ${rel.status}\n`;
  output += `- Trust Level: ${rel.trustLevel}\n`;
  output += `- Notes: ${rel.notes}\n`;
  return output;
}

/**
 * Format all relationships for file display
 */
export function formatRelationshipsForFile(relationships, category = 'professional') {
  const filtered = relationships.filter(r => {
    const statusDef = RELATIONSHIP_STATUSES.find(s => s.id === r.status);
    return statusDef?.category === category || 
           (category === 'professional' && ['supervisor', 'subordinate', 'colleague', 'mentor', 'mentee'].includes(r.status));
  });
  
  if (filtered.length === 0) return `[RELATIONSHIP INDEX - ${category.toUpperCase()}]\n\nNo entries.\n`;
  
  let output = `[RELATIONSHIP INDEX - ${category.toUpperCase()}]\n\n`;
  filtered.forEach(rel => {
    output += formatRelationshipEntry(rel) + '\n';
  });
  
  return output;
}
