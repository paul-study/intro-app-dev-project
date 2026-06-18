<script>
	let { text, type, onclick, value } = $props();
</script>

<button {type} {onclick} class="btn" {value}>{text}</button>

<style>
	.btn {
		padding: 10px;
	}

	.btn:hover {
		background-color: #0056b3;
	}
</style>
