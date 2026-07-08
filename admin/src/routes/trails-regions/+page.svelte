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

  function statusColor(status: string): "green" | "gray" | "yellow" {
    if (status === "published" || status === "active") return "green";
    if (status === "draft") return "yellow";
    return "gray";
  }
</script>

<svelte:head><title>Trails & Regions — Waypoint Admin</title></svelte:head>

<p class="text-xs font-semibold uppercase tracking-wide text-text-muted">Trails & Regions</p>
<h1 class="mt-1 text-2xl font-bold">Read-only audit.</h1>
<p class="mt-1 text-sm text-text-muted">
  Creation and editing happen elsewhere for now -- this is a review view.
</p>

<h2 class="mt-8 text-lg font-semibold">Trails</h2>
<Card class="mt-3 max-w-none border-border bg-surface p-0">
  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each data.trails as trail}
        <TableBodyRow>
          <TableBodyCell class="font-medium">{trail.name}</TableBodyCell>
          <TableBodyCell><Badge color={statusColor(trail.status)}>{trail.status}</Badge></TableBodyCell>
        </TableBodyRow>
      {:else}
        <TableBodyRow>
          <TableBodyCell colspan={2} class="text-text-muted">No trails.</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</Card>

<h2 class="mt-8 text-lg font-semibold">Regions</h2>
<Card class="mt-3 max-w-none border-border bg-surface p-0">
  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each data.regions as region}
        <TableBodyRow>
          <TableBodyCell class="font-medium">{region.name}</TableBodyCell>
          <TableBodyCell><Badge color={statusColor(region.status)}>{region.status}</Badge></TableBodyCell>
        </TableBodyRow>
      {:else}
        <TableBodyRow>
          <TableBodyCell colspan={2} class="text-text-muted">No regions.</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</Card>
