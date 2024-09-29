// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  site: {
    url: 'https://momo.gusibi.mobi',
    name: '古思乱讲'
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@stefanobartoletti/nuxt-social-share',
    '@nuxtjs/sitemap',
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
    '~/plugins/head.ts',
    '~/plugins/banner-content.ts',
    { src: '~/plugins/auth0.client.ts', mode: 'client' }
  ],

  runtimeConfig: {
    public: {
      auth0: {
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
      },
      apiBaseUrl: process.env.API_BASE_URL || 'https://path-memo-api.gusibi.mobi',
      siteUrl: process.env.SITE_URL || 'https://momo.gusibi.mobi'
    }
  },
  // Sitemap configuration
  sitemap: {
    // hostname: 'https://momo.gusibi.mobi',
    // gzip: true,
    exclude: [
      '/admin/**'
    ],
    sources: [
      '/api/__sitemap__/urls'
    ]
  },
  nitro: {
    preset: 'cloudflare-pages'
  },
})