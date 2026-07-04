<script lang="ts">
  export let data;
  export let form;

  const categoryLabels: Record<string, string> = {
    cafe: "Café",
    pub: "Pub",
    farm_shop: "Farm shop",
    campsite: "Campsite",
    outdoor_shop: "Outdoor shop",
    attraction: "Attraction",
    other: "Place",
  };

  const statusNotes: Record<string, string> = {
    draft: "Draft — not yet visible to walkers",
    pending_review: "Awaiting review",
    approved: "Live on Waypoint",
    suspended: "Suspended",
    archived: "Archived",
    active: "Live",
    paused: "Paused — not accepting check-ins",
  };
</script>

<svelte:head><title>Waypoint Business</title></svelte:head>

<header class="top">
  <p class="label">Waypoint Business</p>
  <form method="POST" action="?/signout">
    <button class="signout" type="submit">Sign out</button>
  </form>
</header>

{#if form?.invitationError}
  <div class="card"><p class="muted">{form.invitationError}</p></div>
{/if}

{#if data.loadError}
  <h1>Something went wrong.</h1>
  <p class="muted">{data.loadError}</p>
{:else if data.memberships.length === 0}
  <h1>No business yet.</h1>
  <div class="card">
    <p>
      Your account ({data.email}) isn't linked to a business. If your place
      should be on Waypoint, this is where it will appear.
    </p>
  </div>
{:else}
  {#each data.memberships as membership}
    {#if membership.businesses}
      <h1>{membership.businesses.name}</h1>
      <p class="muted">
        {categoryLabels[membership.businesses.category] ?? "Place"}
        · {statusNotes[membership.businesses.status] ??
          membership.businesses.status}
        · you are {membership.role === "owner" ? "the owner" : membership.role}
      </p>

      {#each membership.businesses.business_locations as location}
        <div class="card">
          <p class="label">Location</p>
          <h2>{location.name ?? membership.businesses.name}</h2>
          <p class="muted">
            {statusNotes[location.status] ?? location.status}
          </p>

          {#each location.qr_codes as code}
            <div class="token" class:retired={code.status !== "active"}>
              <p class="label">
                {code.status === "active"
                  ? "Visit invitation"
                  : `Invitation — ${code.status}`}
              </p>
              <code>{code.code_value}</code>
              {#if code.status === "active"}
                <p class="muted small">
                  This is the code walkers scan or type.
                </p>
                <a class="button" href={`/poster/${location.id}`}>
                  Print poster
                </a>
              {/if}
            </div>
          {:else}
            <p class="muted">No invitation yet for this location.</p>
            <form method="POST" action="?/createInvitation">
              <input type="hidden" name="locationId" value={location.id} />
              <button class="button" type="submit">Create invitation</button>
            </form>
          {/each}
        </div>
      {:else}
        <div class="card">
          <p class="muted">No locations yet.</p>
        </div>
      {/each}
    {/if}
  {/each}
{/if}

{#if !data.loadError && data.memberships.length > 0}
  <h1 class="section">Recent visits</h1>
  <div class="card">
    <p class="muted small">
      Waypoint shows you footfall, not people. Visits are listed without
      walker identity.
    </p>
    {#each data.footfall as visit}
      <p>
        <strong>{visit.business_location_name}</strong>
        <span class="muted">
          · {new Date(visit.checked_in_at).toLocaleString("en-GB")}
          · {visit.check_in_method === "qr" ? "scanned" : visit.check_in_method}
          {visit.invitation_code ? `· ${visit.invitation_code}` : ""}
        </span>
      </p>
    {:else}
      <p class="muted">
        No visits yet. Once your poster is up, they'll appear here.
      </p>
    {/each}
  </div>
{/if}

<style>
  .section {
    font-size: 1.3rem;
    margin-top: 2.5rem;
  }
  .card p {
    margin: 0.4rem 0;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .signout {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font: inherit;
    text-decoration: underline;
    padding: 0;
  }
  h2 {
    margin: 0.25rem 0;
  }
  .token {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 12px;
    background: var(--primary-soft);
  }
  .token.retired {
    background: var(--background);
    opacity: 0.7;
  }
  .token code {
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: 0.04em;
  }
  .small {
    font-size: 0.85rem;
    margin-bottom: 0;
  }
</style>
