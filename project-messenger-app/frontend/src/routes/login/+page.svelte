<script>
// @ts-nocheck
	import { goto } from '$app/navigation';
	import { apiCall } from '$lib/api';
	import Input from '$lib/components/Input.svelte';

	let identifier = '';
	let password = '';
	let error = '';
	let loading = false;

	async function handleLogin(e) {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			const data = await apiCall('/api/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email: identifier, username: identifier, password })
			});

			localStorage.setItem('token', data.token);
			await goto('/conversations');
		} catch (err) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'Login failed';
			}
		} finally {
			loading = false;
		}
	}

	async function handleGoto() {
		await goto('/register')
	}
</script>

<div class="login-container">
	<h1>Login</h1>

	{#if error}
	<p class="error">{error}</p>
	{/if}
	
	<Input type="text" placeholder="Enter Email or Username" bind:value={identifier} required />
	<form onsubmit={handleLogin}>
		<input type="text" placeholder="Enter Email or Username" bind:value={identifier} required />
		<input type="password" placeholder="Password" bind:value={password} required />
		<button type="submit" disabled={loading}>
			{loading ? 'Logging in...' : 'Login'}
		</button>
	</form>

	<button type="button" onclick={handleGoto}>Register</button>
</div>

<style>
	.login-container {
		max-width: 400px;
		margin: 50px auto;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	input,
	button {
		padding: 10px;
	}

	.error {
		color: red;
	}
</style>
