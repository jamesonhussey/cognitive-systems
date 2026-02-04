<script>
  import { gameState } from '../../stores/gameState.js';
  
  let mode = 'select'; // 'select', 'login', 'create'
  let firstName = '';
  let lastName = '';
  let password = '';
  let confirmPassword = '';
  let username = '';
  let error = '';
  let loading = false;

  $: existingAccounts = $gameState.accounts;

  function handleLogin() {
    error = '';
    const result = gameState.login(username, password);
    if (!result.success) {
      error = result.error;
    }
  }

  function handleCreate() {
    error = '';
    
    if (!firstName.trim() || !lastName.trim()) {
      error = 'Please enter your full name';
      return;
    }
    
    if (password.length < 4) {
      error = 'Password must be at least 4 characters';
      return;
    }
    
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    const potentialUsername = `${firstName.toLowerCase()}.${lastName.charAt(0).toLowerCase()}`;
    const exists = existingAccounts.some(a => a.username === potentialUsername);
    
    if (exists) {
      error = 'An account with this name already exists';
      return;
    }

    loading = true;
    
    // Simulate account creation delay for immersion
    setTimeout(() => {
      gameState.createAccount(firstName.trim(), lastName.trim(), password);
      loading = false;
    }, 1500);
  }

  function selectAccount(account) {
    username = account.username;
    mode = 'login';
  }

  let deleteConfirmId = null;

  function confirmDelete(accountId, event) {
    event.stopPropagation();
    deleteConfirmId = accountId;
  }

  function cancelDelete(event) {
    event.stopPropagation();
    deleteConfirmId = null;
  }

  function executeDelete(accountId, event) {
    event.stopPropagation();
    gameState.deleteAccount(accountId);
    deleteConfirmId = null;
  }
</script>

<div class="login-screen">
  <div class="login-container">
    <div class="logo">
      <pre class="ascii-logo">
╔═══════════════════════════════════════╗
║     VERITY SYSTEMS WORKSTATION        ║
║          v4.2.1 [SECURE]              ║
╚═══════════════════════════════════════╝</pre>
    </div>

    {#if loading}
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Creating employee profile...</p>
        <p class="text-muted">Please wait while your account is provisioned.</p>
      </div>
    {:else if mode === 'select'}
      <div class="mode-select">
        {#if existingAccounts.length > 0}
          <div class="existing-accounts">
            <h3>Select Account</h3>
            <div class="account-list">
              {#each existingAccounts as account}
                <div class="account-row">
                  <button 
                    class="account-button"
                    on:click={() => selectAccount(account)}
                  >
                    <span class="account-name">{account.firstName} {account.lastName}</span>
                    <span class="account-email">{account.email}</span>
                  </button>
                  {#if deleteConfirmId === account.id}
                    <div class="delete-confirm">
                      <span>Delete?</span>
                      <button class="confirm-yes" on:click={(e) => executeDelete(account.id, e)}>Yes</button>
                      <button class="confirm-no" on:click={cancelDelete}>No</button>
                    </div>
                  {:else}
                    <button 
                      class="delete-button" 
                      on:click={(e) => confirmDelete(account.id, e)}
                      title="Delete account"
                    >
                      ×
                    </button>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
          <div class="divider">
            <span>or</span>
          </div>
        {/if}
        
        <button class="create-button" on:click={() => mode = 'create'}>
          + Create New Account
        </button>
      </div>

    {:else if mode === 'login'}
      <form class="login-form" on:submit|preventDefault={handleLogin}>
        <h3>Employee Login</h3>
        
        <div class="field">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            bind:value={username}
            placeholder="john.d"
            autocomplete="off"
          />
        </div>
        
        <div class="field">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            bind:value={password}
            placeholder="••••••••"
          />
        </div>

        {#if error}
          <p class="error">{error}</p>
        {/if}

        <div class="button-row">
          <button type="button" class="back-button" on:click={() => { mode = 'select'; error = ''; }}>
            ← Back
          </button>
          <button type="submit" class="submit-button">
            Login →
          </button>
        </div>
      </form>

    {:else if mode === 'create'}
      <form class="login-form" on:submit|preventDefault={handleCreate}>
        <h3>New Employee Registration</h3>
        
        <div class="field-row">
          <div class="field">
            <label for="firstName">First Name</label>
            <input 
              type="text" 
              id="firstName" 
              bind:value={firstName}
              placeholder="John"
              autocomplete="off"
            />
          </div>
          
          <div class="field">
            <label for="lastName">Last Name</label>
            <input 
              type="text" 
              id="lastName" 
              bind:value={lastName}
              placeholder="Doe"
              autocomplete="off"
            />
          </div>
        </div>
        
        <div class="field">
          <label for="newPassword">Password</label>
          <input 
            type="password" 
            id="newPassword" 
            bind:value={password}
            placeholder="••••••••"
          />
        </div>
        
        <div class="field">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            bind:value={confirmPassword}
            placeholder="••••••••"
          />
        </div>

        {#if error}
          <p class="error">{error}</p>
        {/if}

        <div class="button-row">
          <button type="button" class="back-button" on:click={() => { mode = 'select'; error = ''; }}>
            ← Back
          </button>
          <button type="submit" class="submit-button">
            Create Account →
          </button>
        </div>
      </form>
    {/if}

    <footer class="login-footer">
      <p>© 2024 Verity Systems Corporation. All rights reserved.</p>
      <p class="text-muted">Authorized personnel only. Activity is monitored.</p>
    </footer>
  </div>
</div>

<style>
  .login-screen {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(74, 158, 255, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(123, 104, 238, 0.03) 0%, transparent 50%);
  }

  .login-container {
    width: 100%;
    max-width: 480px;
    padding: 2rem;
  }

  .logo {
    text-align: center;
    margin-bottom: 2rem;
  }

  .ascii-logo {
    font-size: 12px;
    color: var(--accent-primary);
    line-height: 1.2;
  }

  .loading-state {
    text-align: center;
    padding: 2rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border-color);
    border-top-color: var(--accent-primary);
    border-radius: 50%;
    margin: 0 auto 1rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .mode-select {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .existing-accounts h3,
  .login-form h3 {
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .account-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .account-button {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    width: 100%;
    padding: 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--window-radius);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .account-button:hover {
    background: var(--bg-tertiary);
    border-color: var(--accent-primary);
  }

  .account-name {
    color: var(--text-primary);
    font-weight: 500;
  }

  .account-email {
    color: var(--text-muted);
    font-size: 12px;
  }

  .account-row {
    display: flex;
    gap: 0.5rem;
    align-items: stretch;
  }

  .account-row .account-button {
    flex: 1;
  }

  .delete-button {
    width: 40px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--window-radius);
    color: var(--text-muted);
    font-size: 18px;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .delete-button:hover {
    background: rgba(255, 107, 107, 0.1);
    border-color: var(--accent-error);
    color: var(--accent-error);
  }

  .delete-confirm {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--accent-error);
    border-radius: var(--window-radius);
    font-size: 12px;
    color: var(--text-primary);
  }

  .confirm-yes,
  .confirm-no {
    padding: 0.35rem 0.6rem;
    border: none;
    border-radius: 3px;
    font-family: var(--font-mono);
    font-size: 11px;
    cursor: pointer;
  }

  .confirm-yes {
    background: var(--accent-error);
    color: white;
  }

  .confirm-yes:hover {
    filter: brightness(1.1);
  }

  .confirm-no {
    background: var(--bg-secondary);
    color: var(--text-secondary);
  }

  .confirm-no:hover {
    background: var(--border-color);
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: var(--text-muted);
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }

  .create-button {
    width: 100%;
    padding: 1rem;
    background: transparent;
    border: 1px dashed var(--border-color);
    border-radius: var(--window-radius);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .create-button:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .field-row {
    display: flex;
    gap: 1rem;
  }

  .field-row .field {
    flex: 1;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field label {
    color: var(--text-secondary);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .field input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--window-radius);
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s ease;
  }

  .field input:focus {
    border-color: var(--accent-primary);
  }

  .field input::placeholder {
    color: var(--text-muted);
  }

  .error {
    color: var(--accent-error);
    font-size: 13px;
    padding: 0.5rem;
    background: rgba(255, 107, 107, 0.1);
    border-radius: var(--window-radius);
  }

  .button-row {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  .back-button,
  .submit-button {
    flex: 1;
    padding: 0.75rem 1rem;
    border-radius: var(--window-radius);
    font-family: var(--font-mono);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .back-button {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
  }

  .back-button:hover {
    border-color: var(--text-secondary);
    color: var(--text-primary);
  }

  .submit-button {
    background: var(--accent-primary);
    border: 1px solid var(--accent-primary);
    color: var(--bg-primary);
    font-weight: 500;
  }

  .submit-button:hover {
    filter: brightness(1.1);
  }

  .login-footer {
    margin-top: 3rem;
    text-align: center;
    font-size: 11px;
  }

  .login-footer p {
    margin-bottom: 0.25rem;
  }
</style>
