/**
 * CHARACTER GENERATION SYSTEM
 * 
 * Main entry point for procedural character generation.
 * 
 * Usage:
 *   import { generateOfficePopulation } from './engine/generation';
 *   const characters = generateOfficePopulation();
 * 
 * Each character includes:
 *   - id, name, employeeId, dob
 *   - department and role info
 *   - personality traits
 *   - relationships to other characters
 *   - priority rankings
 *   - complete file system (for terminal display)
 *   - initial simulation state
 */

// Main generators
export { 
  generateOfficePopulation,
  generateCharacter,
  generateRelationships,
  generateFileSystem
} from './CharacterGenerator.js';

// Data pools (for customization/extension)
export { FIRST_NAMES, LAST_NAMES, generateName } from './data/names.js';
export { TRAITS, selectTraits, getTrait, TRAIT_COUNT } from './data/traits.js';
export { DEPARTMENTS, FLOORS, getAllRolesToFill, getDepartment, getFloor } from './data/departments.js';
export { PRIORITY_TYPES, BASE_PRIORITIES, generatePriorities, formatPrioritiesForFile } from './data/priorities.js';
export { DISPOSITIONS, selectDisposition, getDisposition } from './data/dispositions.js';
export { PHANTOM_TYPES, PHANTOM_TEMPLATES, generatePhantom, generatePhantomSet } from './data/phantoms.js';
export { 
  RELATIONSHIP_STATUSES, 
  TRUST_LEVELS, 
  NOTE_TEMPLATES,
  generateNote,
  formatRelationshipsForFile 
} from './data/relationships.js';
export {
  MEMORY_COUNTS,
  RECENT_MEMORIES_POSITIVE,
  RECENT_MEMORIES_NEUTRAL,
  RECENT_MEMORIES_NEGATIVE,
  CORE_MEMORIES_PERSONAL,
  TRAIT_MEMORIES,
  DETAIL_POOLS,
  selectRecentMemories,
  selectCoreMemories,
  selectTraumaticMemories,
  generateMemoryContent
} from './data/memories.js';

// Schema (for extension)
export { 
  FILE_SYSTEM_SCHEMA, 
  FILE_EXTENSIONS,
  getCategorySchema,
  getCategoryNames,
  isFileEditable,
  getEditableFields
} from './schemas/fileSystemSchema.js';
