<script>
  import { gameState } from './stores/gameState.js';
  import LoginScreen from './components/login/LoginScreen.svelte';
  import Desktop from './components/desktop/Desktop.svelte';
</script>

<main class="app">
  {#if $gameState.currentAccount}
    <Desktop />
  {:else}
    <LoginScreen />
  {/if}
</main>

<style>
  .app {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
