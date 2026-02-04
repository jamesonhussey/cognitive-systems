<script>
  import { createEventDispatcher, onMount } from 'svelte';

  export let title = 'Window';
  export let isActive = false;
  export let initialX = 50;
  export let initialY = 30;
  export let initialWidth = 800;
  export let initialHeight = 500;
  export let minWidth = 400;
  export let minHeight = 300;

  const dispatch = createEventDispatcher();

  let windowElement;
  let x = initialX;
  let y = initialY;
  let width = initialWidth;
  let height = initialHeight;
  let isDragging = false;
  let isResizing = false;
  let dragOffset = { x: 0, y: 0 };
  let resizeStart = { x: 0, y: 0, width: 0, height: 0 };

  function handleClose() {
    dispatch('close');
  }

  function handleMinimize() {
    dispatch('minimize');
  }

  function handleFocus() {
    dispatch('focus');
  }

  function startDrag(event) {
    if (event.target.closest('.window-controls')) return;
    
    isDragging = true;
    dragOffset = {
      x: event.clientX - x,
      y: event.clientY - y
    };
    handleFocus();
    
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', stopDrag);
  }

  function handleDrag(event) {
    if (!isDragging) return;
    
    x = Math.max(0, event.clientX - dragOffset.x);
    y = Math.max(0, event.clientY - dragOffset.y);
  }

  function stopDrag() {
    isDragging = false;
    window.removeEventListener('mousemove', handleDrag);
    window.removeEventListener('mouseup', stopDrag);
  }

  function startResize(event) {
    event.preventDefault();
    event.stopPropagation();
    
    isResizing = true;
    resizeStart = {
      x: event.clientX,
      y: event.clientY,
      width: width,
      height: height
    };
    handleFocus();
    
    window.addEventListener('mousemove', handleResize);
    window.addEventListener('mouseup', stopResize);
  }

  function handleResize(event) {
    if (!isResizing) return;
    
    const deltaX = event.clientX - resizeStart.x;
    const deltaY = event.clientY - resizeStart.y;
    
    width = Math.max(minWidth, resizeStart.width + deltaX);
    height = Math.max(minHeight, resizeStart.height + deltaY);
  }

  function stopResize() {
    isResizing = false;
    window.removeEventListener('mousemove', handleResize);
    window.removeEventListener('mouseup', stopResize);
  }

  function handleMaximize() {
    // Toggle between maximized and restored
    if (width >= window.innerWidth - 20 && height >= window.innerHeight - 60) {
      // Restore
      width = initialWidth;
      height = initialHeight;
      x = initialX;
      y = initialY;
    } else {
      // Maximize
      x = 0;
      y = 0;
      width = window.innerWidth;
      height = window.innerHeight - 36; // Account for taskbar
    }
  }
</script>

<div 
  class="window" 
  class:active={isActive}
  class:dragging={isDragging}
  class:resizing={isResizing}
  style="left: {x}px; top: {y}px; width: {width}px; height: {height}px;"
  bind:this={windowElement}
  on:mousedown={handleFocus}
  role="dialog"
>
  <div 
    class="window-header"
    on:mousedown={startDrag}
    on:dblclick={handleMaximize}
    role="banner"
  >
    <span class="window-title">{title}</span>
    <div class="window-controls">
      <button class="control minimize" on:click={handleMinimize} title="Minimize">
        ─
      </button>
      <button class="control maximize" on:click={handleMaximize} title="Maximize">
        □
      </button>
      <button class="control close" on:click={handleClose} title="Close">
        ×
      </button>
    </div>
  </div>
  <div class="window-content">
    <slot />
  </div>
  <div 
    class="resize-handle"
    on:mousedown={startResize}
    role="separator"
  ></div>
</div>

<style>
  .window {
    position: absolute;
    display: flex;
    flex-direction: column;
    background: var(--bg-window);
    border: 1px solid var(--border-color);
    border-radius: var(--window-radius);
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .window.active {
    border-color: var(--accent-primary);
    box-shadow: 0 4px 30px rgba(74, 158, 255, 0.15);
    z-index: 10;
  }

  .window.dragging,
  .window.resizing {
    user-select: none;
  }

  .window.dragging {
    cursor: grabbing;
  }

  .window-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    user-select: none;
    cursor: grab;
  }

  .window.dragging .window-header {
    cursor: grabbing;
  }

  .window-title {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .window.active .window-title {
    color: var(--text-primary);
  }

  .window-controls {
    display: flex;
    gap: 0.25rem;
  }

  .control {
    width: 24px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: 2px;
    color: var(--text-muted);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.1s ease;
  }

  .control:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  .control.close:hover {
    background: var(--accent-error);
    border-color: var(--accent-error);
    color: white;
  }

  .window-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 16px;
    height: 16px;
    cursor: se-resize;
  }

  .resize-handle::after {
    content: '';
    position: absolute;
    bottom: 3px;
    right: 3px;
    width: 8px;
    height: 8px;
    border-right: 2px solid var(--border-light);
    border-bottom: 2px solid var(--border-light);
    opacity: 0.5;
  }

  .window:hover .resize-handle::after {
    opacity: 1;
  }
</style>
