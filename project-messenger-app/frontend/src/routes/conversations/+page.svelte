<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { apiCall } from '$lib/api';
  import { currentUser } from '$lib/auth';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';
  import Alert from '$lib/components/Alert.svelte';
  import Loading from '$lib/components/Loading.svelte';
  import Card from '$lib/components/Card.svelte';
  import Modal from '$lib/components/Modal.svelte';

  let conversations = $state([]);
  let users = $state([]);
  let loading = $state(true);
  let error = $state('');
  let success = $state('');

  let showForm = $state(false);
  let newTitle = $state('');
  let newChatType = $state('DIRECT');
  let newUserId2 = $state('');
  let creating = $state(false);
  let createError = $state('');
  let titleError = $state('');
  let userError = $state('');

  let deleteTargetId = $state(null);
  let deleting = $state(false);

  async function loadConversations() {
    loading = true;
    error = '';
    try {
      const token = localStorage.getItem('token');
      const [convoRes, userRes] = await Promise.all([
        apiCall('/api/conversations', { headers: { Authorization: `Bearer ${token}` } }),
        apiCall('/api/users?limit=100', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      conversations = convoRes.data;
      users = userRes.data.filter((u) => u.id !== $currentUser?.id);
    } catch (err) {
      error = 'Failed to load conversations.';
    } finally {
      loading = false;
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    titleError = '';
    userError = '';
    if (!newTitle.trim()) { titleError = 'Title is required.'; return; }
    if (newChatType === 'DIRECT' && !newUserId2) { userError = 'Select a user to message.'; return; }
    creating = true;
    createError = '';
    try {
      const token = localStorage.getItem('token');
      const isGroup = newChatType === 'GROUP';
      const body = { title: newTitle.trim(), chatType: newChatType, isGroup };
      if (newChatType === 'DIRECT') body.userId2 = newUserId2;
      await apiCall('/api/conversations', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      newTitle = '';
      newChatType = 'DIRECT';
      newUserId2 = '';
      showForm = false;
      success = 'Conversation created.';
      await loadConversations();
    } catch (err) {
      createError = err.message;
    } finally {
      creating = false;
    }
  }

  async function handleDelete() {
    if (!deleteTargetId) return;
    deleting = true;
    try {
      const token = localStorage.getItem('token');
      await apiCall(`/api/conversations/${deleteTargetId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      deleteTargetId = null;
      success = 'Conversation deleted.';
      await loadConversations();
    } catch (err) {
      error = 'Failed to delete conversation.';
      deleteTargetId = null;
    } finally {
      deleting = false;
    }
  }

  onMount(loadConversations);
</script>

<div class="conversations-container">
  <div class="page-header">
    <h1>Conversations</h1>
    <Button onclick={() => { showForm = !showForm; createError = ''; titleError = ''; success = ''; }}>
      {showForm ? 'Cancel' : 'New Conversation'}
    </Button>
  </div>

  <Alert type="error" message={error} />
  <Alert type="success" message={success} />

  {#if showForm}
    <form onsubmit={handleCreate} class="create-form" novalidate>
      <h2>New Conversation</h2>
      <Alert type="error" message={createError} />
      <div class="field">
        <Input type="text" placeholder="Conversation title" bind:value={newTitle} />
        {#if titleError}<span class="field-error">{titleError}</span>{/if}
      </div>
      <Input
        type="select"
        placeholder="Chat type"
        bind:value={newChatType}
        options={[
          { value: 'DIRECT', label: 'Direct' },
          { value: 'GROUP', label: 'Group' }
        ]}
      />
      {#if newChatType === 'DIRECT'}
        <div class="field">
          <Input
            type="select"
            placeholder="Select user to message"
            bind:value={newUserId2}
            options={users.map((u) => ({ value: u.id, label: u.username }))}
          />
          {#if userError}<span class="field-error">{userError}</span>{/if}
        </div>
      {/if}
      <Button type="submit" disabled={creating}>
        {creating ? 'Creating...' : 'Create'}
      </Button>
    </form>
  {/if}

  {#if loading}
    <Loading />
  {:else if conversations.length === 0}
    <p class="empty">No conversations yet. Start one above!</p>
  {:else}
    <ul>
      {#each conversations as convo}
        {@const otherParticipant = convo.chatType === 'DIRECT'
          ? (convo.participants || []).find((p) => p.user?.id !== $currentUser?.id)
          : null}
        <li>
          <Card>
            <div class="convo-row">
              <button
                class="convo-info"
                onclick={() => goto(`/messages?conversationId=${convo.id}`)}
              >
                <span class="title">
                  {otherParticipant ? otherParticipant.user.username : (convo.title || 'Untitled')}
                </span>
                <span class="type-badge">{convo.chatType}</span>
              </button>
              <div class="convo-actions">
                <Button onclick={() => goto(`/conversations/${convo.id}`)}>Detail</Button>
                {#if $currentUser?.id === convo.creatorId || $currentUser?.role === 'ADMIN'}
                  <Button onclick={() => { deleteTargetId = convo.id; success = ''; }}>Delete</Button>
                {/if}
              </div>
            </div>
          </Card>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<Modal
  open={deleteTargetId !== null}
  title="Delete Conversation"
  onconfirm={handleDelete}
  oncancel={() => (deleteTargetId = null)}
>
  <p>Are you sure you want to delete this conversation? This cannot be undone.</p>
</Modal>

<style>
  .conversations-container {
    max-width: 640px;
    margin: 30px auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .page-header h1 {
    margin: 0;
  }

  .create-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;
  }

  .create-form h2 {
    margin: 0;
    font-size: 1.05rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .field-error {
    color: #b91c1c;
    font-size: 0.8rem;
  }

  ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .convo-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .convo-info {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    flex: 1;
    padding: 0;
    text-align: left;
  }

  .convo-info:hover .title {
    color: #2563eb;
    text-decoration: underline;
  }

  .title {
    font-weight: 600;
    color: #111827;
  }

  .type-badge {
    font-size: 0.78rem;
    color: #6b7280;
    background: #f3f4f6;
    padding: 1px 8px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
  }

  .convo-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }

  .empty {
    color: #6b7280;
    text-align: center;
    padding: 20px 0;
  }

  @media (max-width: 480px) {
    .convo-row {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
