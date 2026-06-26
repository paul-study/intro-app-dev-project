<script>
  // @ts-nocheck
  let { message, isOwn = false, ondelete = null } = $props();
</script>

<div class="message-wrapper" class:own={isOwn}>
  <div class="bubble">
    <p>{message.content}</p>
    <span class="meta">
      {message.sender?.username ?? 'Unknown'} · {new Date(message.timestamp).toLocaleString()}
    </span>
  </div>
  {#if ondelete}
    <button class="delete-btn" onclick={ondelete} title="Delete message" aria-label="Delete message">✕</button>
  {/if}
</div>

<style>
  .message-wrapper {
    display: flex;
    align-items: flex-end;
    gap: 6px;
  }

  .message-wrapper.own {
    flex-direction: row-reverse;
  }

  .bubble {
    padding: 10px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    max-width: 70%;
  }

  .own .bubble {
    background-color: #e8f0fe;
    border-color: #93c5fd;
  }

  .bubble p {
    margin: 0;
    word-break: break-word;
  }

  .meta {
    display: block;
    font-size: 0.72rem;
    color: #9ca3af;
    margin-top: 4px;
  }

  .delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #d1d5db;
    font-size: 0.8rem;
    padding: 4px 6px;
    border-radius: 4px;
    line-height: 1;
  }

  .delete-btn:hover {
    color: #dc2626;
    background-color: #fee2e2;
  }
</style>
