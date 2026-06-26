<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { apiCall } from '$lib/api';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';
  import Alert from '$lib/components/Alert.svelte';
  import Loading from '$lib/components/Loading.svelte';

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
      const data = await apiCall('/api/user-settings/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      settings = data.data;
      applySettings(data.data);
    } catch (err) {
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
        const data = await apiCall(`/api/user-settings/${settingsId}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(body)
        });
        applySettings(data.data);
      } else {
        const data = await apiCall('/api/user-settings', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(body)
        });
        settings = data.data;
        applySettings(data.data);
      }
      success = 'Settings saved successfully.';
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

  <Alert type="error" message={error} />
  <Alert type="success" message={success} />

  {#if loading}
    <Loading />
  {:else}
    <form onsubmit={handleSave}>
      <label>
        Status Message
        <Input type="text" placeholder="What's on your mind?" bind:value={statusMessage} />
      </label>

      <label>
        Theme Color
        <Input
          type="select"
          placeholder="Select theme color"
          bind:value={themeColor}
          options={[
            { value: '#0f62fe', label: 'Blue' },
            { value: '#198038', label: 'Green' },
            { value: '#a56eff', label: 'Purple' },
            { value: '#ff832b', label: 'Orange' },
            { value: '#da1e28', label: 'Red' },
          ]}
        />
      </label>

      <label>
        Language
        <Input
          type="select"
          placeholder="Select language"
          bind:value={language}
          options={[
            { value: 'en', label: 'English' },
            { value: 'fr', label: 'French' },
            { value: 'es', label: 'Spanish' },
            { value: 'de', label: 'German' },
            { value: 'ja', label: 'Japanese' },
            { value: 'zh', label: 'Chinese' },
          ]}
        />
      </label>

      <label>
        Time Zone
        <Input
          type="select"
          placeholder="Select time zone"
          bind:value={timeZone}
          options={[
            { value: 'UTC', label: 'UTC' },
            { value: 'Pacific/Auckland', label: 'Pacific/Auckland (NZST)' },
            { value: 'Pacific/Chatham', label: 'Pacific/Chatham (CHAST)' },
            { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST)' },
            { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
            { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST)' },
            { value: 'Europe/London', label: 'Europe/London (GMT)' },
            { value: 'Europe/Paris', label: 'Europe/Paris (CET)' },
            { value: 'America/New_York', label: 'America/New_York (EST)' },
            { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
          ]}
        />
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
    max-width: 520px;
    margin: 30px auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
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
    color: #374151;
  }

  .checkbox-label {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
</style>
