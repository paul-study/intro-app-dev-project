<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { apiCall } from '$lib/api';
  import { currentUser } from '$lib/auth';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';

  let settings = $state(null);
  let settingsId = $state('');
  let loading = $state(true);
  let saving = $state(false);
  let error = $state('');
  let success = $state('');

  let themeColor = $state('');
  let timeZone = $state('');
  let language = $state('');
  let notificationsEnabled = $state(true);
  let statusMessage = $state('');

  function applySettings(data) {
    settingsId = data.id;
    themeColor = data.themeColor ?? '';
    timeZone = data.timeZone ?? '';
    language = data.language ?? '';
    notificationsEnabled = data.notificationsEnabled ?? true;
    statusMessage = data.statusMessage ?? '';
  }

  async function loadSettings() {
    loading = true;
    error = '';
    try {
      const token = localStorage.getItem('token');
      const data = await apiCall('/api/usersettings/me', {
      headers: { Authorization: `Bearer ${token}` }
      });
      settings = data.data;
      applySettings(data.data);
    } catch (err) {
      // 404 means no settings created yet — that's fine
      if (!err.message.includes('404') && !err.message.includes('Not found')) {
        error = err.message;
      }
    } finally {
      loading = false;
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    saving = true;
    error = '';
    success = '';
    const token = localStorage.getItem('token');
    const body = { themeColor, timeZone, language, notificationsEnabled, statusMessage };

    try {
      if (settings) {
        const data = await apiCall(`/api/usersettings/${settingsId}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(body)
        });
        applySettings(data.data);
      } else {
        const data = await apiCall('/api/usersettings', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(body)
        });
        settings = data.data;
        applySettings(data.data);
      }
      success = 'Settings saved';
    } catch (err) {
      error = err.message;
    } finally {
      saving = false;
    }
  }

  onMount(loadSettings);
</script>

<div class="settings-container">
  <h1>User Settings</h1>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  {#if success}
    <p class="success">{success}</p>
  {/if}

  {#if loading}
    <p>Loading...</p>
  {:else}
    <form onsubmit={handleSave}>
      <label>
        Status Message
        <Input type="text" placeholder="What's on your mind?" bind:value={statusMessage} />
      </label>

      <label>
        Theme Color
        <Input type="text" placeholder="e.g. dark, light" bind:value={themeColor} />
      </label>

      <label>
        Language
        <Input type="text" placeholder="e.g. en, fr" bind:value={language} />
      </label>

      <label>
        Time Zone
        <Input type="text" placeholder="e.g. Pacific/Auckland" bind:value={timeZone} />
      </label>

      <label class="checkbox-label">
        <input type="checkbox" bind:checked={notificationsEnabled} />
        Enable Notifications
      </label>

      <Button type="submit" disabled={saving}>
        {saving ? 'Saving...' : settings ? 'Update Settings' : 'Create Settings'}
      </Button>
    </form>
  {/if}
</div>

<style>
  .settings-container {
    max-width: 500px;
    margin: 30px auto;
    padding: 0 20px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.9rem;
  }

  .checkbox-label {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .error {
    color: red;
  }

  .success {
    color: green;
  }
</style>