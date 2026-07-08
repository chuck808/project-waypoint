<script lang="ts">
  import { page } from "$app/state";

  export let data;

  const navItems = [
    { href: "/", label: "Overview" },
    { href: "/businesses", label: "Businesses" },
    { href: "/field-notes", label: "Field Notes" },
    { href: "/trails-regions", label: "Trails & Regions" },
    { href: "/check-ins", label: "Check-ins" },
  ];

  $: isSignInRoute = page.url.pathname === "/sign-in";
</script>

<div class="shell" class:narrow={isSignInRoute}>
  {#if isSignInRoute}
    <slot />
  {:else if !data.authorised}
    <header class="top">
      <p class="label">Waypoint Admin</p>
    </header>
    <h1>Not authorised.</h1>
    <div class="card">
      <p>
        {data.email} is signed in but does not hold the admin role. If it
        should, the role is assigned server-side.
      </p>
    </div>
  {:else}
    <div class="layout">
      <nav class="nav">
        <p class="label">Waypoint Admin</p>
        <ul>
          {#each navItems as item}
            <li>
              <a
                href={item.href}
                class:active={page.url.pathname === item.href}
              >
                {item.label}
              </a>
            </li>
          {/each}
        </ul>
        <form method="POST" action="/?/signout">
          <button class="linkish" type="submit">Sign out</button>
        </form>
      </nav>

      <main class="content">
        <slot />
      </main>
    </div>
  {/if}
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

  :global(h1) {
    font-size: 1.8rem;
    margin: 0.25rem 0 1.25rem;
  }

  :global(h2) {
    font-size: 1.25rem;
    margin: 2rem 0 0.75rem;
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

  :global(.small) {
    font-size: 0.85rem;
  }

  :global(.card) {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-card);
    padding: 1.5rem;
    margin: 1.25rem 0;
  }

  :global(.button) {
    display: inline-block;
    background: var(--primary);
    color: var(--surface);
    border-radius: 999px;
    padding: 0.65rem 1.25rem;
    text-decoration: none;
    font-weight: 600;
    border: none;
    cursor: pointer;
    font: inherit;
  }

  :global(.button.quiet) {
    background: var(--background);
    color: var(--text);
    border: 1px solid var(--border);
  }

  .shell {
    max-width: 1100px;
    margin: 0 auto;
    padding: 3rem 1.5rem 4rem;
  }

  .shell.narrow {
    max-width: 560px;
  }

  .layout {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 2.5rem;
    align-items: start;
  }

  .nav {
    position: sticky;
    top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .nav a {
    display: block;
    padding: 0.5rem 0.75rem;
    border-radius: 10px;
    color: var(--text-muted);
    text-decoration: none;
    font-weight: 600;
  }

  .nav a.active {
    background: var(--primary-soft);
    color: var(--primary);
  }

  .content {
    min-width: 0;
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .linkish {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font: inherit;
    text-decoration: underline;
    padding: 0;
    text-align: left;
  }
</style>
