<script>
  // @ts-nocheck
  let {
    type = 'text',
    placeholder = '',
    value = $bindable(''),
    required = false,
    disabled = false,
    options = null,
  } = $props();
</script>

{#if type === 'select'}
  <select bind:value {required} {disabled}>
    <option value="" disabled selected>{placeholder || 'Select an option'}</option>
    {#each options as opt}
      <option value={opt.value}>{opt.label}</option>
    {/each}
  </select>
{:else}
  <input {type} {placeholder} bind:value {required} {disabled} />
{/if}

<style>
  input,
  select {
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
  }
</style>