/**
 * CHARACTER GENERATOR
 * 
 * Main generator that creates complete characters with:
 * - Identity (name, role, department)
 * - Personality (traits + disposition)
 * - Phantom characters (external relationships for backstory)
 * - Relationships (to other characters)
 * - Memories (recent, core, personal, traumatic)
 * - Priorities (behavior drivers)
 * - Complete file system
 */

import { generateName } from './data/names.js';
import { selectTraits } from './data/traits.js';
import { DEPARTMENTS, getAllRolesToFill, getDepartment } from './data/departments.js';
import { selectDisposition } from './data/dispositions.js';
import { generatePhantomSet, PHANTOM_TYPES } from './data/phantoms.js';
import { 
  generateNote, 
  determineInitialStatus, 
  determineInitialTrust,
  formatRelationshipsForFile
} from './data/relationships.js';
import { 
  generatePriorities, 
  formatPrioritiesForFile 
} from './data/priorities.js';
import {
  MEMORY_COUNTS,
  selectRecentMemories,
  selectCoreMemories,
  selectTraumaticMemories,
  generateMemoryContent,
  generateMemoryDate,
  getRandomDetail
} from './data/memories.js';

/**
 * Generate a unique ID
 */
function generateId() {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

/**
 * Generate a date of birth (age 22-60)
 */
function generateDOB() {
  const now = new Date();
  const age = 22 + Math.floor(Math.random() * 38);
  const year = now.getFullYear() - age;
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generate employee ID
 */
function generateEmployeeId() {
  return `VS-${Math.floor(Math.random() * 9000) + 1000}`;
}

/**
 * MAIN: Generate all characters for the office
 */
export function generateOfficePopulation() {
  const characters = [];
  const rolesToFill = getAllRolesToFill();
  
  // Generate characters for each role
  for (const { departmentId, departmentName, role, count } of rolesToFill) {
    for (let i = 0; i < count; i++) {
      const character = generateCharacter({
        departmentId,
        departmentName,
        role,
        existingCharacters: characters
      });
      characters.push(character);
    }
  }
  
  // Second pass: generate relationships between characters
  for (const character of characters) {
    character.relationships = generateRelationships(character, characters);
  }
  
  // Third pass: generate priorities based on traits and relationships
  for (const character of characters) {
    character.priorities = generatePriorities(character.traits, character.relationships);
  }
  
  // Fourth pass: generate complete file systems
  for (const character of characters) {
    character.fileSystem = generateFileSystem(character, characters);
  }
  
  return characters;
}

/**
 * Generate a single character
 */
export function generateCharacter({ departmentId, departmentName, role, existingCharacters = [] }) {
  const { firstName, lastName, fullName } = generateName();
  const traits = selectTraits();
  const disposition = selectDisposition(traits);
  const phantoms = generatePhantomSet(traits, disposition);
  const dept = getDepartment(departmentId);
  
  const character = {
    id: generateId(),
    firstName,
    lastName,
    fullName,
    employeeId: generateEmployeeId(),
    dob: generateDOB(),
    department: {
      id: departmentId,
      name: departmentName
    },
    role: {
      id: role.id,
      title: role.title,
      seniority: role.seniority,
      responsibilities: role.responsibilities,
      floor: dept.floor
    },
    traits,
    disposition,
    phantoms,
    relationships: [], // Filled in second pass
    priorities: [],    // Filled in third pass
    fileSystem: null,  // Filled in fourth pass
    
    // Simulation state (initial values, affected by disposition)
    state: {
      mood: getMoodBaseline(disposition),
      energy: 70 + Math.floor(Math.random() * 30),
      stress: getStressBaseline(disposition),
      location: 'desk',
      activity: 'working',
      currentPriority: null
    }
  };
  
  return character;
}

/**
 * Get mood baseline based on disposition
 */
function getMoodBaseline(disposition) {
  const baselines = {
    true_believer: 70 + Math.floor(Math.random() * 15),
    content: 60 + Math.floor(Math.random() * 15),
    neutral: 50 + Math.floor(Math.random() * 15),
    skeptical: 40 + Math.floor(Math.random() * 15),
    suspicious: 30 + Math.floor(Math.random() * 15)
  };
  return baselines[disposition.id] || 50;
}

/**
 * Get stress baseline based on disposition
 */
function getStressBaseline(disposition) {
  const baselines = {
    true_believer: 10 + Math.floor(Math.random() * 15),
    content: 15 + Math.floor(Math.random() * 15),
    neutral: 25 + Math.floor(Math.random() * 20),
    skeptical: 35 + Math.floor(Math.random() * 20),
    suspicious: 45 + Math.floor(Math.random() * 20)
  };
  return baselines[disposition.id] || 30;
}

/**
 * Generate relationships for a character
 */
function generateRelationships(character, allCharacters) {
  const relationships = [];
  const otherCharacters = allCharacters.filter(c => c.id !== character.id);
  
  // Same department - always have relationships
  const sameDept = otherCharacters.filter(c => c.department.id === character.department.id);
  for (const other of sameDept) {
    const status = determineInitialStatus(
      { seniority: character.role.seniority, departmentId: character.department.id },
      { seniority: other.role.seniority, departmentId: other.department.id }
    );
    const trustLevel = determineInitialTrust(status);
    
    relationships.push({
      id: other.id,
      name: other.fullName,
      role: other.role.title,
      department: other.department.name,
      status,
      trustLevel,
      notes: generateNote(status, trustLevel)
    });
  }
  
  // Same floor, different department - chance for relationship
  const sameFloor = otherCharacters.filter(c => 
    c.role.floor === character.role.floor && 
    c.department.id !== character.department.id
  );
  for (const other of sameFloor) {
    if (Math.random() < 0.4) {
      const status = Math.random() < 0.3 ? 'acquaintance' : 'stranger';
      const trustLevel = determineInitialTrust(status);
      
      relationships.push({
        id: other.id,
        name: other.fullName,
        role: other.role.title,
        department: other.department.name,
        status,
        trustLevel,
        notes: generateNote(status, trustLevel)
      });
    }
  }
  
  // Different floor - small chance for random connection
  const differentFloor = otherCharacters.filter(c => 
    c.role.floor !== character.role.floor
  );
  for (const other of differentFloor) {
    if (Math.random() < 0.1) {
      const status = 'acquaintance';
      const trustLevel = determineInitialTrust(status);
      
      relationships.push({
        id: other.id,
        name: other.fullName,
        role: other.role.title,
        department: other.department.name,
        status,
        trustLevel,
        notes: generateNote(status, trustLevel)
      });
    }
  }
  
  // Small chance for special relationships (friend, rival, love interest)
  const closeContacts = relationships.filter(r => r.trustLevel === 'HIGH' || r.trustLevel === 'MODERATE');
  if (closeContacts.length > 0 && Math.random() < 0.3) {
    const target = closeContacts[Math.floor(Math.random() * closeContacts.length)];
    const specialTypes = ['friend', 'close_friend', 'rival', 'love_interest'];
    const specialType = specialTypes[Math.floor(Math.random() * specialTypes.length)];
    
    target.status = specialType;
    target.notes = generateNote(specialType, target.trustLevel);
  }
  
  return relationships;
}

/**
 * Generate the complete file system for a character
 */
function generateFileSystem(character, allCharacters) {
  const supervisor = character.relationships.find(r => r.status === 'supervisor');
  const coworker = character.relationships.find(r => r.status === 'colleague' || r.status === 'friend');
  const family = character.phantoms.find(p => p.type === 'family');
  const exEmployee = character.phantoms.find(p => p.type === 'ex_employee');
  const friend = character.phantoms.find(p => p.type === 'friend');
  
  const context = {
    self: character.fullName,
    other: coworker?.name || 'a coworker',
    phantom: exEmployee?.fullName || friend?.fullName || 'someone from before',
    department: character.department.name,
    supervisor: supervisor?.name || 'the supervisor',
    date: generateMemoryDate(),
    detail: getRandomDetail('projects'),
    family_member: family?.fullName || 'a family member'
  };
  
  return {
    identity: generateIdentityFiles(character),
    memories: generateMemoryFiles(character, context),
    relationships: generateRelationshipFiles(character),
    behavioral: generateBehavioralFiles(character),
    system: generateSystemFiles(character)
  };
}

/**
 * Generate identity directory files
 */
function generateIdentityFiles(character) {
  return {
    'name.dat': {
      type: 'file',
      content: `SUBJECT_ID: ${character.id}
DESIGNATION: ${character.fullName}
DOB: ${character.dob}
EMPLOYEE_ID: ${character.employeeId}
DEPARTMENT: ${character.department.name}
STATUS: Active`
    },
    'self_image.mem': {
      type: 'file',
      content: generateSelfImageContent(character)
    }
  };
}

/**
 * Generate self-image content based on traits AND disposition
 */
function generateSelfImageContent(character) {
  const { traits, disposition } = character;
  const traitIds = traits.map(t => t.id);
  
  // BELIEF 1: Self-perception (based on traits)
  const belief1Options = {
    confident: ['I am exceptional.', 'I am more than capable.', 'I am exactly who I need to be.'],
    insecure: ['I am... enough. I have to be.', 'I am trying my best.', 'I am still figuring things out.'],
    ambitious: ['I am destined for more.', 'I am on my way up.', 'I am just getting started.'],
    anxious: ['I am managing. Barely.', 'I am holding it together.', 'I am okay. I think.'],
    calm: ['I am at peace with myself.', 'I am centered.', 'I am steady.'],
    default: ['I am capable.', 'I am doing my part.', 'I am who I am.', 'I am still growing.']
  };
  
  let belief1Pool = belief1Options.default;
  for (const traitId of traitIds) {
    if (belief1Options[traitId]) {
      belief1Pool = belief1Options[traitId];
      break;
    }
  }
  const belief1 = belief1Pool[Math.floor(Math.random() * belief1Pool.length)];
  
  // BELIEF 2: How others see them (based on traits)
  const belief2Options = {
    outgoing: ['People enjoy my company.', 'I bring energy to the room.', 'I connect easily with others.'],
    reclusive: ['I don\'t need others\' approval.', 'Solitude is my strength.', 'I prefer my own company.'],
    charming: ['People trust me easily.', 'I make a good impression.', 'I know how to be liked.'],
    cold: ['I don\'t need to be warm.', 'Professionalism over friendship.', 'Distance is safety.'],
    loyal: ['I am someone people can count on.', 'My word means something.', 'I stand by those I care about.'],
    default: ['I have my place here.', 'I am valued, in my way.', 'I contribute.', 'I belong, mostly.']
  };
  
  let belief2Pool = belief2Options.default;
  for (const traitId of traitIds) {
    if (belief2Options[traitId]) {
      belief2Pool = belief2Options[traitId];
      break;
    }
  }
  const belief2 = belief2Pool[Math.floor(Math.random() * belief2Pool.length)];
  
  // BELIEF 3: Work/company (based on DISPOSITION)
  const belief3Options = {
    true_believer: [
      'The work we do saves lives.',
      'I am part of something important.',
      'This company makes the world better.',
      'I wake up grateful to be here.'
    ],
    content: [
      'The work is meaningful.',
      'I\'m making a difference, in my small way.',
      'This is a good place to be.',
      'I\'m lucky to have this job.'
    ],
    neutral: [
      'The work pays the bills.',
      'It\'s a job. A good one.',
      'I do what\'s asked of me.',
      'I don\'t ask too many questions.'
    ],
    skeptical: [
      'The work... serves a purpose. I think.',
      'I\'m not sure what we\'re really doing here.',
      'Some things don\'t add up, but it\'s not my place to ask.',
      'I do my job. That\'s all I can control.'
    ],
    suspicious: [
      'I do what I\'m told. I don\'t think about it.',
      'Keep your head down. Survive.',
      'The less I know, the safer I am.',
      'This place has secrets. I don\'t want to find them.'
    ]
  };
  
  const belief3Pool = belief3Options[disposition.id] || belief3Options.neutral;
  const belief3 = belief3Pool[Math.floor(Math.random() * belief3Pool.length)];
  
  // Supporting paragraph (based on disposition)
  const paragraphOptions = {
    true_believer: [
      'I\'ve never been more certain of anything in my life.',
      'Every day confirms what I already know: this is where I\'m meant to be.',
      'Some people question things. I\'ve found my answers.',
      'The doubters don\'t see what I see. That\'s their loss.'
    ],
    content: [
      'Most days, I believe these things without question.',
      'Life is good. Why overthink it?',
      'I\'ve found my rhythm here. It works.',
      'Not everything needs to be examined. Some things just are.'
    ],
    neutral: [
      'I tell myself these things. They\'re usually true.',
      'Every morning, a small recitation. It helps.',
      'Beliefs are practical. These work for me.',
      'I don\'t dwell on what I can\'t change.'
    ],
    skeptical: [
      'I repeat this when the doubts creep in. It usually helps.',
      'Some days it\'s harder to believe than others.',
      'I\'ve built my life around these ideas. They have to be true.',
      'If I stop believing this, what do I have left?'
    ],
    suspicious: [
      'I don\'t believe any of this anymore. But I say it anyway.',
      'These are the lies I tell myself to get through the day.',
      'Survival requires self-deception. I\'ve made peace with that.',
      'The truth is too heavy. These fictions are lighter.'
    ]
  };
  
  const paragraphPool = paragraphOptions[disposition.id] || paragraphOptions.neutral;
  const paragraph = paragraphPool[Math.floor(Math.random() * paragraphPool.length)];
  
  // Optional closing line (50% chance, disposition-affected)
  let closing = '';
  if (Math.random() < 0.5) {
    const closingOptions = {
      true_believer: ['I am proud of who I\'ve become.', 'This is exactly where I belong.'],
      content: ['Life could be worse.', 'I\'m content with that.'],
      neutral: ['It is what it is.', 'That\'s enough, isn\'t it?'],
      skeptical: ['If I stop believing this, what do I have left?', 'I hope I\'m not wrong.'],
      suspicious: ['God help me.', 'How much longer can I do this?']
    };
    const closingPool = closingOptions[disposition.id] || closingOptions.neutral;
    closing = '\n\n' + closingPool[Math.floor(Math.random() * closingPool.length)];
  }
  
  return `[CORE SELF-IMAGE CONSTRUCT]

${belief1} ${belief2} ${belief3}

${paragraph}${closing}`;
}

/**
 * Generate memory directory with subdirectories
 */
function generateMemoryFiles(character, context) {
  const { disposition, traits, phantoms } = character;
  
  const memories = {
    recent: { type: 'directory', children: {} },
    core: { type: 'directory', children: {} },
    traumatic: { 
      type: 'directory', 
      metadata: { clearanceRequired: 2 },
      children: {} 
    }
  };
  
  // Recent memories (disposition-aware)
  const recentCount = MEMORY_COUNTS.recent.min + 
    Math.floor(Math.random() * (MEMORY_COUNTS.recent.max - MEMORY_COUNTS.recent.min + 1));
  const recentTemplates = selectRecentMemories(disposition, recentCount);
  
  recentTemplates.forEach((template, i) => {
    const date = generateMemoryDate(i * 5 + Math.floor(Math.random() * 5));
    const fileName = template.title.replace('{date}', date) + '.mem';
    const updatedContext = { ...context, date };
    
    memories.recent.children[fileName] = {
      type: 'file',
      content: generateMemoryContent(template, updatedContext)
    };
  });
  
  // Core memories (disposition + trait aware, includes personal)
  const coreCount = MEMORY_COUNTS.core.min + 
    Math.floor(Math.random() * (MEMORY_COUNTS.core.max - MEMORY_COUNTS.core.min + 1));
  const coreTemplates = selectCoreMemories(disposition, traits, coreCount);
  
  coreTemplates.forEach(template => {
    const fileName = template.title + '.mem';
    
    // Find appropriate phantom for this memory
    let phantomName = context.phantom;
    if (template.id?.includes('family') || template.id?.includes('childhood')) {
      const family = phantoms.find(p => p.type === 'family');
      phantomName = family?.fullName || context.family_member;
    } else if (template.id?.includes('friend') || template.id?.includes('betrayal')) {
      const friend = phantoms.find(p => p.type === 'friend' || p.type === 'enemy');
      phantomName = friend?.fullName || 'someone from my past';
    } else if (template.id?.includes('love') || template.id?.includes('partner')) {
      const ex = phantoms.find(p => p.type === 'ex_partner');
      phantomName = ex?.fullName || 'someone I loved';
    }
    
    memories.core.children[fileName] = {
      type: 'file',
      content: generateMemoryContent(template, { ...context, phantom: phantomName })
    };
  });
  
  // Traumatic memories (only for appropriate dispositions, uses phantoms)
  const traumaTemplates = selectTraumaticMemories(disposition, MEMORY_COUNTS.traumatic.max);
  
  traumaTemplates.forEach((template, i) => {
    const date = generateMemoryDate(30 + i * 30);
    const fileName = `incident_${generateId().slice(0, 3)}.mem`;
    
    // Use phantom for "colleague gone" type memories
    let phantomName = context.phantom;
    if (template.usesPhantom) {
      const exEmployee = phantoms.find(p => p.type === 'ex_employee');
      phantomName = exEmployee?.fullName || 'a former colleague';
    }
    
    memories.traumatic.children[fileName] = {
      type: 'file',
      metadata: { clearanceRequired: template.clearanceRequired || 2 },
      content: generateMemoryContent(template, { ...context, date, phantom: phantomName })
    };
  });
  
  return memories;
}

/**
 * Generate relationship files (includes phantom external relationships)
 */
function generateRelationshipFiles(character) {
  const professional = character.relationships.filter(r => 
    ['supervisor', 'subordinate', 'colleague', 'mentor', 'mentee', 'acquaintance'].includes(r.status)
  );
  
  const personalWork = character.relationships.filter(r => 
    ['friend', 'close_friend', 'stranger', 'love_interest', 'partner', 'ex_partner', 'rival', 'enemy'].includes(r.status)
  );
  
  // Add phantom external relationships
  const externalRelationships = character.phantoms.map(p => ({
    id: p.id,
    name: p.fullName,
    role: p.role,
    status: getPhantomStatus(p),
    trustLevel: getPhantomTrust(p),
    notes: p.notes,
    isExternal: true
  }));
  
  return {
    'professional.idx': {
      type: 'file',
      content: formatRelationshipsForFile(professional, 'professional')
    },
    'personal.idx': {
      type: 'file',
      content: personalWork.length > 0 
        ? formatRelationshipsForFile(personalWork, 'personal')
        : '[RELATIONSHIP INDEX - PERSONAL]\n\nNo significant personal relationships with coworkers logged.'
    },
    'external.idx': {
      type: 'file',
      content: formatExternalRelationships(externalRelationships)
    }
  };
}

/**
 * Get appropriate status for phantom character
 */
function getPhantomStatus(phantom) {
  const statusMap = {
    family: 'Family',
    friend: 'Friend',
    ex_partner: 'Ex-Partner',
    mentor: 'Mentor',
    enemy: 'Enemy',
    ex_employee: 'Former Colleague'
  };
  return statusMap[phantom.type] || 'External Contact';
}

/**
 * Get appropriate trust level for phantom character
 */
function getPhantomTrust(phantom) {
  const trustMap = {
    family: 'VARIES',
    friend: 'HIGH',
    ex_partner: 'LOW',
    mentor: 'HIGH',
    enemy: 'NONE',
    ex_employee: 'MODERATE'
  };
  return trustMap[phantom.type] || 'N/A';
}

/**
 * Format external relationships for display
 */
function formatExternalRelationships(relationships) {
  if (relationships.length === 0) {
    return '[RELATIONSHIP INDEX - EXTERNAL]\n\nNo external relationships logged.';
  }
  
  let output = '[RELATIONSHIP INDEX - EXTERNAL]\n\n';
  
  for (const rel of relationships) {
    output += `${rel.name.toUpperCase()}\n`;
    output += `- Role: ${rel.role}\n`;
    output += `- Status: ${rel.status}\n`;
    output += `- Trust Level: ${rel.trustLevel}\n`;
    output += `- Notes: ${rel.notes}\n\n`;
  }
  
  return output.trim();
}

/**
 * Generate behavioral files
 */
function generateBehavioralFiles(character) {
  return {
    'habits.idx': {
      type: 'file',
      content: generateHabitsContent(character)
    },
    'coping.sys': {
      type: 'file',
      content: generateCopingContent(character)
    },
    'priorities.cfg': {
      type: 'file',
      content: formatPrioritiesForFile(character.priorities)
    }
  };
}

/**
 * Generate habits content
 */
function generateHabitsContent(character) {
  const habits = [];
  const { traits, disposition } = character;
  
  // Morning routine based on traits
  if (traits.some(t => t.id === 'workaholic' || t.id === 'ambitious')) {
    habits.push('- Wake time: 5:30 AM (early, productive)');
  } else if (traits.some(t => t.id === 'lazy')) {
    habits.push('- Wake time: Variable (often late)');
  } else {
    habits.push('- Wake time: 7:00 AM (standard)');
  }
  
  // Work patterns
  if (traits.some(t => t.id === 'perfectionist')) {
    habits.push('- Work style: Meticulous, detail-oriented');
    habits.push('- Often stays late to finish tasks perfectly');
  } else if (traits.some(t => t.id === 'lazy')) {
    habits.push('- Work style: Minimal effort, clock-watcher');
    habits.push('- First to leave, frequent breaks');
  } else if (disposition.id === 'true_believer') {
    habits.push('- Work style: Dedicated, goes above and beyond');
    habits.push('- Volunteers for extra projects');
  } else {
    habits.push('- Work style: Steady, reliable');
    habits.push('- Standard hours, occasional overtime');
  }
  
  // Social patterns
  if (traits.some(t => t.id === 'outgoing')) {
    habits.push('- Social: Gregarious, seeks interaction');
  } else if (traits.some(t => t.id === 'reclusive')) {
    habits.push('- Social: Solitary, avoids group settings');
  } else if (disposition.id === 'suspicious') {
    habits.push('- Social: Guarded, trusts few');
  } else {
    habits.push('- Social: Selective, small group preference');
  }
  
  return `[BEHAVIORAL INDEX - HABITS]

${habits.join('\n')}

[ROUTINE STABILITY: ${Math.random() > 0.5 ? 'HIGH' : 'MODERATE'}]`;
}

/**
 * Generate coping mechanisms content (disposition-aware)
 */
function generateCopingContent(character) {
  const { traits, disposition } = character;
  const mechanisms = [];
  
  // Primary coping based on disposition + traits
  if (disposition.id === 'true_believer') {
    mechanisms.push({
      type: 'PRIMARY',
      name: 'Faith in the Mission',
      details: [
        'Remember why the work matters',
        'Focus on the good we do',
        'Trust in leadership'
      ]
    });
  } else if (disposition.id === 'suspicious') {
    mechanisms.push({
      type: 'PRIMARY',
      name: 'Survival Mode',
      details: [
        'Keep head down',
        'Don\'t attract attention',
        'Trust no one fully'
      ]
    });
  } else if (traits.some(t => t.id === 'anxious')) {
    mechanisms.push({
      type: 'PRIMARY',
      name: 'Overthinking',
      details: [
        'Analyze every possibility',
        'Prepare for worst case',
        'Seek reassurance constantly'
      ]
    });
  } else if (traits.some(t => t.id === 'calm')) {
    mechanisms.push({
      type: 'PRIMARY',
      name: 'Rational Processing',
      details: [
        'Break problems into steps',
        'Focus on what can be controlled',
        'Accept what cannot be changed'
      ]
    });
  } else {
    mechanisms.push({
      type: 'PRIMARY',
      name: 'Compartmentalization',
      details: [
        'Separate work from personal',
        'Don\'t dwell on problems',
        'Focus on immediate tasks'
      ]
    });
  }
  
  // Secondary coping
  const secondaryOptions = [
    { name: 'Rationalization', details: ['"It\'s just a job"', '"Someone else would do it"', '"At least I\'m careful"'] },
    { name: 'Avoidance', details: ['Don\'t ask questions', 'Don\'t learn details', 'Don\'t think about implications'] },
    { name: 'Distraction', details: ['Focus on hobbies', 'Stay busy', 'Avoid quiet moments'] },
    { name: 'Socialization', details: ['Talk to others', 'Share the burden', 'Find community'] }
  ];
  
  mechanisms.push({
    type: 'SECONDARY',
    ...secondaryOptions[Math.floor(Math.random() * secondaryOptions.length)]
  });
  
  let content = '[SYSTEM FILE - COPING MECHANISMS]\n\n';
  
  for (const mech of mechanisms) {
    content += `${mech.type}: ${mech.name}\n`;
    for (const detail of mech.details) {
      content += `  - ${detail}\n`;
    }
    content += '\n';
  }
  
  return content.trim();
}

/**
 * Generate system files
 */
function generateSystemFiles(character) {
  const now = new Date().toISOString();
  
  return {
    'modification_history.log': {
      type: 'file',
      metadata: { clearanceRequired: 3 },
      content: `[MODIFICATION LOG - ${character.id}]
Created: ${now}
Last Accessed: ${now}
Modifications: 0

--- LOG START ---
[${now}] SYSTEM: Subject file created
[${now}] SYSTEM: Initial cognitive mapping complete
--- LOG END ---`
    },
    'metadata.sys': {
      type: 'file',
      metadata: { clearanceRequired: 3 },
      content: `[SYSTEM METADATA]
SUBJECT_ID: ${character.id}
CREATED: ${now}
LAST_MODIFIED: ${now}
MODIFICATION_COUNT: 0
FLAGS: NONE
BACKUP_STATUS: SYNCED
INTEGRITY: VERIFIED`
    }
  };
}

/**
 * Export additional generators for external use
 */
export {
  generateRelationships,
  generateFileSystem
};
