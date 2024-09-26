// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: 0 }],
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    injectPosition: 0,
    viewer: true,
  },

  plugins: [
    '~/plugins/marked.ts',
    '~/plugins/banner-content.ts'
  ],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://path-memo-api.gusibi.mobi'
    }
  },

  nitro: {
    preset: 'cloudflare-pages'
  },
})