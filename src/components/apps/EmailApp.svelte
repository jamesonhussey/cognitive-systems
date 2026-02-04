<script>
  import { gameState } from '../../stores/gameState.js';
  import { onMount, getContext } from 'svelte';
  import { deliverPendingEmails } from '../../engine/content/EmailSystem.js';

  // Get the openAssignment function from Desktop context
  const openAssignment = getContext('openAssignment');

  let selectedEmailId = null;

  $: currentAccount = $gameState.currentAccount;
  $: emails = currentAccount?.emails || [];
  $: unreadCount = emails.filter(e => !e.read).length;
  
  // Sort emails by date, newest first
  $: sortedEmails = [...emails].sort((a, b) => 
    new Date(b.receivedAt) - new Date(a.receivedAt)
  );

  $: selectedEmail = emails.find(e => e.id === selectedEmailId);

  onMount(() => {
    // Deliver any pending emails when opening the app
    deliverPendingEmails();
    
    // Auto-select first email if none selected
    if (!selectedEmailId && sortedEmails.length > 0) {
      selectEmail(sortedEmails[0].id);
    }
  });

  function selectEmail(id) {
    selectedEmailId = id;
    
    // Mark as read
    const email = emails.find(e => e.id === id);
    if (email && !email.read) {
      markAsRead(id);
    }
  }

  function markAsRead(id) {
    const updatedEmails = emails.map(e => 
      e.id === id ? { ...e, read: true } : e
    );
    gameState.updateAccount({ 
      emails: updatedEmails,
      unreadEmails: updatedEmails.filter(e => !e.read).length
    });
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  function formatFullDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getPreview(body) {
    // Strip any formatting and get first ~50 chars
    const plain = body.replace(/\n/g, ' ').trim();
    return plain.length > 50 ? plain.substring(0, 50) + '...' : plain;
  }

  function handleAction(attachment) {
    if (attachment.type === 'assignment') {
      // Open terminal with this patient
      if (openAssignment && attachment.patientId) {
        openAssignment(attachment.patientId);
      }
    } else if (attachment.type === 'link') {
      // Could open store, case files, etc.
      console.log('Link action:', attachment.target);
    }
  }
</script>

<div class="email-app">
  <div class="email-sidebar">
    <div class="sidebar-header">
      <span class="inbox-title">Inbox</span>
      {#if unreadCount > 0}
        <span class="unread-badge">{unreadCount}</span>
      {/if}
    </div>
    
    <div class="email-list">
      {#if sortedEmails.length === 0}
        <div class="empty-inbox">
          <p>No emails yet.</p>
        </div>
      {:else}
        {#each sortedEmails as email (email.id)}
          <button 
            class="email-item"
            class:selected={selectedEmailId === email.id}
            class:unread={!email.read}
            on:click={() => selectEmail(email.id)}
          >
            <div class="email-indicator">
              {#if !email.read}
                <span class="unread-dot">●</span>
              {/if}
            </div>
            <div class="email-preview">
              <div class="email-header-row">
                <span class="email-sender">{email.from.name}</span>
                <span class="email-date">{formatDate(email.receivedAt)}</span>
              </div>
              <div class="email-subject">{email.subject}</div>
              <div class="email-snippet">{getPreview(email.body)}</div>
            </div>
          </button>
        {/each}
      {/if}
    </div>
  </div>

  <div class="email-viewer">
    {#if selectedEmail}
      <div class="viewer-header">
        <h2 class="viewer-subject">{selectedEmail.subject}</h2>
        <div class="viewer-meta">
          <div class="meta-row">
            <span class="meta-label">From:</span>
            <span class="meta-value">{selectedEmail.from.name} &lt;{selectedEmail.from.email}&gt;</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">To:</span>
            <span class="meta-value">{currentAccount?.email || 'you'}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">Date:</span>
            <span class="meta-value">{formatFullDate(selectedEmail.receivedAt)}</span>
          </div>
        </div>
      </div>

      <div class="viewer-body">
        <pre class="email-content">{selectedEmail.body}</pre>
        
        {#if selectedEmail.attachments && selectedEmail.attachments.length > 0}
          <div class="attachments">
            <div class="attachments-header">Attachments:</div>
            {#each selectedEmail.attachments as attachment}
              <button class="attachment" on:click={() => handleAction(attachment)}>
                <span class="attachment-icon">📎</span>
                <span class="attachment-name">{attachment.name}</span>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {:else}
      <div class="no-email-selected">
        <p>Select an email to read</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .email-app {
    display: flex;
    height: 100%;
    background: var(--bg-primary);
  }

  .email-sidebar {
    width: 280px;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border-color);
  }

  .inbox-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .unread-badge {
    background: var(--accent-primary);
    color: var(--bg-primary);
    font-size: 11px;
    font-weight: 600;
    padding: 0.15rem 0.5rem;
    border-radius: 10px;
  }

  .email-list {
    flex: 1;
    overflow-y: auto;
  }

  .empty-inbox {
    padding: 2rem;
    text-align: center;
    color: var(--text-muted);
  }

  .email-item {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--border-color);
    text-align: left;
    cursor: pointer;
    transition: background 0.1s ease;
    font-family: var(--font-mono);
  }

  .email-item:hover {
    background: var(--bg-tertiary);
  }

  .email-item.selected {
    background: var(--bg-tertiary);
    border-left: 2px solid var(--accent-primary);
  }

  .email-item.unread .email-sender,
  .email-item.unread .email-subject {
    font-weight: 600;
    color: var(--text-primary);
  }

  .email-indicator {
    width: 12px;
    flex-shrink: 0;
  }

  .unread-dot {
    color: var(--accent-primary);
    font-size: 8px;
  }

  .email-preview {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .email-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .email-sender {
    font-size: 13px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .email-date {
    font-size: 11px;
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .email-subject {
    font-size: 12px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .email-snippet {
    font-size: 11px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .email-viewer {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .viewer-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
  }

  .viewer-subject {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }

  .viewer-meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .meta-row {
    display: flex;
    gap: 0.5rem;
    font-size: 12px;
  }

  .meta-label {
    color: var(--text-muted);
    width: 40px;
  }

  .meta-value {
    color: var(--text-secondary);
  }

  .viewer-body {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }

  .email-content {
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.7;
    color: var(--text-primary);
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .attachments {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
  }

  .attachments-header {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .attachment {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 12px;
    cursor: pointer;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .attachment:hover {
    border-color: var(--accent-primary);
    background: var(--bg-tertiary);
  }

  .no-email-selected {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
  }
</style>
