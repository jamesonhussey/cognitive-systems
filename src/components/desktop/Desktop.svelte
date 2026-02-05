<script>
  import { gameState } from '../../stores/gameState.js';
  import Taskbar from './Taskbar.svelte';
  import Window from './Window.svelte';
  import StartMenu from './StartMenu.svelte';
  import DesktopIcons from './DesktopIcons.svelte';
  import Terminal from '../terminal/Terminal.svelte';
  import NotesApp from '../apps/NotesApp.svelte';
  import EmailApp from '../apps/EmailApp.svelte';
  import PlaceholderApp from '../apps/PlaceholderApp.svelte';
  import SurveillanceApp from '../apps/SurveillanceApp/SurveillanceApp.svelte';
  import { onMount, setContext } from 'svelte';
  import { deliverPendingEmails } from '../../engine/content/EmailSystem.js';
  import { getPatientManifest } from '../../engine/content/PatientLoader.js';
  
  // Provide a way for child components to open assignments
  setContext('openAssignment', (patientId) => openTerminal(patientId));
  
  // Provide a way for child components to open character scans
  setContext('openScan', (character) => openCharacterScan(character));

  // Window definitions
  const windowDefs = {
    terminal: { 
      title: 'CA Terminal', 
      component: Terminal,
      initialX: 80,
      initialY: 30,
      initialWidth: 950,
      initialHeight: 650
    },
    email: { 
      title: 'Email', 
      component: EmailApp,
      initialX: 150,
      initialY: 80,
      initialWidth: 800,
      initialHeight: 550
    },
    notes: { 
      title: 'Notes', 
      component: NotesApp,
      initialX: 200,
      initialY: 100,
      initialWidth: 500,
      initialHeight: 400
    },
    casefile: { 
      title: 'Case Files', 
      component: PlaceholderApp,
      props: { appName: 'Case Files', message: 'Case file system coming soon...' },
      initialX: 180,
      initialY: 70,
      initialWidth: 750,
      initialHeight: 500
    },
    store: { 
      title: 'Store', 
      component: PlaceholderApp,
      props: { appName: 'Store', message: 'Upgrade store coming soon...' },
      initialX: 250,
      initialY: 120,
      initialWidth: 600,
      initialHeight: 450
    },
    surveillance: { 
      title: 'Surveillance System', 
      component: SurveillanceApp,
      initialX: 50,
      initialY: 20,
      initialWidth: 1100,
      initialHeight: 700
    }
  };

  // Track open windows - start with no terminal open (clean desktop)
  let openWindows = {};

  let activeWindowId = null;
  let startMenuOpen = false;
  let nextZIndex = 1;
  
  // Track terminal instances with their patient IDs or character data
  let terminalPatients = {}; // { windowId: patientId }
  let terminalCharacters = {}; // { windowId: character } for .scan files
  let terminalCounter = 0;

  function openWindow(id, props = {}) {
    // Special handling for terminal - can have multiple instances
    if (id === 'terminal') {
      openTerminal(props.patientId);
      return;
    }
    
    if (!windowDefs[id]) return;
    
    if (openWindows[id]) {
      // Already open, just focus it
      openWindows[id].isOpen = true;
      openWindows[id].isMinimized = false;
      focusWindow(id);
    } else {
      // Open new window
      openWindows[id] = { isOpen: true, isMinimized: false, zIndex: nextZIndex++ };
      openWindows = openWindows;
      activeWindowId = id;
    }
  }

  function openTerminal(patientId = null) {
    // Create unique terminal window ID
    const terminalId = `terminal_${terminalCounter++}`;
    
    // Store the patient ID for this terminal
    terminalPatients[terminalId] = patientId;
    terminalPatients = terminalPatients;
    
    // Get title based on patient
    let title = 'CA Terminal';
    if (patientId) {
      const manifest = getPatientManifest(patientId);
      if (manifest) {
        title = `CA Terminal - ${manifest.id}`;
      }
    }
    
    // Create window definition for this terminal instance
    openWindows[terminalId] = { 
      isOpen: true, 
      isMinimized: false, 
      zIndex: nextZIndex++,
      title: title,
      isTerminal: true
    };
    openWindows = openWindows;
    activeWindowId = terminalId;
  }

  // Open a terminal with a character's brain file system (.scan)
  function openCharacterScan(character) {
    if (!character) return;
    
    // Create unique terminal window ID
    const terminalId = `terminal_${terminalCounter++}`;
    
    // Store the character data for this terminal
    terminalCharacters[terminalId] = character;
    terminalCharacters = terminalCharacters;
    
    // Get title based on character name
    const lastName = character.lastName || character.fullName?.split(' ').pop() || 'UNKNOWN';
    const title = `CA Terminal - ${lastName.toUpperCase()}.scan`;
    
    // Create window definition for this terminal instance
    openWindows[terminalId] = { 
      isOpen: true, 
      isMinimized: false, 
      zIndex: nextZIndex++,
      title: title,
      isTerminal: true,
      isScan: true  // Flag to indicate this is a scan, not an assignment
    };
    openWindows = openWindows;
    activeWindowId = terminalId;
  }

  // Handle assignment file clicks from email
  function handleOpenAssignment(patientId) {
    openTerminal(patientId);
  }
  
  // Handle scan file clicks from surveillance app
  function handleOpenScan(event) {
    const { character } = event.detail;
    openCharacterScan(character);
  }

  function closeWindow(id) {
    if (openWindows[id]) {
      openWindows[id].isOpen = false;
      openWindows = openWindows;
      
      // Focus another window if this was active
      if (activeWindowId === id) {
        const stillOpen = Object.entries(openWindows)
          .filter(([_, w]) => w.isOpen && !w.isMinimized)
          .sort((a, b) => b[1].zIndex - a[1].zIndex);
        activeWindowId = stillOpen[0]?.[0] || null;
      }
    }
  }

  function minimizeWindow(id) {
    if (openWindows[id]) {
      openWindows[id].isMinimized = true;
      openWindows = openWindows;
      
      // Focus another window
      if (activeWindowId === id) {
        const stillOpen = Object.entries(openWindows)
          .filter(([_, w]) => w.isOpen && !w.isMinimized)
          .sort((a, b) => b[1].zIndex - a[1].zIndex);
        activeWindowId = stillOpen[0]?.[0] || null;
      }
    }
  }

  function focusWindow(id) {
    if (openWindows[id]) {
      openWindows[id].zIndex = nextZIndex++;
      openWindows[id].isMinimized = false;
      openWindows = openWindows;
      activeWindowId = id;
    }
  }

  function handleTaskbarWindowClick(id) {
    if (activeWindowId === id && openWindows[id] && !openWindows[id].isMinimized) {
      // Clicking active window minimizes it
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  }

  function toggleStartMenu() {
    startMenuOpen = !startMenuOpen;
  }

  function handleOpenApp(event) {
    openWindow(event.detail);
  }

  // Get sorted list of open windows for rendering
  $: sortedWindows = Object.entries(openWindows)
    .filter(([_, w]) => w.isOpen)
    .map(([id, w]) => {
      // Check if this is a terminal instance
      if (w.isTerminal) {
        // Check if it's a scan (character) or assignment (patient)
        const props = w.isScan 
          ? { character: terminalCharacters[id] }
          : { patientId: terminalPatients[id] };
        
        return {
          id,
          ...w,
          def: {
            ...windowDefs.terminal,
            title: w.title,
            props
          }
        };
      }
      return { id, ...w, def: windowDefs[id] };
    })
    .sort((a, b) => a.zIndex - b.zIndex);

  // Get list for taskbar
  $: taskbarWindows = Object.entries(openWindows)
    .filter(([_, w]) => w.isOpen)
    .map(([id, w]) => ({ 
      id, 
      title: w.title || windowDefs[id]?.title || id, 
      isMinimized: w.isMinimized 
    }));

  // Deliver any pending emails on mount (e.g., welcome emails)
  onMount(() => {
    deliverPendingEmails();
  });
</script>

<div class="desktop">
  <div class="desktop-area">
    <DesktopIcons on:openApp={handleOpenApp} />
    
    {#each sortedWindows as window (window.id)}
      {#if !window.isMinimized}
        <div style="z-index: {window.zIndex}; position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none;">
          <div style="pointer-events: auto; position: absolute;">
            <Window 
              title={window.def.title}
              isActive={activeWindowId === window.id}
              initialX={window.def.initialX}
              initialY={window.def.initialY}
              initialWidth={window.def.initialWidth}
              initialHeight={window.def.initialHeight}
              on:close={() => closeWindow(window.id)}
              on:minimize={() => minimizeWindow(window.id)}
              on:focus={() => focusWindow(window.id)}
            >
              <svelte:component 
                this={window.def.component} 
                {...(window.def.props || {})}
              />
            </Window>
          </div>
        </div>
      {/if}
    {/each}
  </div>
  
  <StartMenu 
    isOpen={startMenuOpen}
    on:close={() => startMenuOpen = false}
    on:openApp={handleOpenApp}
  />
  
  <Taskbar 
    openWindows={taskbarWindows} 
    {activeWindowId}
    on:windowClick={(e) => handleTaskbarWindowClick(e.detail)}
    on:startClick={toggleStartMenu}
  />
</div>

<style>
  .desktop {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    /* Default wallpaper - subtle grid pattern */
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 20px 20px;
    position: relative;
  }

  .desktop-area {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
</style>
