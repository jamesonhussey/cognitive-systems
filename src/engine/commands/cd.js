/**
 * CD command - change directory
 */

export const commandCd = {
  name: 'cd',
  description: 'Change current directory',
  usage: 'cd <path>',

  execute(args, context) {
    const { fs, clearanceLevel } = context;
    const output = [];

    if (args.length === 0) {
      // No argument - show current path
      output.push(fs.getCurrentPath());
      return { output };
    }

    const targetPath = args[0];
    const result = fs.navigate(targetPath, clearanceLevel);

    if (!result.success) {
      output.push(`Error: ${result.error}`);
    }

    return { output };
  }
};
