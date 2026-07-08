<script lang="ts">
  import { Card, Badge, Button } from "flowbite-svelte";
  import {
    facilityKeys,
    facilityLabels,
    walkerCharacteristicKeys,
    walkerCharacteristicLabels,
  } from "@waypoint/ui";

  export let data;
  export let form;

  // walker_characteristics/facilities are jsonb columns, typed as the
  // broad Supabase Json union; narrow defensively rather than assume
  // the stored shape (same pattern as the Business Portal).
  function asRecord(value: unknown): Record<string, unknown> {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    return {};
  }

  function enabledLabels(
    value: unknown,
    keys: readonly string[],
    labels: Record<string, string>,
  ): string[] {
    const record = asRecord(value);
    return keys.filter((key) => record[key] === true).map((key) => labels[key]);
  }

  function statusColor(status: string): "green" | "red" | "yellow" | "gray" {
    if (status === "approved") return "green";
    if (status === "suspended") return "red";
    if (status === "pending_review") return "yellow";
    return "gray";
  }

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleString();
  }
</script>

<svelte:head><title>{data.business?.name ?? "Business"} — Waypoint Admin</title></svelte:head>

<a href="/businesses" class="text-sm text-text-muted hover:text-text">← Businesses</a>

{#if data.business}
  <h1 class="mt-2 text-2xl font-bold">{data.business.name}</h1>
  <p class="mt-1 text-text-muted">
    {data.business.category} · <Badge color={statusColor(data.business.status)}>{data.business.status}</Badge>
  </p>

  {#if form?.decisionError}
    <Card class="mt-4 max-w-none border-danger bg-danger-soft p-4">
      <p>{form.decisionError}</p>
    </Card>
  {/if}

  <Card class="mt-4 max-w-none border-border bg-surface p-5">
    <div class="flex items-start justify-between gap-4">
      <p class="text-text-muted">{data.business.description ?? "No description."}</p>
      <div class="flex shrink-0 gap-2">
        {#if data.business.status !== "approved"}
          <form method="POST" action="?/decide">
            <input type="hidden" name="decision" value="approved" />
            <Button size="xs" type="submit">Approve</Button>
          </form>
        {/if}
        {#if data.business.status !== "suspended"}
          <form method="POST" action="?/decide">
            <input type="hidden" name="decision" value="suspended" />
            <Button size="xs" color="alternative" type="submit">Suspend</Button>
          </form>
        {/if}
      </div>
    </div>
  </Card>

  <h2 class="mt-8 text-lg font-semibold">Locations</h2>
  {#each data.locations as location}
    <Card class="mt-3 max-w-none border-border bg-surface p-5">
      <strong class="text-base">{location.name ?? "Unnamed location"}</strong>
      <p class="text-sm text-text-muted">{location.address ?? "No address"} · {location.status}</p>

      {#if location.welcome_message}
        <p class="mt-2 rounded-card bg-primary-soft p-3 italic">"{location.welcome_message}"</p>
      {/if}
      {#if location.steward_notice}
        <p class="mt-2 rounded-card border border-border bg-background p-3">
          Official: {location.steward_notice}
        </p>
      {/if}
      {#if location.seasonal_information}
        <p class="mt-2 rounded-card bg-primary-soft p-3">{location.seasonal_information}</p>
      {/if}
      {#if location.walking_context}
        <p class="mt-2 text-sm text-text-muted">{location.walking_context}</p>
      {/if}
      {#if location.place_story}
        <p class="mt-2 text-sm text-text-muted">{location.place_story}</p>
      {/if}
      {#if location.accessibility_notes}
        <p class="mt-2 text-sm text-text-muted">Accessibility: {location.accessibility_notes}</p>
      {/if}
      {#if location.best_seasons?.length}
        <p class="mt-2 text-sm text-text-muted">Best seasons: {location.best_seasons.join(", ")}</p>
      {/if}

      <div class="mt-3 flex flex-wrap gap-2">
        {#each enabledLabels(location.walker_characteristics, walkerCharacteristicKeys, walkerCharacteristicLabels) as label}
          <Badge color="green">{label}</Badge>
        {/each}
        {#each enabledLabels(location.facilities, facilityKeys, facilityLabels) as label}
          <Badge color="gray">{label}</Badge>
        {/each}
      </div>

      {#if !enabledLabels(location.walker_characteristics, walkerCharacteristicKeys, walkerCharacteristicLabels).length && !enabledLabels(location.facilities, facilityKeys, facilityLabels).length}
        <p class="mt-2 text-sm text-text-muted">No walker characteristics or facilities confirmed yet.</p>
      {/if}
    </Card>
  {:else}
    <p class="mt-3 text-text-muted">No locations yet.</p>
  {/each}

  <h2 class="mt-8 text-lg font-semibold">Members</h2>
  <Card class="mt-3 max-w-none border-border bg-surface p-5">
    <p class="text-sm text-text-muted">
      No profile/email access from Admin -- user IDs are shown raw.
    </p>
    {#each data.memberships as membership}
      <p class="mt-2">
        <code class="font-mono">{membership.user_id.slice(0, 8)}…</code>
        <span class="text-text-muted">
          · {membership.role} · {membership.status} · since {formatTime(membership.created_at)}
        </span>
      </p>
    {:else}
      <p class="text-text-muted">No members yet.</p>
    {/each}
  </Card>
{:else}
  <h1 class="mt-4 text-2xl font-bold">Business not found.</h1>
{/if}
