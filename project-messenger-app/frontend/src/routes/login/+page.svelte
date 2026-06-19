<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { apiCall } from '$lib/api';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';

	let identifier = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

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
		await goto('/register');
	}
</script>

<div class="login-container">
	<h1>Login</h1>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	<form onsubmit={handleLogin}>
		<Input type="text" placeholder="Enter Email or Username" bind:value={identifier} required />
		<Input type="password" placeholder="Password" bind:value={password} required />
		<Button type="submit" disabled={loading}>
			{loading ? 'Logging in...' : 'Login'}
		</Button>
	</form>

	<Button type="button" onclick={handleGoto}>Register</Button>
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
