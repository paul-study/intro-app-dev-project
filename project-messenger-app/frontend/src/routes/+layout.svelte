<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import favicon from '$lib/assets/favicon.svg';
  import { Styles } from '@sveltestrap/sveltestrap';
  import { onMount } from 'svelte';
  import { currentUser } from '$lib/auth';
  import Navbar from '$lib/components/Navbar.svelte';

  let { children } = $props();

  const publicRoutes = ['/', '/login', '/register'];

  onMount(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (!publicRoutes.includes($page.url.pathname)) {
        goto('/login');
      }
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        currentUser.set(null);
        goto('/login');
        return;
      }
      currentUser.set(payload);
    } catch {
      localStorage.removeItem('token');
      currentUser.set(null);
      goto('/login');
    }
  });
</script>

<Styles />
<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{#if !publicRoutes.includes($page.url.pathname)}
  <Navbar />
{/if}

{@render children()}