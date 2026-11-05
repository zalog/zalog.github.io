# zalog.ro

Portfolio of Cătălin Zălog, a static site built with [Astro](https://astro.build) and
[Tailwind CSS](https://tailwindcss.com), published to GitHub Pages at <https://zalog.ro>.

Romanian is served at `/`, English at `/en/`. Visitors whose browser is not set to Romanian are
sent to `/en/`; a language picked in the header is remembered.

## Develop

Requires the Node version in `.nvmrc`.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # type-check, then build to dist/
npm run preview   # serve dist/
```

## Where things are

| Path | What it holds |
| --- | --- |
| `src/data/content.ts` | All content: profile (name, role, contact details, stack), results, focus areas, experience, projects, earlier projects, social links, particle labels |
| `src/i18n/strings.json` | Interface text in both languages |
| `src/components/` | One component per section; `Home.astro` puts the page together |
| `src/scripts/` | Browser code: display settings, particle background |
| `src/styles/global.css` | Design tokens for light and dark, and the few styles Tailwind utilities do not cover |
| `public/` | Files copied as they are (`CNAME`, `favicon.ico`, `robots.txt`) |

To add a project, append it to `recent` (with an `id`, its anchor) or to `earlier` in
`src/data/content.ts`. Text that differs per language is written as `{ en, ro }`.

## Behaviour worth knowing

- Everything is readable without JavaScript except the email address, which a script decodes when
  Contact scrolls into view. Scripts also add the display settings, the copy buttons, the
  earlier-projects filter, the scroll effects and the particle background.
- The Display panel (theme, animations, text size) is stored in `localStorage` and applied before
  first paint. With reduced motion, from the panel or the OS, nothing animates.
- Visits are counted with Cloudflare Web Analytics, which sets no cookies, so there is no cookie banner.
  It loads only in the production build.
- Fonts are self-hosted through Fontsource; the site makes no request to Google Fonts.

## Deploy

`.github/workflows/deploy.yml` builds every pull request and deploys `main` to GitHub Pages.
In the repository settings, **Pages → Build and deployment → Source** must be **GitHub Actions**.
Dependabot opens weekly npm and monthly Actions updates.
