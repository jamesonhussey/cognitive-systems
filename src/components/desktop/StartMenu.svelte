<script>
  import { createEventDispatcher } from 'svelte';
  import { gameState } from '../../stores/gameState.js';

  export let isOpen = false;

  const dispatch = createEventDispatcher();

  $: currentAccount = $gameState.currentAccount;

  function handleLogout() {
    gameState.logout();
    dispatch('close');
  }

  function openApp(appId) {
    dispatch('openApp', appId);
    dispatch('close');
  }

  function handleClickOutside(event) {
    if (isOpen) {
      dispatch('close');
    }
  }
</script>

{#if isOpen}
  <div class="start-menu-backdrop" on:click={handleClickOutside} role="presentation"></div>
  <div class="start-menu">
    <div class="menu-header">
      <div class="user-info">
        <div class="avatar">
          {currentAccount?.firstName?.charAt(0) || '?'}{currentAccount?.lastName?.charAt(0) || ''}
        </div>
        <div class="user-details">
          <span class="user-name">{currentAccount?.firstName} {currentAccount?.lastName}</span>
          <span class="user-email">{currentAccount?.email}</span>
        </div>
      </div>
    </div>

    <div class="menu-divider"></div>

    <div class="menu-section">
      <button class="menu-item" on:click={() => openApp('terminal')}>
        <span class="menu-icon">▣</span>
        <span>CA Terminal</span>
      </button>
      <button class="menu-item" on:click={() => openApp('surveillance')}>
        <span class="menu-icon">◉</span>
        <span>Surveillance System</span>
      </button>
      <button class="menu-item" on:click={() => openApp('email')}>
        <span class="menu-icon">✉</span>
        <span>Email</span>
      </button>
      <button class="menu-item" on:click={() => openApp('notes')}>
        <span class="menu-icon">📋</span>
        <span>Notes</span>
      </button>
      <button class="menu-item" on:click={() => openApp('casefile')}>
        <span class="menu-icon">📁</span>
        <span>Case Files</span>
      </button>
      <button class="menu-item" on:click={() => openApp('store')}>
        <span class="menu-icon">🛒</span>
        <span>Store</span>
      </button>
    </div>

    <div class="menu-divider"></div>

    <div class="menu-section">
      <button class="menu-item logout" on:click={handleLogout}>
        <span class="menu-icon">⏻</span>
        <span>Log Out</span>
      </button>
    </div>
  </div>
{/if}

<style>
  .start-menu-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
  }

  .start-menu {
    position: absolute;
    bottom: calc(var(--taskbar-height) + 8px);
    left: 8px;
    width: 280px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--window-radius);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    z-index: 100;
    overflow: hidden;
  }

  .menu-header {
    padding: 1rem;
    background: var(--bg-tertiary);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .avatar {
    width: 40px;
    height: 40px;
    background: var(--accent-primary);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    color: var(--bg-primary);
  }

  .user-details {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .user-name {
    font-weight: 500;
    color: var(--text-primary);
  }

  .user-email {
    font-size: 11px;
    color: var(--text-muted);
  }

  .menu-divider {
    height: 1px;
    background: var(--border-color);
  }

  .menu-section {
    padding: 0.5rem;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.6rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: 3px;
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 13px;
    cursor: pointer;
    transition: background 0.1s ease;
    text-align: left;
  }

  .menu-item:hover {
    background: var(--bg-tertiary);
  }

  .menu-item.logout {
    color: var(--accent-error);
  }

  .menu-item.logout:hover {
    background: rgba(255, 107, 107, 0.1);
  }

  .menu-icon {
    width: 20px;
    text-align: center;
    opacity: 0.8;
  }
</style>
