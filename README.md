# ARC Website

React and Vite site with a standalone home page, booking flow, and Career Mentorship page.

## Cloudflare deployment

This repository is configured for Cloudflare Workers Static Assets. Wrangler serves the Vite `dist` output and falls back to `index.html` for the React routes.

1. Install project dependencies with `npm install`.
2. Authenticate Wrangler once with `npx wrangler login`, then confirm the account with `npx wrangler whoami`.
3. Deploy with `npm run deploy:cloudflare`.

The script builds the site before deploying it. Vite copies `public/main02.html` into `dist`, and `vite.config.js` includes `career-mentorship.html` as a separate build entry. The script targets the Workers Static Assets config in `wrangler.jsonc`. If using Cloudflare Pages Git integration instead, set the build command to `npm run build` and the output directory to `dist`; that is a separate deployment target.

`wrangler.jsonc` keeps the `workers.dev` URL disabled. A custom domain or route must already be attached to the Worker in the Cloudflare dashboard for the deployed site to be reachable. To use a `workers.dev` URL, enable it in the dashboard and update the Wrangler setting accordingly.
