<script>
  let { children } = $props();
</script>

<div class="card">
  {@render children()}
</div>

<style>
  .card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }
</style>
