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
    Checkbox,
  } from "flowbite-svelte";

  export let data;
  export let form;

  let showDecided = false;

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleString();
  }

  function statusColor(status: string): "yellow" | "green" | "red" {
    if (status === "approved") return "green";
    if (status === "rejected") return "red";
    return "yellow";
  }

  $: filtered = data.claims.filter((claim) => showDecided || claim.status === "pending");
</script>

<svelte:head><title>Claims — Waypoint Admin</title></svelte:head>

<p class="text-xs font-semibold uppercase tracking-wide text-text-muted">Claims</p>
<h1 class="mt-1 text-2xl font-bold">Business claim requests.</h1>

{#if form?.claimError}
  <Card class="mt-4 max-w-none border-danger bg-danger-soft p-4"><p>{form.claimError}</p></Card>
{/if}

<div class="mt-4">
  <Checkbox bind:checked={showDecided}>Show decided</Checkbox>
</div>

<Card class="mt-4 max-w-none border-border bg-surface p-0">
  <Table>
    <TableHead>
      <TableHeadCell>Business</TableHeadCell>
      <TableHeadCell>Requester</TableHeadCell>
      <TableHeadCell>Message</TableHeadCell>
      <TableHeadCell>Requested</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each filtered as claim}
        <TableBodyRow>
          <TableBodyCell class="font-medium">{claim.businesses?.name ?? "Unknown business"}</TableBodyCell>
          <TableBodyCell class="text-text-muted font-mono text-xs">{claim.requester_user_id}</TableBodyCell>
          <TableBodyCell class="max-w-xs text-text-muted">{claim.message ?? ""}</TableBodyCell>
          <TableBodyCell class="text-text-muted">{formatTime(claim.created_at)}</TableBodyCell>
          <TableBodyCell><Badge color={statusColor(claim.status)}>{claim.status}</Badge></TableBodyCell>
          <TableBodyCell>
            {#if claim.status === "pending"}
              <div class="flex gap-2">
                <form method="POST" action="?/approve">
                  <input type="hidden" name="claimId" value={claim.id} />
                  <input type="hidden" name="businessId" value={claim.business_id} />
                  <input type="hidden" name="requesterUserId" value={claim.requester_user_id} />
                  <Button size="xs" type="submit">Approve</Button>
                </form>
                <form method="POST" action="?/reject">
                  <input type="hidden" name="claimId" value={claim.id} />
                  <Button size="xs" color="alternative" type="submit">Reject</Button>
                </form>
              </div>
            {:else}
              <span class="text-xs text-text-muted">
                Decided {claim.decided_at ? formatTime(claim.decided_at) : ""}
              </span>
            {/if}
          </TableBodyCell>
        </TableBodyRow>
      {:else}
        <TableBodyRow>
          <TableBodyCell colspan={6} class="text-text-muted">No claim requests.</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</Card>
