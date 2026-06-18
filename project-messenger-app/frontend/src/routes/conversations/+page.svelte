<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { apiCall } from '$lib/api';
  import { currentUser } from '$lib/auth';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';

  let conversations = [];
  let loading = true;
  let error = '';

  let showForm = false;
  let newTitle = '';
  let newChatType = 'DIRECT';
  let creating = false;
  let createError = '';

  async function loadConversations() {
    loading = true;
    error = '';
    try {
      const token = localStorage.getItem('token');
      const data = await apiCall('/api/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      conversations = data.data;
    } catch (err) {
      error = 'Failed to load conversations';
    } finally {
      loading = false;
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    creating = true;
    createError = '';
    try {
      const token = localStorage.getItem('token');
      const isGroup = newChatType === 'GROUP';
      await apiCall('/api/conversations', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newTitle, chatType: newChatType, isGroup })
      });
      newTitle = '';
      newChatType = 'DIRECT';
      showForm = false;
      await loadConversations();
    } catch (err) {
      createError = 'Failed to create conversation';
    } finally {
      creating = false;
    }
  }

  async function handleDelete(id) {
    try {
      const token = localStorage.getItem('token');
      await apiCall(`/api/conversations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadConversations();
    } catch (err) {
      error = 'Failed to delete conversation';
    }
  }

  onMount(loadConversations);
</script>

<div class="conversations-container">
  <div class="header">
    <h1>Conversations</h1>
    <Button onclick={() => (showForm = !showForm)}>
      {showForm ? 'Cancel' : 'New Conversation'}
    </Button>
  </div>

  {#if showForm}
    <form onsubmit={handleCreate} class="create-form">
      {#if createError}
        <p class="error">{createError}</p>
      {/if}
      <Input type="text" placeholder="Conversation title" bind:value={newTitle} required />
      <Input
        type="select"
        placeholder="Chat type"
        bind:value={newChatType}
        options={[
          { value: 'DIRECT', label: 'Direct' },
          { value: 'GROUP', label: 'Group' }
        ]}
      />
      <Button type="submit" disabled={creating}>
        {creating ? 'Creating...' : 'Create'}
      </Button>
    </form>
  {/if}

  {#if error}
    <p class="error">{error}</p>
  {/if}

  {#if loading}
    <p>Loading...</p>
  {:else if conversations.length === 0}
    <p>No conversations yet.</p>
  {:else}
    <ul>
      {#each conversations as convo}
        <li>
          <button class="convo-item" onclick={() => goto(`/messages?conversationId=${convo.id}`)}>
            <span class="title">{convo.title || 'Untitled'}</span>
            <span class="type">{convo.chatType}</span>
          </button>
          {#if $currentUser?.id === convo.creatorId || $currentUser?.role === 'ADMIN'}
            <Button onclick={() => handleDelete(convo.id)}>Delete</Button>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .conversations-container {
    max-width: 600px;
    margin: 30px auto;
    padding: 0 20px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .create-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
    padding: 16px;
    border: 1px solid #ccc;
  }

  ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    padding: 10px;
  }

  .convo-item {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    flex: 1;
    padding: 0;
  }

  .type {
    font-size: 0.8rem;
    color: #666;
  }

  .error {
    color: red;
  }
</style>