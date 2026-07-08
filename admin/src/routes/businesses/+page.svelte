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
    Card,
  } from "flowbite-svelte";

  export let data;
  export let form;

  function statusColor(status: string): "green" | "red" | "yellow" | "gray" {
    if (status === "approved") return "green";
    if (status === "suspended") return "red";
    if (status === "pending_review") return "yellow";
    return "gray";
  }
</script>

<svelte:head><title>Businesses — Waypoint Admin</title></svelte:head>

<p class="text-xs font-semibold uppercase tracking-wide text-text-muted">Businesses</p>
<h1 class="mt-1 text-2xl font-bold">Review and approve.</h1>

{#if form?.decisionError}
  <Card class="mt-4 max-w-none border-danger bg-danger-soft p-4">
    <p>{form.decisionError}</p>
  </Card>
{/if}

{#if data.loadError}
  <Card class="mt-4 max-w-none border-danger bg-danger-soft p-4">
    <p>{data.loadError}</p>
  </Card>
{/if}

<Card class="mt-6 max-w-none border-border bg-surface p-0">
  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Category</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each data.businesses as business}
        <TableBodyRow>
          <TableBodyCell>
            <a class="font-semibold text-text hover:underline" href={`/businesses/${business.id}`}>
              {business.name}
            </a>
          </TableBodyCell>
          <TableBodyCell class="text-text-muted">{business.category}</TableBodyCell>
          <TableBodyCell>
            <Badge color={statusColor(business.status)}>{business.status}</Badge>
          </TableBodyCell>
          <TableBodyCell>
            <div class="flex gap-2">
              {#if business.status !== "approved"}
                <form method="POST" action="?/decide">
                  <input type="hidden" name="businessId" value={business.id} />
                  <input type="hidden" name="decision" value="approved" />
                  <Button size="xs" type="submit">Approve</Button>
                </form>
              {/if}
              {#if business.status !== "suspended"}
                <form method="POST" action="?/decide">
                  <input type="hidden" name="businessId" value={business.id} />
                  <input type="hidden" name="decision" value="suspended" />
                  <Button size="xs" color="alternative" type="submit">Suspend</Button>
                </form>
              {/if}
            </div>
          </TableBodyCell>
        </TableBodyRow>
      {:else}
        <TableBodyRow>
          <TableBodyCell colspan={4} class="text-text-muted">No businesses yet.</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</Card>
