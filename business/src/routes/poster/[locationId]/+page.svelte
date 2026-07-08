<script lang="ts">
  export let data;
</script>

<svelte:head><title>Poster — {data.placeName}</title></svelte:head>

<div class="no-print toolbar">
  <a href="/">← Back to Steward Portal</a>
  <button class="button" on:click={() => window.print()}>Print poster</button>
</div>

<div class="poster">
  <div class="crest" aria-hidden="true">⌖</div>
  <p class="label">Waypoint Checkpoint</p>
  <h1>Remember this stop on your walk.</h1>
  <p class="place">{data.placeName}</p>

  <div class="qr">{@html data.qrSvg}</div>

  <p class="instruction">Scan to check in, collect your stamp and help remember the journey.</p>
  <p class="fallback">Or open Waypoint and enter</p>
  <p class="token">{data.token}</p>
  <p class="footer">Walkers welcome · observations encouraged · no personal details shared</p>
</div>

<style>
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  .toolbar a { color: var(--text-muted); }
  .toolbar button { border: none; cursor: pointer; font: inherit; }
  .poster {
    position: relative;
    max-width: 520px;
    margin: 0 auto;
    background:
      radial-gradient(circle at 20% 10%, rgba(60, 95, 70, 0.08), transparent 28%),
      var(--surface);
    border: 2px solid var(--primary);
    border-radius: 28px;
    padding: 3rem 2.5rem 2.5rem;
    text-align: center;
    box-shadow: var(--shadow-card);
  }
  .crest {
    width: 56px;
    height: 56px;
    margin: 0 auto 1rem;
    border: 2px solid var(--primary);
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: var(--primary);
    font-size: 1.8rem;
  }
  h1 { font-size: 2.1rem; line-height: 1.05; }
  .place { font-size: 1.3rem; font-weight: 700; margin: 0.75rem 0 2rem; }
  .qr {
    max-width: 280px;
    margin: 0 auto;
    padding: 1rem;
    border-radius: 20px;
    background: white;
    border: 1px solid var(--border);
  }
  .qr :global(svg) { width: 100%; height: auto; }
  .instruction { margin: 2rem auto 0; max-width: 360px; font-size: 1.08rem; font-weight: 650; }
  .fallback { color: var(--text-muted); margin: 1rem 0 0.25rem; }
  .token { font-family: ui-monospace, monospace; font-size: 1.5rem; font-weight: 800; letter-spacing: 0.08em; margin: 0; }
  .footer { margin: 2rem 0 0; color: var(--text-muted); font-size: 0.85rem; }
  @media print {
    @page { size: A5; margin: 10mm; }
    .no-print { display: none; }
    .poster { border: 2px solid #3c5f46; padding: 8mm 7mm; box-shadow: none; }
    .qr { max-width: 78mm; }
    :global(body) { background: white; }
    :global(.shell) { max-width: none; padding: 0; }
  }
</style>
