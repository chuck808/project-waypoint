<script lang="ts">
  export let data;
  export let form;
</script>

<svelte:head><title>Businesses — Waypoint Admin</title></svelte:head>

<p class="label">Businesses</p>
<h1>Review and approve.</h1>

{#if form?.decisionError}
  <div class="card"><p class="muted">{form.decisionError}</p></div>
{/if}

{#if data.loadError}
  <div class="card"><p class="muted">{data.loadError}</p></div>
{/if}

{#each data.businesses as business}
  <div class="card row">
    <div>
      <a class="name" href={`/businesses/${business.id}`}>{business.name}</a>
      <p class="muted small">{business.category} · {business.status}</p>
    </div>
    <div class="decisions">
      {#if business.status !== "approved"}
        <form method="POST" action="?/decide">
          <input type="hidden" name="businessId" value={business.id} />
          <input type="hidden" name="decision" value="approved" />
          <button class="button" type="submit">Approve</button>
        </form>
      {/if}
      {#if business.status !== "suspended"}
        <form method="POST" action="?/decide">
          <input type="hidden" name="businessId" value={business.id} />
          <input type="hidden" name="decision" value="suspended" />
          <button class="button quiet" type="submit">Suspend</button>
        </form>
      {/if}
    </div>
  </div>
{:else}
  <p class="muted">No businesses yet.</p>
{/each}

<style>
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .name {
    color: var(--text);
    font-weight: 700;
    text-decoration: none;
  }

  .name:hover {
    text-decoration: underline;
  }

  .decisions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }
</style>
