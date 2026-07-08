<script lang="ts">
  import {
    Card,
    Button,
    Label,
    Input,
    Textarea,
    Select,
    Fileupload,
    Radio,
  } from "flowbite-svelte";

  export let data;
  export let form;

  let target: "new" | "existing" = "new";
  let existingTrailId = data.trails[0]?.id ?? "";
</script>

<svelte:head><title>Import GPX — Waypoint Admin</title></svelte:head>

<p class="text-xs font-semibold uppercase tracking-wide text-text-muted">Trails & Regions</p>
<h1 class="mt-1 text-2xl font-bold">Import a GPX route.</h1>
<p class="mt-1 text-sm text-text-muted">
  Upload a .gpx file to preview its distance, elevation and shape before creating or updating a
  trail. Only the route itself is imported -- named waypoints in the file aren't saved.
</p>

{#if form?.previewError}
  <Card class="mt-4 max-w-none border-danger bg-danger-soft p-4"><p>{form.previewError}</p></Card>
{/if}
{#if form?.confirmError}
  <Card class="mt-4 max-w-none border-danger bg-danger-soft p-4"><p>{form.confirmError}</p></Card>
{/if}
{#if form?.imported}
  <Card class="mt-4 max-w-none border-primary bg-primary-soft p-4">
    <p>Route imported. <a class="underline" href="/trails-regions">Back to Trails & Regions.</a></p>
  </Card>
{/if}

{#if !form?.preview}
  <Card class="mt-6 max-w-none border-border bg-surface p-6">
    <form method="POST" action="?/preview" enctype="multipart/form-data" class="space-y-4">
      <div>
        <Label for="gpx-file">GPX file</Label>
        <Fileupload id="gpx-file" name="gpxFile" accept=".gpx" required />
      </div>
      <Button type="submit">Preview</Button>
    </form>
  </Card>
{:else}
  <Card class="mt-6 max-w-none border-border bg-surface p-6">
    <h2 class="text-lg font-semibold">Preview</h2>
    <dl class="mt-3 grid grid-cols-3 gap-4 text-sm">
      <div>
        <dt class="text-text-muted">Distance</dt>
        <dd class="font-medium">{form.preview.distanceKm} km</dd>
      </div>
      <div>
        <dt class="text-text-muted">Elevation gain</dt>
        <dd class="font-medium">{form.preview.elevationGainM} m</dd>
      </div>
      <div>
        <dt class="text-text-muted">Track points</dt>
        <dd class="font-medium">{form.preview.pointCount}</dd>
      </div>
    </dl>

    <form method="POST" action="?/confirm" class="mt-6 space-y-4">
      <input type="hidden" name="pointsJson" value={form.preview.pointsJson} />
      <input type="hidden" name="distanceKm" value={form.preview.distanceKm} />
      <input type="hidden" name="elevationGainM" value={form.preview.elevationGainM} />
      <input type="hidden" name="trailType" value={form.preview.trailType} />
      <input type="hidden" name="target" value={target === "new" ? "new" : existingTrailId} />

      <fieldset class="space-y-2">
        <legend class="text-sm font-medium">What should this route become?</legend>
        <Radio name="targetChoice" value="new" bind:group={target}>Create a new trail</Radio>
        <Radio name="targetChoice" value="existing" bind:group={target} disabled={data.trails.length === 0}>
          Set the route on an existing trail
        </Radio>
      </fieldset>

      {#if target === "new"}
        <div>
          <Label for="import-name">Name</Label>
          <Input id="import-name" name="name" required value={form.preview.name} />
        </div>
        <div>
          <Label for="import-description">Description</Label>
          <Textarea id="import-description" name="description" rows={3} value={form.preview.description ?? ""} />
        </div>
        <p class="text-xs text-text-muted">
          Detected as {form.preview.trailType === "circular" ? "a circular route" : "an out-and-back route"} --
          created as a draft trail; adjust difficulty, type or publish from the Trails & Regions page.
        </p>
      {:else}
        <div>
          <Label for="import-existing-trail">Trail</Label>
          <Select
            id="import-existing-trail"
            items={data.trails.map((t) => ({ value: t.id, name: t.name }))}
            bind:value={existingTrailId}
          />
        </div>
        <p class="text-xs text-text-muted">
          This replaces the selected trail's stored route only -- name, description and stats are
          left as they are.
        </p>
      {/if}

      <Button type="submit">Confirm import</Button>
    </form>
  </Card>
{/if}
