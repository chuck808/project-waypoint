<script lang="ts">
  export let data;

  const statusOrder = ["draft", "pending_review", "approved", "suspended", "archived"];
  const statusLabels: Record<string, string> = {
    draft: "Draft",
    pending_review: "Awaiting review",
    approved: "Approved",
    suspended: "Suspended",
    archived: "Archived",
  };
</script>

<svelte:head><title>Overview — Waypoint Admin</title></svelte:head>

<p class="label">Overview</p>
<h1>Platform at a glance.</h1>

{#if data.kpis}
  <div class="grid">
    {#each statusOrder as status}
      {#if data.kpis.businessesByStatus[status]}
        <div class="tile">
          <strong>{data.kpis.businessesByStatus[status]}</strong>
          <span class="muted small">{statusLabels[status]} businesses</span>
        </div>
      {/if}
    {/each}

    <div class="tile">
      <strong>{data.kpis.activeLocations}</strong>
      <span class="muted small">active locations</span>
    </div>

    <div class="tile">
      <strong>{data.kpis.checkInsLast7Days}</strong>
      <span class="muted small">check-ins, last 7 days</span>
    </div>

    <div class="tile" class:attention={data.kpis.fieldNotesUnresolved > 0}>
      <strong>{data.kpis.fieldNotesUnresolved}</strong>
      <span class="muted small">field notes unresolved</span>
    </div>

    <div class="tile">
      <strong>{data.kpis.fieldNotesPublic}</strong>
      <span class="muted small">field notes live to walkers</span>
    </div>

    <div class="tile">
      <strong>{data.kpis.publishedTrails}</strong>
      <span class="muted small">published trails</span>
    </div>

    <div class="tile">
      <strong>{data.kpis.activeRegions}</strong>
      <span class="muted small">published regions</span>
    </div>
  </div>

  {#if data.kpis.fieldNotesUnresolved > 0}
    <div class="card">
      <p>
        <a href="/field-notes">{data.kpis.fieldNotesUnresolved} Field Note{data.kpis.fieldNotesUnresolved === 1 ? "" : "s"} waiting for review →</a>
      </p>
    </div>
  {/if}
{/if}

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .tile {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-card);
    padding: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .tile.attention {
    border-color: var(--primary);
    background: var(--primary-soft);
  }

  .tile strong {
    font-size: 1.7rem;
  }

  a {
    color: var(--primary);
    font-weight: 600;
  }
</style>
