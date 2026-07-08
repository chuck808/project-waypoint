<script lang="ts">
  import {
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableBodyRow,
    TableBodyCell,
    Badge,
    Card,
  } from "flowbite-svelte";

  export let data;

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleString();
  }

  function statusColor(status: string): "green" | "yellow" | "red" {
    if (status === "verified") return "green";
    if (status === "pending") return "yellow";
    return "red";
  }
</script>

<svelte:head><title>Check-ins — Waypoint Admin</title></svelte:head>

<p class="text-xs font-semibold uppercase tracking-wide text-text-muted">Check-ins</p>
<h1 class="mt-1 text-2xl font-bold">Recent activity.</h1>

{#if data.loadError}
  <Card class="mt-4 max-w-none border-danger bg-danger-soft p-4">
    <p>{data.loadError}</p>
  </Card>
{/if}

<Card class="mt-4 max-w-none border-border bg-surface p-0">
  <p class="border-b border-border p-4 text-sm text-text-muted">
    Read-only audit. Walker identity is not shown here; investigate
    specific accounts through the database with cause.
  </p>
  <Table>
    <TableHead>
      <TableHeadCell>Place</TableHeadCell>
      <TableHeadCell>Time</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each data.checkIns as checkIn}
        <TableBodyRow>
          <TableBodyCell class="font-medium">{checkIn.business_locations?.name ?? "Unknown place"}</TableBodyCell>
          <TableBodyCell class="text-text-muted">{formatTime(checkIn.checked_in_at)}</TableBodyCell>
          <TableBodyCell><Badge color={statusColor(checkIn.verification_status)}>{checkIn.verification_status}</Badge></TableBodyCell>
        </TableBodyRow>
      {:else}
        <TableBodyRow>
          <TableBodyCell colspan={3} class="text-text-muted">No check-ins yet.</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</Card>
