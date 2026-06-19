<script>
// @ts-nocheck
  import { currentUser } from '$lib/auth';
  import { goto } from '$app/navigation';

  function logout() {
    localStorage.removeItem('token');
    currentUser.set(null);
    goto('/login');
  }
</script>

<nav>
  <div class="nav-links">
    <a href="/conversations">Conversations</a>
    <a href="/friendships">Friends</a>
    <a href="/usersettings">Settings</a>
  </div>
  <div class="nav-user">
    {#if $currentUser}
      <span>Welcome, {$currentUser.username}</span>
      <button onclick={logout}>Logout</button>
    {/if}
  </div>
</nav>

<style>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
  }

  .nav-links {
    display: flex;
    gap: 16px;
  }

  .nav-user {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  button {
    padding: 6px 12px;
    cursor: pointer;
  }
</style>