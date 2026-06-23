<script>
  let { message = 'Loading...' } = $props();
</script>

<div class="loading" role="status" aria-live="polite">
  <div class="spinner"></div>
  <span>{message}</span>
</div>

<style>
  .loading {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #6b7280;
    padding: 20px 0;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
