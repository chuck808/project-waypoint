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
    Button,
    Modal,
    Label,
    Input,
    Select,
    Textarea,
  } from "flowbite-svelte";

  export let data;
  export let form;

  const REGION_TYPES = [
    { value: "national_park", name: "National park" },
    { value: "county", name: "County" },
    { value: "area", name: "Area" },
    { value: "custom", name: "Custom" },
  ];
  const REGION_STATUSES = [
    { value: "draft", name: "Draft" },
    { value: "published", name: "Published" },
    { value: "archived", name: "Archived" },
  ];
  const TRAIL_DIFFICULTIES = [
    { value: "easy", name: "Easy" },
    { value: "moderate", name: "Moderate" },
    { value: "hard", name: "Hard" },
    { value: "expert", name: "Expert" },
  ];
  const TRAIL_TYPES = [
    { value: "circular", name: "Circular" },
    { value: "linear", name: "Linear" },
    { value: "out_and_back", name: "Out and back" },
  ];
  const TRAIL_STATUSES = [
    { value: "draft", name: "Draft" },
    { value: "published", name: "Published" },
    { value: "archived", name: "Archived" },
  ];

  function statusColor(status: string): "green" | "gray" | "yellow" {
    if (status === "published" || status === "active") return "green";
    if (status === "draft") return "yellow";
    return "gray";
  }

  function regionOptions(regions: typeof data.regions) {
    return [{ value: "", name: "No region" }, ...regions.map((r) => ({ value: r.id, name: r.name }))];
  }

  function regionIdForTrail(trailId: string) {
    return data.trailRegionLinks.find((link) => link.trail_id === trailId)?.region_id ?? "";
  }

  let showNewRegion = false;
  let showNewTrail = false;
  let showEditRegion = false;
  let showEditTrail = false;
  let editingRegionId: string | null = null;
  let editingTrailId: string | null = null;

  $: editingRegion = data.regions.find((r) => r.id === editingRegionId) ?? null;
  $: editingTrail = data.trails.find((t) => t.id === editingTrailId) ?? null;

  function openEditRegion(id: string) {
    editingRegionId = id;
    showEditRegion = true;
  }

  function openEditTrail(id: string) {
    editingTrailId = id;
    showEditTrail = true;
  }
</script>

<svelte:head><title>Trails & Regions — Waypoint Admin</title></svelte:head>

<div class="flex items-start justify-between">
  <div>
    <p class="text-xs font-semibold uppercase tracking-wide text-text-muted">Trails & Regions</p>
    <h1 class="mt-1 text-2xl font-bold">Create and manage.</h1>
  </div>
  <Button href="/trails-regions/import" color="alternative" size="sm">Import GPX</Button>
</div>

{#if form?.regionError}
  <Card class="mt-4 max-w-none border-danger bg-danger-soft p-4"><p>{form.regionError}</p></Card>
{/if}
{#if form?.trailError}
  <Card class="mt-4 max-w-none border-danger bg-danger-soft p-4"><p>{form.trailError}</p></Card>
{/if}

<div class="mt-8 flex items-center justify-between">
  <h2 class="text-lg font-semibold">Trails</h2>
  <Button size="xs" onclick={() => (showNewTrail = true)}>New trail</Button>
</div>
<Card class="mt-3 max-w-none border-border bg-surface p-0">
  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Difficulty</TableHeadCell>
      <TableHeadCell>Distance (km)</TableHeadCell>
      <TableHeadCell>Region</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each data.trails as trail}
        <TableBodyRow>
          <TableBodyCell class="font-medium">{trail.name}</TableBodyCell>
          <TableBodyCell class="text-text-muted">{trail.difficulty}</TableBodyCell>
          <TableBodyCell class="text-text-muted">{trail.distance_km ?? "—"}</TableBodyCell>
          <TableBodyCell class="text-text-muted">
            {data.regions.find((r) => r.id === regionIdForTrail(trail.id))?.name ?? "—"}
          </TableBodyCell>
          <TableBodyCell><Badge color={statusColor(trail.status)}>{trail.status}</Badge></TableBodyCell>
          <TableBodyCell>
            <Button size="xs" color="alternative" onclick={() => openEditTrail(trail.id)}>Edit</Button>
          </TableBodyCell>
        </TableBodyRow>
      {:else}
        <TableBodyRow>
          <TableBodyCell colspan={6} class="text-text-muted">No trails.</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</Card>

<div class="mt-8 flex items-center justify-between">
  <h2 class="text-lg font-semibold">Regions</h2>
  <Button size="xs" onclick={() => (showNewRegion = true)}>New region</Button>
</div>
<Card class="mt-3 max-w-none border-border bg-surface p-0">
  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Type</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each data.regions as region}
        <TableBodyRow>
          <TableBodyCell class="font-medium">{region.name}</TableBodyCell>
          <TableBodyCell class="text-text-muted">{region.region_type}</TableBodyCell>
          <TableBodyCell><Badge color={statusColor(region.status)}>{region.status}</Badge></TableBodyCell>
          <TableBodyCell>
            <Button size="xs" color="alternative" onclick={() => openEditRegion(region.id)}>Edit</Button>
          </TableBodyCell>
        </TableBodyRow>
      {:else}
        <TableBodyRow>
          <TableBodyCell colspan={4} class="text-text-muted">No regions.</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</Card>

<Modal title="New region" bind:open={showNewRegion} autoclose={false}>
  <form method="POST" action="?/createRegion" class="space-y-4">
    <div>
      <Label for="new-region-name">Name</Label>
      <Input id="new-region-name" name="name" required />
    </div>
    <div>
      <Label for="new-region-type">Type</Label>
      <Select id="new-region-type" name="regionType" items={REGION_TYPES} value="area" />
    </div>
    <div>
      <Label for="new-region-status">Status</Label>
      <Select id="new-region-status" name="status" items={REGION_STATUSES} value="draft" />
    </div>
    <div>
      <Label for="new-region-description">Description</Label>
      <Textarea id="new-region-description" name="description" rows={3} />
    </div>
    <Button type="submit">Create region</Button>
  </form>
</Modal>

<Modal title="New trail" bind:open={showNewTrail} autoclose={false}>
  <form method="POST" action="?/createTrail" class="space-y-4">
    <div>
      <Label for="new-trail-name">Name</Label>
      <Input id="new-trail-name" name="name" required />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <Label for="new-trail-difficulty">Difficulty</Label>
        <Select id="new-trail-difficulty" name="difficulty" items={TRAIL_DIFFICULTIES} value="moderate" />
      </div>
      <div>
        <Label for="new-trail-type">Trail type</Label>
        <Select id="new-trail-type" name="trailType" items={TRAIL_TYPES} value="circular" />
      </div>
    </div>
    <div class="grid grid-cols-3 gap-4">
      <div>
        <Label for="new-trail-distance">Distance (km)</Label>
        <Input id="new-trail-distance" name="distanceKm" type="number" step="0.1" min="0" />
      </div>
      <div>
        <Label for="new-trail-elevation">Elevation gain (m)</Label>
        <Input id="new-trail-elevation" name="elevationGainM" type="number" min="0" />
      </div>
      <div>
        <Label for="new-trail-duration">Duration (min)</Label>
        <Input id="new-trail-duration" name="estimatedDurationMinutes" type="number" min="0" />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <Label for="new-trail-status">Status</Label>
        <Select id="new-trail-status" name="status" items={TRAIL_STATUSES} value="draft" />
      </div>
      <div>
        <Label for="new-trail-region">Region</Label>
        <Select id="new-trail-region" name="regionId" items={regionOptions(data.regions)} value="" />
      </div>
    </div>
    <div>
      <Label for="new-trail-description">Description</Label>
      <Textarea id="new-trail-description" name="description" rows={3} />
    </div>
    <Button type="submit">Create trail</Button>
  </form>
</Modal>

<Modal title={editingRegion ? `Edit ${editingRegion.name}` : "Edit region"} bind:open={showEditRegion} autoclose={false}>
  {#if editingRegion}
    <form method="POST" action="?/updateRegion" class="space-y-4">
      <input type="hidden" name="id" value={editingRegion.id} />
      <div>
        <Label for="edit-region-name">Name</Label>
        <Input id="edit-region-name" name="name" required value={editingRegion.name} />
      </div>
      <div>
        <Label for="edit-region-type">Type</Label>
        <Select id="edit-region-type" name="regionType" items={REGION_TYPES} value={editingRegion.region_type} />
      </div>
      <div>
        <Label for="edit-region-status">Status</Label>
        <Select id="edit-region-status" name="status" items={REGION_STATUSES} value={editingRegion.status} />
      </div>
      <div>
        <Label for="edit-region-description">Description</Label>
        <Textarea id="edit-region-description" name="description" rows={3} value={editingRegion.description ?? ""} />
      </div>
      <Button type="submit">Save region</Button>
    </form>
  {/if}
</Modal>

<Modal title={editingTrail ? `Edit ${editingTrail.name}` : "Edit trail"} bind:open={showEditTrail} autoclose={false}>
  {#if editingTrail}
    <form method="POST" action="?/updateTrail" class="space-y-4">
      <input type="hidden" name="id" value={editingTrail.id} />
      <div>
        <Label for="edit-trail-name">Name</Label>
        <Input id="edit-trail-name" name="name" required value={editingTrail.name} />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <Label for="edit-trail-difficulty">Difficulty</Label>
          <Select id="edit-trail-difficulty" name="difficulty" items={TRAIL_DIFFICULTIES} value={editingTrail.difficulty} />
        </div>
        <div>
          <Label for="edit-trail-type">Trail type</Label>
          <Select id="edit-trail-type" name="trailType" items={TRAIL_TYPES} value={editingTrail.trail_type} />
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <Label for="edit-trail-distance">Distance (km)</Label>
          <Input id="edit-trail-distance" name="distanceKm" type="number" step="0.1" min="0" value={editingTrail.distance_km ?? ""} />
        </div>
        <div>
          <Label for="edit-trail-elevation">Elevation gain (m)</Label>
          <Input id="edit-trail-elevation" name="elevationGainM" type="number" min="0" value={editingTrail.elevation_gain_m ?? ""} />
        </div>
        <div>
          <Label for="edit-trail-duration">Duration (min)</Label>
          <Input id="edit-trail-duration" name="estimatedDurationMinutes" type="number" min="0" value={editingTrail.estimated_duration_minutes ?? ""} />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <Label for="edit-trail-status">Status</Label>
          <Select id="edit-trail-status" name="status" items={TRAIL_STATUSES} value={editingTrail.status} />
        </div>
        <div>
          <Label for="edit-trail-region">Region</Label>
          <Select
            id="edit-trail-region"
            name="regionId"
            items={regionOptions(data.regions)}
            value={regionIdForTrail(editingTrail.id)}
          />
        </div>
      </div>
      <div>
        <Label for="edit-trail-description">Description</Label>
        <Textarea id="edit-trail-description" name="description" rows={3} value={editingTrail.description ?? ""} />
      </div>
      <Button type="submit">Save trail</Button>
    </form>
  {/if}
</Modal>
