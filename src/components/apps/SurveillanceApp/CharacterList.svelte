<script>
  import { createEventDispatcher } from 'svelte';
  import { worldMap } from '../../../engine/simulation/index.js';
  
  export let characters = [];
  export let selectedCharacterId = null;
  
  const dispatch = createEventDispatcher();
  
  // Group characters by state
  $: groupedCharacters = {
    working: characters.filter(c => c.sim.state === 'working'),
    break: characters.filter(c => c.sim.state === 'break'),
    commuting: characters.filter(c => c.sim.state === 'commuting'),
    sleeping: characters.filter(c => c.sim.state === 'sleeping'),
    other: characters.filter(c => !['working', 'break', 'commuting', 'sleeping'].includes(c.sim.state))
  };
  
  function selectCharacter(id) {
    dispatch('select', id);
  }
  
  function getStateColor(state) {
    switch (state) {
      case 'sleeping': return '#666';
      case 'working': return '#00ff00';
      case 'break': return '#00ffff';
      case 'commuting': return '#ff8800';
      case 'leisure': return '#88ff88';
      default: return '#888';
    }
  }
</script>

<div class="character-list">
  <div class="list-header">
    PERSONNEL ({characters.length})
  </div>
  
  {#each Object.entries(groupedCharacters) as [state, chars]}
    {#if chars.length > 0}
      <div class="state-group">
        <div class="state-header" style="color: {getStateColor(state)}">
          {state.toUpperCase()} ({chars.length})
        </div>
        
        {#each chars as char}
          <button
            class="char-item"
            class:selected={char.id === selectedCharacterId}
            on:click={() => selectCharacter(char.id)}
          >
            <div class="char-name">{char.fullName}</div>
            <div class="char-info">
              <span class="char-role">{char.role.title}</span>
              <span class="char-action">{char.sim.currentAction}</span>
            </div>
          </button>
        {/each}
      </div>
    {/if}
  {/each}
</div>

<style>
  .character-list {
    padding: 8px;
  }
  
  .list-header {
    font-size: 11px;
    color: #00ff00;
    padding: 4px 0;
    border-bottom: 1px solid #333;
    margin-bottom: 8px;
  }
  
  .state-group {
    margin-bottom: 12px;
  }
  
  .state-header {
    font-size: 10px;
    padding: 4px;
    background: #111;
    margin-bottom: 4px;
  }
  
  .char-item {
    display: block;
    width: 100%;
    padding: 6px 8px;
    background: #0a0a0a;
    border: 1px solid #222;
    color: #888;
    cursor: pointer;
    font-family: inherit;
    text-align: left;
    margin-bottom: 2px;
  }
  
  .char-item:hover {
    background: #111;
    border-color: #333;
  }
  
  .char-item.selected {
    background: #1a2a1a;
    border-color: #00ff00;
    color: #00ff00;
  }
  
  .char-name {
    font-size: 11px;
    margin-bottom: 2px;
  }
  
  .char-info {
    display: flex;
    justify-content: space-between;
    font-size: 9px;
    color: #666;
  }
  
  .char-action {
    font-style: italic;
  }
</style>
