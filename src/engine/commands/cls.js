/**
 * CLS command - clear screen
 */

export const commandCls = {
  name: 'cls',
  description: 'Clear the terminal screen',
  usage: 'cls',
  alias: 'cls', // clear resolves to cls

  execute(args, context) {
    return { 
      output: [],
      clearScreen: true 
    };
  }
};
