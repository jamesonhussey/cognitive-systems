/**
 * TYPE command - display file contents
 */

export const commandType = {
  name: 'type',
  description: 'Display file contents',
  usage: 'type <filename>',
  alias: 'type', // cat resolves to type

  execute(args, context) {
    const { fs, clearanceLevel } = context;
    const output = [];

    if (args.length === 0) {
      output.push('Usage: type <filename>');
      return { output };
    }

    const targetPath = args[0];
    const result = fs.read(targetPath, clearanceLevel);

    if (!result.success) {
      output.push(`Error: ${result.error}`);
      return { output };
    }

    // Add file header
    output.push(`═══════════════════════════════════════════`);
    output.push(`File: ${targetPath}`);
    output.push(`═══════════════════════════════════════════`);
    output.push('');

    // Split content into lines and add
    const lines = result.content.split('\n');
    for (const line of lines) {
      output.push(line);
    }

    output.push('');
    output.push(`═══════════════════════════════════════════`);

    return { output };
  }
};
