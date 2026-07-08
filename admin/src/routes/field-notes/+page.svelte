<script lang="ts">
  import {
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableBodyRow,
    TableBodyCell,
    Badge,
    Button,
    Select,
    Checkbox,
    Card,
  } from "flowbite-svelte";

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

  function severityColor(severity: string): "red" | "yellow" | "gray" {
    if (severity === "hazard") return "red";
    if (severity === "watch") return "yellow";
    return "gray";
  }

  $: categories = Array.from(new Set(data.fieldNotes.map((n) => n.category))).sort();
  $: severities = Array.from(new Set(data.fieldNotes.map((n) => n.severity))).sort();
  $: sources = Array.from(new Set(data.fieldNotes.map((n) => n.source))).sort();

  $: categoryItems = [
    { value: "all", name: "All categories" },
    ...categories.map((c) => ({ value: c, name: prettify(c) })),
  ];
  $: severityItems = [
    { value: "all", name: "All severities" },
    ...severities.map((s) => ({ value: s, name: prettify(s) })),
  ];
  $: sourceItems = [
    { value: "all", name: "All sources" },
    ...sources.map((s) => ({ value: s, name: prettify(s) })),
  ];

  $: filtered = data.fieldNotes.filter((note) => {
    if (categoryFilter !== "all" && note.category !== categoryFilter) return false;
    if (severityFilter !== "all" && note.severity !== severityFilter) return false;
    if (sourceFilter !== "all" && note.source !== sourceFilter) return false;
    if (!showResolved && note.resolved_at) return false;
    return true;
  });
</script>

<svelte:head><title>Field Notes — Waypoint Admin</title></svelte:head>

<p class="text-xs font-semibold uppercase tracking-wide text-text-muted">Field Notes</p>
<h1 class="mt-1 text-2xl font-bold">Moderation queue.</h1>

{#if form?.resolveError}
  <Card class="mt-4 max-w-none border-danger bg-danger-soft p-4">
    <p>{form.resolveError}</p>
  </Card>
{/if}

{#if data.loadError}
  <Card class="mt-4 max-w-none border-danger bg-danger-soft p-4">
    <p>{data.loadError}</p>
  </Card>
{/if}

<div class="mt-4 flex flex-wrap items-center gap-3">
  <Select class="w-44" items={categoryItems} bind:value={categoryFilter} />
  <Select class="w-40" items={severityItems} bind:value={severityFilter} />
  <Select class="w-40" items={sourceItems} bind:value={sourceFilter} />
  <Checkbox bind:checked={showResolved}>Show resolved</Checkbox>
</div>

<Card class="mt-4 max-w-none border-border bg-surface p-0">
  <Table>
    <TableHead>
      <TableHeadCell>Category</TableHeadCell>
      <TableHeadCell>Severity</TableHeadCell>
      <TableHeadCell>Source</TableHeadCell>
      <TableHeadCell>Where</TableHeadCell>
      <TableHeadCell>Observed</TableHeadCell>
      <TableHeadCell>Message</TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each filtered as note}
        <TableBodyRow class={note.resolved_at ? "opacity-60" : ""}>
          <TableBodyCell class="font-medium">{prettify(note.category)}</TableBodyCell>
          <TableBodyCell><Badge color={severityColor(note.severity)}>{prettify(note.severity)}</Badge></TableBodyCell>
          <TableBodyCell class="text-text-muted">{prettify(note.source)}</TableBodyCell>
          <TableBodyCell class="text-text-muted">
            {note.business_locations?.name ?? note.trails?.name ?? "Unattributed"}
          </TableBodyCell>
          <TableBodyCell class="text-text-muted">{formatTime(note.observed_at)}</TableBodyCell>
          <TableBodyCell class="max-w-xs text-text-muted">{note.message ?? ""}</TableBodyCell>
          <TableBodyCell>
            {#if note.resolved_at}
              <span class="text-xs text-text-muted">Resolved {formatTime(note.resolved_at)}</span>
            {:else}
              <form method="POST" action="?/resolve">
                <input type="hidden" name="fieldNoteId" value={note.id} />
                <Button size="xs" color="alternative" type="submit">Resolve</Button>
              </form>
            {/if}
          </TableBodyCell>
        </TableBodyRow>
      {:else}
        <TableBodyRow>
          <TableBodyCell colspan={7} class="text-text-muted">Nothing matches these filters.</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</Card>
