<script lang="ts">
  export let data;
</script>

<svelte:head>
  <title>Waypoint — walks worth remembering</title>
  <meta
    name="description"
    content="Waypoint helps walkers discover trails and places, check in as they go, and keep a Passport of moments worth remembering."
  />
</svelte:head>

<header class="nav">
  <div class="wrap navRow">
    <div class="brand">
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2.5c-3.6 0-6.5 2.9-6.5 6.5 0 4.9 6.5 12 6.5 12s6.5-7.1 6.5-12c0-3.6-2.9-6.5-6.5-6.5z"
          fill="none"
          stroke="var(--fern)"
          stroke-width="1.8"
        />
        <circle cx="12" cy="9" r="2.4" fill="none" stroke="var(--fern)" stroke-width="1.8" />
      </svg>
      <div>
        <strong>Waypoint</strong>
        <span class="strap">Walk. Discover. Remember.</span>
      </div>
    </div>
    <nav class="links">
      <a href="#how-it-works">How it works</a>
      <a href="#invited">You're invited</a>
      <a href="#businesses">For businesses</a>
    </nav>
  </div>
</header>

<section class="hero">
  <div class="wrap heroGrid">
    <div>
      <h1 class="heroTitle">Remember the places that make your walks special.</h1>
      <p class="muted heroLede">
        Waypoint helps you discover wonderful walks, find great places along
        the way, and keep the moments worth keeping.
      </p>
      <p class="soon">
        The Waypoint app is in development for iOS and Android. The places
        are already waiting.
      </p>
      <a class="button" href="#how-it-works">See how it works</a>
    </div>
    <div class="heroArt" aria-hidden="true">
      <svg viewBox="0 0 320 220" width="100%">
        <path d="M0 170 Q60 120 130 150 T320 130" fill="none" stroke="var(--moss)" stroke-width="2" />
        <path d="M0 195 Q90 150 180 175 T320 165" fill="none" stroke="var(--sandstone)" stroke-width="2" />
        <path d="M40 205 q30 -6 60 0 q30 6 60 0" fill="none" stroke="var(--sandstone)" stroke-width="1.4" stroke-dasharray="1 5" stroke-linecap="round" />
        <line x1="228" y1="90" x2="228" y2="168" stroke="var(--fern)" stroke-width="4" stroke-linecap="round" />
        <path d="M228 96 h56 l12 12 -12 12 h-56 z" fill="var(--warm-white)" stroke="var(--fern)" stroke-width="2.2" stroke-linejoin="round" />
        <text x="252" y="112" text-anchor="middle" font-size="10" fill="var(--fern)" letter-spacing="1">CAFÉ</text>
        <path d="M212 128 h16 l-8 10 z" fill="none" stroke="var(--fern)" stroke-width="1.6" stroke-linejoin="round" />
        <circle cx="70" cy="70" r="16" fill="none" stroke="var(--moss)" stroke-width="1.6" stroke-dasharray="2 3" />
        <path d="M62 74 l5-7 3 4 3-3 5 6 z" fill="none" stroke="var(--moss)" stroke-width="1.4" stroke-linejoin="round" />
      </svg>
    </div>
  </div>
</section>

<section id="how-it-works" class="band">
  <div class="wrap quartet">
    <div class="step">
      <svg viewBox="0 0 48 48" width="52" aria-hidden="true">
        <path d="M8 12 l10-4 12 4 10-4 v28 l-10 4-12-4-10 4 z" fill="none" stroke="var(--fern)" stroke-width="1.8" stroke-linejoin="round" />
        <path d="M18 8 v28 M30 12 v28" stroke="var(--sandstone)" stroke-width="1.4" />
        <path d="M24 18 c-3 0-5 2.2-5 5 0 3.8 5 9 5 9 s5-5.2 5-9 c0-2.8-2-5-5-5z" fill="none" stroke="var(--fern)" stroke-width="1.6" />
      </svg>
      <h3>Discover</h3>
      <p class="muted">Beautiful walks, hidden gems and places worth visiting.</p>
    </div>
    <div class="step">
      <svg viewBox="0 0 48 48" width="52" aria-hidden="true">
        <path d="M10 34 v-12 c0-2 1.5-3 3-3 h6 l3 5 h8 c4 0 8 3 8 8 v2 z" fill="none" stroke="var(--fern)" stroke-width="1.8" stroke-linejoin="round" />
        <path d="M10 34 h28 M14 38 h4 M24 38 h4" stroke="var(--fern)" stroke-width="1.8" stroke-linecap="round" />
        <path d="M34 14 c0-2.5 3-2.5 3-5" fill="none" stroke="var(--moss)" stroke-width="1.5" stroke-linecap="round" />
        <path d="M30 20 h9 v5 c0 2.5-2 4.5-4.5 4.5 S30 27.5 30 25 z M39 21 h3 a2.5 2.5 0 0 1 0 5 h-3" fill="none" stroke="var(--moss)" stroke-width="1.6" />
      </svg>
      <h3>Experience</h3>
      <p class="muted">Check in at the places you visit along the way.</p>
    </div>
    <div class="step">
      <svg viewBox="0 0 48 48" width="52" aria-hidden="true">
        <path d="M24 10 c-4-3-10-3-14 0 v26 c4-3 10-3 14 0 c4-3 10-3 14 0 V10 c-4-3-10-3-14 0z" fill="none" stroke="var(--fern)" stroke-width="1.8" stroke-linejoin="round" />
        <path d="M24 10 v26" stroke="var(--sandstone)" stroke-width="1.4" />
        <circle cx="33" cy="20" r="6" fill="none" stroke="var(--moss)" stroke-width="1.5" transform="rotate(8 33 20)" />
        <circle cx="33" cy="20" r="4.2" fill="none" stroke="var(--moss)" stroke-width="0.9" stroke-dasharray="1.4 1.6" transform="rotate(8 33 20)" />
      </svg>
      <h3>Remember</h3>
      <p class="muted">Your Passport keeps every stamped moment in one place.</p>
    </div>
    <div class="step">
      <svg viewBox="0 0 48 48" width="52" aria-hidden="true">
        <circle cx="17" cy="18" r="5" fill="none" stroke="var(--fern)" stroke-width="1.8" />
        <path d="M8 38 c0-6 4-10 9-10 s9 4 9 10" fill="none" stroke="var(--fern)" stroke-width="1.8" stroke-linecap="round" />
        <circle cx="33" cy="20" r="4.2" fill="none" stroke="var(--moss)" stroke-width="1.6" />
        <path d="M27 38 c0-5 3-8.5 7-8.5 s7 3.5 7 8.5" fill="none" stroke="var(--moss)" stroke-width="1.6" stroke-linecap="round" />
      </svg>
      <h3>Share</h3>
      <p class="muted">Keep memories for yourself, or share the story of a walk.</p>
    </div>
  </div>
</section>

<section id="invited" class="wrap invited">
  <div class="invitedCard">
    <div>
      <p class="label">You're invited</p>
      <h2>Look for the Waypoint sign on your travels.</h2>
      <p class="muted">
        Cafés, pubs, farm shops and attractions display a Waypoint
        invitation. Scan it — or type the code — and the visit becomes part
        of your story.
      </p>
      <p class="muted">Try it now: this is a real invitation, from a real place.</p>
      <p class="code">{data.demoToken}</p>
    </div>
    <div class="qr" aria-label="A real Waypoint invitation QR code">
      {@html data.demoQr}
      <p class="muted small">Scan to see where it leads</p>
    </div>
  </div>

  <div class="trust">
    <div>
      <h4>Private by design</h4>
      <p class="muted">Your memories are yours. Places you visit see footfall, never people.</p>
    </div>
    <div>
      <h4>Memories, not metrics</h4>
      <p class="muted">No streaks, no leaderboards, no noise. Just walks worth remembering.</p>
    </div>
    <div>
      <h4>Made for walkers</h4>
      <p class="muted">Simple, thoughtful and ad-free.</p>
    </div>
  </div>
</section>

<section id="businesses" class="band">
  <div class="wrap businesses">
    <p class="label">For businesses</p>
    <h2>Be part of walkers' journeys.</h2>
    <p class="muted">
      Waypoint treats businesses as hosts, not advertisements. A small sign
      in your window welcomes walkers, and your portal shows the visits it
      brings — footfall, not people.
    </p>
  </div>
</section>

<footer class="footer">
  <div class="wrap footRow">
    <p class="muted">Helping walkers. Supporting places.</p>
    <p class="muted small">© 2026 Waypoint</p>
  </div>
</footer>

<style>
  .wrap { max-width: 960px; margin: 0 auto; padding: 0 1.5rem; }
  .nav { border-bottom: 1px solid var(--sandstone); background: var(--warm-white); }
  .navRow { display: flex; align-items: center; justify-content: space-between; padding-top: 0.9rem; padding-bottom: 0.9rem; gap: 1rem; flex-wrap: wrap; }
  .brand { display: flex; align-items: center; gap: 0.6rem; }
  .brand strong { display: block; letter-spacing: 0.04em; color: var(--fern); }
  .strap { display: block; font-size: 0.72rem; color: var(--slate); }
  .links { display: flex; gap: 1.4rem; }
  .links a { color: var(--charcoal); text-decoration: none; font-size: 0.95rem; }
  .links a:hover { color: var(--fern); }
  .hero { padding: 3.5rem 0 2.5rem; }
  .heroGrid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 2.5rem; align-items: center; }
  .heroTitle { font-size: 2.4rem; line-height: 1.15; margin: 0; color: var(--fern); font-weight: 600; }
  .heroLede { font-size: 1.1rem; margin: 1rem 0 0.75rem; max-width: 34ch; }
  .soon { font-size: 0.92rem; color: var(--slate); margin: 0 0 1.5rem; }
  .band { background: var(--warm-white); border-top: 1px solid var(--sandstone); border-bottom: 1px solid var(--sandstone); padding: 2.5rem 0; }
  .quartet { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; text-align: center; }
  .step h3 { margin: 0.75rem 0 0.25rem; font-size: 1.05rem; }
  .step p { margin: 0; font-size: 0.92rem; }
  .invited { padding: 3rem 1.5rem; }
  .invitedCard { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2rem; background: var(--sage-soft); border-radius: var(--radius-card); padding: 2rem; align-items: center; }
  .invitedCard h2 { margin: 0.25rem 0 0.5rem; font-size: 1.5rem; }
  .code { font-family: ui-monospace, monospace; font-weight: 700; letter-spacing: 0.08em; color: var(--fern); margin: 0.5rem 0 0; }
  .qr { background: var(--warm-white); border-radius: 14px; padding: 1rem; text-align: center; }
  .qr :global(svg) { width: 160px; height: 160px; }
  .qr p { margin: 0.5rem 0 0; }
  .trust { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 2.5rem; }
  .trust h4 { margin: 0 0 0.25rem; color: var(--fern); }
  .trust p { margin: 0; font-size: 0.92rem; }
  .businesses { text-align: center; max-width: 620px; }
  .businesses h2 { margin: 0.25rem 0 0.5rem; }
  .footer { padding: 2rem 0 2.5rem; }
  .footRow { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
  .small { font-size: 0.85rem; }
  @media (max-width: 760px) {
    .heroGrid, .invitedCard { grid-template-columns: 1fr; }
    .quartet { grid-template-columns: repeat(2, 1fr); }
    .trust { grid-template-columns: 1fr; }
    .heroTitle { font-size: 1.9rem; }
  }
</style>
