import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: [
    '~/assets/app.css',
    'leaflet/dist/leaflet.css',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      mapboxToken: '',
      hereApiKey: '',
      /** Base site URL for canonical links and Open Graph (no trailing slash). Set NUXT_PUBLIC_SITE_URL in production. */
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      /** Optional default OG image path (relative to site origin) or absolute URL */
      ogImageDefault: process.env.NUXT_PUBLIC_OG_IMAGE_DEFAULT || '',
    },
  },
})
