<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { apiCall } from '$lib/api';
  import { currentUser } from '$lib/auth';
  import Alert from '$lib/components/Alert.svelte';
  import Loading from '$lib/components/Loading.svelte';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Card from '$lib/components/Card.svelte';

  let conversation = $state(null);
  let loading = $state(true);
  let error = $state('');
  let success = $state('');

  let editing = $state(false);
  let editTitle = $state('');
  let editType = $state('DIRECT');
  let saving = $state(false);
  let editError = $state('');

  let showDeleteModal = $state(false);
  let deleting = $state(false);

  const id = $page.params.id;

  async function loadConversation() {
    loading = true;
    error = '';
    try {
      const token = localStorage.getItem('token');
      const data = await apiCall(`/api/conversations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      conversation = data.data;
      editTitle = data.data.title ?? '';
      editType = data.data.chatType ?? 'DIRECT';
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleEdit(e) {
    e.preventDefault();
    if (!editTitle.trim()) {
      editError = 'Title is required.';
      return;
    }
    saving = true;
    editError = '';
    success = '';
    try {
      const token = localStorage.getItem('token');
      const data = await apiCall(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: editTitle.trim(), chatType: editType })
      });
      conversation = data.data;
      editing = false;
      success = 'Conversation updated successfully.';
    } catch (err) {
      editError = err.message;
    } finally {
      saving = false;
    }
  }

  async function handleDelete() {
    deleting = true;
    try {
      const token = localStorage.getItem('token');
      await apiCall(`/api/conversations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      goto('/conversations');
    } catch (err) {
      error = err.message;
      showDeleteModal = false;
    } finally {
      deleting = false;
    }
  }

  onMount(loadConversation);
</script>

<div class="detail-container">
  <div class="page-header">
    <a href="/conversations" class="back-link">← Back to Conversations</a>
    <h1>Conversation Detail</h1>
  </div>

  <Alert type="error" message={error} />
  <Alert type="success" message={success} />

  {#if loading}
    <Loading />
  {:else if conversation}
    <Card>
      <div class="convo-info">
        <div class="field">
          <span class="field-label">Title</span>
          <span>{conversation.title ?? 'Untitled'}</span>
        </div>
        <div class="field">
          <span class="field-label">Type</span>
          <span class="badge">{conversation.chatType}</span>
        </div>
        <div class="field">
          <span class="field-label">Created</span>
          <span>{new Date(conversation.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Card>

    <div class="actions">
      <Button onclick={() => goto(`/messages?conversationId=${id}`)}>Open Messages</Button>
      {#if $currentUser?.id === conversation.creatorId || $currentUser?.role === 'ADMIN'}
        <Button onclick={() => { editing = !editing; editError = ''; success = ''; }}>
          {editing ? 'Cancel Edit' : 'Edit'}
        </Button>
        <Button onclick={() => showDeleteModal = true}>Delete</Button>
      {/if}
    </div>

    {#if editing}
      <form onsubmit={handleEdit} class="edit-form">
        <h2>Edit Conversation</h2>
        <Alert type="error" message={editError} />
        <label>
          Title
          <Input type="text" placeholder="Conversation title" bind:value={editTitle} required />
        </label>
        <label>
          Chat Type
          <Input
            type="select"
            bind:value={editType}
            options={[
              { value: 'DIRECT', label: 'Direct' },
              { value: 'GROUP', label: 'Group' }
            ]}
          />
        </label>
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    {/if}
  {/if}
</div>

<Modal
  open={showDeleteModal}
  title="Delete Conversation"
  onconfirm={handleDelete}
  oncancel={() => (showDeleteModal = false)}
>
  <p>Are you sure you want to delete this conversation? This cannot be undone.</p>
</Modal>

<style>
  .detail-container {
    max-width: 600px;
    margin: 30px auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .page-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
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

  .convo-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .field {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .field-label {
    font-weight: 600;
    min-width: 72px;
    color: #374151;
  }

  .badge {
    background: #eff6ff;
    color: #1d4ed8;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 0.85rem;
    border: 1px solid #bfdbfe;
  }

  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;
  }

  .edit-form h2 {
    margin: 0;
    font-size: 1.05rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.9rem;
    color: #374151;
  }

  @media (max-width: 480px) {
    .actions {
      flex-direction: column;
    }
  }
</style>
