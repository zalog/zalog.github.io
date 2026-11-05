// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Visitors whose browser is not Romanian are sent to /en/ by a script in Base.astro
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
