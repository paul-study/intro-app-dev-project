<script>
  import { goto } from '$app/navigation';
  import { apiCall } from '$lib/api';
  
  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleLogin() {
    loading = true;
    error = '';
    
    try {
      const data = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
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
</script>

<div class="login-container">
  <h1>Login</h1>
  
  {#if error}
    <p class="error">{error}</p>
  {/if}
  
  <form on:submit|preventDefault={handleLogin}>
    <input 
  type="email" 
  placeholder="Email" 
  bind:value={email}
  required
/>
    <input 
      type="password" 
      placeholder="Password" 
      bind:value={password}
      required
    />
    <button type="submit" disabled={loading}>
      {loading ? 'Logging in...' : 'Login'}
    </button>
  </form>
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
  
  input, button {
    padding: 10px;
  }
  
  .error {
    color: red;
  }
</style>