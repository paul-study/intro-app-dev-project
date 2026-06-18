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
    if (!token && !publicRoutes.includes($page.url.pathname)) {
      goto('/login');
    }
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUser.set(payload);
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