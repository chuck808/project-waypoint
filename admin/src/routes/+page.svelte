<script lang="ts">
  export let data;
  export let form;

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleString();
  }
</script>

<svelte:head><title>Waypoint Admin</title></svelte:head>

<header class="top">
  <p class="label">Waypoint Admin</p>
  <form method="POST" action="?/signout">
    <button class="linkish" type="submit">Sign out</button>
  </form>
</header>

{#if !data.authorised}
  <h1>Not authorised.</h1>
  <div class="card">
    <p>
      {data.email} is signed in but does not hold the admin role. If it
      should, the role is assigned server-side.
    </p>
  </div>
{:else}
  {#if form?.decisionError}
    <div class="card"><p class="muted">{form.decisionError}</p></div>
  {/if}

  <h1>Businesses</h1>
  {#each data.businesses as business}
    <div class="card row">
      <div>
        <strong>{business.name}</strong>
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

  <h1>Trails & regions</h1>
  <div class="card">
    {#each data.trails as trail}
      <p><strong>{trail.name}</strong> <span class="muted">· trail · {trail.status}</span></p>
    {:else}
      <p class="muted">No trails.</p>
    {/each}
    {#each data.regions as region}
      <p><strong>{region.name}</strong> <span class="muted">· region · {region.status}</span></p>
    {:else}
      <p class="muted">No regions.</p>
    {/each}
  </div>

  <h1>Recent check-ins</h1>
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
{/if}

<style>
  .top { display: flex; justify-content: space-between; align-items: baseline; }
  .linkish {
    background: none; border: none; color: var(--text-muted);
    cursor: pointer; font: inherit; text-decoration: underline; padding: 0;
  }
  h1 { font-size: 1.4rem; margin-top: 2.5rem; }
  .row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
  .decisions { display: flex; gap: 0.5rem; }
  .decisions .button { border: none; cursor: pointer; font: inherit; }
  .button.quiet { background: var(--background); color: var(--text); border: 1px solid var(--border); }
  .small { font-size: 0.85rem; }
  .card p { margin: 0.4rem 0; }
</style>
