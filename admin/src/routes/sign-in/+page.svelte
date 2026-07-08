<script lang="ts">
  import { Card, Label, Input, Button } from "flowbite-svelte";

  export let form;
</script>

<svelte:head><title>Sign in — Waypoint Admin</title></svelte:head>

<p class="text-xs font-semibold uppercase tracking-wide text-text-muted">Waypoint Admin</p>
<h1 class="mt-1 text-2xl font-bold">Sign in</h1>
<p class="mt-1 text-text-muted">Platform governance. Authorised accounts only.</p>

<Card class="mt-6 max-w-none border-border bg-surface p-6">
  <form method="POST" class="flex flex-col gap-4">
    <Label class="space-y-1">
      <span>Email</span>
      <Input name="email" type="email" value={form?.email ?? ""} required />
    </Label>

    <Label class="space-y-1">
      <span>Password</span>
      <Input name="password" type="password" required />
    </Label>

    {#if form?.message}
      <p class="text-sm text-danger">{form.message}</p>
    {/if}

    <Button type="submit">Sign in</Button>
  </form>
</Card>
