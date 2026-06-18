<script>
  // @ts-nocheck
  let {
    type = 'button',
    disabled = false,
    onclick = null,
    children,
  } = $props();
</script>

<button {type} {disabled} {onclick}>
  {@render children()}
</button>

<style>
  button {
    padding: 10px;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>