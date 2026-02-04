<script>
  import { createEventDispatcher } from 'svelte';
  import { gameState } from '../../stores/gameState.js';

  export let openWindows = [];
  export let activeWindowId = '';

  const dispatch = createEventDispatcher();

  $: currentAccount = $gameState.currentAccount;
  $: unreadEmails = (currentAccount?.emails || []).filter(e => !e.read).length;

  function handleWindowClick(id) {
    dispatch('windowClick', id);
  }

  function handleStartClick() {
    dispatch('startClick');
  }

  function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  let currentTime = new Date();
  
  // Update time every minute
  setInterval(() => {
    currentTime = new Date();
  }, 60000);
</script>

<div class="taskbar">
  <div class="taskbar-left">
    <button class="start-button" on:click={handleStartClick}>
      <span class="start-icon">◈</span>
      <span class="start-text">VERITY</span>
    </button>
    
    <div class="window-buttons">
      {#each openWindows as window (window.id)}
        <button 
          class="window-button"
          class:active={activeWindowId === window.id && !window.isMinimized}
          class:minimized={window.isMinimized}
          on:click={() => handleWindowClick(window.id)}
        >
          {window.title}
        </button>
      {/each}
    </div>
  </div>

  <div class="taskbar-right">
    {#if currentAccount}
      {#if unreadEmails > 0}
        <div class="notification-badge" title="{unreadEmails} unread email(s)">
          <span class="notif-icon">✉</span>
          <span class="notif-count">{unreadEmails}</span>
        </div>
      {/if}
      
      <div class="currency-display">
        <span class="currency credits" title="Credits">
          ¢{currentAccount.credits}
        </span>
        <span class="currency tokens" title="Tokens">
          ◆{currentAccount.tokens}
        </span>
      </div>
      
      <div class="user-info">
        <span class="clearance">L{currentAccount.clearanceLevel}</span>
        <span class="username">{currentAccount.username}</span>
      </div>
    {/if}
    
    <div class="clock">
      {formatTime(currentTime)}
    </div>
  </div>
</div>

<style>
  .taskbar {
    height: var(--taskbar-height);
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.5rem;
    gap: 1rem;
  }

  .taskbar-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  .taskbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .start-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--window-radius);
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .start-button:hover {
    background: var(--border-color);
  }

  .start-icon {
    color: var(--accent-primary);
  }

  .start-text {
    font-weight: 600;
    letter-spacing: 1px;
  }

  .window-buttons {
    display: flex;
    gap: 0.25rem;
    overflow-x: auto;
    flex: 1;
  }

  .window-button {
    padding: 0.35rem 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--window-radius);
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s ease;
  }

  .window-button:hover {
    background: var(--border-color);
    color: var(--text-primary);
  }

  .window-button.active {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: var(--bg-primary);
  }

  .window-button.minimized {
    opacity: 0.6;
  }

  .currency-display {
    display: flex;
    gap: 0.75rem;
    padding: 0.25rem 0.5rem;
    background: var(--bg-tertiary);
    border-radius: var(--window-radius);
  }

  .currency {
    font-size: 12px;
    font-weight: 500;
  }

  .credits {
    color: var(--accent-success);
  }

  .tokens {
    color: var(--accent-secondary);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 12px;
  }

  .clearance {
    padding: 0.15rem 0.4rem;
    background: var(--accent-primary);
    color: var(--bg-primary);
    border-radius: 2px;
    font-weight: 600;
    font-size: 10px;
  }

  .username {
    color: var(--text-secondary);
  }

  .clock {
    font-size: 12px;
    color: var(--text-muted);
    min-width: 45px;
    text-align: right;
  }

  .notification-badge {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.5rem;
    background: var(--accent-primary);
    border-radius: var(--window-radius);
    color: var(--bg-primary);
    font-size: 11px;
    font-weight: 600;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  .notif-icon {
    font-size: 12px;
  }

  .notif-count {
    font-size: 11px;
  }
</style>
