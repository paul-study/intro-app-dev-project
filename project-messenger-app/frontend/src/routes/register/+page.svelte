<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { apiCall } from '$lib/api';
	import { currentUser } from '$lib/auth';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import Alert from '$lib/components/Alert.svelte';

	let username = $state('');
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let gender = $state('');
	let error = $state('');
	let loading = $state(false);

	let usernameError = $state('');
	let nameError = $state('');
	let emailError = $state('');
	let passwordError = $state('');
	let genderError = $state('');

	function isValidEmail(val) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
	}

	function validate() {
		usernameError = '';
		nameError = '';
		emailError = '';
		passwordError = '';
		genderError = '';
		let valid = true;

		if (!username.trim()) {
			usernameError = 'Username is required.';
			valid = false;
		} else if (username.trim().length < 3) {
			usernameError = 'Username must be at least 3 characters.';
			valid = false;
		}
		if (!name.trim()) {
			nameError = 'Full name is required.';
			valid = false;
		} else if (name.trim().length < 2) {
			nameError = 'Name must be at least 2 characters.';
			valid = false;
		}
		if (!email.trim()) {
			emailError = 'Email is required.';
			valid = false;
		} else if (!isValidEmail(email)) {
			emailError = 'Enter a valid email address.';
			valid = false;
		}
		if (!password) {
			passwordError = 'Password is required.';
			valid = false;
		} else if (password.length < 8) {
			passwordError = 'Password must be at least 8 characters.';
			valid = false;
		}
		if (!gender) {
			genderError = 'Please select a gender.';
			valid = false;
		}
		return valid;
	}

	async function handleRegister(event) {
		event.preventDefault();
		if (!validate()) return;

		loading = true;
		error = '';

		try {
			const data = await apiCall('/api/auth/register', {
				method: 'POST',
				body: JSON.stringify({ username, name, email, password, gender, role: 'USER' })
			});

			localStorage.setItem('token', data.token);
			const payload = JSON.parse(atob(data.token.split('.')[1]));
			currentUser.set(payload);
			await goto('/dashboard');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Registration failed.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="register-container">
	<h1>Register</h1>

	<Alert type="error" message={error} />

	<form onsubmit={handleRegister} novalidate>
		<div class="field">
			<Input type="text" placeholder="Username" bind:value={username} />
			{#if usernameError}<span class="field-error">{usernameError}</span>{/if}
		</div>
		<div class="field">
			<Input type="text" placeholder="Full Name" bind:value={name} />
			{#if nameError}<span class="field-error">{nameError}</span>{/if}
		</div>
		<div class="field">
			<Input type="email" placeholder="Email" bind:value={email} />
			{#if emailError}<span class="field-error">{emailError}</span>{/if}
		</div>
		<div class="field">
			<Input type="password" placeholder="Password (min 8 chars)" bind:value={password} />
			{#if passwordError}<span class="field-error">{passwordError}</span>{/if}
		</div>
		<div class="field">
			<Input
				type="select"
				placeholder="Select Gender"
				bind:value={gender}
				options={[
					{ value: 'MALE', label: 'Male' },
					{ value: 'FEMALE', label: 'Female' },
					{ value: 'UNKNOWN', label: 'Prefer not to say' }
				]}
			/>
			{#if genderError}<span class="field-error">{genderError}</span>{/if}
		</div>
		<Button type="submit" disabled={loading}>
			{loading ? 'Registering...' : 'Register'}
		</Button>
	</form>

	<p class="switch">Already have an account? <a href="/login">Login</a></p>
</div>

<style>
	.register-container {
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

