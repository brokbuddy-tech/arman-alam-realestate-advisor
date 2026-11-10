This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Individual broker public feed

This Next.js App Router site requests one broker’s explicitly public profile and
listings from the individual broker feed. The server fetches
`/api/public/broker-template/{slug}`, `/listings?page=1&limit=12`, and
`/listings/{id}` under that same broker route. Every request sends the individual
code in `X-BrokBuddy-Broker-Code`. No organization feed or legacy endpoint is used.

Copy `.env.example` to `.env.local` and replace the placeholders with operator-supplied
settings, or set these in the hosting provider’s **server-side** environment:

- `BROKBUDDY_API_BASE_URL`: HTTPS API origin, without credentials or a query string.
- `BROKBUDDY_BROKER_PROFILE_SLUG`: the broker’s stable public profile slug.
- `BROKBUDDY_BROKER_CODE`: the individual code issued in Admin Console; exactly
  32 lowercase hexadecimal characters (128 bits), not an organization template code.

Do not prefix these settings with `NEXT_PUBLIC_`. Never put the code in URLs,
client props, browser code, analytics, or logs. The config and fetching modules
use `server-only` to prevent browser imports. Only mapped public display data
crosses the server/client boundary. Do not enable request-header logging for the
upstream requests in hosting or monitoring tools.

Restart the development server after changing `.env.local`. In production,
restart/redeploy the server after changing configuration; rebuild as well if the
hosting platform injects environment settings during its build. The integration
requires a Next.js server runtime and does not support a static export. Feed
requests use `no-store` and pages render dynamically so rotation and revocation
are checked on subsequent requests. Already open pages refresh on reload.

The home profile shows at most six listings from the API’s active listing preview,
with a link to the full inventory. The map uses the active preview (up to 18 listings).
All-listing and category pages request paginated data, 12 per page, with the
category applied upstream. Category navigation resets pagination. Detail pages
always request the same broker-scoped detail endpoint, including on a direct visit.
Images use returned public `/api/public/agency/...` asset URLs, resolved against
the configured API origin and rendered through the existing unoptimized image
flow. Storage URLs and internal object paths are never constructed or passed on.

Missing/invalid configuration displays an unavailable state. API, authorization,
network, or malformed-response failures display an error with a retry action;
they never become successful empty feeds. Only a valid empty listing response
shows the empty state. A detail `404` displays unavailable because this API uses
`404` for both missing listings and invalid/revoked codes.

**API prerequisite:** the production API must have the broker-feed implementation
deployed and its corresponding database migration applied. An admin must generate
the broker’s individual raw code in Admin Console. It is shown once, the API stores
only its SHA-256 hash, and rotating/revoking it invalidates the previous code.
Update only the website’s server-side configuration when rotating it.

Run `npm test` for config, response mapping, header secrecy, pagination, detail
scope, and failure coverage. Tests use synthetic credentials and mocked requests;
they do not require or print a real broker code.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

`vercel.json` selects the Next.js server runtime, installs with `npm ci`, and
builds with `npm run build -- --webpack`, the production build verified for this
checkout. Keep Vercel's default Next.js output directory; do not use a static
export. No Git commit or push is needed when deploying this checkout with the CLI.

1. Complete the API deployment and migration described above and issue the
   broker's raw code in Admin Console.
2. Fill in the three server settings in `.env.local`. For this broker,
   `BROKBUDDY_BROKER_PROFILE_SLUG` is `arman-alam-9942`. Confirm that the API base
   URL points to the deployed BrokBuddy API; it must not include the route or slug.
3. Sign into Vercel with `npx vercel login`, then run `npx vercel link` from this
   directory to create or select the website project in your account.
4. In the Vercel project's **Settings → Environment Variables**, add
   `BROKBUDDY_API_BASE_URL`, `BROKBUDDY_BROKER_PROFILE_SLUG`, and
   `BROKBUDDY_BROKER_CODE` for **Production**. Enter the values from `.env.local`;
   store the broker code as a **Secret** (called **Sensitive** in older versions
   of the dashboard). Keep these names free of `NEXT_PUBLIC_` prefixes. Add Preview
   settings only if you also want preview deployments to use this feed.
5. Run `npm test`, then `npx vercel deploy --prod`. The Vercel build uses the
   settings above. Changes to Vercel environment settings require a new deployment.
6. Open the returned URL and verify the profile, a paginated listing page, and
   a listing detail page. Invalid or revoked codes must show an unavailable state.

`.env.local` stays on your machine. `.vercelignore` excludes all `.env` files and
local credential/configuration directories from CLI source uploads; Git also
ignores local environment files. Vercel environment variables must be configured
separately rather than uploading the file. When using the CLI to set a broker
code, send its value through stdin instead of putting it in command arguments.

References: [Vercel CLI deployment](https://vercel.com/docs/cli/deploy),
[Config and Secret variables](https://vercel.com/docs/environment-variables/sensitive-environment-variables),
and [excluding deployment files](https://vercel.com/docs/deployments/vercel-ignore).

## Responsive display and descriptions

The top-right menu contains navigation, broker contact details, and display
currency controls. Prices default to AED; changing the display currency keeps the
upstream listing currency intact for conversion. The shared footer displays the
broker's public BRN and contact fields on every page when they are configured.
Mortgage calculations are hidden for all rental transactions, including
commercial rentals.

The server normalizes legacy HTML wrappers and escaped HTML into Markdown before
passing descriptions and biography text to the browser. The renderer supports
paragraphs, headings, emphasis, lists, and tables while rejecting raw HTML,
embedded media, and unsafe link protocols. The same description renderer is used
in property details and brochures. Text normalization and rental detection are
covered by `npm test`; responsive layouts and menu interactions are also checked
in Chromium at phone, tablet, and desktop widths.

## Natural-language property matching

The search bar on the profile and listing pages translates requests such as
`2BHK UNDER 25K`, `rent 2BR under 40k`, or `two bedroom flats in Ajman` into matching rules for
transaction, property type, bedrooms, price, and location words. This is a
rule-based natural-language matcher with a compact glass search interface; it does
not call an external AI model or require another API key.

Search reads the complete broker-scoped public listing result in pages of at most
100 items, then matches and paginates the results in groups of 12. Budgets are
compared in AED using the existing currency conversion rates. Category, sorting,
and page navigation retain broker scope; search pagination retains the original
request. Errors on any upstream page fail the search instead of returning a
partial successful feed. Searches exceeding 50 upstream pages fail explicitly.
Bedroom and budget requirements are enforced together, regardless of input case.
An empty result means no public listing meets those requirements; the search does
not silently relax the budget or bedroom count. The map uses the same matching
rules within the listings loaded for its view.

Photo counts come from unique public image URLs returned for each listing. The
photo control opens a keyboard-accessible viewer with previous/next controls.
Listings with no photos show an unavailable placeholder, without counting the
site logo as a listing photo.

## Contact enquiries

The navbar's **Contact us** button opens a validated enquiry form on desktop and
inside the mobile menu. `/contact` provides the same form as a standalone page.
Messages post to the website's same-origin `/api/contact` route. The server first
verifies the configured broker-template feed/code, then submits to the existing
`POST /api/public/broker/{slug}/inquiry` endpoint using the operator-configured
broker slug. The template code is never sent by the browser or attached to the
public enquiry POST.

The proxy returns only a delivery confirmation, validates fields and request
size, checks the website origin, preserves idempotency keys for safe retries,
and surfaces API errors without showing a false success state. It requires no
additional email-provider keys. Enquiries enter BrokBuddy through its existing
broker inquiry flow; the UI does not claim an email has been sent. Automated
submission tests use mocked APIs and synthetic contact details.
