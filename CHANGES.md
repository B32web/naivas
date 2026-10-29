# Visual and booking-display update

The original app.js, application.js, styles.css, vacancy counts, form fields, validation, processing delay and confirmation flow are unchanged.

Added separate visual files: soft shadows, rounded cards, subtle pointer-driven 3D depth, photo zoom, scroll reveals, hero parallax, scroll progress, reduced-motion support and mobile touch improvements. Optimized WebP photos are selected by the enhancement script; original photos remain included.

After the existing simulated application completes, a Booked · Preview badge appears on confirmation and the matching role/location Apply button area. This anonymous display state lasts for the browser tab session, including reloads. It does not reduce global vacancies or claim a server reservation. No personal application details are stored by this enhancement.

This ZIP retains the original simulated submission behavior. It does not send applications to Render or Supabase. Shared, durable booking would require changing submission logic to save and reserve a verified vacancy on the server. No live database, employer authorization or verified openings were supplied for this visual-only revision.

Hosting: the existing buildless frontend can be served as a Render Static Site. Publish the folder containing index.html; no build step is needed. Supabase is not connected in this package. Do not place secret database keys in frontend files.

Checks: original business scripts compared byte-for-byte with the uploaded source; JavaScript syntax validated. Browser visual QA and live deployment were not performed.
