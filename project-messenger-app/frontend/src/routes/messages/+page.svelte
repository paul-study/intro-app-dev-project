<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { apiCall } from '$lib/api';
  import { currentUser } from '$lib/auth';
  import Button from '$lib/components/Button.svelte';

  let messages = $state([]);
  let loading = $state(true);
  let error = $state('');
  let newContent = $state('');
  let sending = $state(false);
  let conversationId = $state('');

  async function loadMessages() {
    loading = true;
    error = '';
    try {
      const token = localStorage.getItem('token');
      const data = await apiCall(`/api/messages?conversationId=${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      messages = data.data;
    } catch (err) {
      error = 'Failed to load messages';
    } finally {
      loading = false;
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!newContent.trim()) return;
    sending = true;
    try {
      const token = localStorage.getItem('token');
      await apiCall('/api/messages', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ conversationId, content: newContent.trim() })
      });
      newContent = '';
      await loadMessages();
    } catch (err) {
      error = 'Failed to send message';
    } finally {
      sending = false;
    }
  }

  async function handleDelete(id) {
    try {
      const token = localStorage.getItem('token');
      await apiCall(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadMessages();
    } catch (err) {
      error = 'Failed to delete message';
    }
  }

  onMount(() => {
    conversationId = $page.url.searchParams.get('conversationId') || '';
    if (conversationId) loadMessages();
    else error = 'No conversation selected';
  });
</script>

<div class="messages-container">
  <div class="header">
    <a href="/conversations">← Back</a>
    <h1>Messages</h1>
  </div>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  {#if loading}
    <p>Loading...</p>
  {:else if messages.length === 0}
    <p>No messages yet. Say something!</p>
  {:else}
    <ul>
      {#each messages as msg}
        {@const isOwn = msg.senderId === $currentUser?.id}
        <li class:own={isOwn}>
          <div class="bubble">
            <p>{msg.content}</p>
            <span class="meta">{msg.sender?.username ?? 'Unknown'} · {new Date(msg.createdAt).toLocaleTimeString()}</span>
          </div>
          {#if isOwn || $currentUser?.role === 'ADMIN'}
            <Button onclick={() => handleDelete(msg.id)}>Delete</Button>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}

  <form onsubmit={handleSend} class="send-form">
    <input
      type="text"
      placeholder="Type a message..."
      bind:value={newContent}
      required
    />
    <Button type="submit" disabled={sending}>
      {sending ? 'Sending...' : 'Send'}
    </Button>
  </form>
</div>

<style>
  .messages-container {
    max-width: 600px;
    margin: 30px auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 16px;
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
    align-items: flex-end;
    gap: 8px;
  }

  li.own {
    flex-direction: row-reverse;
  }

  .bubble {
    padding: 10px;
    border: 1px solid #ccc;
    max-width: 70%;
  }

  li.own .bubble {
    background-color: #e8f0fe;
  }

  .meta {
    display: block;
    font-size: 0.75rem;
    color: #888;
    margin-top: 4px;
  }

  .send-form {
    display: flex;
    gap: 8px;
  }

  .send-form input {
    flex: 1;
    padding: 10px;
  }

  .error {
    color: red;
  }
</style>