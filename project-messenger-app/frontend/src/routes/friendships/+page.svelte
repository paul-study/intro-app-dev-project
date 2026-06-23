<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { apiCall } from '$lib/api';
  import { currentUser } from '$lib/auth';
  import Button from '$lib/components/Button.svelte';
  import Alert from '$lib/components/Alert.svelte';
  import Loading from '$lib/components/Loading.svelte';
  import Card from '$lib/components/Card.svelte';
  import Modal from '$lib/components/Modal.svelte';

  let friendships = $state([]);
  let users = $state([]);
  let loading = $state(true);
  let error = $state('');
  let success = $state('');

  let sending = $state(''); // holds userId being sent to
  let deleteTargetId = $state(null);

  async function loadData() {
    loading = true;
    error = '';
    try {
      const token = localStorage.getItem('token');
      const [friendRes, userRes] = await Promise.all([
        apiCall('/api/friendships', { headers: { Authorization: `Bearer ${token}` } }),
        apiCall('/api/users?limit=100', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      friendships = friendRes.data;
      users = userRes.data.filter((u) => u.id !== $currentUser?.id);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleSendRequest(userId) {
    sending = userId;
    success = '';
    error = '';
    try {
      const token = localStorage.getItem('token');
      await apiCall('/api/friendships', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId2: userId })
      });
      success = 'Friend request sent.';
      await loadData();
    } catch (err) {
      error = err.message;
    } finally {
      sending = '';
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
      success = 'Friend request accepted.';
      await loadData();
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
      success = 'User blocked.';
      await loadData();
    } catch (err) {
      error = err.message;
    }
  }

  async function handleDelete() {
    if (!deleteTargetId) return;
    try {
      const token = localStorage.getItem('token');
      await apiCall(`/api/friendships/${deleteTargetId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      deleteTargetId = null;
      success = 'Friend removed.';
      await loadData();
    } catch (err) {
      error = err.message;
      deleteTargetId = null;
    }
  }

  function getFriendship(userId) {
    return friendships.find(
      (f) => f.userId1 === userId || f.userId2 === userId
    );
  }

  function isIncoming(f) {
    return f.userId2 === $currentUser?.id && f.status === 'PENDING';
  }

  onMount(loadData);
</script>

<div class="friendships-container">
  <h1>Friends</h1>

  <Alert type="error" message={error} />
  <Alert type="success" message={success} />

  {#if loading}
    <Loading />
  {:else}
    <h2>All Users</h2>
    {#if users.length === 0}
      <p class="empty">No other users found.</p>
    {:else}
      <ul>
        {#each users as user}
          {@const friendship = getFriendship(user.id)}
          <li>
            <Card>
              <div class="user-row">
                <div class="user-info">
                  <span class="username">{user.username}</span>
                  <span class="name">{user.name}</span>
                </div>
                <div class="actions">
                  {#if !friendship}
                    <Button
                      onclick={() => handleSendRequest(user.id)}
                      disabled={sending === user.id}
                    >
                      {sending === user.id ? 'Sending...' : 'Send Request'}
                    </Button>
                  {:else if friendship.status === 'PENDING' && isIncoming(friendship)}
                    <Button onclick={() => handleAccept(friendship.id)}>Accept</Button>
                    <span class="status-badge pending">Pending (incoming)</span>
                  {:else if friendship.status === 'PENDING'}
                    <span class="status-badge pending">Request Sent</span>
                  {:else if friendship.status === 'ACCEPTED'}
                    <span class="status-badge accepted">Friends</span>
                    <Button onclick={() => { deleteTargetId = friendship.id; success = ''; }}>Remove</Button>
                  {:else if friendship.status === 'BLOCKED'}
                    <span class="status-badge blocked">Blocked</span>
                  {/if}
                  {#if friendship && friendship.status !== 'BLOCKED'}
                    <Button onclick={() => handleBlock(friendship.id)}>Block</Button>
                  {/if}
                </div>
              </div>
            </Card>
          </li>
        {/each}
      </ul>
    {/if}
  {/if}
</div>

<Modal
  open={deleteTargetId !== null}
  title="Remove Friend"
  onconfirm={handleDelete}
  oncancel={() => (deleteTargetId = null)}
>
  <p>Are you sure you want to remove this friend?</p>
</Modal>

<style>
  .friendships-container {
    max-width: 640px;
    margin: 30px auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  h2 {
    margin: 0;
    font-size: 1.05rem;
    color: #374151;
  }

  ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .user-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .username {
    font-weight: 600;
    color: #111827;
  }

  .name {
    font-size: 0.85rem;
    color: #6b7280;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .status-badge {
    font-size: 0.78rem;
    padding: 2px 10px;
    border-radius: 10px;
    border: 1px solid currentColor;
  }

  .status-badge.pending {
    color: #d97706;
    background: #fef3c7;
    border-color: #fcd34d;
  }

  .status-badge.accepted {
    color: #15803d;
    background: #dcfce7;
    border-color: #86efac;
  }

  .status-badge.blocked {
    color: #b91c1c;
    background: #fee2e2;
    border-color: #fca5a5;
  }

  .empty {
    color: #6b7280;
    text-align: center;
    padding: 20px 0;
  }
</style>