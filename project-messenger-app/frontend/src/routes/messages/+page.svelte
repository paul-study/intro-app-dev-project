<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { apiCall } from '$lib/api';
  import { currentUser } from '$lib/auth';
  import Button from '$lib/components/Button.svelte';
  import Alert from '$lib/components/Alert.svelte';
  import Loading from '$lib/components/Loading.svelte';
  import Message from '$lib/components/Message.svelte';
  import Modal from '$lib/components/Modal.svelte';

  let messages = $state([]);
  let loading = $state(true);
  let error = $state('');
  let newContent = $state('');
  let sending = $state(false);
  let conversationId = $state('');
  let deleteTargetId = $state(null);

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
      error = 'Failed to load messages.';
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
      error = 'Failed to send message.';
    } finally {
      sending = false;
    }
  }

  async function handleDelete() {
    if (!deleteTargetId) return;
    try {
      const token = localStorage.getItem('token');
      await apiCall(`/api/messages/${deleteTargetId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      deleteTargetId = null;
      await loadMessages();
    } catch (err) {
      error = 'Failed to delete message.';
      deleteTargetId = null;
    }
  }

  onMount(() => {
    conversationId = $page.url.searchParams.get('conversationId') || '';
    if (conversationId) {
      loadMessages();
    } else {
      error = 'No conversation selected.';
      loading = false;
    }
  });
</script>

<div class="messages-container">
  <div class="page-header">
    <a href="/conversations" class="back-link">&larr; Back</a>
    <h1>Messages</h1>
  </div>

  <Alert type="error" message={error} />

  {#if loading}
    <Loading />
  {:else if messages.length === 0}
    <p class="empty">No messages yet. Say something!</p>
  {:else}
    <ul class="message-list">
      {#each messages as msg}
        {@const isOwn = msg.senderId === $currentUser?.id}
        {@const canDelete = isOwn || $currentUser?.role === 'ADMIN'}
        <li>
          <Message
            message={msg}
            {isOwn}
            ondelete={canDelete ? () => { deleteTargetId = msg.id; } : null}
          />
        </li>
      {/each}
    </ul>
  {/if}

  <form onsubmit={handleSend} class="send-form" novalidate>
    <input
      type="text"
      class="msg-input"
      placeholder="Type a message..."
      bind:value={newContent}
    />
    <Button type="submit" disabled={sending || !newContent.trim()}>
      {sending ? '...' : 'Send'}
    </Button>
  </form>
</div>

<Modal
  open={deleteTargetId !== null}
  title="Delete Message"
  onconfirm={handleDelete}
  oncancel={() => (deleteTargetId = null)}
>
  <p>Are you sure you want to delete this message?</p>
</Modal>

<style>
  .messages-container {
    max-width: 640px;
    margin: 30px auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .page-header {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .page-header h1 {
    margin: 0;
  }

  .back-link {
    color: #2563eb;
    text-decoration: none;
    font-size: 0.9rem;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  .message-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .send-form {
    display: flex;
    gap: 8px;
    position: sticky;
    bottom: 0;
    background: #fff;
    padding: 12px 0;
    border-top: 1px solid #e5e7eb;
    margin-top: auto;
  }

  .msg-input {
    flex: 1;
    padding: 10px 14px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.95rem;
  }

  .msg-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px #bfdbfe;
  }

  .empty {
    color: #6b7280;
    text-align: center;
    padding: 40px 0;
  }
</style>
