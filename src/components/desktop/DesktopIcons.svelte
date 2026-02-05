<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const icons = [
    { id: 'terminal', label: 'CA Terminal', icon: '▣' },
    { id: 'surveillance', label: 'Surveillance', icon: '◉' },
    { id: 'email', label: 'Email', icon: '✉' },
    { id: 'notes', label: 'Notes', icon: '📋' },
    { id: 'casefile', label: 'Case Files', icon: '📁' },
    { id: 'store', label: 'Store', icon: '🛒' },
  ];

  function handleDoubleClick(id) {
    dispatch('openApp', id);
  }

  function handleKeyDown(event, id) {
    if (event.key === 'Enter') {
      dispatch('openApp', id);
    }
  }
</script>

<div class="desktop-icons">
  {#each icons as icon}
    <button 
      class="desktop-icon"
      on:dblclick={() => handleDoubleClick(icon.id)}
      on:keydown={(e) => handleKeyDown(e, icon.id)}
    >
      <div class="icon-graphic">{icon.icon}</div>
      <span class="icon-label">{icon.label}</span>
    </button>
  {/each}
</div>

<style>
  .desktop-icons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    position: absolute;
    top: 0;
    left: 0;
  }

  .desktop-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    padding: 0.5rem;
    width: 80px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.1s ease;
  }

  .desktop-icon:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .desktop-icon:focus {
    background: rgba(74, 158, 255, 0.15);
    border-color: var(--accent-primary);
    outline: none;
  }

  .icon-graphic {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
  }

  .icon-label {
    font-size: 11px;
    color: var(--text-primary);
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    word-break: break-word;
    font-family: var(--font-mono);
  }
</style>
