<script>
  import { createEventDispatcher } from 'svelte';
  import { worldMap } from '../../../engine/simulation/index.js';
  
  export let floor;
  export let characters = [];
  export let selectedCharacterId = null;
  
  const dispatch = createEventDispatcher();
  
  // Tile colors for different types
  const TILE_COLORS = {
    void: '#000',
    wall: '#444',
    wall_h: '#444',
    wall_v: '#444',
    corner_tl: '#444',
    corner_tr: '#444',
    corner_bl: '#444',
    corner_br: '#444',
    t_up: '#444',
    t_down: '#444',
    t_left: '#444',
    t_right: '#444',
    cross: '#444',
    door: '#886600',
    door_open: '#553300',
    floor: '#1a1a1a',
    floor_carpet: '#1a1a2a',
    floor_tile: '#1a2a2a',
    grass: '#1a2a1a',
    road: '#2a2a2a',
    sidewalk: '#252525',
    path: '#2a2a1a',
    desk: '#553300',
    chair: '#333',
    computer: '#003355',
    table: '#442200',
    filing_cabinet: '#333',
    coffee_machine: '#332200',
    vending_machine: '#223300',
    couch: '#2a1a2a',
    bed: '#2a1a1a',
    tv: '#002233',
    fridge: '#223333',
    stove: '#332222',
    toilet: '#333',
    sink: '#334',
    shower: '#224',
    elevator: '#002255'
  };
  
  // Get characters on this floor
  $: floorCharacters = characters.filter(c => {
    const loc = worldMap.getCharacterLocation(c.id);
    return loc === floor?.id;
  });
  
  // Create character position lookup
  $: characterPositions = new Map(
    floorCharacters.map(c => [`${c.sim.x},${c.sim.y}`, c])
  );
  
  // Render data
  $: renderData = floor?.getRenderData() || [];
  
  function handleTileClick(x, y) {
    const char = characterPositions.get(`${x},${y}`);
    if (char) {
      dispatch('selectCharacter', char.id);
    }
  }
  
  function getCharacterColor(character) {
    if (character.id === selectedCharacterId) {
      return '#ffff00'; // Selected
    }
    
    // Color by state
    const state = character.sim.state;
    switch (state) {
      case 'sleeping': return '#666';
      case 'working': return '#00ff00';
      case 'break': return '#00ffff';
      case 'commuting': return '#ff8800';
      case 'leisure': return '#88ff88';
      default: return '#00ff00';
    }
  }
</script>

<div class="floor-renderer">
  <div class="floor-header">
    <span class="floor-name">{floor?.name || 'Unknown'}</span>
    <span class="floor-info">{floorCharacters.length} characters</span>
  </div>
  
  <div class="grid-container">
    <div class="grid-wrapper">
      <div 
        class="grid"
        style="--cols: {floor?.width || 1}; --rows: {floor?.height || 1}"
      >
        {#each renderData as row, y}
          {#each row as cell, x}
            {@const character = characterPositions.get(`${x},${y}`)}
            <div 
              class="cell"
              class:has-character={character}
              class:selected={character?.id === selectedCharacterId}
              style="background-color: {TILE_COLORS[cell.type] || '#111'}"
              on:click={() => handleTileClick(x, y)}
              title={character ? `${character.fullName}: ${character.sim.currentAction}` : cell.type}
            >
              {#if character}
                <span class="character" style="color: {getCharacterColor(character)}">@</span>
              {:else}
                <span class="tile-char">{cell.char}</span>
              {/if}
            </div>
          {/each}
        {/each}
      </div>
      
      <!-- Character labels - now inside the scrolling container -->
      {#if floorCharacters.length > 0}
        <div class="character-labels">
          {#each floorCharacters as char}
            <div 
              class="char-label"
              class:selected={char.id === selectedCharacterId}
              style="left: {char.sim.x * 12}px; top: {char.sim.y * 14 + 14}px"
            >
              {char.sim.currentAction}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .floor-renderer {
    position: relative;
  }
  
  .floor-header {
    display: flex;
    justify-content: space-between;
    padding: 4px 8px;
    background: #111;
    border: 1px solid #333;
    margin-bottom: 8px;
    font-size: 12px;
  }
  
  .floor-name {
    color: #00ff00;
  }
  
  .floor-info {
    color: #666;
  }
  
  .grid-container {
    overflow: auto;
    max-height: calc(100vh - 200px);
    border: 1px solid #333;
    background: #000;
  }
  
  .grid-wrapper {
    position: relative;
    display: inline-block;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(var(--cols), 12px);
    grid-template-rows: repeat(var(--rows), 14px);
    font-size: 12px;
    line-height: 14px;
    font-family: 'Consolas', 'Monaco', monospace;
  }
  
  .cell {
    width: 12px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
  }
  
  .cell.has-character {
    cursor: pointer;
  }
  
  .cell.has-character:hover {
    outline: 1px solid #ffff00;
  }
  
  .cell.selected {
    outline: 2px solid #ffff00;
  }
  
  .tile-char {
    color: #666;
    font-size: 10px;
  }
  
  .character {
    font-weight: bold;
    font-size: 12px;
  }
  
  .character-labels {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    width: 100%;
    height: 100%;
  }
  
  .char-label {
    position: absolute;
    font-size: 8px;
    color: #888;
    white-space: nowrap;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 0 2px #000, 0 0 4px #000;
  }
  
  .char-label.selected {
    color: #ffff00;
    font-weight: bold;
  }
</style>
