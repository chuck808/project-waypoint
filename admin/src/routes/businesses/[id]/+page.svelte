<script lang="ts">
  import {
    facilityKeys,
    facilityLabels,
    walkerCharacteristicKeys,
    walkerCharacteristicLabels,
  } from "@waypoint/ui";

  export let data;
  export let form;

  // walker_characteristics/facilities are jsonb columns, typed as the
  // broad Supabase Json union; narrow defensively rather than assume
  // the stored shape (same pattern as the Business Portal).
  function asRecord(value: unknown): Record<string, unknown> {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    return {};
  }

  function enabledLabels(
    value: unknown,
    keys: readonly string[],
    labels: Record<string, string>,
  ): string[] {
    const record = asRecord(value);
    return keys.filter((key) => record[key] === true).map((key) => labels[key]);
  }

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleString();
  }
</script>

<svelte:head><title>{data.business?.name ?? "Business"} — Waypoint Admin</title></svelte:head>

<p class="label"><a class="back" href="/businesses">← Businesses</a></p>

{#if data.business}
  <h1>{data.business.name}</h1>
  <p class="muted">{data.business.category} · {data.business.status}</p>

  {#if form?.decisionError}
    <div class="card"><p class="muted">{form.decisionError}</p></div>
  {/if}

  <div class="card row">
    <p class="muted small">
      {data.business.description ?? "No description."}
    </p>
    <div class="decisions">
      {#if data.business.status !== "approved"}
        <form method="POST" action="?/decide">
          <input type="hidden" name="decision" value="approved" />
          <button class="button" type="submit">Approve</button>
        </form>
      {/if}
      {#if data.business.status !== "suspended"}
        <form method="POST" action="?/decide">
          <input type="hidden" name="decision" value="suspended" />
          <button class="button quiet" type="submit">Suspend</button>
        </form>
      {/if}
    </div>
  </div>

  <h2>Locations</h2>
  {#each data.locations as location}
    <div class="card">
      <strong>{location.name ?? "Unnamed location"}</strong>
      <p class="muted small">{location.address ?? "No address"} · {location.status}</p>

      {#if location.welcome_message}
        <p class="notice welcome">"{location.welcome_message}"</p>
      {/if}
      {#if location.steward_notice}
        <p class="notice official">Official: {location.steward_notice}</p>
      {/if}
      {#if location.seasonal_information}
        <p class="notice">{location.seasonal_information}</p>
      {/if}
      {#if location.walking_context}
        <p class="muted small">{location.walking_context}</p>
      {/if}
      {#if location.place_story}
        <p class="muted small">{location.place_story}</p>
      {/if}
      {#if location.accessibility_notes}
        <p class="muted small">Accessibility: {location.accessibility_notes}</p>
      {/if}

      {#if location.best_seasons?.length}
        <p class="muted small">Best seasons: {location.best_seasons.join(", ")}</p>
      {/if}

      <div class="chips">
        {#each enabledLabels(location.walker_characteristics, walkerCharacteristicKeys, walkerCharacteristicLabels) as label}
          <span class="chip">{label}</span>
        {/each}
        {#each enabledLabels(location.facilities, facilityKeys, facilityLabels) as label}
          <span class="chip quiet">{label}</span>
        {/each}
      </div>

      {#if !enabledLabels(location.walker_characteristics, walkerCharacteristicKeys, walkerCharacteristicLabels).length && !enabledLabels(location.facilities, facilityKeys, facilityLabels).length}
        <p class="muted small">No walker characteristics or facilities confirmed yet.</p>
      {/if}
    </div>
  {:else}
    <p class="muted">No locations yet.</p>
  {/each}

  <h2>Members</h2>
  <div class="card">
    <p class="muted small">
      No profile/email access from Admin -- user IDs are shown raw.
    </p>
    {#each data.memberships as membership}
      <p>
        <code>{membership.user_id.slice(0, 8)}…</code>
        <span class="muted"> · {membership.role} · {membership.status} · since {formatTime(membership.created_at)}</span>
      </p>
    {:else}
      <p class="muted">No members yet.</p>
    {/each}
  </div>
{:else}
  <h1>Business not found.</h1>
{/if}

<style>
  .back {
    color: var(--text-muted);
    text-decoration: none;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .decisions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .notice {
    padding: 0.6rem 0.8rem;
    border-radius: 12px;
    background: var(--primary-soft);
    margin: 0.5rem 0;
  }

  .notice.welcome {
    font-style: italic;
  }

  .notice.official {
    background: var(--background);
    border: 1px solid var(--border);
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.6rem;
  }

  .chip {
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0.3rem 0.7rem;
    font-size: 0.8rem;
    background: var(--primary-soft);
    color: var(--primary);
  }

  .chip.quiet {
    background: var(--background);
    color: var(--text);
  }

  code {
    font-family: ui-monospace, monospace;
  }
</style>
