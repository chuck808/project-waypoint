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

  const CATEGORIES = [
    { value: "viewpoint", name: "Viewpoint" },
    { value: "waterfall", name: "Waterfall" },
    { value: "historical_site", name: "Historical site" },
    { value: "honesty_box", name: "Honesty box" },
    { value: "picnic_spot", name: "Picnic spot" },
    { value: "landmark", name: "Landmark" },
    { value: "other", name: "Other" },
  ];
  const STATUSES = [
    { value: "draft", name: "Draft" },
    { value: "published", name: "Published" },
    { value: "archived", name: "Archived" },
  ];

  function trailOptions(trails: typeof data.trails) {
    return [{ value: "", name: "No trail" }, ...trails.map((t) => ({ value: t.id, name: t.name }))];
  }

  function statusColor(status: string): "green" | "gray" | "yellow" {
    if (status === "published") return "green";
    if (status === "draft") return "yellow";
    return "gray";
  }

  function trailName(trailId: string | null) {
    return data.trails.find((t) => t.id === trailId)?.name ?? "—";
  }

  let showNewPoi = false;
  let showEditPoi = false;
  let editingPoiId: string | null = null;

  $: editingPoi = data.pois.find((p) => p.id === editingPoiId) ?? null;

  function openEditPoi(id: string) {
    editingPoiId = id;
    showEditPoi = true;
  }
</script>

<svelte:head><title>Points of Interest — Waypoint Admin</title></svelte:head>

<div class="flex items-start justify-between">
  <div>
    <p class="text-xs font-semibold uppercase tracking-wide text-text-muted">Points of Interest</p>
    <h1 class="mt-1 text-2xl font-bold">Viewpoints, landmarks & more.</h1>
  </div>
  <Button size="sm" onclick={() => (showNewPoi = true)}>New point of interest</Button>
</div>

{#if form?.poiError}
  <Card class="mt-4 max-w-none border-danger bg-danger-soft p-4"><p>{form.poiError}</p></Card>
{/if}

<Card class="mt-6 max-w-none border-border bg-surface p-0">
  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Category</TableHeadCell>
      <TableHeadCell>Trail</TableHeadCell>
      <TableHeadCell>Source</TableHeadCell>
      <TableHeadCell>Status</TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each data.pois as poi}
        <TableBodyRow>
          <TableBodyCell class="font-medium">{poi.name}</TableBodyCell>
          <TableBodyCell class="text-text-muted">{poi.category}</TableBodyCell>
          <TableBodyCell class="text-text-muted">{trailName(poi.trailId)}</TableBodyCell>
          <TableBodyCell class="text-text-muted">{poi.source}</TableBodyCell>
          <TableBodyCell><Badge color={statusColor(poi.status)}>{poi.status}</Badge></TableBodyCell>
          <TableBodyCell>
            <div class="flex gap-2">
              <Button size="xs" color="alternative" onclick={() => openEditPoi(poi.id)}>Edit</Button>
              <form
                method="POST"
                action="?/deletePoi"
                on:submit={(e) => {
                  if (!confirm(`Delete "${poi.name}"? This can't be undone.`)) e.preventDefault();
                }}
              >
                <input type="hidden" name="id" value={poi.id} />
                <Button size="xs" color="red" type="submit">Delete</Button>
              </form>
            </div>
          </TableBodyCell>
        </TableBodyRow>
      {:else}
        <TableBodyRow>
          <TableBodyCell colspan={6} class="text-text-muted">No points of interest yet.</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</Card>

<Modal title="New point of interest" bind:open={showNewPoi} autoclose={false}>
  <form method="POST" action="?/createPoi" class="space-y-4">
    <div>
      <Label for="new-poi-name">Name</Label>
      <Input id="new-poi-name" name="name" required />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <Label for="new-poi-category">Category</Label>
        <Select id="new-poi-category" name="category" items={CATEGORIES} value="landmark" />
      </div>
      <div>
        <Label for="new-poi-status">Status</Label>
        <Select id="new-poi-status" name="status" items={STATUSES} value="draft" />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <Label for="new-poi-lat">Latitude</Label>
        <Input id="new-poi-lat" name="lat" type="number" step="0.000001" required />
      </div>
      <div>
        <Label for="new-poi-lon">Longitude</Label>
        <Input id="new-poi-lon" name="lon" type="number" step="0.000001" required />
      </div>
    </div>
    <div>
      <Label for="new-poi-trail">Trail (optional)</Label>
      <Select id="new-poi-trail" name="trailId" items={trailOptions(data.trails)} value="" />
    </div>
    <div>
      <Label for="new-poi-description">Description</Label>
      <Textarea id="new-poi-description" name="description" rows={3} />
    </div>
    <Button type="submit">Create point of interest</Button>
  </form>
</Modal>

<Modal title={editingPoi ? `Edit ${editingPoi.name}` : "Edit point of interest"} bind:open={showEditPoi} autoclose={false}>
  {#if editingPoi}
    <form method="POST" action="?/updatePoi" class="space-y-4">
      <input type="hidden" name="id" value={editingPoi.id} />
      <div>
        <Label for="edit-poi-name">Name</Label>
        <Input id="edit-poi-name" name="name" required value={editingPoi.name} />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <Label for="edit-poi-category">Category</Label>
          <Select id="edit-poi-category" name="category" items={CATEGORIES} value={editingPoi.category} />
        </div>
        <div>
          <Label for="edit-poi-status">Status</Label>
          <Select id="edit-poi-status" name="status" items={STATUSES} value={editingPoi.status} />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <Label for="edit-poi-lat">Latitude</Label>
          <Input id="edit-poi-lat" name="lat" type="number" step="0.000001" required value={editingPoi.latitude} />
        </div>
        <div>
          <Label for="edit-poi-lon">Longitude</Label>
          <Input id="edit-poi-lon" name="lon" type="number" step="0.000001" required value={editingPoi.longitude} />
        </div>
      </div>
      <div>
        <Label for="edit-poi-trail">Trail (optional)</Label>
        <Select id="edit-poi-trail" name="trailId" items={trailOptions(data.trails)} value={editingPoi.trailId ?? ""} />
      </div>
      <div>
        <Label for="edit-poi-description">Description</Label>
        <Textarea id="edit-poi-description" name="description" rows={3} value={editingPoi.description ?? ""} />
      </div>
      <Button type="submit">Save point of interest</Button>
    </form>
  {/if}
</Modal>
