<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { apiCall } from '$lib/api';
  import { currentUser } from '$lib/auth';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';

  let friendships = $state([]);
  let loading = $state(true);
  let error = $state('');

  let newUserId2 = $state('');
  let sending = $state(false);
  let sendError = $state('');

  async function loadFriendships() {
    loading = true;
    error = '';
    try {
      const token = localStorage.getItem('token');
      const data = await apiCall('/api/friendships', {
        headers: { Authorization: `Bearer ${token}` }
      });
      friendships = data.data;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleSendRequest(e) {
    e.preventDefault();
    sending = true;
    sendError = '';
    try {
      const token = localStorage.getItem('token');
      await apiCall('/api/friendships', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId2: newUserId2 })
      });
      newUserId2 = '';
      await loadFriendships();
    } catch (err) {
      sendError = err.message;
    } finally {
      sending = false;
    }
  }

  async function handleAccept(id) {
    try {
      const token = localStorage.getItem('token');
      await apiCall(`/api/friendships/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'ACCEPTED' })
      });
      await loadFriendships();
    } catch (err) {
      error = err.message;
    }
  }

  async function handleBlock(id) {
    try {
      const token = localStorage.getItem('token');
      await apiCall(`/api/friendships/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'BLOCKED' })
      });
      await loadFriendships();
    } catch (err) {
      error = err.message;
    }
  }

  async function handleDelete(id) {
    try {
      const token = localStorage.getItem('token');
      await apiCall(`/api/friendships/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadFriendships();
    } catch (err) {
      error = err.message;
    }
  }

  function getOtherUserId(f) {
    return f.userId1 === $currentUser?.id ? f.userId2 : f.userId1;
  }

  function isIncoming(f) {
    return f.userId2 === $currentUser?.id && f.status === 'PENDING';
  }

  onMount(loadFriendships);
</script>

<div class="friendships-container">
  <h1>Friends</h1>

  <form onsubmit={handleSendRequest} class="send-form">
    <Input type="text" placeholder="Enter user ID to add" bind:value={newUserId2} required />
    <Button type="submit" disabled={sending}>
      {sending ? 'Sending...' : 'Send Request'}
    </Button>
  </form>
  {#if sendError}
    <p class="error">{sendError}</p>
  {/if}

  {#if error}
    <p class="error">{error}</p>
  {/if}

  {#if loading}
    <p>Loading...</p>
  {:else if friendships.length === 0}
    <p>No friendships yet.</p>
  {:else}
    <ul>
      {#each friendships as f}
        <li>
          <div class="info">
            <span class="user">User: {getOtherUserId(f)}</span>
            <span class="status" class:pending={f.status === 'PENDING'} class:accepted={f.status === 'ACCEPTED'} class:blocked={f.status === 'BLOCKED'}>
              {f.status}
              {#if isIncoming(f)} (incoming){/if}
            </span>
          </div>
          <div class="actions">
            {#if isIncoming(f)}
              <Button onclick={() => handleAccept(f.id)}>Accept</Button>
            {/if}
            {#if f.status !== 'BLOCKED'}
              <Button onclick={() => handleBlock(f.id)}>Block</Button>
            {/if}
            <Button onclick={() => handleDelete(f.id)}>Remove</Button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .friendships-container {
    max-width: 600px;
    margin: 30px auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .send-form {
    display: flex;
    gap: 8px;
    align-items: flex-end;
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
    padding: 10px;
    border: 1px solid #ccc;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .actions {
    display: flex;
    gap: 6px;
  }

  .status {
    font-size: 0.8rem;
  }

  .status.pending { color: orange; }
  .status.accepted { color: green; }
  .status.blocked { color: red; }

  .error {
    color: red;
  }
</style>