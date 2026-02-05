import { writable, derived } from 'svelte/store';
import { saveAccounts, loadAccounts } from '../engine/storage/SaveManager.js';
import { simulationManager } from '../engine/simulation/SimulationManager.js';

// Base commands that are ALWAYS available (free updates post-launch go here)
export const BASE_COMMANDS = ['help', 'cd', 'dir', 'type', 'cls', 'clear', 'tree'];

// Create the main game state store
function createGameState() {
  const defaultState = {
    currentAccount: null,
    accounts: [], // List of saved accounts
  };

  const { subscribe, set, update } = writable(defaultState);

  return {
    subscribe,
    
    // Account management
    createAccount: (firstName, lastName, password) => {
      const username = `${firstName.toLowerCase()}.${lastName.charAt(0).toLowerCase()}`;
      const email = `${username}@verity-systems.com`;
      
      // Generate simulation data for new account
      console.log('[GameState] Creating new account, generating simulation...');
      const simulationData = simulationManager.generateNewSimulation();
      
      const newAccount = {
        id: crypto.randomUUID(),
        firstName,
        lastName,
        username,
        email,
        password, // In a real app, this would be hashed
        createdAt: new Date().toISOString(),
        
        // Game progress
        credits: 500, // Starting currency
        tokens: 0,    // Cosmetic currency
        clearanceLevel: 1,
        currentShift: 1,
        completedTasks: [],
        // Purchased commands (commands bought from store)
        purchasedCommands: ['del'],
        unlockedFeatures: [],
        
        // Customization
        theme: 'default',
        wallpaper: 'default',
        
        // Emails and notifications
        emails: [],
        unreadEmails: 0,
        
        // Assessment data
        assessments: [],
        
        // Notes app data
        notes: [],
        
        // Flags for story progression
        flags: {},
        
        // SIMULATION DATA - Generated office and characters
        simulationData: simulationData
      };

      update(state => {
        const accounts = [...state.accounts, newAccount];
        saveAccountsToStorage(accounts);
        return {
          ...state,
          accounts,
          currentAccount: newAccount
        };
      });
      
      // Start simulation for the new account
      simulationManager.startSimulation(newAccount.id, newAccount.simulationData);

      return newAccount;
    },

    login: (username, password) => {
      let result = { success: false, error: null };
      let loggedInAccount = null;
      
      update(state => {
        const account = state.accounts.find(
          a => a.username === username && a.password === password
        );
        
        if (account) {
          result.success = true;
          loggedInAccount = account;
          return { ...state, currentAccount: account };
        } else {
          result.error = 'Invalid username or password';
          return state;
        }
      });
      
      // Start simulation after successful login
      if (result.success && loggedInAccount) {
        console.log('[GameState] Login successful, starting simulation...');
        simulationManager.startSimulation(loggedInAccount.id, loggedInAccount.simulationData);
      }

      return result;
    },

    logout: () => {
      // Save simulation state before logout
      if (simulationManager.isRunning()) {
        const simState = simulationManager.getSimulationState();
        // Update the account with latest simulation state
        update(state => {
          if (state.currentAccount) {
            const updatedAccount = { ...state.currentAccount, simulationData: simState };
            const accounts = state.accounts.map(a => 
              a.id === updatedAccount.id ? updatedAccount : a
            );
            saveAccountsToStorage(accounts);
            return { ...state, accounts };
          }
          return state;
        });
      }
      
      // Stop the simulation
      simulationManager.stopSimulation();
      
      update(state => ({ ...state, currentAccount: null }));
    },

    updateAccount: (updates) => {
      update(state => {
        if (!state.currentAccount) return state;
        
        const updatedAccount = { ...state.currentAccount, ...updates };
        const accounts = state.accounts.map(a => 
          a.id === updatedAccount.id ? updatedAccount : a
        );
        
        saveAccountsToStorage(accounts);
        
        return {
          ...state,
          currentAccount: updatedAccount,
          accounts
        };
      });
    },

    addCredits: (amount) => {
      update(state => {
        if (!state.currentAccount) return state;
        const updatedAccount = {
          ...state.currentAccount,
          credits: state.currentAccount.credits + amount
        };
        const accounts = state.accounts.map(a =>
          a.id === updatedAccount.id ? updatedAccount : a
        );
        saveAccountsToStorage(accounts);
        return { ...state, currentAccount: updatedAccount, accounts };
      });
    },

    addTokens: (amount) => {
      update(state => {
        if (!state.currentAccount) return state;
        const updatedAccount = {
          ...state.currentAccount,
          tokens: state.currentAccount.tokens + amount
        };
        const accounts = state.accounts.map(a =>
          a.id === updatedAccount.id ? updatedAccount : a
        );
        saveAccountsToStorage(accounts);
        return { ...state, currentAccount: updatedAccount, accounts };
      });
    },

    purchaseCommand: (command) => {
      update(state => {
        if (!state.currentAccount) return state;
        const purchased = state.currentAccount.purchasedCommands || [];
        if (purchased.includes(command)) return state;
        
        const updatedAccount = {
          ...state.currentAccount,
          purchasedCommands: [...purchased, command]
        };
        const accounts = state.accounts.map(a =>
          a.id === updatedAccount.id ? updatedAccount : a
        );
        saveAccountsToStorage(accounts);
        return { ...state, currentAccount: updatedAccount, accounts };
      });
    },

    deleteAccount: (accountId) => {
      update(state => {
        const accounts = state.accounts.filter(a => a.id !== accountId);
        saveAccountsToStorage(accounts);
        
        // If we deleted the current account, log out
        const currentAccount = state.currentAccount?.id === accountId 
          ? null 
          : state.currentAccount;
        
        return { ...state, accounts, currentAccount };
      });
    },

    loadAccountsAsync: async () => {
      try {
        const accounts = await loadAccounts();
        update(state => ({ ...state, accounts }));
      } catch (e) {
        console.error('Failed to load accounts:', e);
      }
    },

    // Synchronous load for backwards compatibility
    loadAccounts: () => {
      const saved = localStorage.getItem('cognitive_game_accounts');
      if (saved) {
        try {
          const accounts = JSON.parse(saved);
          update(state => ({ ...state, accounts }));
        } catch (e) {
          console.error('Failed to load accounts:', e);
        }
      }
    }
  };
}

function saveAccountsToStorage(accounts) {
  // Save to both localStorage (immediate) and file system (async)
  localStorage.setItem('cognitive_game_accounts', JSON.stringify(accounts));
  
  // Also save via SaveManager (handles Electron file saves)
  saveAccounts(accounts).catch(err => {
    console.error('Async save failed:', err);
  });
}

export const gameState = createGameState();

/**
 * Get all unlocked commands for an account (base + purchased)
 * This ensures new base commands are always available even for old accounts
 */
export function getAllUnlockedCommands(account) {
  if (!account) return [...BASE_COMMANDS];
  
  const purchased = account.purchasedCommands || [];
  // Legacy support: if account has old unlockedCommands, migrate them
  const legacy = account.unlockedCommands || [];
  
  // Combine: base commands + purchased + any legacy commands not in base
  const all = new Set([
    ...BASE_COMMANDS,
    ...purchased,
    ...legacy.filter(cmd => !BASE_COMMANDS.includes(cmd))
  ]);
  
  return [...all];
}

// Initialize on load
if (typeof window !== 'undefined') {
  gameState.loadAccounts();
  
  // Listen for simulation auto-save events
  window.addEventListener('simulation-autosave', (event) => {
    const { accountId, simulationData } = event.detail;
    
    gameState.updateAccount({ simulationData });
    console.log('[GameState] Auto-saved simulation data');
  });
}
