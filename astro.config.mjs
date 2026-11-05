// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Romanian lives at the root (zalog.ro/), English under /en/.
// Visitors whose browser is not Romanian are sent to /en/ by a small script in the layout.
export default defineConfig({
  site: 'https://zalog.ro',
  trailingSlash: 'always',
  i18n: {
    locales: ['ro', 'en'],
    defaultLocale: 'ro',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'ro', locales: { ro: 'ro-RO', en: 'en-US' } },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
