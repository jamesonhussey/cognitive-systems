<script>
  import { onMount, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import { 
    simulation, 
    simulationTime, 
    simulationSpeed, 
    simulationPaused,
    worldMap, 
    worldState,
    worldCharacters,
    worldInitialized,
    LOCATIONS,
    LOCATION_NAMES
  } from '../../../engine/simulation/index.js';
  
  import FloorRenderer from './FloorRenderer.svelte';
  import SimulationControls from './SimulationControls.svelte';
  import CharacterList from './CharacterList.svelte';
  
  // Props
  export let onClose = () => {};
  
  // State
  let currentLocation = LOCATIONS.NEIGHBORHOOD;
  let showCharacterList = false;
  let selectedCharacterId = null;
  
  // Check if simulation is initialized (should be started on login)
  $: initialized = $worldInitialized;
  
  // Derived data
  $: currentFloor = initialized ? worldMap.getFloor(currentLocation) : null;
  $: locationCounts = initialized ? worldMap.getLocationCounts() : {};
  $: characters = $worldCharacters;
  
  // The simulation should already be running (started on login)
  // This app just provides a view into it
  onMount(() => {
    if (!initialized) {
      console.warn('[SurveillanceApp] Simulation not initialized! Should be started on login.');
    } else {
      console.log('[SurveillanceApp] Simulation already running, connecting view...');
    }
  });
  
  // Location switching
  function switchLocation(locationId) {
    currentLocation = locationId;
    worldMap.switchLocation(locationId);
  }
  
  // Handle character selection
  function selectCharacter(characterId) {
    selectedCharacterId = characterId;
    
    // Pan to character's location
    const location = worldMap.getCharacterLocation(characterId);
    if (location !== currentLocation) {
      switchLocation(location);
    }
  }
</script>

<div class="surveillance-app">
  <div class="header">
    <div class="title">
      <span class="icon">◉</span>
      SURVEILLANCE SYSTEM
    </div>
    <div class="time">
      {$simulationTime.dayName} - {$simulationTime.time12Hour}
      <span class="day">Day {$simulationTime.day}</span>
    </div>
    <button class="close-btn" on:click={onClose}>×</button>
  </div>
  
  <div class="main-content">
    <div class="sidebar">
      <div class="location-list">
        <div class="section-title">LOCATIONS</div>
        {#each Object.entries(LOCATION_NAMES) as [locId, locName]}
          <button 
            class="location-btn"
            class:active={currentLocation === locId}
            on:click={() => switchLocation(locId)}
          >
            <span class="loc-name">{locName}</span>
            <span class="loc-count">{locationCounts[locId] || 0}</span>
          </button>
        {/each}
      </div>
      
      <div class="section-title">CONTROLS</div>
      <SimulationControls />
      
      <button 
        class="toggle-list-btn"
        on:click={() => showCharacterList = !showCharacterList}
      >
        {showCharacterList ? 'Hide' : 'Show'} Character List
      </button>
    </div>
    
    <div class="view-area">
      {#if initialized && currentFloor}
        <FloorRenderer 
          floor={currentFloor}
          characters={characters}
          {selectedCharacterId}
          on:selectCharacter={(e) => selectCharacter(e.detail)}
        />
      {:else}
        <div class="loading">Initializing surveillance system...</div>
      {/if}
    </div>
    
    {#if showCharacterList}
      <div class="character-panel">
        <CharacterList 
          {characters}
          {selectedCharacterId}
          on:select={(e) => selectCharacter(e.detail)}
        />
      </div>
    {/if}
  </div>
</div>

<style>
  .surveillance-app {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #0a0a0a;
    color: #00ff00;
    font-family: 'Consolas', 'Monaco', monospace;
  }
  
  .header {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: #111;
    border-bottom: 1px solid #333;
  }
  
  .title {
    font-size: 14px;
    font-weight: bold;
    flex: 1;
  }
  
  .icon {
    color: #ff0000;
    margin-right: 8px;
    animation: blink 1s infinite;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.3; }
  }
  
  .time {
    font-size: 12px;
    color: #888;
    margin-right: 16px;
  }
  
  .day {
    margin-left: 8px;
    color: #666;
  }
  
  .close-btn {
    background: none;
    border: 1px solid #333;
    color: #888;
    width: 24px;
    height: 24px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .close-btn:hover {
    background: #333;
    color: #fff;
  }
  
  .main-content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  
  .sidebar {
    width: 180px;
    background: #0d0d0d;
    border-right: 1px solid #222;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .section-title {
    font-size: 10px;
    color: #666;
    padding: 4px 0;
    border-bottom: 1px solid #222;
    margin-bottom: 4px;
  }
  
  .location-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .location-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    background: #111;
    border: 1px solid #222;
    color: #888;
    cursor: pointer;
    font-size: 11px;
    font-family: inherit;
    text-align: left;
  }
  
  .location-btn:hover {
    background: #1a1a1a;
    border-color: #333;
  }
  
  .location-btn.active {
    background: #1a2a1a;
    border-color: #00ff00;
    color: #00ff00;
  }
  
  .loc-count {
    background: #222;
    padding: 2px 6px;
    border-radius: 2px;
    font-size: 10px;
  }
  
  .toggle-list-btn {
    margin-top: auto;
    padding: 8px;
    background: #111;
    border: 1px solid #333;
    color: #888;
    cursor: pointer;
    font-size: 11px;
    font-family: inherit;
  }
  
  .toggle-list-btn:hover {
    background: #1a1a1a;
    color: #fff;
  }
  
  .view-area {
    flex: 1;
    overflow: auto;
    padding: 8px;
  }
  
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
  }
  
  .character-panel {
    width: 250px;
    background: #0d0d0d;
    border-left: 1px solid #222;
    overflow-y: auto;
  }
</style>
