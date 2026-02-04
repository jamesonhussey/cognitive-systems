/**
 * DIR command - list directory contents
 */

export const commandDir = {
  name: 'dir',
  description: 'List directory contents',
  usage: 'dir [path]',
  alias: 'dir', // ls resolves to dir

  execute(args, context) {
    const { fs, clearanceLevel } = context;
    const output = [];

    const targetPath = args[0] || '.';
    const result = fs.list(targetPath, clearanceLevel);

    if (!result.success) {
      output.push(`Error: ${result.error}`);
      return { output };
    }

    const currentPath = targetPath === '.' ? fs.getCurrentPath() : targetPath;
    output.push(`Directory of ${currentPath}`);
    output.push('');

    if (result.entries.length === 0) {
      output.push('  (empty)');
    } else {
      for (const entry of result.entries) {
        let prefix = entry.type === 'directory' ? '[DIR]' : '     ';
        let suffix = '';

        if (entry.locked) {
          suffix = ' [LOCKED]';
        } else if (!entry.accessible) {
          suffix = ` [L${entry.clearanceRequired}]`;
        }

        const line = `  ${prefix} ${entry.name}${suffix}`;
        output.push(line);
      }
    }

    output.push('');
    const dirCount = result.entries.filter(e => e.type === 'directory').length;
    const fileCount = result.entries.filter(e => e.type === 'file').length;
    output.push(`  ${dirCount} directory(s), ${fileCount} file(s)`);

    return { output };
  }
};
