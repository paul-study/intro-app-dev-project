<script>
  import { page } from '$app/stores';
</script>

<div class="error-page">
  <h1>{$page.status}</h1>
  <p class="msg">{$page.error?.message ?? 'Something went wrong.'}</p>
  {#if $page.status === 404}
    <p class="hint">The page you are looking for does not exist.</p>
  {/if}
  <a href="/">Go Home</a>
</div>

<style>
  .error-page {
    max-width: 420px;
    margin: 100px auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    padding: 0 20px;
  }

  h1 {
    font-size: 5rem;
    margin: 0;
    color: #374151;
    line-height: 1;
  }

  .msg {
    font-size: 1.15rem;
    color: #111827;
    margin: 0;
  }

  .hint {
    color: #6b7280;
    margin: 0;
  }

  a {
    margin-top: 8px;
    padding: 10px 28px;
    background-color: #3b82f6;
    color: #fff;
    text-decoration: none;
    border-radius: 6px;
    font-size: 0.95rem;
  }

  a:hover {
    background-color: #2563eb;
  }
</style>
