<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { apiCall } from '$lib/api';
  import Input from '$lib/components/Input.svelte';

	let username = $state('');
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let gender = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleRegister(event) {
		event.preventDefault();
		loading = true;
		error = '';

		try {
			const data = await apiCall('/api/auth/register', {
				method: 'POST',
				body: JSON.stringify({ username, name, email, password, gender, role: 'USER' })
			});

			localStorage.setItem('token', data.token);
			await goto('/conversations');
		} catch (err) {
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'Registration failed';
			}
		} finally {
			loading = false;
		}
	}

	async function handleGoto() {
		await goto('/login');
	}
</script>

<div class="register-container">
	<h1>Register</h1>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	<form onsubmit={handleRegister}>
		<Input type="text" placeholder="Username" bind:value={username} required />
		<Input type="text" placeholder="Full Name" bind:value={name} required />
		<Input type="email" placeholder="Email" bind:value={email} required />
		<Input type="password" placeholder="Password" bind:value={password} required />
		<Input
			type="select"
			placeholder="Select Gender"
			bind:value={gender}
			required
			options={[
				{ value: 'MALE', label: 'Male' },
				{ value: 'FEMALE', label: 'Female' },
				{ value: 'UNKNOWN', label: 'Prefer not to say' }
			]}
		/>
		<button type="submit" disabled={loading}>
			{loading ? 'Registering...' : 'Register'}
		</button>
	</form>
	<button type="button" onclick={handleGoto}>Login</button>
</div>

<style>
	.register-container {
		max-width: 400px;
		margin: 50px auto;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	input,
	select,
	button {
		padding: 10px;
	}

	.error {
		color: red;
	}
</style>
