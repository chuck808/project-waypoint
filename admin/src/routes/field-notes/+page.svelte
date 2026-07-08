<script lang="ts">
  export let data;
  export let form;

  let categoryFilter = "all";
  let severityFilter = "all";
  let sourceFilter = "all";
  let showResolved = false;

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleString();
  }

  // Deliberately not a hand-maintained label map -- this is already the
  // third place category names would need mirroring (mobile's
  // metadata.ts, the now-deleted packages/ui copy that drifted, and
  // this). A plain prettify avoids adding a fourth source of drift; the
  // walker-facing polished labels live where walkers actually see them.
  function prettify(value: string): string {
    return value.replace(/_/g, " ");
  }

  $: categories = Array.from(new Set(data.fieldNotes.map((n) => n.category))).sort();
  $: severities = Array.from(new Set(data.fieldNotes.map((n) => n.severity))).sort();
  $: sources = Array.from(new Set(data.fieldNotes.map((n) => n.source))).sort();

  $: filtered = data.fieldNotes.filter((note) => {
    if (categoryFilter !== "all" && note.category !== categoryFilter) return false;
    if (severityFilter !== "all" && note.severity !== severityFilter) return false;
    if (sourceFilter !== "all" && note.source !== sourceFilter) return false;
    if (!showResolved && note.resolved_at) return false;
    return true;
  });
</script>

<svelte:head><title>Field Notes — Waypoint Admin</title></svelte:head>

<p class="label">Field Notes</p>
<h1>Moderation queue.</h1>

{#if form?.resolveError}
  <div class="card"><p class="muted">{form.resolveError}</p></div>
{/if}

{#if data.loadError}
  <div class="card"><p class="muted">{data.loadError}</p></div>
{/if}

<div class="filters">
  <select bind:value={categoryFilter}>
    <option value="all">All categories</option>
    {#each categories as category}
      <option value={category}>{prettify(category)}</option>
    {/each}
  </select>

  <select bind:value={severityFilter}>
    <option value="all">All severities</option>
    {#each severities as severity}
      <option value={severity}>{prettify(severity)}</option>
    {/each}
  </select>

  <select bind:value={sourceFilter}>
    <option value="all">All sources</option>
    {#each sources as source}
      <option value={source}>{prettify(source)}</option>
    {/each}
  </select>

  <label class="check">
    <input type="checkbox" bind:checked={showResolved} />
    Show resolved
  </label>
</div>

{#each filtered as note}
  <div class="card row" class:resolved={note.resolved_at}>
    <div>
      <strong>{prettify(note.category)}</strong>
      <span class="muted small">
        · {prettify(note.severity)} · {prettify(note.source)} ·
        {note.business_locations?.name ?? note.trails?.name ?? "Unattributed"}
        · {formatTime(note.observed_at)}
      </span>
      {#if note.message}
        <p>{note.message}</p>
      {/if}
      {#if note.visibility !== "public"}
        <p class="muted small">visibility: {note.visibility}</p>
      {/if}
      {#if note.resolved_at}
        <p class="muted small">Resolved {formatTime(note.resolved_at)}</p>
      {/if}
    </div>
    {#if !note.resolved_at}
      <form method="POST" action="?/resolve">
        <input type="hidden" name="fieldNoteId" value={note.id} />
        <button class="button quiet" type="submit">Resolve</button>
      </form>
    {/if}
  </div>
{:else}
  <p class="muted">Nothing matches these filters.</p>
{/each}

<style>
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    margin: 1.25rem 0;
  }

  select {
    padding: 0.5rem 0.7rem;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    font: inherit;
  }

  .check {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .row p {
    margin: 0.4rem 0 0;
  }

  .resolved {
    opacity: 0.6;
  }
</style>
