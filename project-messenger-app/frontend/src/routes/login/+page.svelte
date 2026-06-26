<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { apiCall } from '$lib/api';
	import { currentUser } from '$lib/auth';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import Alert from '$lib/components/Alert.svelte';

	let identifier = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	let identifierError = $state('');
	let passwordError = $state('');

	function validate() {
		identifierError = '';
		passwordError = '';
		let valid = true;
		if (!identifier.trim()) {
			identifierError = 'Email or username is required.';
			valid = false;
		}
		if (!password) {
			passwordError = 'Password is required.';
			valid = false;
		}
		return valid;
	}

	async function handleLogin(e) {
		e.preventDefault();
		if (!validate()) return;

		loading = true;
		error = '';

		try {
			const data = await apiCall('/api/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email: identifier, username: identifier, password })
			});

			localStorage.setItem('token', data.token);
			const payload = JSON.parse(atob(data.token.split('.')[1]));
			currentUser.set(payload);
			await goto('/dashboard');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Login failed.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="login-container">
	<h1>Login</h1>

	<Alert type="error" message={error} />

	<form onsubmit={handleLogin} novalidate>
		<div class="field">
			<Input type="text" placeholder="Email or Username" bind:value={identifier} />
			{#if identifierError}<span class="field-error">{identifierError}</span>{/if}
		</div>
		<div class="field">
			<Input type="password" placeholder="Password" bind:value={password} />
			{#if passwordError}<span class="field-error">{passwordError}</span>{/if}
		</div>
		<Button type="submit" disabled={loading}>
			{loading ? 'Logging in...' : 'Login'}
		</Button>
	</form>

	<p class="switch">Don't have an account? <a href="/register">Register</a></p>
</div>

<style>
	.login-container {
		max-width: 420px;
		margin: 60px auto;
		padding: 0 20px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.field-error {
		color: #b91c1c;
		font-size: 0.8rem;
	}

	.switch {
		text-align: center;
		font-size: 0.9rem;
		color: #4b5563;
	}

	.switch a {
		color: #2563eb;
		text-decoration: none;
	}

	.switch a:hover {
		text-decoration: underline;
	}
</style>

