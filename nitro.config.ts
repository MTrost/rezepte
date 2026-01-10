import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  preset: 'cloudflare-pages',
  compatibilityDate: '2024-01-01',
  cloudflare: {
    pages: {
      routes: {
        exclude: ['/assets/*', '/images/*'],
      },
    },
  },
})
