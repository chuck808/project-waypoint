<script lang="ts">
  // Palette per Field Guide 002 (docs/field-guide). One source of truth.
</script>

<div class="shell">
  <slot />
</div>

<style>
  :global(:root) {
    --cream: #f7f3ea;
    --warm-white: #fffdf7;
    --sage-soft: #dde8d5;
    --sandstone: #ddd3c2;
    --fern: #3c5f46;
    --moss: #6d8265;
    --slate: #6b7261;
    --charcoal: #2f3328;
    /* legacy aliases used by existing pages */
    --background: var(--cream);
    --surface: var(--warm-white);
    --primary: var(--fern);
    --primary-soft: var(--sage-soft);
    --border: var(--sandstone);
    --text: var(--charcoal);
    --text-muted: var(--slate);
    --radius-card: 18px;
  }

  :global(body) {
    margin: 0;
    background: var(--cream);
    color: var(--charcoal);
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    line-height: 1.55;
  }

  .shell {
    min-height: 100vh;
  }

  :global(.narrow) {
    max-width: 560px;
    margin: 0 auto;
    padding: 3rem 1.5rem 4rem;
  }

  :global(h1) {
    font-size: 2rem;
    margin: 0.25rem 0 0;
    font-weight: 600;
  }

  :global(.label) {
    font-size: 0.8rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--slate);
  }

  :global(.muted) {
    color: var(--slate);
  }

  :global(.card) {
    background: var(--warm-white);
    border: 1px solid var(--sandstone);
    border-radius: var(--radius-card);
    padding: 1.5rem;
    margin: 1.5rem 0;
  }

  :global(.button) {
    display: inline-block;
    background: var(--fern);
    color: var(--warm-white);
    border-radius: 999px;
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    font-weight: 600;
    border: none;
    font: inherit;
    cursor: pointer;
  }
</style>
