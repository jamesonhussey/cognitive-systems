<script>
  export let appName = 'App';
  export let message = 'Coming soon...';
</script>

<div class="placeholder-app">
  <div class="placeholder-content">
    <div class="icon">🚧</div>
    <h2>{appName}</h2>
    <p>{message}</p>
  </div>
</div>

<style>
  .placeholder-app {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
  }

  .placeholder-content {
    text-align: center;
    padding: 2rem;
  }

  .icon {
    font-size: 48px;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 18px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-muted);
    font-size: 14px;
  }
</style>
