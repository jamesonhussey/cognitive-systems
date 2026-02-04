/**
 * Command registry and parser
 */

import { commandHelp } from './help.js';
import { commandCd } from './cd.js';
import { commandDir } from './dir.js';
import { commandType } from './type.js';
import { commandCls } from './cls.js';
import { commandDel } from './del.js';
import { commandTree } from './tree.js';

// All available commands
const allCommands = {
  help: commandHelp,
  cd: commandCd,
  dir: commandDir,
  ls: commandDir,  // alias
  type: commandType,
  cat: commandType, // alias
  cls: commandCls,
  clear: commandCls, // alias
  del: commandDel,
  rm: commandDel,   // alias
  tree: commandTree,
};

/**
 * Parse and execute a command
 * @param {string} input - Raw command input
 * @param {object} context - Command context { fs, clearanceLevel, unlockedCommands, output }
 * @returns {{ output: string[], clearScreen?: boolean }}
 */
export function executeCommand(input, context) {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return { output: [] };
  }

  // Parse command and arguments
  const parts = parseCommandLine(trimmed);
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Check if command exists
  const command = allCommands[commandName];
  
  if (!command) {
    return { 
      output: [`'${commandName}' is not recognized as a command. Type 'help' for available commands.`] 
    };
  }

  // Check if command is unlocked
  // Allow aliases to work if base command is unlocked
  const baseCommand = command.alias || commandName;
  if (!context.unlockedCommands.includes(baseCommand)) {
    return {
      output: [`Command '${commandName}' is not available. Purchase it from the store to unlock.`]
    };
  }

  // Execute command
  try {
    return command.execute(args, context);
  } catch (error) {
    return {
      output: [`Error executing command: ${error.message}`]
    };
  }
}

/**
 * Parse command line into parts, respecting quotes
 * @param {string} input 
 * @returns {string[]}
 */
function parseCommandLine(input) {
  const parts = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (const char of input) {
    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
    } else if (char === quoteChar && inQuotes) {
      inQuotes = false;
      quoteChar = '';
    } else if (char === ' ' && !inQuotes) {
      if (current) {
        parts.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) {
    parts.push(current);
  }

  return parts;
}

/**
 * Get list of all command names (for tab completion, etc)
 * @param {string[]} unlockedCommands 
 * @returns {string[]}
 */
export function getAvailableCommands(unlockedCommands) {
  return Object.keys(allCommands).filter(name => {
    const cmd = allCommands[name];
    const baseCommand = cmd.alias || name;
    return unlockedCommands.includes(baseCommand);
  });
}
