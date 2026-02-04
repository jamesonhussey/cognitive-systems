/**
 * HELP command - display available commands
 */

export const commandHelp = {
  name: 'help',
  description: 'Display available commands',
  usage: 'help [command]',
  
  execute(args, context) {
    const output = [];

    if (args.length > 0) {
      // Help for specific command
      const cmdName = args[0].toLowerCase();
      const helpText = commandDescriptions[cmdName];
      
      if (helpText) {
        output.push(`${cmdName.toUpperCase()}`);
        output.push(`  ${helpText.description}`);
        output.push('');
        output.push(`  Usage: ${helpText.usage}`);
        if (helpText.examples) {
          output.push('');
          output.push('  Examples:');
          helpText.examples.forEach(ex => output.push(`    ${ex}`));
        }
      } else {
        output.push(`No help available for '${cmdName}'`);
      }
    } else {
      // General help
      output.push('╔════════════════════════════════════════╗');
      output.push('║     VERITY SYSTEMS TERMINAL v4.2.1     ║');
      output.push('║          COMMAND REFERENCE             ║');
      output.push('╚════════════════════════════════════════╝');
      output.push('');
      output.push('Available commands:');
      output.push('');

      // Show only unlocked commands
      const unlocked = context.unlockedCommands || [];
      
      for (const [cmd, info] of Object.entries(commandDescriptions)) {
        if (unlocked.includes(cmd)) {
          const padded = cmd.toUpperCase().padEnd(10);
          output.push(`  ${padded} ${info.description}`);
        }
      }

      output.push('');
      output.push('Type "help <command>" for detailed information.');
    }

    return { output };
  }
};

const commandDescriptions = {
  help: {
    description: 'Display this help information',
    usage: 'help [command]',
    examples: ['help', 'help cd']
  },
  cd: {
    description: 'Change current directory',
    usage: 'cd <path>',
    examples: ['cd memories', 'cd ..', 'cd /identity']
  },
  dir: {
    description: 'List directory contents',
    usage: 'dir [path]',
    examples: ['dir', 'dir memories', 'dir /']
  },
  type: {
    description: 'Display file contents',
    usage: 'type <filename>',
    examples: ['type name.dat', 'type ../identity/name.dat']
  },
  cls: {
    description: 'Clear the terminal screen',
    usage: 'cls',
    examples: ['cls']
  },
  del: {
    description: 'Delete a file or directory',
    usage: 'del <path>',
    examples: ['del old_memory.mem', 'del traumatic/incident.mem']
  },
  tree: {
    description: 'Display directory structure as a tree',
    usage: 'tree [path] [depth]',
    examples: ['tree', 'tree memories', 'tree / 3']
  },
  search: {
    description: 'Search for text in files',
    usage: 'search <pattern> [path]',
    examples: ['search "Mitchell"', 'search "fear" memories/']
  },
  recover: {
    description: 'Recover deleted files',
    usage: 'recover [path]',
    examples: ['recover', 'recover deleted_file.mem']
  }
};
