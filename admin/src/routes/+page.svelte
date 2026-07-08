<script lang="ts">
  import { Card } from "flowbite-svelte";

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

<p class="text-xs font-semibold uppercase tracking-wide text-text-muted">Overview</p>
<h1 class="mt-1 text-2xl font-bold">Platform at a glance.</h1>

{#if data.kpis}
  <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    {#each statusOrder as status}
      {#if data.kpis.businessesByStatus[status]}
        <Card class="max-w-none border-border bg-surface p-4">
          <strong class="text-2xl font-bold">{data.kpis.businessesByStatus[status]}</strong>
          <span class="text-sm text-text-muted">{statusLabels[status]} businesses</span>
        </Card>
      {/if}
    {/each}

    <Card class="max-w-none border-border bg-surface p-4">
      <strong class="text-2xl font-bold">{data.kpis.activeLocations}</strong>
      <span class="text-sm text-text-muted">active locations</span>
    </Card>

    <Card class="max-w-none border-border bg-surface p-4">
      <strong class="text-2xl font-bold">{data.kpis.checkInsLast7Days}</strong>
      <span class="text-sm text-text-muted">check-ins, last 7 days</span>
    </Card>

    <Card
      class="max-w-none p-4 {data.kpis.fieldNotesUnresolved > 0
        ? 'border-primary bg-primary-soft'
        : 'border-border bg-surface'}"
    >
      <strong class="text-2xl font-bold">{data.kpis.fieldNotesUnresolved}</strong>
      <span class="text-sm text-text-muted">field notes unresolved</span>
    </Card>

    <Card class="max-w-none border-border bg-surface p-4">
      <strong class="text-2xl font-bold">{data.kpis.fieldNotesPublic}</strong>
      <span class="text-sm text-text-muted">field notes live to walkers</span>
    </Card>

    <Card class="max-w-none border-border bg-surface p-4">
      <strong class="text-2xl font-bold">{data.kpis.publishedTrails}</strong>
      <span class="text-sm text-text-muted">published trails</span>
    </Card>

    <Card class="max-w-none border-border bg-surface p-4">
      <strong class="text-2xl font-bold">{data.kpis.activeRegions}</strong>
      <span class="text-sm text-text-muted">published regions</span>
    </Card>
  </div>

  {#if data.kpis.fieldNotesUnresolved > 0}
    <Card class="mt-4 max-w-none border-border bg-surface p-5">
      <a href="/field-notes" class="font-semibold text-primary hover:underline">
        {data.kpis.fieldNotesUnresolved} Field Note{data.kpis.fieldNotesUnresolved === 1 ? "" : "s"} waiting for review →
      </a>
    </Card>
  {/if}
{/if}
