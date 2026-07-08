<script lang="ts">
  import "../app.css";
  import { page } from "$app/state";
  import {
    Sidebar,
    SidebarWrapper,
    SidebarGroup,
    SidebarItem,
  } from "flowbite-svelte";

  export let data;

  const navItems = [
    { href: "/", label: "Overview" },
    { href: "/businesses", label: "Businesses" },
    { href: "/field-notes", label: "Field Notes" },
    { href: "/trails-regions", label: "Trails & Regions" },
    { href: "/claims", label: "Claims" },
    { href: "/users", label: "Users" },
    { href: "/check-ins", label: "Check-ins" },
  ];

  $: isSignInRoute = page.url.pathname === "/sign-in";
</script>

<div class="min-h-screen bg-background text-text">
  {#if isSignInRoute}
    <div class="mx-auto max-w-md px-6 py-16">
      <slot />
    </div>
  {:else if !data.authorised}
    <div class="mx-auto max-w-2xl px-6 py-16">
      <p class="text-xs font-semibold uppercase tracking-wide text-text-muted">
        Waypoint Admin
      </p>
      <h1 class="mt-1 text-2xl font-bold">Not authorised.</h1>
      <div class="mt-4 rounded-card border border-border bg-surface p-6">
        <p>
          {data.email} is signed in but does not hold the admin role. If it
          should, the role is assigned server-side.
        </p>
      </div>
    </div>
  {:else}
    <div class="flex">
      <Sidebar
        activeUrl={page.url.pathname}
        position="static"
        class="h-screen shrink-0 border-r border-border bg-surface"
        activeClass="flex items-center rounded-lg p-2 text-base font-normal bg-primary-soft text-primary"
        nonActiveClass="flex items-center rounded-lg p-2 text-base font-normal text-text-muted hover:bg-primary-soft/50"
      >
        <SidebarWrapper class="bg-surface px-3 py-4">
          <p class="mb-4 px-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Waypoint Admin
          </p>
          <SidebarGroup>
            {#each navItems as item}
              <SidebarItem href={item.href} label={item.label} />
            {/each}
          </SidebarGroup>
          <form method="POST" action="/?/signout" class="mt-6 px-2">
            <button
              type="submit"
              class="text-sm text-text-muted underline underline-offset-2 hover:text-text"
            >
              Sign out
            </button>
          </form>
        </SidebarWrapper>
      </Sidebar>

      <main class="min-w-0 flex-1 px-8 py-10">
        <slot />
      </main>
    </div>
  {/if}
</div>
