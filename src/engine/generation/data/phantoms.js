/**
 * PHANTOM CHARACTERS
 * 
 * These are characters who don't exist in the current office but can be
 * referenced in memories and backstories. They provide narrative depth
 * without creating contradictions.
 * 
 * Types:
 * - ex_employee: Former coworkers who left/disappeared
 * - family: Family members (parents, siblings, etc.)
 * - friend: Friends from outside work
 * - ex_partner: Past romantic relationships
 * - mentor: Important figures from the past
 * - enemy: People who wronged them
 */

import { generateName } from './names.js';

export const PHANTOM_TYPES = {
  EX_EMPLOYEE: 'ex_employee',
  FAMILY: 'family',
  FRIEND: 'friend',
  EX_PARTNER: 'ex_partner',
  MENTOR: 'mentor',
  ENEMY: 'enemy'
};

/**
 * Templates for phantom character relationships
 */
export const PHANTOM_TEMPLATES = {
  ex_employee: [
    { role: 'Former Colleague', fate: 'left the company', notes: 'We used to work together. Then one day, they were gone.' },
    { role: 'Former Colleague', fate: 'transferred', notes: 'Got moved to another branch. We don\'t talk anymore.' },
    { role: 'Former Mentor', fate: 'retired', notes: 'Taught me everything. Said they couldn\'t do it anymore.' },
    { role: 'Former Colleague', fate: 'disappeared', notes: 'HR said they "moved on." Nobody believes that.' },
    { role: 'Former Friend', fate: 'fired', notes: 'Asked too many questions. Made an example of.' }
  ],
  family: [
    { role: 'Mother', relation: 'parent', notes: 'Calls every Sunday. Worries too much.' },
    { role: 'Father', relation: 'parent', notes: 'Proud of my career. Doesn\'t know the details.' },
    { role: 'Mother', relation: 'parent', notes: 'We don\'t talk anymore. Some wounds don\'t heal.' },
    { role: 'Father', relation: 'parent', notes: 'Passed away years ago. Still think about him.' },
    { role: 'Sister', relation: 'sibling', notes: 'My best friend growing up. Lives far away now.' },
    { role: 'Brother', relation: 'sibling', notes: 'Always competing. Never good enough in his shadow.' },
    { role: 'Sibling', relation: 'sibling', notes: 'Haven\'t spoken in years. Family is complicated.' }
  ],
  friend: [
    { role: 'College Friend', notes: 'One of the few who stayed in touch. Don\'t see them enough.' },
    { role: 'Childhood Friend', notes: 'Known each other forever. They know the real me.' },
    { role: 'Old Roommate', notes: 'Shared an apartment before this job. Good times.' },
    { role: 'Online Friend', notes: 'Never met in person. Sometimes that\'s easier.' }
  ],
  ex_partner: [
    { role: 'Ex-Partner', notes: 'It ended badly. Still hurts to think about.' },
    { role: 'Ex-Partner', notes: 'We grew apart. No one\'s fault really.' },
    { role: 'Ex-Partner', notes: 'They couldn\'t handle my work schedule. Fair enough.' },
    { role: 'First Love', notes: 'A lifetime ago. Wonder where they are now.' }
  ],
  mentor: [
    { role: 'Former Teacher', notes: 'Believed in me when no one else did.' },
    { role: 'Old Boss', notes: 'Taught me how to survive in this industry.' },
    { role: 'Family Friend', notes: 'Guided me through the hardest years.' }
  ],
  enemy: [
    { role: 'Former Friend', notes: 'Betrayed my trust. Never again.' },
    { role: 'Old Rival', notes: 'They won. I moved on. Mostly.' },
    { role: 'Bully', notes: 'Made my life hell for years. Still affects me.' }
  ]
};

/**
 * Generate a phantom character
 */
export function generatePhantom(type) {
  const { firstName, lastName, fullName } = generateName();
  const templates = PHANTOM_TEMPLATES[type] || PHANTOM_TEMPLATES.friend;
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    id: `phantom_${Math.random().toString(36).substring(2, 9)}`,
    type,
    firstName,
    lastName,
    fullName,
    role: template.role,
    relation: template.relation || null,
    fate: template.fate || null,
    notes: template.notes,
    isPhantom: true
  };
}

/**
 * Generate a set of phantom characters for a character's backstory
 * Based on traits and disposition
 */
export function generatePhantomSet(traits, disposition) {
  const phantoms = [];
  const traitIds = traits.map(t => t.id);
  
  // Everyone has some family (1-2 members)
  const familyCount = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < familyCount; i++) {
    phantoms.push(generatePhantom(PHANTOM_TYPES.FAMILY));
  }
  
  // Most have a friend outside work (70% chance)
  if (Math.random() < 0.7) {
    phantoms.push(generatePhantom(PHANTOM_TYPES.FRIEND));
  }
  
  // Romantic types more likely to have ex (50% base, higher for romantic trait)
  const exChance = traitIds.includes('romantic') ? 0.7 : 0.4;
  if (Math.random() < exChance) {
    phantoms.push(generatePhantom(PHANTOM_TYPES.EX_PARTNER));
  }
  
  // Suspicious/skeptical more likely to have ex-employee stories
  if (disposition.suspicionLevel >= 3 && Math.random() < 0.6) {
    phantoms.push(generatePhantom(PHANTOM_TYPES.EX_EMPLOYEE));
  }
  
  // Paranoid or vengeful more likely to have an enemy
  if ((traitIds.includes('paranoid') || traitIds.includes('vengeful')) && Math.random() < 0.5) {
    phantoms.push(generatePhantom(PHANTOM_TYPES.ENEMY));
  }
  
  // Everyone had someone who helped them (mentor) - 40% chance
  if (Math.random() < 0.4) {
    phantoms.push(generatePhantom(PHANTOM_TYPES.MENTOR));
  }
  
  return phantoms;
}
