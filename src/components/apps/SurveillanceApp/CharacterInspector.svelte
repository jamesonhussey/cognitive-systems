<script>
  import { createEventDispatcher } from 'svelte';
  
  export let character = null;
  
  const dispatch = createEventDispatcher();
  
  function getStateColor(state) {
    switch (state) {
      case 'sleeping': return '#666';
      case 'working': return '#00ff00';
      case 'break': return '#00ffff';
      case 'commuting': return '#ff8800';
      case 'walking': return '#ffaa00';
      case 'leisure': return '#88ff88';
      case 'eating': return '#88ffff';
      default: return '#888';
    }
  }
  
  function getNeedColor(value) {
    if (value >= 70) return '#22c55e'; // Green - good
    if (value >= 40) return '#eab308'; // Yellow - moderate
    return '#ef4444'; // Red - low
  }
  
  function getStressColor(value) {
    // Stress is inverted - low is good
    if (value <= 30) return '#22c55e';
    if (value <= 60) return '#eab308';
    return '#ef4444';
  }
  
  function openScanFile() {
    if (character) {
      dispatch('openScan', character);
    }
  }
  
  function close() {
    dispatch('close');
  }
</script>

{#if character}
  <div class="character-inspector">
    <div class="inspector-header">
      <span class="header-title">SUBJECT SCAN</span>
      <button class="close-btn" on:click={close}>×</button>
    </div>
    
    <!-- Portrait placeholder -->
    <div class="portrait-section">
      <div class="portrait-placeholder">
        <pre class="ascii-portrait">{`
  .----.
 / o  o \\
|   <>   |
 \\  --  /
  '----'
        `.trim()}</pre>
        <div class="portrait-note">// TODO: ASCII Portrait</div>
      </div>
    </div>
    
    <!-- Identity -->
    <div class="info-section">
      <div class="section-header">IDENTITY</div>
      <div class="info-row">
        <span class="label">Name:</span>
        <span class="value">{character.fullName}</span>
      </div>
      <div class="info-row">
        <span class="label">Employee ID:</span>
        <span class="value">{character.employeeId}</span>
      </div>
    </div>
    
    <!-- Position -->
    <div class="info-section">
      <div class="section-header">POSITION</div>
      <div class="info-row">
        <span class="label">Department:</span>
        <span class="value">{character.department?.name || 'Unknown'}</span>
      </div>
      <div class="info-row">
        <span class="label">Role:</span>
        <span class="value">{character.role?.title || 'Unknown'}</span>
      </div>
    </div>
    
    <!-- Status -->
    <div class="info-section">
      <div class="section-header">STATUS</div>
      <div class="info-row">
        <span class="label">State:</span>
        <span class="value state" style="color: {getStateColor(character.sim?.state)}">
          {character.sim?.state?.toUpperCase() || 'UNKNOWN'}
        </span>
      </div>
      <div class="info-row">
        <span class="label">Activity:</span>
        <span class="value">{character.sim?.currentAction || 'Unknown'}</span>
      </div>
    </div>
    
    <!-- Needs -->
    <div class="info-section">
      <div class="section-header">VITALS</div>
      
      <div class="need-row">
        <span class="need-label">Energy</span>
        <div class="need-bar">
          <div 
            class="need-fill"
            style="width: {character.sim?.needs?.energy || 0}%; background: {getNeedColor(character.sim?.needs?.energy || 0)}"
          ></div>
        </div>
        <span class="need-value">{Math.round(character.sim?.needs?.energy || 0)}%</span>
      </div>
      
      <div class="need-row">
        <span class="need-label">Social</span>
        <div class="need-bar">
          <div 
            class="need-fill"
            style="width: {character.sim?.needs?.social || 0}%; background: {getNeedColor(character.sim?.needs?.social || 0)}"
          ></div>
        </div>
        <span class="need-value">{Math.round(character.sim?.needs?.social || 0)}%</span>
      </div>
      
      <div class="need-row">
        <span class="need-label">Stress</span>
        <div class="need-bar">
          <div 
            class="need-fill"
            style="width: {character.sim?.needs?.stress || 0}%; background: {getStressColor(character.sim?.needs?.stress || 0)}"
          ></div>
        </div>
        <span class="need-value">{Math.round(character.sim?.needs?.stress || 0)}%</span>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="actions-section">
      <button class="scan-btn" on:click={openScanFile}>
        <span class="btn-icon">⎔</span>
        <span class="btn-text">OPEN {character.fullName.split(' ')[1]?.toUpperCase() || character.fullName.split(' ')[0].toUpperCase()}.scan</span>
      </button>
    </div>
  </div>
{/if}

<style>
  .character-inspector {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .inspector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
    border-bottom: 1px solid #00ff00;
  }
  
  .header-title {
    font-size: 11px;
    color: #00ff00;
    font-weight: bold;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: #666;
    font-size: 18px;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
  }
  
  .close-btn:hover {
    color: #ff4444;
  }
  
  .portrait-section {
    display: flex;
    justify-content: center;
    padding: 8px 0;
  }
  
  .portrait-placeholder {
    text-align: center;
  }
  
  .ascii-portrait {
    font-size: 10px;
    line-height: 1.2;
    color: #00ff00;
    margin: 0;
    font-family: 'Consolas', 'Monaco', monospace;
  }
  
  .portrait-note {
    font-size: 8px;
    color: #444;
    margin-top: 4px;
    font-style: italic;
  }
  
  .info-section {
    background: #0a0a0a;
    border: 1px solid #222;
    padding: 8px;
  }
  
  .section-header {
    font-size: 9px;
    color: #666;
    margin-bottom: 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid #222;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    padding: 2px 0;
  }
  
  .label {
    color: #666;
  }
  
  .value {
    color: #aaa;
  }
  
  .value.state {
    font-weight: bold;
  }
  
  .need-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 3px 0;
  }
  
  .need-label {
    font-size: 9px;
    color: #666;
    width: 45px;
  }
  
  .need-bar {
    flex: 1;
    height: 8px;
    background: #111;
    border: 1px solid #333;
    position: relative;
  }
  
  .need-fill {
    height: 100%;
    transition: width 0.3s ease;
  }
  
  .need-value {
    font-size: 9px;
    color: #888;
    width: 30px;
    text-align: right;
  }
  
  .actions-section {
    margin-top: 8px;
  }
  
  .scan-btn {
    width: 100%;
    padding: 10px;
    background: #0a1a0a;
    border: 1px solid #00ff00;
    color: #00ff00;
    cursor: pointer;
    font-family: inherit;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
  }
  
  .scan-btn:hover {
    background: #1a2a1a;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
  }
  
  .btn-icon {
    font-size: 14px;
  }
</style>
