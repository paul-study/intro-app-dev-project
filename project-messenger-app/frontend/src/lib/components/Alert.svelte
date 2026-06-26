<script>
  let { type = 'error', message = '' } = $props();
</script>

{#if message}
  <div class="alert alert-{type}" role="alert">
    {message}
  </div>
{/if}

<style>
  .alert {
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 0.9rem;
  }

  .alert-error {
    background-color: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fca5a5;
  }

  .alert-success {
    background-color: #dcfce7;
    color: #15803d;
    border: 1px solid #86efac;
  }

  .alert-info {
    background-color: #dbeafe;
    color: #1d4ed8;
    border: 1px solid #93c5fd;
  }
</style>
