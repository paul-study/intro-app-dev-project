<script>
// @ts-nocheck
  import { goto } from '$app/navigation';
  import { apiCall } from '$lib/api';

  let username = '';
  let name = '';
  let email = '';
  let password = '';
  let gender = '';
  let error = '';
  let loading = false;

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
</script>

<div class="register-container">
  <h1>Register</h1>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <form onsubmit={handleRegister}>
    <input type="text" placeholder="Username" bind:value={username} required />
    <input type="text" placeholder="Full Name" bind:value={name} required />
    <input type="email" placeholder="Email" bind:value={email} required />
    <input type="password" placeholder="Password" bind:value={password} required />
    <select bind:value={gender} required>
      <option value="" disabled selected>Select Gender</option>
      <option value="MALE">Male</option>
      <option value="FEMALE">Female</option>
      <option value="UNKNOWN">Prefer not to say</option>
    </select>
    <button type="submit" disabled={loading}>
      {loading ? 'Registering...' : 'Register'}
    </button>
  </form>
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

  input, select, button {
    padding: 10px;
  }

  .error {
    color: red;
  }
</style>