/**
 * TREE command - display directory structure as ASCII tree
 */

export const commandTree = {
  name: 'tree',
  description: 'Display directory structure as a tree',
  usage: 'tree [path] [depth]',

  execute(args, context) {
    const { fs, clearanceLevel } = context;
    const output = [];

    // Parse arguments
    const targetPath = args[0] || '.';
    const maxDepth = parseInt(args[1]) || 10; // Default max depth

    const node = fs.resolvePath(targetPath, clearanceLevel);

    if (!node) {
      output.push('Error: Path not found');
      return { output };
    }

    if (node.type !== 'file' && node.metadata.clearanceRequired > clearanceLevel) {
      output.push(`Error: Access denied. Requires clearance level ${node.metadata.clearanceRequired}`);
      return { output };
    }

    // Header
    const rootName = targetPath === '.' ? fs.getCurrentPath() : targetPath;
    output.push(rootName);

    if (node.type === 'file') {
      output.push('(file)');
      return { output };
    }

    // Build tree
    const stats = { dirs: 0, files: 0 };
    const treeLines = buildTree(node, '', true, clearanceLevel, 0, maxDepth, stats);
    output.push(...treeLines);

    // Summary
    output.push('');
    output.push(`${stats.dirs} directories, ${stats.files} files`);

    return { output };
  }
};

/**
 * Recursively build tree lines
 */
function buildTree(node, prefix, isLast, clearanceLevel, currentDepth, maxDepth, stats) {
  const lines = [];
  
  if (node.type !== 'directory' || !node.children) {
    return lines;
  }

  // Get visible children
  const children = [];
  for (const [name, child] of node.children) {
    // Skip hidden unless high clearance
    if (child.metadata.hidden && clearanceLevel < 3) {
      continue;
    }
    children.push(child);
  }

  // Sort: directories first, then alphabetically
  children.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  // Build lines for each child
  children.forEach((child, index) => {
    const isLastChild = index === children.length - 1;
    const connector = isLastChild ? '└── ' : '├── ';
    const extension = isLastChild ? '    ' : '│   ';

    // Determine display name and status
    let displayName = child.name;
    let suffix = '';

    if (child.type === 'directory') {
      displayName += '/';
      stats.dirs++;

      // Check access
      if (child.metadata.clearanceRequired > clearanceLevel) {
        suffix = ' [L' + child.metadata.clearanceRequired + ']';
      } else if (child.metadata.locked) {
        suffix = ' [LOCKED]';
      }
    } else {
      stats.files++;
      
      if (child.metadata.clearanceRequired > clearanceLevel) {
        suffix = ' [L' + child.metadata.clearanceRequired + ']';
      } else if (child.metadata.locked) {
        suffix = ' [LOCKED]';
      }
    }

    lines.push(prefix + connector + displayName + suffix);

    // Recurse into directories if within depth limit and accessible
    if (child.type === 'directory' && currentDepth < maxDepth) {
      if (child.metadata.clearanceRequired <= clearanceLevel && !child.metadata.locked) {
        const subLines = buildTree(
          child, 
          prefix + extension, 
          isLastChild, 
          clearanceLevel, 
          currentDepth + 1, 
          maxDepth,
          stats
        );
        lines.push(...subLines);
      }
    }
  });

  return lines;
}
