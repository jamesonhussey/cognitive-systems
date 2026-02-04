/**
 * DEL command - delete file or directory
 */

export const commandDel = {
  name: 'del',
  description: 'Delete a file or directory',
  usage: 'del <path>',
  alias: 'del', // rm resolves to del

  execute(args, context) {
    const { fs, clearanceLevel } = context;
    const output = [];

    if (args.length === 0) {
      output.push('Usage: del <path>');
      return { output };
    }

    const targetPath = args[0];
    
    // Confirm message (for flavor)
    const node = fs.resolvePath(targetPath, clearanceLevel);
    if (!node) {
      output.push(`Error: Path not found`);
      return { output };
    }

    const result = fs.delete(targetPath, clearanceLevel);

    if (!result.success) {
      output.push(`Error: ${result.error}`);
      return { output };
    }

    output.push(`Deleted: ${targetPath}`);
    output.push('');
    output.push('[MODIFICATION LOGGED]');

    return { output };
  }
};
