<script>
  import { gameState } from '../../stores/gameState.js';

  let notes = [];
  let activeNoteId = null;
  let noteContent = '';
  let noteTitle = '';

  // Load notes from account on mount
  $: if ($gameState.currentAccount) {
    const savedNotes = $gameState.currentAccount.notes || [];
    if (JSON.stringify(savedNotes) !== JSON.stringify(notes)) {
      notes = savedNotes;
    }
  }

  $: activeNote = notes.find(n => n.id === activeNoteId);

  function createNote() {
    const newNote = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes = [...notes, newNote];
    activeNoteId = newNote.id;
    noteTitle = newNote.title;
    noteContent = newNote.content;
    saveNotes();
  }

  function selectNote(id) {
    // Save current note before switching
    if (activeNoteId) {
      saveCurrentNote();
    }
    
    activeNoteId = id;
    const note = notes.find(n => n.id === id);
    if (note) {
      noteTitle = note.title;
      noteContent = note.content;
    }
  }

  function saveCurrentNote() {
    if (!activeNoteId) return;
    
    notes = notes.map(n => {
      if (n.id === activeNoteId) {
        return {
          ...n,
          title: noteTitle || 'Untitled Note',
          content: noteContent,
          updatedAt: new Date().toISOString()
        };
      }
      return n;
    });
    saveNotes();
  }

  function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    if (activeNoteId === id) {
      activeNoteId = notes[0]?.id || null;
      if (activeNoteId) {
        const note = notes.find(n => n.id === activeNoteId);
        noteTitle = note?.title || '';
        noteContent = note?.content || '';
      } else {
        noteTitle = '';
        noteContent = '';
      }
    }
    saveNotes();
  }

  function saveNotes() {
    gameState.updateAccount({ notes });
  }

  function handleContentChange() {
    saveCurrentNote();
  }

  function handleTitleChange() {
    saveCurrentNote();
  }
</script>

<div class="notes-app">
  <div class="sidebar">
    <div class="sidebar-header">
      <span>Notes</span>
      <button class="new-note-btn" on:click={createNote} title="New Note">
        +
      </button>
    </div>
    <div class="notes-list">
      {#each notes as note (note.id)}
        <button 
          class="note-item"
          class:active={note.id === activeNoteId}
          on:click={() => selectNote(note.id)}
        >
          <span class="note-title">{note.title}</span>
          <span class="note-date">
            {new Date(note.updatedAt).toLocaleDateString()}
          </span>
        </button>
      {/each}
      {#if notes.length === 0}
        <div class="empty-state">
          No notes yet.<br>
          Click + to create one.
        </div>
      {/if}
    </div>
  </div>
  
  <div class="editor">
    {#if activeNoteId}
      <div class="editor-header">
        <input 
          type="text" 
          class="title-input"
          bind:value={noteTitle}
          on:blur={handleTitleChange}
          placeholder="Note title..."
        />
        <button 
          class="delete-btn" 
          on:click={() => deleteNote(activeNoteId)}
          title="Delete Note"
        >
          🗑
        </button>
      </div>
      <textarea 
        class="content-input"
        bind:value={noteContent}
        on:blur={handleContentChange}
        placeholder="Start typing..."
      ></textarea>
    {:else}
      <div class="no-note-selected">
        <p>Select a note or create a new one</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .notes-app {
    display: flex;
    height: 100%;
    background: var(--bg-primary);
  }

  .sidebar {
    width: 200px;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    border-bottom: 1px solid var(--border-color);
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-secondary);
  }

  .new-note-btn {
    width: 24px;
    height: 24px;
    background: var(--accent-primary);
    border: none;
    border-radius: 4px;
    color: var(--bg-primary);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .new-note-btn:hover {
    filter: brightness(1.1);
  }

  .notes-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .note-item {
    width: 100%;
    padding: 0.6rem 0.5rem;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 4px;
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    font-family: var(--font-mono);
    margin-bottom: 0.25rem;
  }

  .note-item:hover {
    background: var(--bg-tertiary);
  }

  .note-item.active {
    background: var(--bg-tertiary);
    border-color: var(--accent-primary);
  }

  .note-title {
    font-size: 13px;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .note-date {
    font-size: 10px;
    color: var(--text-muted);
  }

  .empty-state {
    padding: 1rem;
    text-align: center;
    color: var(--text-muted);
    font-size: 12px;
    line-height: 1.6;
  }

  .editor {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .editor-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border-bottom: 1px solid var(--border-color);
  }

  .title-input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 16px;
    font-weight: 500;
    outline: none;
  }

  .title-input::placeholder {
    color: var(--text-muted);
  }

  .delete-btn {
    padding: 0.35rem 0.5rem;
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 14px;
  }

  .delete-btn:hover {
    background: rgba(255, 107, 107, 0.1);
    border-color: var(--accent-error);
    color: var(--accent-error);
  }

  .content-input {
    flex: 1;
    padding: 1rem;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 14px;
    line-height: 1.6;
    resize: none;
    outline: none;
  }

  .content-input::placeholder {
    color: var(--text-muted);
  }

  .no-note-selected {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
  }
</style>
