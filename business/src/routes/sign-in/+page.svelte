<script lang="ts">
  export let form;
</script>

<svelte:head><title>Sign in — Waypoint Business</title></svelte:head>

<p class="label">Waypoint Business</p>
<h1>Sign in</h1>
<p class="muted">Manage your places, invitations and Waypoint presence.</p>

<form method="POST" class="card">
  <label>
    <span class="label">Email</span>
    <input name="email" type="email" value={form?.email ?? ""} required />
  </label>

  <label>
    <span class="label">Password</span>
    <input name="password" type="password" required />
  </label>

  {#if form?.message}
    <p class="muted">{form.message}</p>
  {/if}

  <button class="button" type="submit">Sign in</button>
</form>

<style>
  label {
    display: block;
    margin-bottom: 1rem;
  }
  input {
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin-top: 0.35rem;
    padding: 0.65rem 0.8rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--background);
    font: inherit;
    color: var(--text);
  }
  button {
    border: none;
    cursor: pointer;
    font: inherit;
  }
</style>
