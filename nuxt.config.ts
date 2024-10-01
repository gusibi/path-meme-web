// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  site: {
    url: 'https://momo.gusibi.mobi',
    name: '古思乱讲'
  },
  ssr: false,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@stefanobartoletti/nuxt-social-share',
    '@nuxtjs/sitemap',
    '@nuxtjs/supabase',
    'nuxt-gtag',
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
  ],
  routeRules: {
    // 指定只有 /profile 路由需要身份验证
    '/profile': { auth: true },
  },
  // 确保中间件被加载
  hooks: {
    'pages:extend'(pages) {
      pages.forEach((page) => {
        if (page.path === '/profile') {
          page.meta = page.meta || {}
          page.meta.middleware = ['auth']
        }
      })
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://path-memo-api.gusibi.mobi',
      siteUrl: process.env.SITE_URL || 'https://momo.gusibi.mobi'
    }
  },
  gtag: {
    id: 'G-N7EW8Y4SEF'
  },
  supabase: {
    // Options
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    redirect: false, // Redirect automatically to the configured login page if a non authenticated user is trying to access a guarded. You can disable all redirects by setting this option to false.
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