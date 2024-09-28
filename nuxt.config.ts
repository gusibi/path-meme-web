// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@stefanobartoletti/nuxt-social-share',
  ],

  // configuration options
  socialShare: {
    baseUrl: 'https://momo.gusibi.mobi' // required!
    // other optional module options
  },


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
      apiBaseUrl: process.env.API_BASE_URL || 'https://path-memo-api.gusibi.mobi',
      siteUrl: process.env.SITE_URL || 'https://momo.gusibi.mobi'
    }
  },

  nitro: {
    preset: 'cloudflare-pages'
  },
})