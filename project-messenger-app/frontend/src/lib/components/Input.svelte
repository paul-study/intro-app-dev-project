<script>
    let {type, placeholder, value, ...restProps} = $props();
</script>

<input type={type} placeholder={placeholder} value={value} {...restProps} />

