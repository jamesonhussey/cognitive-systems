/**
 * FILE SYSTEM SCHEMA
 * 
 * Data-driven definition of the cognitive file system structure.
 * This schema is extensible - add new categories, files, or fields here.
 * 
 * The generator reads this schema and creates file structures accordingly.
 * 
 * Schema structure:
 * - categories: Top-level directories in the file system
 *   - files: Files within the category
 *     - type: 'static' | 'generated' | 'collection'
 *     - editable: Which fields can be modified by player
 *     - generator: Function name to generate content
 *     - clearanceRequired: Minimum clearance to view
 */

export const FILE_SYSTEM_SCHEMA = {
  categories: {
    identity: {
      name: 'identity',
      description: 'Core identity information',
      files: {
        'name.dat': {
          type: 'static',
          description: 'Basic identification data',
          fields: [
            { name: 'SUBJECT_ID', editable: false },
            { name: 'DESIGNATION', editable: false },
            { name: 'DOB', editable: false },
            { name: 'EMPLOYEE_ID', editable: false },
            { name: 'DEPARTMENT', editable: false },
            { name: 'STATUS', editable: true, options: ['Active', 'Suspended', 'Terminated', 'On Leave'] }
          ]
        },
        'self_image.mem': {
          type: 'generated',
          description: 'Self-perception and core beliefs',
          generator: 'generateSelfImage',
          editableFields: [
            { 
              name: 'core_belief_1', 
              editable: true, 
              options: ['competent', 'incompetent', 'valuable', 'worthless', 'capable', 'useless', 'intelligent', 'stupid']
            },
            { 
              name: 'core_belief_2', 
              editable: true, 
              options: ['valued', 'ignored', 'respected', 'despised', 'important', 'replaceable', 'needed', 'burden']
            },
            { 
              name: 'core_belief_3', 
              editable: true, 
              options: ['The work matters', 'The work is meaningless', 'I belong here', 'I don\'t belong', 'This is right', 'This is wrong']
            }
          ]
        }
      }
    },
    
    memories: {
      name: 'memories',
      description: 'Stored experiences and events',
      subdirectories: {
        recent: {
          description: 'Recent memories (last 90 days)',
          fileType: 'collection',
          generator: 'generateRecentMemories',
          filePattern: '{type}_{date}.mem'
        },
        core: {
          description: 'Formative memories that shape identity',
          fileType: 'collection',
          generator: 'generateCoreMemories',
          filePattern: '{type}.mem'
        },
        traumatic: {
          description: 'High-impact negative experiences',
          clearanceRequired: 2,
          fileType: 'collection',
          generator: 'generateTraumaticMemories',
          filePattern: 'incident_{id}.mem'
        }
      }
    },
    
    relationships: {
      name: 'relationships',
      description: 'Connections to other individuals',
      files: {
        'professional.idx': {
          type: 'generated',
          description: 'Work-related relationships',
          generator: 'generateProfessionalRelationships',
          entryFields: [
            { name: 'Role', editable: false },
            { name: 'Status', editable: true, options: ['Supervisor', 'Subordinate', 'Colleague', 'Mentor', 'Mentee', 'Acquaintance', 'Stranger'] },
            { name: 'Trust Level', editable: true, options: ['NONE', 'LOW', 'MODERATE', 'HIGH', 'ABSOLUTE'] },
            { name: 'Notes', editable: false, regenerateOnChange: true }
          ]
        },
        'personal.idx': {
          type: 'generated',
          description: 'Personal/social relationships',
          generator: 'generatePersonalRelationships',
          entryFields: [
            { name: 'Role', editable: false },
            { name: 'Status', editable: true, options: ['Friend', 'Close Friend', 'Acquaintance', 'Stranger', 'Love Interest', 'Partner', 'Ex-Partner', 'Rival', 'Enemy'] },
            { name: 'Trust Level', editable: true, options: ['NONE', 'LOW', 'MODERATE', 'HIGH', 'ABSOLUTE'] },
            { name: 'Notes', editable: false, regenerateOnChange: true }
          ]
        }
      }
    },
    
    behavioral: {
      name: 'behavioral',
      description: 'Behavioral patterns and systems',
      files: {
        'habits.idx': {
          type: 'generated',
          description: 'Daily habits and routines',
          generator: 'generateHabits',
          fields: [
            { name: 'Morning Routine', editable: true, options: ['Early riser', 'Late sleeper', 'Variable', 'Insomniac'] },
            { name: 'Work Style', editable: true, options: ['Focused', 'Scattered', 'Methodical', 'Chaotic', 'Perfectionist'] },
            { name: 'Social Pattern', editable: true, options: ['Gregarious', 'Reserved', 'Selective', 'Avoidant'] },
            { name: 'Stress Response', editable: true, options: ['Calm', 'Anxious', 'Aggressive', 'Withdrawn', 'Manic'] }
          ]
        },
        'coping.sys': {
          type: 'generated',
          description: 'Coping mechanisms',
          generator: 'generateCopingMechanisms'
        },
        'priorities.cfg': {
          type: 'generated',
          description: 'Priority ranking that drives behavior',
          generator: 'generatePriorities',
          editableEntries: true,
          entryFields: [
            { name: 'Priority', editable: false },
            { name: 'Type', editable: false },
            { name: 'Weight', editable: true, min: 0, max: 100 }
          ]
        }
      }
    },
    
    system: {
      name: 'system',
      description: 'System metadata and logs',
      clearanceRequired: 3,
      hidden: true,
      files: {
        'modification_history.log': {
          type: 'log',
          description: 'Record of all modifications made to this subject',
          generator: 'generateModificationLog'
        },
        'metadata.sys': {
          type: 'static',
          description: 'Subject metadata',
          fields: [
            { name: 'CREATED', editable: false },
            { name: 'LAST_MODIFIED', editable: false },
            { name: 'MODIFICATION_COUNT', editable: false },
            { name: 'FLAGS', editable: false }
          ]
        }
      }
    }
  }
};

/**
 * File extension descriptions
 */
export const FILE_EXTENSIONS = {
  '.dat': 'Data file - static information',
  '.mem': 'Memory file - experiential data',
  '.idx': 'Index file - structured list',
  '.sys': 'System file - behavioral/system data',
  '.cfg': 'Configuration file - editable settings',
  '.log': 'Log file - chronological records'
};

/**
 * Get schema for a specific category
 */
export function getCategorySchema(categoryName) {
  return FILE_SYSTEM_SCHEMA.categories[categoryName];
}

/**
 * Get all category names
 */
export function getCategoryNames() {
  return Object.keys(FILE_SYSTEM_SCHEMA.categories);
}

/**
 * Check if a file is editable
 */
export function isFileEditable(categoryName, fileName) {
  const category = getCategorySchema(categoryName);
  if (!category?.files?.[fileName]) return false;
  
  const file = category.files[fileName];
  return file.editableFields?.length > 0 || 
         file.editableEntries || 
         file.fields?.some(f => f.editable);
}

/**
 * Get editable fields for a file
 */
export function getEditableFields(categoryName, fileName) {
  const category = getCategorySchema(categoryName);
  if (!category?.files?.[fileName]) return [];
  
  const file = category.files[fileName];
  
  if (file.editableFields) return file.editableFields;
  if (file.entryFields) return file.entryFields.filter(f => f.editable);
  if (file.fields) return file.fields.filter(f => f.editable);
  
  return [];
}
