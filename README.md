# Sion King — first portfolio draft

Plain HTML, CSS, and JavaScript. The design preserves Figma's Neuton and DM Sans fonts, ivory background, text, and exported icons. The interactive plot occupies the open right side; it stacks below the introduction on mobile.

## Preview

Run `node serve.mjs` from this folder and open http://localhost:4173. There is no installation or build step. Serve `dist/` with any static host for production. Use HTTPS in production (required for visitor session storage and UUID generation).

## Activate the shared plot

The public Project URL and publishable key are already in `dist/config.js`. They are intended to be visible in browser code; no secret key belongs there.

1. In your Supabase project's **SQL Editor**, run `supabase/setup.sql`.
2. Under **Authentication → Sign In / Providers**, enable **Allow anonymous sign-ins**.
3. Reload the page. A working empty distribution shows `n = 0`. Click the plot; the count should increase and the point should remain after reloading. Open another browser to verify shared updates.

Visitors do not see a sign-in screen. Supabase creates a pseudonymous session on their first click. Coordinates and a timestamp are stored; no name or email is requested. Public readers can only see aggregated cells, not visitor IDs. RLS denies direct writes. A database function validates coordinates, makes retries idempotent, and enforces a two-second cooldown per anonymous user, even for concurrent requests. A new browser session can obtain a new identity, so this is light abuse resistance, not a bot-proof system. For a public launch with significant traffic, add CAPTCHA to anonymous sign-in and pass its token in the client.

Cells update via Supabase Realtime, with 15-second refresh as fallback. Every point remains in the database, and dense cells use progressively heavier ASCII characters (`· + * #`). The 56 × 28 aggregation bounds browser rendering and download size. All visible data is from Supabase: no invented visitor points and no local-only persistence fallback.

## Add your links

Edit `dist/config.js`, filling `links.github`, `links.linkedin`, `links.email`, and `links.resume`. Use full HTTPS URLs for profiles, a plain email address for email, and either an HTTPS URL or `resume.pdf` for the résumé (place the PDF in `dist/`). Until filled, each icon is clearly marked “coming soon” on hover or keyboard focus.

## Files

- `dist/index.html`: page content
- `dist/styles.css`: responsive layout and appearance
- `dist/app.js`: ASCII rendering, keyboard/click interaction, Supabase read/write/sync
- `dist/config.js`: your public connection and personal links
- `dist/assets/`: locally stored Figma exports, fonts, and Supabase JS 2.57.4 (MIT)
- `supabase/setup.sql`: database schema, permissions, and validated write function

Fonts are Google Fonts Neuton and DM Sans (SIL Open Font License). Assets were exported from the supplied Figma design. The connected Figma icon snippets refer to a Simple Design System not present in this empty workspace; exact Figma SVG exports are used instead.

## Validation scope

Frontend syntax, local assets, desktop/mobile layout, keyboard input, and simulated Supabase success/error states can be checked locally. Live persistence requires the two Supabase activation steps above. Never interpret a local mocked interaction test as evidence that the production database is configured.


## Plot visual update
The plot uses larger density marks, a sparse background grid, rust crosshairs with a coordinate readout, a connection indicator, and a brief ripple on confirmed contributions (including live contributions from other visitors). Reduced-motion preferences disable ripples. No database changes are required.

