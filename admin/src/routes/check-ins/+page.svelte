<script lang="ts">
  export let data;

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleString();
  }
</script>

<svelte:head><title>Check-ins — Waypoint Admin</title></svelte:head>

<p class="label">Check-ins</p>
<h1>Recent activity.</h1>

{#if data.loadError}
  <div class="card"><p class="muted">{data.loadError}</p></div>
{/if}

<div class="card">
  <p class="muted small">
    Read-only audit. Walker identity is not shown here; investigate
    specific accounts through the database with cause.
  </p>
  {#each data.checkIns as checkIn}
    <p>
      <strong>{checkIn.business_locations?.name ?? "Unknown place"}</strong>
      <span class="muted">
        · {formatTime(checkIn.checked_in_at)} · {checkIn.verification_status}
      </span>
    </p>
  {:else}
    <p class="muted">No check-ins yet.</p>
  {/each}
</div>

<style>
  .card p {
    margin: 0.4rem 0;
  }
</style>
