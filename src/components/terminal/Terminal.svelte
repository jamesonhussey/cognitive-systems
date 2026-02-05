<script>
  import { onMount, afterUpdate, tick } from 'svelte';
  import { gameState, getAllUnlockedCommands } from '../../stores/gameState.js';
  import { FileSystem } from '../../engine/filesystem/FileSystem.js';
  import { loadPatient, getPatientManifest } from '../../engine/content/PatientLoader.js';
  import { executeCommand, getAvailableCommands } from '../../engine/commands/index.js';

  // Optional: patient ID to load (passed when opening from assignment)
  export let patientId = null;
  
  // Optional: character object to load (passed when opening from .scan)
  export let character = null;

  let inputElement;
  let outputContainer;
  let currentInput = '';
  let commandHistory = [];
  let historyIndex = -1;
  let outputLines = [];
  let shouldScrollToBottom = false;
  
  // File system - initialized from patient or character
  let fs = null;
  let patientManifest = null;
  let isScanMode = false;  // True if viewing a .scan file (read-only surveillance)
  
  // Track loaded IDs to prevent unnecessary rebuilds
  let loadedPatientId = null;
  let loadedCharacterId = null;

  // Load patient if ID provided (only when patient changes)
  $: if (patientId && !character && patientId !== loadedPatientId) {
    fs = loadPatient(patientId);
    patientManifest = getPatientManifest(patientId);
    isScanMode = false;
    loadedPatientId = patientId;
    loadedCharacterId = null;
  }
  
  // Load character file system if character provided (.scan mode)
  // Only rebuild when a DIFFERENT character is loaded, not on every update
  $: if (character && character.fileSystem && character.id !== loadedCharacterId) {
    // Create a new FileSystem and populate it from the character's brain structure
    const lastName = character.lastName || character.fullName?.split(' ').pop() || 'UNKNOWN';
    const scanFs = new FileSystem(lastName.toUpperCase());
    scanFs.buildFromStructure(character.fileSystem);
    fs = scanFs;
    patientManifest = null;
    isScanMode = true;
    loadedCharacterId = character.id;
    loadedPatientId = null;
  }

  $: currentAccount = $gameState.currentAccount;
  $: clearanceLevel = currentAccount?.clearanceLevel || 1;
  $: unlockedCommands = getAllUnlockedCommands(currentAccount);

  // Build prompt based on whether we have a patient loaded
  $: prompt = fs ? `${fs.getCurrentPath()}>` : 'CA>';

  onMount(() => {
    if (character && fs && isScanMode) {
      // Character scan loaded - show scan interface
      outputLines = [
        { text: '+===============================================================+', color: 'scan-header' },
        { text: '|        VERITY SYSTEMS - COGNITIVE SCAN VIEWER v4.2.1          |', color: 'scan-header' },
        { text: `|                    CLEARANCE LEVEL: ${clearanceLevel}                         |`, color: 'scan-header' },
        { text: '+===============================================================+', color: 'scan-header' },
        '',
        { text: `Scan file loaded: ${character.lastName?.toUpperCase() || 'UNKNOWN'}.scan`, color: 'scan-info' },
        { text: `Subject: ${character.fullName}`, color: 'scan-info' },
        { text: `Employee ID: ${character.employeeId}`, color: 'muted' },
        { text: `Department: ${character.department?.name || 'Unknown'}`, color: 'muted' },
        { text: `Role: ${character.role?.title || 'Unknown'}`, color: 'muted' },
        '',
        { text: '[ SURVEILLANCE MODE - READ ONLY ]', color: 'scan-warning' },
        '',
        'Type "help" for available commands. Type "tree" to view cognitive structure.',
        '',
      ];
    } else if (patientId && fs && patientManifest) {
      // Patient loaded - show patient interface
      outputLines = [
        { text: '+===============================================================+', color: 'header' },
        { text: '|        VERITY SYSTEMS - COGNITIVE ACCESS TERMINAL v4.2.1      |', color: 'header' },
        { text: `|                    CLEARANCE LEVEL: ${clearanceLevel}                         |`, color: 'header' },
        { text: '+===============================================================+', color: 'header' },
        '',
        { text: `Case file loaded: ${patientManifest.id}`, color: 'info' },
        { text: `Subject: ${patientManifest.name}`, color: 'info' },
        { text: `Department: ${patientManifest.department}`, color: 'muted' },
        { text: `Status: ${patientManifest.status}`, color: 'muted' },
        '',
        'Type "help" for available commands. Type "tree" to view structure.',
        '',
      ];
    } else {
      // No patient - show welcome/idle screen with VS logo
      outputLines = [
        { text: '    ============================================================', color: 'border' },
        { text: '    ||                                                        ||', color: 'border' },
        { text: '    ||    VV      VV    SSSSSSS                               ||', color: 'logo-cyan' },
        { text: '    ||     VV    VV    SS                                     ||', color: 'logo-cyan' },
        { text: '    ||      VV  VV      SSSSS                                 ||', color: 'logo-blue' },
        { text: '    ||       VVVV          SSS                                ||', color: 'logo-purple' },
        { text: '    ||        VV      SSSSSSSS                                ||', color: 'logo-pink' },
        { text: '    ||                                                        ||', color: 'border' },
        { text: '    ||                                                        ||', color: 'border' },
        { text: '    ||                     VERITY SYSTEMS                     ||', color: 'title' },
        { text: '    ||               Clarity Through Innovation               ||', color: 'subtitle' },
        { text: '    ||                                                        ||', color: 'border' },
        { text: '    ============================================================', color: 'border' },
        '',
        '',
        `        Welcome to work, ${currentAccount?.firstName || 'Operator'}! Hope you have a great day :)`,
        '',
        { text: '    --------------------------------------------------------------', color: 'dim' },
        '',
        '    No case files loaded in this terminal.',
        '',
        '    To load a case, click on an assignment file (.assignment)',
        '    from your Email inbox or Case Files application.',
        '',
        '    Feel free to type "help" to see a list of commands.',
        '',
        { text: '    --------------------------------------------------------------', color: 'dim' },
      ];
    }
    
    focusInput();
  });

  afterUpdate(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
      shouldScrollToBottom = false;
    }
  });

  function focusInput() {
    if (inputElement) {
      inputElement.focus();
    }
  }

  function scrollToBottom() {
    if (outputContainer) {
      outputContainer.scrollTop = outputContainer.scrollHeight;
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      submitCommand();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      navigateHistory(-1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      navigateHistory(1);
    } else if (event.key === 'Tab') {
      event.preventDefault();
      handleTabComplete();
    }
  }

  function submitCommand() {
    const input = currentInput.trim();
    
    // Enable scrolling after command submission
    shouldScrollToBottom = true;
    
    // Add command to output
    outputLines = [...outputLines, `${prompt}${input}`];
    
    if (input) {
      // Add to history
      commandHistory = [...commandHistory, input];
      historyIndex = commandHistory.length;

      // Check if we have a file system to work with
      if (!fs) {
        // No patient loaded - only allow help command
        if (input.toLowerCase() === 'help' || input.toLowerCase() === 'cls' || input.toLowerCase() === 'clear') {
          const context = {
            fs: null,
            clearanceLevel,
            unlockedCommands
          };
          const result = executeCommand(input, context);
          if (result.clearScreen) {
            outputLines = [];
          } else if (result.output && result.output.length > 0) {
            outputLines = [...outputLines, ...result.output, ''];
          }
        } else {
          outputLines = [...outputLines, 'No case file loaded. Please open an assignment to access patient files.', ''];
        }
      } else {
        // Execute command with file system
        const context = {
          fs,
          clearanceLevel,
          unlockedCommands
        };

        const result = executeCommand(input, context);

        if (result.clearScreen) {
          outputLines = [];
        } else if (result.output && result.output.length > 0) {
          outputLines = [...outputLines, ...result.output, ''];
        } else {
          outputLines = [...outputLines, ''];
        }
      }
    } else {
      outputLines = [...outputLines, ''];
    }

    currentInput = '';
  }

  function navigateHistory(direction) {
    const newIndex = historyIndex + direction;
    
    if (newIndex >= 0 && newIndex < commandHistory.length) {
      historyIndex = newIndex;
      currentInput = commandHistory[newIndex];
    } else if (newIndex >= commandHistory.length) {
      historyIndex = commandHistory.length;
      currentInput = '';
    }
  }

  function handleTabComplete() {
    if (!currentInput || !fs) return;

    const parts = currentInput.split(' ');
    
    if (parts.length === 1) {
      // Complete command name
      const partial = parts[0].toLowerCase();
      const matches = getAvailableCommands(unlockedCommands)
        .filter(cmd => cmd.startsWith(partial));
      
      if (matches.length === 1) {
        currentInput = matches[0] + ' ';
      } else if (matches.length > 1) {
        outputLines = [...outputLines, `${prompt}${currentInput}`, matches.join('  '), ''];
      }
    } else {
      // Complete path
      const partial = parts[parts.length - 1];
      const dirPart = partial.includes('/') ? partial.substring(0, partial.lastIndexOf('/') + 1) : '';
      const namePart = partial.includes('/') ? partial.substring(partial.lastIndexOf('/') + 1) : partial;
      
      const listResult = fs.list(dirPart || '.', clearanceLevel);
      
      if (listResult.success) {
        const matches = listResult.entries
          .filter(e => e.name.toLowerCase().startsWith(namePart.toLowerCase()))
          .map(e => e.type === 'directory' ? e.name + '/' : e.name);
        
        if (matches.length === 1) {
          parts[parts.length - 1] = dirPart + matches[0];
          currentInput = parts.join(' ');
        } else if (matches.length > 1) {
          outputLines = [...outputLines, `${prompt}${currentInput}`, matches.join('  '), ''];
        }
      }
    }
  }
</script>

<div class="terminal" on:click={focusInput} role="textbox" tabindex="-1">
  <div class="output" bind:this={outputContainer}>
    {#each outputLines as line}
      {#if typeof line === 'object' && line !== null}
        {#if line.inline}
          <div class="line">{#each line.inline as segment}<span class="segment-{segment.color}">{segment.text}</span>{/each}</div>
        {:else}
          <div class="line line-{line.color}">{line.text}</div>
        {/if}
      {:else}
        <div class="line">{line}</div>
      {/if}
    {/each}
    
    <div class="input-line">
      <span class="prompt">{prompt}</span>
      <input
        bind:this={inputElement}
        bind:value={currentInput}
        on:keydown={handleKeyDown}
        type="text"
        class="command-input"
        spellcheck="false"
        autocomplete="off"
      />
    </div>
  </div>
</div>

<style>
  .terminal {
    width: 100%;
    height: 100%;
    background: var(--bg-primary);
    padding: 1rem;
    overflow: hidden;
    cursor: text;
  }

  .output {
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .line {
    white-space: pre-wrap;
    word-break: break-word;
    min-height: 1.5em;
    color: var(--text-primary);
  }

  .line-logo-cyan {
    color: #22d3ee;
    text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
  }

  .line-logo-blue {
    color: #3b82f6;
    text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  }

  .line-logo-purple {
    color: #8b5cf6;
    text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
  }

  .line-glow {
    color: #0ea5e9;
    opacity: 0.4;
  }

  .line-title {
    color: #e0f2fe;
    font-weight: 600;
  }

  .line-subtitle {
    color: #7dd3fc;
  }

  .line-dim {
    color: #334155;
  }

  .line-border {
    color: #0ea5e9;
  }

  /* Inline segment colors */
  .segment-border {
    color: #0ea5e9;
  }

  .segment-logo-cyan {
    color: #22d3ee;
    text-shadow: 0 0 8px rgba(34, 211, 238, 0.6);
  }

  .segment-logo-blue {
    color: #3b82f6;
    text-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
  }

  .segment-logo-purple {
    color: #8b5cf6;
    text-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
  }

  .segment-logo-pink {
    color: #ec4899;
    text-shadow: 0 0 8px rgba(236, 72, 153, 0.6);
  }

  .segment-title {
    color: #e0f2fe;
  }

  .segment-subtitle {
    color: #7dd3fc;
  }

  .segment-text {
    color: var(--text-primary);
  }

  .line-header {
    color: #5cb8e8;
  }

  .line-info {
    color: #7dd3fc;
  }

  .line-muted {
    color: var(--text-muted);
  }

  .line-success {
    color: var(--accent-success);
  }

  .line-warning {
    color: var(--accent-warning);
  }

  .line-error {
    color: var(--accent-error);
  }

  /* Scan mode styling (surveillance) */
  .line-scan-header {
    color: #22c55e;
    text-shadow: 0 0 4px rgba(34, 197, 94, 0.4);
  }

  .line-scan-info {
    color: #86efac;
  }

  .line-scan-warning {
    color: #fbbf24;
    font-weight: bold;
  }

  .input-line {
    display: flex;
    align-items: center;
    min-height: 1.5em;
  }

  .prompt {
    color: var(--accent-primary);
    white-space: pre;
    flex-shrink: 0;
  }

  .command-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: inherit;
    padding: 0;
    margin: 0;
    caret-color: var(--accent-primary);
  }

  .command-input::selection {
    background: var(--accent-primary);
    color: var(--bg-primary);
  }
</style>
