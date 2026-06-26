<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { currentUser } from '$lib/auth';
  import { apiCall } from '$lib/api';
  import Card from '$lib/components/Card.svelte';
  import Alert from '$lib/components/Alert.svelte';
  import Loading from '$lib/components/Loading.svelte';

  let conversationCount = $state(0);
  let friendCount = $state(0);
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    try {
      const token = localStorage.getItem('token');
      const [convosRes, friendsRes] = await Promise.all([
        apiCall('/api/conversations', { headers: { Authorization: `Bearer ${token}` } }),
        apiCall('/api/friendships', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      conversationCount = convosRes.data?.length ?? 0;
      friendCount = friendsRes.data?.length ?? 0;
    } catch (err) {
      error = 'Failed to load dashboard data.';
    } finally {
      loading = false;
    }
  });
</script>

<div class="dashboard">
  <div class="welcome">
    <h1>Welcome{$currentUser ? `, ${$currentUser.username}` : ''}!</h1>
    <p class="subtitle">Here's a summary of your messenger activity.</p>
  </div>

  <Alert type="error" message={error} />

  {#if loading}
    <Loading />
  {:else}
    <div class="stats">
      <Card>
        <div class="stat">
          <span class="count">{conversationCount}</span>
          <span class="label">Conversations</span>
          <a href="/conversations">View all →</a>
        </div>
      </Card>
      <Card>
        <div class="stat">
          <span class="count">{friendCount}</span>
          <span class="label">Friends</span>
          <a href="/friendships">View all →</a>
        </div>
      </Card>
    </div>

    <div class="quick-links">
      <h2>Quick Actions</h2>
      <div class="link-grid">
        <a href="/conversations" class="link-card">💬 Conversations</a>
        <a href="/friendships" class="link-card">👥 Friends</a>
        <a href="/usersettings" class="link-card">⚙️ Settings</a>
      </div>
    </div>
  {/if}
</div>

<style>
  .dashboard {
    max-width: 700px;
    margin: 30px auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .welcome h1 {
    margin: 0 0 4px;
  }

  .subtitle {
    color: #6b7280;
    margin: 0;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-align: center;
  }

  .count {
    font-size: 2.5rem;
    font-weight: bold;
    color: #2563eb;
    line-height: 1;
  }

  .label {
    font-size: 0.95rem;
    color: #4b5563;
  }

  .stat a {
    font-size: 0.85rem;
    color: #2563eb;
    text-decoration: none;
    margin-top: 4px;
  }

  .quick-links h2 {
    margin: 0 0 12px;
    font-size: 1.05rem;
    color: #374151;
  }

  .link-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
  }

  .link-card {
    display: block;
    padding: 14px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    text-align: center;
    text-decoration: none;
    color: #1d4ed8;
    background: #f9fafb;
    font-size: 0.95rem;
    transition: background 0.15s, border-color 0.15s;
  }

  .link-card:hover {
    background: #eff6ff;
    border-color: #93c5fd;
  }

  @media (max-width: 480px) {
    .stats, .link-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
