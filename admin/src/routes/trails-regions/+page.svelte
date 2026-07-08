<script lang="ts">
  export let data;
</script>

<svelte:head><title>Trails & Regions — Waypoint Admin</title></svelte:head>

<p class="label">Trails & Regions</p>
<h1>Read-only audit.</h1>
<p class="muted small">
  Creation and editing happen elsewhere for now -- this is a review view.
</p>

<h2>Trails</h2>
<div class="card">
  {#each data.trails as trail}
    <p><strong>{trail.name}</strong> <span class="muted">· {trail.status}</span></p>
  {:else}
    <p class="muted">No trails.</p>
  {/each}
</div>

<h2>Regions</h2>
<div class="card">
  {#each data.regions as region}
    <p><strong>{region.name}</strong> <span class="muted">· {region.status}</span></p>
  {:else}
    <p class="muted">No regions.</p>
  {/each}
</div>

<style>
  .card p {
    margin: 0.4rem 0;
  }
</style>
