/**
 * Patient content loader
 * Loads patient data from the content folder structure
 */

import { FileSystem, FileNode } from '../filesystem/FileSystem.js';

// Import patient data statically (Vite will bundle these)
// We use import.meta.glob for dynamic imports

const patientManifests = import.meta.glob('/src/content/patients/*/manifest.json', { eager: true });
const patientStructures = import.meta.glob('/src/content/patients/*/structure.json', { eager: true });
const patientFiles = import.meta.glob('/src/content/patients/*/files/**/*', { eager: true, query: '?raw', import: 'default' });

/**
 * Get list of all available patients
 * @returns {Array<{id: string, manifest: object}>}
 */
export function getAvailablePatients() {
  const patients = [];
  
  for (const [path, manifest] of Object.entries(patientManifests)) {
    const patientFolder = path.match(/\/patients\/([^/]+)\//)?.[1];
    if (patientFolder) {
      patients.push({
        id: patientFolder,
        manifest: manifest.default || manifest
      });
    }
  }
  
  return patients;
}

/**
 * Load a patient's file system
 * @param {string} patientId - The patient folder name (e.g., 'patient_1001')
 * @returns {FileSystem|null}
 */
export function loadPatient(patientId) {
  const structurePath = `/src/content/patients/${patientId}/structure.json`;
  const manifestPath = `/src/content/patients/${patientId}/manifest.json`;
  
  const structure = patientStructures[structurePath]?.default || patientStructures[structurePath];
  const manifest = patientManifests[manifestPath]?.default || patientManifests[manifestPath];
  
  if (!structure || !manifest) {
    console.error(`Patient ${patientId} not found`);
    return null;
  }
  
  // Create file system with patient ID as root
  const fs = new FileSystem(manifest.id);
  
  // Build the file tree from structure
  buildFromStructure(structure, fs.root, patientId);
  
  return fs;
}

/**
 * Recursively build file system from structure definition
 */
function buildFromStructure(structure, parent, patientId) {
  for (const [name, definition] of Object.entries(structure)) {
    if (definition.type === 'directory') {
      const dir = new FileNode(name, 'directory', null, definition.metadata || {});
      parent.addChild(dir);
      
      if (definition.children) {
        buildFromStructure(definition.children, dir, patientId);
      }
    } else {
      // Load file content
      let content = '';
      
      if (definition.contentFile) {
        const filePath = `/src/content/patients/${patientId}/files/${definition.contentFile}`;
        content = patientFiles[filePath] || `[ERROR: Content file not found: ${definition.contentFile}]`;
      } else if (definition.content) {
        content = definition.content;
      }
      
      const file = new FileNode(name, 'file', content, definition.metadata || {});
      parent.addChild(file);
    }
  }
}

/**
 * Get a patient's manifest without loading the full file system
 * @param {string} patientId 
 * @returns {object|null}
 */
export function getPatientManifest(patientId) {
  const manifestPath = `/src/content/patients/${patientId}/manifest.json`;
  return patientManifests[manifestPath]?.default || patientManifests[manifestPath] || null;
}
