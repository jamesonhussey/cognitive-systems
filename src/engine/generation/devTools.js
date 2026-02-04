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
 * Initialize dev tools on window
 */
export function initDevTools() {
  if (typeof window !== 'undefined') {
    window.devGenerateOffice = devGenerateOffice;
    window.devGenerateOne = devGenerateOne;
    window.devListCharacters = devListCharacters;
    window.devInspect = devInspect;
    window.devShowRelationship = devShowRelationship;
    window.devShowFileSystem = devShowFileSystem;
    window.devShowTraits = devShowTraits;
    window.devShowDepartments = devShowDepartments;
    
    console.log('%c[Character Generation Dev Tools Loaded]', 'color: #22d3ee; font-weight: bold;');
    console.log('%cAvailable commands:', 'color: #888;');
    console.log('  devGenerateOffice()       - Generate full office');
    console.log('  devListCharacters()       - List all characters with indices');
    console.log('  devInspect(0)             - Inspect character by index');
    console.log('  devInspect("Sarah")       - Inspect character by name');
    console.log('  devShowRelationship(0,1)  - Show how two characters view each other');
    console.log('  devShowFileSystem()       - Show inspected character\'s files');
    console.log('  devGenerateOne()          - Generate one standalone character');
    console.log('  devShowTraits()           - List all traits');
    console.log('  devShowDepartments()      - Show department structure');
  }
}
