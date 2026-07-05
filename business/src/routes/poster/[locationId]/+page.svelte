<script lang="ts">
  export let data;
</script>

<svelte:head><title>Poster — {data.placeName}</title></svelte:head>

<div class="no-print toolbar">
  <a href="/">← Back</a>
  <button class="button" on:click={() => window.print()}>Print poster</button>
</div>

<div class="poster">
  <p class="label">Waypoint</p>
  <h1>You've found a Waypoint place.</h1>
  <p class="place">{data.placeName}</p>

  <div class="qr">{@html data.qrSvg}</div>

  <p class="instruction">
    Scan to record your visit
  </p>
  <p class="fallback">
    or open Waypoint and enter the code
  </p>
  <p class="token">{data.token}</p>
</div>

<style>
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  .toolbar a {
    color: var(--text-muted);
  }
  .toolbar button {
    border: none;
    cursor: pointer;
    font: inherit;
  }

  .poster {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-card);
    padding: 3rem 2.5rem;
    text-align: center;
  }
  .place {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0.5rem 0 2rem;
  }
  .qr {
    max-width: 280px;
    margin: 0 auto;
  }
  .qr :global(svg) {
    width: 100%;
    height: auto;
  }
  .instruction {
    margin-top: 2rem;
    font-size: 1.1rem;
    font-weight: 600;
  }
  .fallback {
    color: var(--text-muted);
    margin: 0.75rem 0 0.25rem;
  }
  .token {
    font-family: ui-monospace, monospace;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin: 0;
  }

  @media print {
    @page {
      size: A5;
      margin: 10mm;
    }
    .no-print {
      display: none;
    }
    .poster {
      border: none;
      padding: 8mm 4mm 0;
    }
    .qr {
      max-width: 80mm;
    }
    :global(body) {
      background: white;
    }
    :global(.shell) {
      max-width: none;
      padding: 0;
    }
  }
</style>
