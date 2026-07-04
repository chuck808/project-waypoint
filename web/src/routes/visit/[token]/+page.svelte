<script lang="ts">
  export let data;

  const categoryLabels: Record<string, string> = {
    cafe: "Café",
    pub: "Pub",
    farm_shop: "Farm shop",
    campsite: "Campsite",
    outdoor_shop: "Outdoor shop",
    attraction: "Attraction",
    other: "Place",
  };
</script>

<svelte:head>
  <title>
    {data.outcome === "found"
      ? `${data.placeName} — Waypoint`
      : "Waypoint invitation"}
  </title>
</svelte:head>

{#if data.outcome === "found"}
  <p class="label">You've found a Waypoint place</p>
  <h1>{data.placeName}</h1>
  {#if data.businessName !== data.placeName}
    <p class="muted">{data.businessName}</p>
  {/if}
  <p class="muted">{categoryLabels[data.category] ?? "Place"}</p>

  <div class="card">
    <p class="label">Continue your journey</p>
    <p>
      Check in with the Waypoint app to add this visit to your Passport. The
      app is currently in development — this invitation will be waiting.
    </p>
    <p class="muted">
      Already have the app? Open it and enter the code from the sign:
      <strong>{data.canonicalToken}</strong>
    </p>
  </div>
{:else}
  <p class="label">Waypoint</p>
  <h1>Hmm, we don't recognise that invitation.</h1>

  <div class="card">
    <p>
      Check the code against the sign and try again — codes look like
      <strong>wp1-XXXX-XXXX</strong>. If the sign is old or damaged, the place
      may have a new one.
    </p>
  </div>

  <a class="button" href="/">What is Waypoint?</a>
{/if}
