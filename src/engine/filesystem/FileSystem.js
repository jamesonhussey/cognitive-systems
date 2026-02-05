/**
 * Virtual file system for patient brain structures
 */

export class FileNode {
  constructor(name, type, content = null, metadata = {}) {
    this.name = name;
    this.type = type; // 'directory' or 'file'
    this.content = content;
    this.metadata = {
      clearanceRequired: 1,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      locked: false,
      hidden: false,
      ...metadata
    };
    this.children = type === 'directory' ? new Map() : null;
    this.parent = null;
  }

  addChild(node) {
    if (this.type !== 'directory') {
      throw new Error('Cannot add child to file');
    }
    node.parent = this;
    this.children.set(node.name, node);
    return node;
  }

  getChild(name) {
    if (this.type !== 'directory') return null;
    return this.children.get(name);
  }

  getPath() {
    const parts = [];
    let current = this;
    while (current) {
      parts.unshift(current.name);
      current = current.parent;
    }
    return parts.join('/').replace('//', '/');
  }
}

export class FileSystem {
  constructor(rootName = 'PATIENT_0000') {
    this.root = new FileNode(rootName, 'directory');
    this.currentDirectory = this.root;
    this.clipboard = null;
  }

  /**
   * Navigate to a path
   * @param {string} path - Absolute or relative path
   * @param {number} clearanceLevel - User's clearance level
   * @returns {{ success: boolean, error?: string, node?: FileNode }}
   */
  navigate(path, clearanceLevel = 1) {
    const node = this.resolvePath(path, clearanceLevel);
    
    if (!node) {
      return { success: false, error: 'Path not found' };
    }
    
    if (node.type !== 'directory') {
      return { success: false, error: 'Not a directory' };
    }

    if (node.metadata.clearanceRequired > clearanceLevel) {
      return { success: false, error: `Access denied. Requires clearance level ${node.metadata.clearanceRequired}` };
    }

    if (node.metadata.locked) {
      return { success: false, error: 'Directory is locked' };
    }

    this.currentDirectory = node;
    return { success: true, node };
  }

  /**
   * Resolve a path to a node
   * @param {string} path 
   * @param {number} clearanceLevel 
   * @returns {FileNode|null}
   */
  resolvePath(path, clearanceLevel = 1) {
    if (!path || path === '.') {
      return this.currentDirectory;
    }

    // Handle parent directory
    if (path === '..') {
      return this.currentDirectory.parent || this.currentDirectory;
    }

    // Determine starting point
    let current;
    let parts;

    if (path.startsWith('/')) {
      current = this.root;
      parts = path.slice(1).split('/').filter(p => p);
    } else {
      current = this.currentDirectory;
      parts = path.split('/').filter(p => p);
    }

    // Navigate through parts
    for (const part of parts) {
      if (part === '..') {
        current = current.parent || current;
      } else if (part === '.') {
        continue;
      } else {
        const child = current.getChild(part);
        if (!child) {
          return null;
        }
        // Check if hidden (unless user has high clearance)
        if (child.metadata.hidden && clearanceLevel < 3) {
          return null;
        }
        current = child;
      }
    }

    return current;
  }

  /**
   * List contents of current or specified directory
   * @param {string} path 
   * @param {number} clearanceLevel 
   * @param {boolean} showHidden 
   * @returns {{ success: boolean, error?: string, entries?: Array }}
   */
  list(path = '.', clearanceLevel = 1, showHidden = false) {
    const node = this.resolvePath(path, clearanceLevel);
    
    if (!node) {
      return { success: false, error: 'Path not found' };
    }

    if (node.type !== 'directory') {
      return { success: false, error: 'Not a directory' };
    }

    if (node.metadata.clearanceRequired > clearanceLevel) {
      return { success: false, error: `Access denied. Requires clearance level ${node.metadata.clearanceRequired}` };
    }

    const entries = [];
    
    for (const [name, child] of node.children) {
      // Skip hidden unless authorized
      if (child.metadata.hidden && !showHidden && clearanceLevel < 3) {
        continue;
      }

      entries.push({
        name: child.name,
        type: child.type,
        locked: child.metadata.locked,
        clearanceRequired: child.metadata.clearanceRequired,
        accessible: child.metadata.clearanceRequired <= clearanceLevel && !child.metadata.locked
      });
    }

    // Sort: directories first, then alphabetically
    entries.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    return { success: true, entries };
  }

  /**
   * Read a file's content
   * @param {string} path 
   * @param {number} clearanceLevel 
   * @returns {{ success: boolean, error?: string, content?: string, metadata?: object }}
   */
  read(path, clearanceLevel = 1) {
    const node = this.resolvePath(path, clearanceLevel);

    if (!node) {
      return { success: false, error: 'File not found' };
    }

    if (node.type !== 'file') {
      return { success: false, error: 'Cannot read a directory' };
    }

    if (node.metadata.clearanceRequired > clearanceLevel) {
      return { success: false, error: `Access denied. Requires clearance level ${node.metadata.clearanceRequired}` };
    }

    if (node.metadata.locked) {
      return { success: false, error: 'File is locked' };
    }

    return { 
      success: true, 
      content: node.content,
      metadata: node.metadata
    };
  }

  /**
   * Delete a file or directory
   * @param {string} path 
   * @param {number} clearanceLevel 
   * @returns {{ success: boolean, error?: string }}
   */
  delete(path, clearanceLevel = 1) {
    const node = this.resolvePath(path, clearanceLevel);

    if (!node) {
      return { success: false, error: 'Path not found' };
    }

    if (node === this.root) {
      return { success: false, error: 'Cannot delete root directory' };
    }

    if (node.metadata.clearanceRequired > clearanceLevel) {
      return { success: false, error: `Access denied. Requires clearance level ${node.metadata.clearanceRequired}` };
    }

    if (node.metadata.locked) {
      return { success: false, error: 'Cannot delete locked item' };
    }

    if (node.parent) {
      node.parent.children.delete(node.name);
    }

    return { success: true };
  }

  /**
   * Get current path as string
   */
  getCurrentPath() {
    return this.currentDirectory.getPath() || '/';
  }

  /**
   * Create directory structure from JSON definition
   * Supports two formats:
   * 1. Explicit: { type: 'directory', children: {...} } or { type: 'file', content: '...' }
   * 2. Inferred: Objects without 'type' property containing nested objects = directory
   * 
   * @param {object} structure 
   * @param {FileNode} parent 
   */
  buildFromStructure(structure, parent = this.root) {
    for (const [name, definition] of Object.entries(structure)) {
      // Explicit directory
      if (definition.type === 'directory') {
        const dir = new FileNode(name, 'directory', null, definition.metadata || {});
        parent.addChild(dir);
        if (definition.children) {
          this.buildFromStructure(definition.children, dir);
        }
      } 
      // Explicit file
      else if (definition.type === 'file') {
        const file = new FileNode(name, 'file', definition.content || '', definition.metadata || {});
        parent.addChild(file);
      }
      // Inferred: object without 'type' that contains nested objects = directory
      else if (typeof definition === 'object' && definition !== null) {
        // Check if this looks like a directory (contains objects with 'type' or nested objects)
        const hasNestedContent = Object.values(definition).some(
          v => typeof v === 'object' && v !== null
        );
        
        if (hasNestedContent) {
          // Treat as directory
          const dir = new FileNode(name, 'directory', null, {});
          parent.addChild(dir);
          this.buildFromStructure(definition, dir);
        } else {
          // Treat as file with stringified content
          const file = new FileNode(name, 'file', JSON.stringify(definition), {});
          parent.addChild(file);
        }
      }
      // Primitive value = file with that content
      else {
        const file = new FileNode(name, 'file', String(definition), {});
        parent.addChild(file);
      }
    }
  }
}

