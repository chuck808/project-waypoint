<script lang="ts">
  // Palette mirrors apps/mobile/src/theme/colors.ts. When the design
  // identity session lands, these tokens move to a shared source.
</script>

<div class="shell">
  <slot />
</div>

<style>
  :global(:root) {
    --background: #f7f3ea;
    --surface: #fffdf7;
    --text: #2f3328;
    --text-muted: #4f5648;
    --primary: #3c5f46;
    --primary-soft: #dde8d5;
    --border: #ddd3c2;
    --radius-card: 18px;
    --radius-panel: 24px;
    --shadow-card: 0 14px 34px rgba(47, 51, 40, 0.08);
    --warning-soft: #f3e2c8;
    --danger-soft: #f1d8d2;
  }

  :global(body) {
    margin: 0;
    background: var(--background);
    color: var(--text);
    font-family:
      system-ui,
      -apple-system,
      "Segoe UI",
      sans-serif;
    line-height: 1.5;
  }

  .shell {
    max-width: 1120px;
    margin: 0 auto;
    padding: 3rem 1.5rem 4rem;
  }

  :global(h1) {
    font-size: 2rem;
    margin: 0.25rem 0 0;
  }

  :global(.label) {
    font-size: 0.8rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  :global(.muted) {
    color: var(--text-muted);
  }

  :global(.card) {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-card);
    padding: 1.5rem;
    margin: 1.5rem 0;
  }

  :global(.button) {
    display: inline-block;
    background: var(--primary);
    color: var(--surface);
    border-radius: 999px;
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    font-weight: 600;
  }
</style>
