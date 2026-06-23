<script>
  let {
    open = false,
    title = 'Confirm',
    onconfirm = null,
    oncancel = null,
    children
  } = $props();
</script>

{#if open}
  <div
    class="overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div class="modal">
      <h2 id="modal-title">{title}</h2>
      <div class="body">
        {@render children()}
      </div>
      <div class="actions">
        <button class="btn-cancel" onclick={oncancel}>Cancel</button>
        <button class="btn-confirm" onclick={onconfirm}>Confirm</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal {
    background: #fff;
    padding: 24px;
    border-radius: 10px;
    min-width: 300px;
    max-width: 90vw;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  h2 {
    margin: 0;
    font-size: 1.1rem;
  }

  .body {
    color: #4b5563;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .btn-cancel {
    padding: 8px 18px;
    cursor: pointer;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: #fff;
  }

  .btn-cancel:hover {
    background: #f3f4f6;
  }

  .btn-confirm {
    padding: 8px 18px;
    background-color: #dc2626;
    color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 6px;
  }

  .btn-confirm:hover {
    background-color: #b91c1c;
  }
</style>
