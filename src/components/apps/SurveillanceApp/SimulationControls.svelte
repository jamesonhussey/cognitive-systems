<script>
  import { simulation, simulationSpeed, simulationPaused, SPEED_OPTIONS } from '../../../engine/simulation/index.js';
  
  function togglePause() {
    simulation.togglePause();
  }
  
  function setSpeed(speed) {
    simulation.setSpeed(speed);
  }
  
  function getSpeedLabel(speed) {
    if (speed === 0) return '⏸';
    return `${speed}x`;
  }
</script>

<div class="controls">
  <button 
    class="pause-btn"
    class:paused={$simulationPaused}
    on:click={togglePause}
  >
    {$simulationPaused ? '▶ PLAY' : '⏸ PAUSE'}
  </button>
  
  <div class="speed-controls">
    {#each SPEED_OPTIONS.filter(s => s > 0) as speed}
      <button
        class="speed-btn"
        class:active={$simulationSpeed === speed}
        on:click={() => setSpeed(speed)}
      >
        {speed}x
      </button>
    {/each}
  </div>
</div>

<style>
  .controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .pause-btn {
    padding: 8px;
    background: #111;
    border: 1px solid #333;
    color: #00ff00;
    cursor: pointer;
    font-family: inherit;
    font-size: 11px;
  }
  
  .pause-btn:hover {
    background: #1a1a1a;
  }
  
  .pause-btn.paused {
    border-color: #00ff00;
    animation: pulse 1s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  .speed-controls {
    display: flex;
    gap: 4px;
  }
  
  .speed-btn {
    flex: 1;
    padding: 6px;
    background: #111;
    border: 1px solid #222;
    color: #666;
    cursor: pointer;
    font-family: inherit;
    font-size: 10px;
  }
  
  .speed-btn:hover {
    background: #1a1a1a;
    color: #888;
  }
  
  .speed-btn.active {
    background: #1a2a1a;
    border-color: #00ff00;
    color: #00ff00;
  }
</style>
