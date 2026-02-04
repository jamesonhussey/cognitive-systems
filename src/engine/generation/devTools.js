/**
 * DEVELOPMENT TOOLS FOR CHARACTER GENERATION
 * 
 * These functions are exposed to the browser console for testing.
 * Run them from DevTools (F12) to see generated characters.
 * 
 * Usage:
 *   devGenerateOffice()     - Generate full office, log summary
 *   devGenerateOne()        - Generate and log one character in detail
 *   devShowTraits()         - Show all available traits
 *   devShowDepartments()    - Show department structure
 */

import { generateOfficePopulation, generateCharacter, generateFileSystem } from './CharacterGenerator.js';
import { TRAITS } from './data/traits.js';
import { DEPARTMENTS, FLOORS, getAllRolesToFill } from './data/departments.js';
import { generatePriorities } from './data/priorities.js';

/**
 * Generate full office and display summary
 */
export function devGenerateOffice() {
  console.log('%c=== GENERATING OFFICE POPULATION ===', 'color: #22d3ee; font-weight: bold; font-size: 14px;');
  
  const startTime = performance.now();
  const characters = generateOfficePopulation();
  const elapsed = (performance.now() - startTime).toFixed(2);
  
  console.log(`%cGenerated ${characters.length} characters in ${elapsed}ms`, 'color: #22d3ee;');
  console.log('');
  
  // Group by department
  const byDept = {};
  for (const char of characters) {
    const dept = char.department.name;
    if (!byDept[dept]) byDept[dept] = [];
    byDept[dept].push(char);
  }
  
  // Display by department
  for (const [dept, chars] of Object.entries(byDept)) {
    console.log(`%c${dept}`, 'color: #f59e0b; font-weight: bold;');
    for (const char of chars) {
      const traits = char.traits.map(t => t.name).join(', ');
      console.log(`  ${char.fullName} - ${char.role.title}`);
      console.log(`    %cTraits: ${traits}`, 'color: #888;');
    }
    console.log('');
  }
  
  // Disposition stats
  const dispCounts = {};
  for (const char of characters) {
    const d = char.disposition?.name || 'Unknown';
    dispCounts[d] = (dispCounts[d] || 0) + 1;
  }
  
  console.log('%c=== DISPOSITION BREAKDOWN ===', 'color: #22d3ee; font-weight: bold;');
  for (const [disp, count] of Object.entries(dispCounts)) {
    const pct = ((count / characters.length) * 100).toFixed(0);
    console.log(`${disp}: ${count} (${pct}%)`);
  }
  console.log('');
  
  // Relationship stats
  let totalRels = 0;
  let friendships = 0;
  let rivals = 0;
  let loveInterests = 0;
  let totalPhantoms = 0;
  
  for (const char of characters) {
    totalRels += char.relationships.length;
    friendships += char.relationships.filter(r => r.status === 'friend' || r.status === 'close_friend').length;
    rivals += char.relationships.filter(r => r.status === 'rival').length;
    loveInterests += char.relationships.filter(r => r.status === 'love_interest').length;
    totalPhantoms += char.phantoms?.length || 0;
  }
  
  console.log('%c=== RELATIONSHIP SUMMARY ===', 'color: #22d3ee; font-weight: bold;');
  console.log(`Total work relationships: ${totalRels}`);
  console.log(`Total external/phantom relationships: ${totalPhantoms}`);
  console.log(`Friendships: ${friendships}`);
  console.log(`Rivalries: ${rivals}`);
  console.log(`Love interests: ${loveInterests}`);
  console.log('');
  
  console.log('%cFull data available in: window._lastOffice', 'color: #888; font-style: italic;');
  window._lastOffice = characters;
  
  return characters;
}

/**
 * Generate one character and show full details
 */
export function devGenerateOne(deptId = null) {
  console.log('%c=== GENERATING SINGLE CHARACTER ===', 'color: #22d3ee; font-weight: bold; font-size: 14px;');
  
  // Pick a random role
  const roles = getAllRolesToFill();
  let role;
  
  if (deptId) {
    const filtered = roles.filter(r => r.departmentId === deptId);
    role = filtered[Math.floor(Math.random() * filtered.length)];
  } else {
    role = roles[Math.floor(Math.random() * roles.length)];
  }
  
  const char = generateCharacter({
    departmentId: role.departmentId,
    departmentName: role.departmentName,
    role: role.role
  });
  
  // Generate some fake relationships for context
  char.relationships = [
    { id: 'fake1', name: 'Test Supervisor', role: 'Manager', status: 'supervisor', trustLevel: 'MODERATE', notes: 'Generated for testing' },
    { id: 'fake2', name: 'Test Colleague', role: 'Colleague', status: 'colleague', trustLevel: 'HIGH', notes: 'Generated for testing' }
  ];
  
  // Generate priorities and file system
  char.priorities = generatePriorities(char.traits, char.relationships);
  char.fileSystem = generateFileSystem(char, [char]);
  
  // Display
  console.log('%c--- IDENTITY ---', 'color: #f59e0b; font-weight: bold;');
  console.log(`Name: ${char.fullName}`);
  console.log(`Employee ID: ${char.employeeId}`);
  console.log(`DOB: ${char.dob}`);
  console.log(`Department: ${char.department.name}`);
  console.log(`Role: ${char.role.title} (Floor ${char.role.floor})`);
  console.log('');
  
  console.log('%c--- TRAITS ---', 'color: #f59e0b; font-weight: bold;');
  for (const trait of char.traits) {
    console.log(`• ${trait.name}: ${trait.description}`);
  }
  console.log('');
  
  console.log('%c--- PRIORITIES ---', 'color: #f59e0b; font-weight: bold;');
  for (const p of char.priorities.slice(0, 6)) {
    console.log(`${p.weight.toString().padStart(3)} | ${p.name} [${p.type}]`);
  }
  console.log('');
  
  console.log('%c--- FILE SYSTEM PREVIEW ---', 'color: #f59e0b; font-weight: bold;');
  console.log('%cidentity/name.dat:', 'color: #888;');
  console.log(char.fileSystem.identity['name.dat'].content);
  console.log('');
  console.log('%cidentity/self_image.mem:', 'color: #888;');
  console.log(char.fileSystem.identity['self_image.mem'].content);
  console.log('');
  console.log('%cbehavioral/priorities.cfg:', 'color: #888;');
  console.log(char.fileSystem.behavioral['priorities.cfg'].content);
  
  console.log('');
  console.log('%cFull data available in: window._lastCharacter', 'color: #888; font-style: italic;');
  window._lastCharacter = char;
  
  return char;
}

/**
 * Show a specific character's full file system
 */
export function devShowFileSystem(char = null) {
  const character = char || window._lastCharacter;
  if (!character) {
    console.log('No character loaded. Run devGenerateOne() first.');
    return;
  }
  
  console.log('%c=== FULL FILE SYSTEM ===', 'color: #22d3ee; font-weight: bold; font-size: 14px;');
  console.log(`Character: ${character.fullName}`);
  console.log('');
  
  function printDir(obj, path = '') {
    for (const [name, item] of Object.entries(obj)) {
      if (item.type === 'file') {
        console.log(`%c${path}${name}`, 'color: #22d3ee;');
        console.log(item.content);
        console.log('');
      } else if (item.type === 'directory') {
        console.log(`%c${path}${name}/`, 'color: #f59e0b; font-weight: bold;');
        printDir(item.children, path + name + '/');
      } else if (item.content) {
        console.log(`%c${path}${name}`, 'color: #22d3ee;');
        console.log(item.content);
        console.log('');
      } else if (typeof item === 'object' && !item.type) {
        // It's a directory without explicit type
        console.log(`%c${path}${name}/`, 'color: #f59e0b; font-weight: bold;');
        printDir(item, path + name + '/');
      }
    }
  }
  
  printDir(character.fileSystem);
}

/**
 * Show all available traits
 */
export function devShowTraits() {
  console.log('%c=== AVAILABLE TRAITS ===', 'color: #22d3ee; font-weight: bold; font-size: 14px;');
  console.log(`Total: ${TRAITS.length} traits`);
  console.log('');
  
  for (const trait of TRAITS) {
    console.log(`%c${trait.name}`, 'color: #f59e0b; font-weight: bold;');
    console.log(`  ${trait.description}`);
    if (trait.incompatible?.length) {
      console.log(`  %cIncompatible with: ${trait.incompatible.join(', ')}`, 'color: #888;');
    }
  }
}

/**
 * Show department structure
 */
export function devShowDepartments() {
  console.log('%c=== DEPARTMENT STRUCTURE ===', 'color: #22d3ee; font-weight: bold; font-size: 14px;');
  console.log('');
  
  for (const floor of FLOORS.sort((a, b) => b.floor - a.floor)) {
    console.log(`%cFloor ${floor.floor}: ${floor.name}`, 'color: #f59e0b; font-weight: bold;');
    
    const floorDepts = DEPARTMENTS.filter(d => d.floor === floor.floor);
    for (const dept of floorDepts) {
      console.log(`  ${dept.name}`);
      for (const role of dept.roles) {
        const count = role.isFixed ? '1' : `${role.count.min}-${role.count.max}`;
        console.log(`    • ${role.title} (${count})`);
      }
    }
    console.log('');
  }
}

/**
 * List all characters in the last generated office
 */
export function devListCharacters() {
  const office = window._lastOffice;
  if (!office) {
    console.log('No office generated. Run devGenerateOffice() first.');
    return;
  }
  
  console.log('%c=== OFFICE ROSTER ===', 'color: #22d3ee; font-weight: bold; font-size: 14px;');
  console.log('Use devInspect(index) to view a character in detail.\n');
  
  // Count dispositions
  const dispCounts = {};
  office.forEach(c => {
    const d = c.disposition?.name || 'Unknown';
    dispCounts[d] = (dispCounts[d] || 0) + 1;
  });
  
  console.log('%cDisposition breakdown:', 'color: #888;');
  for (const [disp, count] of Object.entries(dispCounts)) {
    console.log(`  ${disp}: ${count}`);
  }
  console.log('');
  
  office.forEach((char, i) => {
    const traits = char.traits.map(t => t.name).slice(0, 3).join(', ');
    const disp = char.disposition?.name || '?';
    const dispColor = {
      'True Believer': '#22c55e',
      'Content': '#84cc16',
      'Neutral': '#eab308',
      'Skeptical': '#f97316',
      'Suspicious': '#ef4444'
    }[disp] || '#888';
    
    console.log(`%c[${i}]%c ${char.fullName} - ${char.role.title} %c[${disp}]`, 
      'color: #f59e0b; font-weight: bold;', 
      'color: inherit;',
      `color: ${dispColor};`);
    console.log(`     ${char.department.name} | Traits: ${traits}`);
  });
}

/**
 * Inspect a specific character from the office by index or name
 */
export function devInspect(indexOrName) {
  const office = window._lastOffice;
  if (!office) {
    console.log('No office generated. Run devGenerateOffice() first.');
    return;
  }
  
  let char;
  if (typeof indexOrName === 'number') {
    char = office[indexOrName];
  } else if (typeof indexOrName === 'string') {
    char = office.find(c => 
      c.fullName.toLowerCase().includes(indexOrName.toLowerCase()) ||
      c.firstName.toLowerCase() === indexOrName.toLowerCase() ||
      c.lastName.toLowerCase() === indexOrName.toLowerCase()
    );
  }
  
  if (!char) {
    console.log(`Character not found: ${indexOrName}`);
    console.log('Run devListCharacters() to see available characters.');
    return;
  }
  
  // Set as last character for devShowFileSystem
  window._lastCharacter = char;
  
  console.log('%c=== CHARACTER DETAILS ===', 'color: #22d3ee; font-weight: bold; font-size: 14px;');
  
  console.log('%c--- IDENTITY ---', 'color: #f59e0b; font-weight: bold;');
  console.log(`Name: ${char.fullName}`);
  console.log(`Employee ID: ${char.employeeId}`);
  console.log(`DOB: ${char.dob}`);
  console.log(`Department: ${char.department.name}`);
  console.log(`Role: ${char.role.title} (Floor ${char.role.floor})`);
  console.log('');
  
  console.log('%c--- DISPOSITION ---', 'color: #f59e0b; font-weight: bold;');
  if (char.disposition) {
    const dispColor = {
      true_believer: '#22c55e',
      content: '#84cc16',
      neutral: '#eab308',
      skeptical: '#f97316',
      suspicious: '#ef4444'
    }[char.disposition.id] || '#888';
    console.log(`%c${char.disposition.name}%c: ${char.disposition.description}`, `color: ${dispColor}; font-weight: bold;`, 'color: inherit;');
    console.log(`Suspicion Level: ${char.disposition.suspicionLevel}/4`);
  }
  console.log('');
  
  console.log('%c--- TRAITS ---', 'color: #f59e0b; font-weight: bold;');
  for (const trait of char.traits) {
    console.log(`• ${trait.name}: ${trait.description}`);
  }
  console.log('');
  
  console.log('%c--- WORK RELATIONSHIPS ---', 'color: #f59e0b; font-weight: bold;');
  for (const rel of char.relationships.slice(0, 8)) {
    const trust = rel.trustLevel.padEnd(8);
    console.log(`${rel.name} [${rel.status}] Trust: ${trust}`);
    console.log(`  %c"${rel.notes}"`, 'color: #888; font-style: italic;');
  }
  if (char.relationships.length > 8) {
    console.log(`  ... and ${char.relationships.length - 8} more`);
  }
  console.log('');
  
  console.log('%c--- EXTERNAL RELATIONSHIPS (Phantoms) ---', 'color: #f59e0b; font-weight: bold;');
  if (char.phantoms && char.phantoms.length > 0) {
    for (const p of char.phantoms) {
      console.log(`${p.fullName} [${p.role}]`);
      console.log(`  %c"${p.notes}"`, 'color: #888; font-style: italic;');
    }
  } else {
    console.log('  (None)');
  }
  console.log('');
  
  console.log('%c--- TOP PRIORITIES ---', 'color: #f59e0b; font-weight: bold;');
  for (const p of char.priorities.slice(0, 6)) {
    console.log(`${p.weight.toString().padStart(3)} | ${p.name} [${p.type}]`);
  }
  console.log('');
  
  console.log('%c--- SIMULATION STATE ---', 'color: #f59e0b; font-weight: bold;');
  if (char.state) {
    console.log(`Mood: ${char.state.mood}/100  Energy: ${char.state.energy}/100  Stress: ${char.state.stress}/100`);
  }
  console.log('');
  
  console.log('%cRun devShowFileSystem() to see full file contents', 'color: #888; font-style: italic;');
  console.log('%cCharacter stored in window._lastCharacter', 'color: #888; font-style: italic;');
  
  return char;
}

/**
 * Show relationships between two characters
 */
export function devShowRelationship(char1, char2) {
  const office = window._lastOffice;
  if (!office) {
    console.log('No office generated. Run devGenerateOffice() first.');
    return;
  }
  
  // Find characters
  const findChar = (query) => {
    if (typeof query === 'number') return office[query];
    return office.find(c => 
      c.fullName.toLowerCase().includes(query.toLowerCase()) ||
      c.firstName.toLowerCase() === query.toLowerCase()
    );
  };
  
  const c1 = findChar(char1);
  const c2 = findChar(char2);
  
  if (!c1 || !c2) {
    console.log('Could not find one or both characters.');
    return;
  }
  
  console.log('%c=== RELATIONSHIP ===', 'color: #22d3ee; font-weight: bold; font-size: 14px;');
  
  // c1's view of c2
  const rel1 = c1.relationships.find(r => r.id === c2.id);
  console.log(`%c${c1.fullName}'s view of ${c2.fullName}:`, 'color: #f59e0b; font-weight: bold;');
  if (rel1) {
    console.log(`  Status: ${rel1.status}`);
    console.log(`  Trust: ${rel1.trustLevel}`);
    console.log(`  Notes: "${rel1.notes}"`);
  } else {
    console.log('  (No direct relationship)');
  }
  console.log('');
  
  // c2's view of c1
  const rel2 = c2.relationships.find(r => r.id === c1.id);
  console.log(`%c${c2.fullName}'s view of ${c1.fullName}:`, 'color: #f59e0b; font-weight: bold;');
  if (rel2) {
    console.log(`  Status: ${rel2.status}`);
    console.log(`  Trust: ${rel2.trustLevel}`);
    console.log(`  Notes: "${rel2.notes}"`);
  } else {
    console.log('  (No direct relationship)');
  }
}

/**
 * List all special relationships (friendships, rivalries, love interests)
 * Now shows reciprocity status!
 */
export function devListRelationships(type = 'all') {
  const office = window._lastOffice;
  if (!office) {
    console.log('No office generated. Run devGenerateOffice() first.');
    return;
  }
  
  console.log('%c=== RELATIONSHIP LISTINGS ===', 'color: #22d3ee; font-weight: bold; font-size: 14px;');
  
  // Track pairs to avoid duplicates and detect reciprocity
  const seenPairs = new Set();
  const friendships = { mutual: [], oneSided: [] };
  const rivalries = { mutual: [], oneSided: [] };
  const loveInterests = { mutual: [], oneSided: [] };
  
  office.forEach((char, charIndex) => {
    char.relationships.forEach(rel => {
      // Create unique pair key
      const otherId = rel.id;
      const pairKey = [char.id, otherId].sort().join('-');
      
      // Skip if we've already processed this pair
      if (seenPairs.has(pairKey + rel.status)) return;
      seenPairs.add(pairKey + rel.status);
      
      // Find the other character
      const otherChar = office.find(c => c.id === otherId);
      if (!otherChar) return;
      const otherIndex = office.indexOf(otherChar);
      
      // Check reciprocity
      const reverseRel = otherChar.relationships.find(r => r.id === char.id);
      const reverseStatus = reverseRel?.status || 'stranger';
      
      if (rel.status === 'friend' || rel.status === 'close_friend') {
        const isMutual = reverseStatus === 'friend' || reverseStatus === 'close_friend';
        const entry = {
          a: char, aIndex: charIndex, aTrust: rel.trustLevel,
          b: otherChar, bIndex: otherIndex, bTrust: reverseRel?.trustLevel || 'NONE',
          type: rel.status === 'close_friend' ? 'close_friend' : 'friend',
          notes: rel.notes
        };
        
        if (isMutual) {
          friendships.mutual.push(entry);
        } else {
          entry.bStatus = reverseStatus;
          friendships.oneSided.push(entry);
        }
      }
      
      if (rel.status === 'rival') {
        const isMutual = reverseStatus === 'rival';
        const entry = {
          a: char, aIndex: charIndex, aTrust: rel.trustLevel,
          b: otherChar, bIndex: otherIndex, bTrust: reverseRel?.trustLevel || 'NONE',
          notes: rel.notes
        };
        
        if (isMutual) {
          rivalries.mutual.push(entry);
        } else {
          entry.bStatus = reverseStatus;
          rivalries.oneSided.push(entry);
        }
      }
      
      if (rel.status === 'love_interest') {
        const isMutual = reverseStatus === 'love_interest';
        const entry = {
          a: char, aIndex: charIndex, aTrust: rel.trustLevel,
          b: otherChar, bIndex: otherIndex, bTrust: reverseRel?.trustLevel || 'NONE',
          notes: rel.notes
        };
        
        if (isMutual) {
          loveInterests.mutual.push(entry);
        } else {
          entry.bStatus = reverseStatus;
          loveInterests.oneSided.push(entry);
        }
      }
    });
  });
  
  if (type === 'all' || type === 'friends') {
    console.log('%c--- FRIENDSHIPS ---', 'color: #22c55e; font-weight: bold;');
    
    if (friendships.mutual.length > 0) {
      console.log('%cMutual:', 'color: #22c55e;');
      friendships.mutual.forEach(f => {
        const typeLabel = f.type === 'close_friend' ? '★ CLOSE' : '';
        console.log(`  [${f.aIndex}] ${f.a.fullName} ↔ ${f.b.fullName} [${f.bIndex}] ${typeLabel}`);
        console.log(`    Trust: ${f.aTrust} / ${f.bTrust}`);
      });
    }
    
    if (friendships.oneSided.length > 0) {
      console.log('%cOne-sided:', 'color: #888;');
      friendships.oneSided.forEach(f => {
        console.log(`  [${f.aIndex}] ${f.a.fullName} → ${f.b.fullName} (sees as ${f.bStatus})`);
        console.log(`    Trust: ${f.aTrust} / ${f.bTrust}`);
      });
    }
    
    if (friendships.mutual.length === 0 && friendships.oneSided.length === 0) {
      console.log('  (None)');
    }
    console.log('');
  }
  
  if (type === 'all' || type === 'rivals') {
    console.log('%c--- RIVALRIES ---', 'color: #f97316; font-weight: bold;');
    
    if (rivalries.mutual.length > 0) {
      console.log('%cMutual:', 'color: #f97316;');
      rivalries.mutual.forEach(r => {
        console.log(`  [${r.aIndex}] ${r.a.fullName} ↔ ${r.b.fullName} [${r.bIndex}]`);
        console.log(`    Trust: ${r.aTrust} / ${r.bTrust}`);
      });
    }
    
    if (rivalries.oneSided.length > 0) {
      console.log('%cOne-sided:', 'color: #888;');
      rivalries.oneSided.forEach(r => {
        console.log(`  [${r.aIndex}] ${r.a.fullName} → ${r.b.fullName} (sees as ${r.bStatus})`);
        console.log(`    Trust: ${r.aTrust} / ${r.bTrust}`);
      });
    }
    
    if (rivalries.mutual.length === 0 && rivalries.oneSided.length === 0) {
      console.log('  (None)');
    }
    console.log('');
  }
  
  if (type === 'all' || type === 'love') {
    console.log('%c--- LOVE INTERESTS ---', 'color: #ec4899; font-weight: bold;');
    
    if (loveInterests.mutual.length > 0) {
      console.log('%cMutual:', 'color: #ec4899;');
      loveInterests.mutual.forEach(l => {
        console.log(`  [${l.aIndex}] ${l.a.fullName} ↔ ${l.b.fullName} [${l.bIndex}] ❤️`);
        console.log(`    Trust: ${l.aTrust} / ${l.bTrust}`);
      });
    }
    
    if (loveInterests.oneSided.length > 0) {
      console.log('%cUnrequited:', 'color: #888;');
      loveInterests.oneSided.forEach(l => {
        console.log(`  [${l.aIndex}] ${l.a.fullName} → ${l.b.fullName} 💔 (sees as ${l.bStatus})`);
        console.log(`    Trust: ${l.aTrust} / ${l.bTrust}`);
      });
    }
    
    if (loveInterests.mutual.length === 0 && loveInterests.oneSided.length === 0) {
      console.log('  (None)');
    }
    console.log('');
  }
  
  // Summary
  console.log('%c--- SUMMARY ---', 'color: #888;');
  console.log(`Friendships: ${friendships.mutual.length} mutual, ${friendships.oneSided.length} one-sided`);
  console.log(`Rivalries: ${rivalries.mutual.length} mutual, ${rivalries.oneSided.length} one-sided`);
  console.log(`Love Interests: ${loveInterests.mutual.length} mutual, ${loveInterests.oneSided.length} unrequited`);
  console.log('');
  
  console.log('%cUse devInspect(index) to view full character details', 'color: #888; font-style: italic;');
  console.log('%cUse devShowRelationship(index1, index2) to see mutual view', 'color: #888; font-style: italic;');
}

/**
 * List all phantom/external relationships
 */
export function devListPhantoms() {
  const office = window._lastOffice;
  if (!office) {
    console.log('No office generated. Run devGenerateOffice() first.');
    return;
  }
  
  console.log('%c=== PHANTOM/EXTERNAL RELATIONSHIPS ===', 'color: #22d3ee; font-weight: bold; font-size: 14px;');
  
  // Group by phantom type
  const byType = {
    family: [],
    friend: [],
    ex_partner: [],
    ex_employee: [],
    mentor: [],
    enemy: []
  };
  
  office.forEach((char, charIndex) => {
    if (char.phantoms) {
      char.phantoms.forEach(p => {
        if (byType[p.type]) {
          byType[p.type].push({ char, charIndex, phantom: p });
        }
      });
    }
  });
  
  const typeLabels = {
    family: { name: 'FAMILY', color: '#a78bfa' },
    friend: { name: 'EXTERNAL FRIENDS', color: '#22c55e' },
    ex_partner: { name: 'EX-PARTNERS', color: '#ec4899' },
    ex_employee: { name: 'FORMER COLLEAGUES', color: '#f97316' },
    mentor: { name: 'MENTORS', color: '#3b82f6' },
    enemy: { name: 'ENEMIES', color: '#ef4444' }
  };
  
  for (const [type, items] of Object.entries(byType)) {
    if (items.length === 0) continue;
    
    const label = typeLabels[type];
    console.log(`%c--- ${label.name} (${items.length}) ---`, `color: ${label.color}; font-weight: bold;`);
    
    items.forEach(({ char, charIndex, phantom }) => {
      console.log(`[${charIndex}] ${char.fullName} has: ${phantom.fullName} (${phantom.role})`);
      console.log(`    %c"${phantom.notes}"`, 'color: #888; font-style: italic;');
    });
    console.log('');
  }
}

/**
 * Show characters by disposition
 */
export function devListByDisposition(dispositionName = null) {
  const office = window._lastOffice;
  if (!office) {
    console.log('No office generated. Run devGenerateOffice() first.');
    return;
  }
  
  const dispositions = ['true_believer', 'content', 'neutral', 'skeptical', 'suspicious'];
  const colors = {
    true_believer: '#22c55e',
    content: '#84cc16',
    neutral: '#eab308',
    skeptical: '#f97316',
    suspicious: '#ef4444'
  };
  
  const filter = dispositionName ? [dispositionName.toLowerCase().replace(' ', '_')] : dispositions;
  
  console.log('%c=== CHARACTERS BY DISPOSITION ===', 'color: #22d3ee; font-weight: bold; font-size: 14px;');
  
  for (const dispId of filter) {
    const chars = office.filter(c => c.disposition?.id === dispId);
    if (chars.length === 0) continue;
    
    const dispName = chars[0].disposition.name;
    console.log(`%c--- ${dispName.toUpperCase()} (${chars.length}) ---`, `color: ${colors[dispId]}; font-weight: bold;`);
    
    chars.forEach(char => {
      const index = office.indexOf(char);
      const traits = char.traits.map(t => t.name).slice(0, 3).join(', ');
      console.log(`[${index}] ${char.fullName} - ${char.role.title}`);
      console.log(`    Traits: ${traits}`);
      console.log(`    Mood: ${char.state.mood} | Stress: ${char.state.stress}`);
    });
    console.log('');
  }
}

/**
 * Initialize dev tools on window
 */
export function initDevTools() {
  if (typeof window !== 'undefined') {
    window.devGenerateOffice = devGenerateOffice;
    window.devGenerateOne = devGenerateOne;
    window.devListCharacters = devListCharacters;
    window.devInspect = devInspect;
    window.devShowRelationship = devShowRelationship;
    window.devListRelationships = devListRelationships;
    window.devListPhantoms = devListPhantoms;
    window.devListByDisposition = devListByDisposition;
    window.devShowFileSystem = devShowFileSystem;
    window.devShowTraits = devShowTraits;
    window.devShowDepartments = devShowDepartments;
    
    console.log('%c[Character Generation Dev Tools Loaded]', 'color: #22d3ee; font-weight: bold;');
    console.log('%cAvailable commands:', 'color: #888;');
    console.log('  devGenerateOffice()         - Generate full office');
    console.log('  devListCharacters()         - List all characters');
    console.log('  devListRelationships()      - List friendships, rivalries, love interests');
    console.log('  devListRelationships("love")- Filter: "friends", "rivals", "love"');
    console.log('  devListPhantoms()           - List all external relationships');
    console.log('  devListByDisposition()      - List by disposition');
    console.log('  devListByDisposition("suspicious") - Filter by specific disposition');
    console.log('  devInspect(0)               - Inspect character by index');
    console.log('  devShowRelationship(0,1)    - Show mutual view between two');
    console.log('  devShowFileSystem()         - Show inspected character\'s files');
    console.log('  devShowTraits()             - List all traits');
    console.log('  devShowDepartments()        - Show department structure');
  }
}
