# Careers frontend

Open `index.html` in a modern browser or serve this folder with any static web server, for example `python -m http.server 8000`. No build step is required. The three typefaces load from Google Fonts when online and fall back to system fonts offline.

The site includes a homepage, searchable and filterable career categories, 12 role information pages, editorial pages and responsive navigation. Search state is stored in the URL. The roles are career descriptions and no vacancies or application actions are presented. The supplied and generated images are in `assets/images`.

This is a frontend only: there is no authentication, live vacancy feed, application submission, or backend. Connect a verified recruitment system before offering those functions. Confirm the operator's relationship to Naivas and permission for the supplied logo and images before publishing. The typeface and colour choices follow the supplied design brief; they are not confirmed official brand specifications.

Locations are user-provided town and regional labels. Individual branch addresses and the number of positions have not been verified. The zero counters are placeholders, not confirmed staffing or vacancy numbers. The same supplied store image is reused for every location. Lobster is bundled locally for reliable display.

## Application flow
The application screen is available for inspection at `#apply/cashier?location=Nairobi` but submitting is disabled until a verified open vacancy and a real application endpoint are configured in `js/application.js`. The vacancy list is empty and endpoint is null by default. An Apply link appears only when a matching vacancy is explicitly marked `status: 'open'` and `verifiedByHR: true`. Configure vacancy objects with `id`, `slug`, `location`, `status` and `verifiedByHR`, and an authenticated, secure same-origin `endpoint`.

The server must enforce vacancy status, validate and securely handle all submitted fields and uploads, provide an accurate privacy notice, and return a JSON response with `received: true` only after durable receipt; `status: 'under_review'` controls review wording, and `reference` is optional. Email/WhatsApp delivery and interview notifications are not implemented. The confirmation requires a successful backend response; it is never shown just on clicking. The form collects national ID and KRA PIN at the user's request; confirm the legitimate need, retention policy and approved privacy notice before enabling collection. The existing local vacancy data and any client-side checks do not replace server authorisation.
