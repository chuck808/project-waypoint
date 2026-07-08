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
    Select,
    Input,
  } from "flowbite-svelte";

  export let data;
  export let form;

  const ROLES = [
    { value: "walker", name: "Walker" },
    { value: "business_user", name: "Business user" },
    { value: "moderator", name: "Moderator" },
    { value: "admin", name: "Admin" },
  ];

  let search = "";
  let grantRoleByUser: Record<string, string> = {};

  function roleColor(role: string): "gray" | "green" | "purple" | "red" {
    if (role === "admin") return "red";
    if (role === "moderator") return "purple";
    if (role === "business_user") return "green";
    return "gray";
  }

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleDateString();
  }

  $: filtered = data.users.filter((u) =>
    !search || (u.displayName ?? "").toLowerCase().includes(search.toLowerCase()),
  );
</script>

<svelte:head><title>Users — Waypoint Admin</title></svelte:head>

<p class="text-xs font-semibold uppercase tracking-wide text-text-muted">Users</p>
<h1 class="mt-1 text-2xl font-bold">People & roles.</h1>

{#if form?.roleError}
  <Card class="mt-4 max-w-none border-danger bg-danger-soft p-4"><p>{form.roleError}</p></Card>
{/if}

<div class="mt-4">
  <Input class="max-w-xs" placeholder="Search by display name…" bind:value={search} />
</div>

<Card class="mt-4 max-w-none border-border bg-surface p-0">
  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Joined</TableHeadCell>
      <TableHeadCell>Roles</TableHeadCell>
      <TableHeadCell>Grant role</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each filtered as u}
        <TableBodyRow>
          <TableBodyCell class="font-medium">{u.displayName ?? "(no name)"}</TableBodyCell>
          <TableBodyCell class="text-text-muted">{formatTime(u.createdAt)}</TableBodyCell>
          <TableBodyCell>
            <div class="flex flex-wrap gap-1.5">
              {#each u.roles as role}
                <form method="POST" action="?/revokeRole" class="inline">
                  <input type="hidden" name="userId" value={u.userId} />
                  <input type="hidden" name="role" value={role} />
                  <button type="submit" class="cursor-pointer">
                    <Badge color={roleColor(role)}>{role} ✕</Badge>
                  </button>
                </form>
              {:else}
                <span class="text-xs text-text-muted">No roles</span>
              {/each}
            </div>
          </TableBodyCell>
          <TableBodyCell>
            <form method="POST" action="?/grantRole" class="flex gap-2">
              <input type="hidden" name="userId" value={u.userId} />
              <Select
                class="w-40"
                name="role"
                items={ROLES}
                bind:value={grantRoleByUser[u.userId]}
                placeholder="Choose a role"
              />
              <Button size="xs" type="submit" disabled={!grantRoleByUser[u.userId]}>Grant</Button>
            </form>
          </TableBodyCell>
        </TableBodyRow>
      {:else}
        <TableBodyRow>
          <TableBodyCell colspan={4} class="text-text-muted">No users match "{search}".</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</Card>
