<script lang="ts">
  import {
    facilityGlyphs,
    facilityKeys,
    facilityLabels,
    walkerCharacteristicGlyphs,
    walkerCharacteristicKeys,
    walkerCharacteristicLabels,
  } from "@waypoint/ui";

  export let data;
  export let form;

  const categoryLabels: Record<string, string> = {
    cafe: "Café",
    pub: "Pub",
    farm_shop: "Farm shop",
    campsite: "Campsite",
    outdoor_shop: "Outdoor shop",
    attraction: "Attraction",
    other: "Place",
  };

  const statusNotes: Record<string, string> = {
    draft: "Draft",
    pending_review: "Awaiting review",
    approved: "Live on Waypoint",
    suspended: "Suspended",
    archived: "Archived",
    active: "Live",
    paused: "Paused",
  };

  // walker_characteristics/facilities are jsonb columns, typed as the
  // broad Supabase `Json` union; narrow defensively rather than assume
  // the stored shape.
  function asRecord(value: unknown): Record<string, unknown> {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    return {};
  }

  function enabled(record: unknown, key: string) {
    return Boolean(asRecord(record)[key]);
  }

  function activeCount(record: unknown) {
    return Object.values(asRecord(record)).filter(Boolean).length;
  }
</script>

<svelte:head><title>Waypoint Steward</title></svelte:head>

<header class="topbar">
  <div>
    <p class="eyebrow">Waypoint Steward</p>
    <h1>Place management</h1>
    <p class="muted">
      Keep your place accurate, useful and welcoming for walkers.
    </p>
  </div>
  <form method="POST" action="?/signout">
    <button class="ghost" type="submit">Sign out</button>
  </form>
</header>

{#if data.loadError}
  <section class="panel danger">
    <h2>Something went wrong</h2>
    <p>{data.loadError}</p>
  </section>
{:else if data.memberships.length === 0}
  <section class="panel">
    <p class="eyebrow">No steward access</p>
    <h2>No managed place yet</h2>
    <p class="muted">
      Your account ({data.email}) is not linked to a business or place. Once a
      claim is approved, the operational tools will appear here.
    </p>
  </section>
{:else}
  {#each data.memberships as membership}
    {#if membership.businesses}
      <section class="business-header">
        <div>
          <p class="eyebrow">
            {categoryLabels[membership.businesses.category] ?? "Place"} ·
            {statusNotes[membership.businesses.status] ?? membership.businesses.status}
          </p>
          <h2>{membership.businesses.name}</h2>
          <p class="muted">
            You are {membership.role === "owner" ? "the owner" : membership.role}.
            Visibility is never for sale; these tools keep factual information current.
          </p>
        </div>
      </section>

      {#each membership.businesses.business_locations as location}
        <article class="location-shell">
          <div class="location-title">
            <div>
              <p class="eyebrow">Managed location</p>
              <h2>{location.name ?? membership.businesses.name}</h2>
              <p class="muted">{statusNotes[location.status] ?? location.status}</p>
            </div>
            <div class="status-card">
              <span class="metric">{data.footfallByLocation[location.name ?? membership.businesses.name] ?? 0}</span>
              <span class="metric-label">recent visits</span>
            </div>
          </div>

          <nav class="section-nav" aria-label="Location management sections">
            <a href={`#details-${location.id}`}>Details</a>
            <a href={`#walker-${location.id}`}>Walker info</a>
            <a href={`#notices-${location.id}`}>Notices</a>
            <a href={`#qr-${location.id}`}>QR</a>
            <a href={`#insights-${location.id}`}>Insights</a>
          </nav>

          <section class="grid">
            <div class="panel" id={`details-${location.id}`}>
              <p class="eyebrow">Place details</p>
              <h3>Core listing</h3>
              <p class="muted small">
                Factual information shown to walkers. Non-paying places are still discoverable.
              </p>
              <form method="POST" action="?/saveLocationDetails" class="form-grid">
                <input type="hidden" name="locationId" value={location.id} />
                <label>
                  Location name
                  <input name="name" value={location.name ?? ""} placeholder={membership.businesses.name} />
                </label>
                <label>
                  Address
                  <input name="address" value={location.address ?? ""} placeholder="Village, valley, trailhead…" />
                </label>
                <label>
                  Website
                  <input name="websiteUrl" value={location.website_url ?? ""} placeholder="https://…" />
                </label>
                <label>
                  Phone
                  <input name="phone" value={location.phone ?? ""} />
                </label>
                <label>
                  Email
                  <input name="email" value={location.email ?? ""} />
                </label>
                <label>
                  Hero image URL
                  <input name="heroImageUrl" value={location.hero_image_url ?? ""} placeholder="https://…" />
                </label>
                <button class="button" type="submit">Save details</button>
                {#if form?.locationError}<p class="error">{form.locationError}</p>{/if}
                {#if form?.locationSaved}<p class="success">Details saved.</p>{/if}
              </form>
            </div>

            <div class="panel" id={`walker-${location.id}`}>
              <p class="eyebrow">Walker information</p>
              <h3>How this place fits into a walk</h3>
              <form method="POST" action="?/saveWalkerInfo">
                <input type="hidden" name="locationId" value={location.id} />
                <h4>Walker characteristics</h4>
                <div class="check-grid">
                  {#each walkerCharacteristicKeys as key}
                    <label class="check-card">
                      <input
                        type="checkbox"
                        name={key}
                        checked={enabled(location.walker_characteristics, key)}
                      />
                      <span>{walkerCharacteristicGlyphs[key]}</span>
                      {walkerCharacteristicLabels[key]}
                    </label>
                  {/each}
                </div>

                <h4>Facilities</h4>
                <div class="check-grid">
                  {#each facilityKeys as key}
                    <label class="check-card">
                      <input
                        type="checkbox"
                        name={key}
                        checked={enabled(location.facilities, key)}
                      />
                      <span>{facilityGlyphs[key]}</span>
                      {facilityLabels[key]}
                    </label>
                  {/each}
                </div>

                <label class="full">
                  Accessibility notes
                  <textarea
                    name="accessibilityNotes"
                    rows="3"
                    placeholder="e.g. Step-free entrance from car park. Narrow doorway to rear room."
                    >{location.accessibility_notes ?? ""}</textarea>
                </label>

                <button class="button" type="submit">Save walker info</button>
                {#if form?.walkerInfoError}<p class="error">{form.walkerInfoError}</p>{/if}
                {#if form?.walkerInfoSaved}<p class="success">Walker information saved.</p>{/if}
              </form>
            </div>
          </section>

          <section class="grid">
            <div class="panel" id={`notices-${location.id}`}>
              <p class="eyebrow">Official updates</p>
              <h3>Welcome, notices and seasonal information</h3>
              <form method="POST" action="?/saveStewardNotice" class="stacked">
                <input type="hidden" name="locationId" value={location.id} />
                <label>
                  Welcome message
                  <textarea
                    name="welcomeMessage"
                    rows="2"
                    maxlength="280"
                    placeholder="e.g. Muddy boots welcome. Water refills available at the counter."
                    >{location.welcome_message ?? ""}</textarea>
                </label>
                <label>
                  Temporary official notice
                  <textarea
                    name="stewardNotice"
                    rows="3"
                    maxlength="500"
                    placeholder="e.g. Rear entrance closed today due to path repairs."
                    >{location.steward_notice ?? ""}</textarea>
                </label>
                <label>
                  Seasonal information
                  <textarea
                    name="seasonalInformation"
                    rows="3"
                    maxlength="800"
                    placeholder="e.g. Winter opening hours, bluebell season parking advice, festival week changes…"
                    >{location.seasonal_information ?? ""}</textarea>
                </label>
                <button class="button" type="submit">Publish updates</button>
                {#if form?.noticeError}<p class="error">{form.noticeError}</p>{/if}
                {#if form?.noticeSaved}<p class="success">Updates saved.</p>{/if}
              </form>
            </div>

            <div class="panel preview">
              <p class="eyebrow">Walker preview</p>
              <h3>{location.name ?? membership.businesses.name}</h3>
              {#if location.welcome_message}
                <div class="preview-card welcome">{location.welcome_message}</div>
              {/if}
              {#if location.steward_notice}
                <div class="preview-card notice">Official: {location.steward_notice}</div>
              {/if}
              <div class="chip-row">
                {#each walkerCharacteristicKeys as key}
                  {#if enabled(location.walker_characteristics, key)}
                    <span class="chip">{walkerCharacteristicGlyphs[key]} {walkerCharacteristicLabels[key]}</span>
                  {/if}
                {/each}
              </div>
              <p class="muted small">
                {activeCount(location.walker_characteristics)} walker characteristics ·
                {activeCount(location.facilities)} facilities
              </p>
            </div>
          </section>

          <section class="grid">
            <div class="panel" id={`qr-${location.id}`}>
              <p class="eyebrow">QR checkpoints</p>
              <h3>Invite walkers to remember their visit</h3>
              {#each location.qr_codes as code}
                <div class="token" class:retired={code.status !== "active"}>
                  <p class="eyebrow">{code.status === "active" ? "Active invitation" : `Invitation — ${code.status}`}</p>
                  <code>{code.code_value}</code>
                  {#if code.status === "active"}
                    <div class="actions">
                      <a class="button secondary" href={`/poster/${location.id}`}>Print poster</a>
                    </div>
                  {/if}
                </div>
              {:else}
                <p class="muted">No invitation yet for this location.</p>
                <form method="POST" action="?/createInvitation">
                  <input type="hidden" name="locationId" value={location.id} />
                  <button class="button" type="submit">Create invitation</button>
                </form>
              {/each}
              {#if form?.invitationError}<p class="error">{form.invitationError}</p>{/if}
            </div>

            <div class="panel" id={`insights-${location.id}`}>
              <p class="eyebrow">Insights</p>
              <h3>Footfall, not people</h3>
              <p class="muted small">
                Waypoint shows aggregated operational signals. It does not reveal walker identity.
              </p>
              <div class="insight-grid">
                <div><strong>{data.footfallByLocation[location.name ?? membership.businesses.name] ?? 0}</strong><span>recent visits</span></div>
                <div><strong>{activeCount(location.walker_characteristics)}</strong><span>walker facts</span></div>
                <div><strong>{activeCount(location.facilities)}</strong><span>facilities</span></div>
              </div>
            </div>
          </section>
        </article>
      {:else}
        <section class="panel"><p class="muted">No locations yet.</p></section>
      {/each}
    {/if}
  {/each}

  <section class="panel visits">
    <p class="eyebrow">Recent visits</p>
    <h2>Operational log</h2>
    {#each data.footfall as visit}
      <p>
        <strong>{visit.business_location_name}</strong>
        <span class="muted">
          · {new Date(visit.checked_in_at).toLocaleString("en-GB")}
          · {visit.check_in_method === "qr" ? "scanned" : visit.check_in_method === "manual" ? "typed" : visit.check_in_method}
          {visit.invitation_code ? `· ${visit.invitation_code}` : ""}
        </span>
      </p>
    {:else}
      <p class="muted">No visits yet. Once your poster is up, they will appear here.</p>
    {/each}
  </section>
{/if}

<style>
  .topbar,
  .business-header,
  .location-title,
  .actions {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: flex-start;
  }
  .topbar {
    margin-bottom: 2rem;
  }
  .ghost {
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--text-muted);
    cursor: pointer;
    font: inherit;
    padding: 0.55rem 1rem;
  }
  .business-header,
  .location-shell,
  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-panel, 24px);
    box-shadow: var(--shadow-card, 0 14px 34px rgba(47, 51, 40, 0.08));
  }
  .business-header,
  .location-shell {
    padding: 1.5rem;
    margin: 1.5rem 0;
  }
  .panel {
    padding: 1.25rem;
    margin: 0;
  }
  .danger {
    border-color: #d7aaa0;
    background: #f1d8d2;
  }
  .location-title {
    margin-bottom: 1rem;
  }
  .status-card {
    min-width: 110px;
    border-radius: 18px;
    padding: 1rem;
    background: var(--primary-soft);
    text-align: center;
  }
  .metric {
    display: block;
    font-size: 1.8rem;
    font-weight: 800;
  }
  .metric-label {
    display: block;
    color: var(--text-muted);
    font-size: 0.8rem;
  }
  .section-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .section-nav a,
  .chip {
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--text);
    padding: 0.45rem 0.75rem;
    text-decoration: none;
    background: #fffaf0;
    font-size: 0.85rem;
  }
  .grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 1rem;
    margin-top: 1rem;
  }
  h2,
  h3,
  h4 {
    margin: 0.25rem 0 0.5rem;
  }
  .small {
    font-size: 0.85rem;
  }
  form label {
    display: block;
    font-weight: 650;
    color: var(--text);
    margin-bottom: 0.75rem;
  }
  input,
  textarea {
    box-sizing: border-box;
    display: block;
    width: 100%;
    margin-top: 0.35rem;
    padding: 0.65rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--background);
    color: var(--text);
    font: inherit;
  }
  textarea {
    resize: vertical;
  }
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }
  .form-grid button,
  .form-grid .success,
  .form-grid .error {
    grid-column: 1 / -1;
  }
  .check-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
    margin: 0.5rem 0 1rem;
  }
  .check-card {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 0.55rem 0.65rem;
    background: #fffaf0;
    margin: 0;
    font-weight: 600;
  }
  .check-card input {
    width: auto;
    margin: 0;
  }
  .stacked label {
    margin-bottom: 1rem;
  }
  .button {
    border: none;
    cursor: pointer;
    font: inherit;
  }
  .button.secondary {
    background: #fffaf0;
    color: var(--primary);
    border: 1px solid var(--border);
  }
  .success {
    color: #3c5f46;
    font-weight: 700;
  }
  .error {
    color: #8d3d2f;
    font-weight: 700;
  }
  .preview-card {
    border-radius: 14px;
    padding: 0.8rem;
    margin: 0.75rem 0;
  }
  .preview-card.welcome {
    background: var(--primary-soft);
  }
  .preview-card.notice {
    background: #f3e2c8;
  }
  .chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0.8rem 0;
  }
  .token {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 16px;
    background: var(--primary-soft);
  }
  .token.retired {
    opacity: 0.7;
    background: var(--background);
  }
  .token code {
    display: block;
    font-size: 1rem;
    font-weight: 800;
    overflow-wrap: anywhere;
  }
  .insight-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
  .insight-grid div {
    border-radius: 14px;
    background: var(--background);
    padding: 0.8rem;
  }
  .insight-grid strong {
    display: block;
    font-size: 1.45rem;
  }
  .insight-grid span {
    color: var(--text-muted);
    font-size: 0.8rem;
  }
  .visits p {
    margin: 0.5rem 0;
  }
  @media (max-width: 820px) {
    .grid,
    .form-grid,
    .check-grid {
      grid-template-columns: 1fr;
    }
    .topbar,
    .location-title {
      flex-direction: column;
    }
  }
</style>
