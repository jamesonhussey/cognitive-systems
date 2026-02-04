import App from './App.svelte';
import './styles/global.css';

// Load dev tools in development mode
if (import.meta.env.DEV) {
  import('./engine/generation/devTools.js').then(({ initDevTools }) => {
    initDevTools();
  });
}

const app = new App({
  target: document.getElementById('app')
});

export default app;
