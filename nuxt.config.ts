// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // site: {
  //   url: 'https://momo.gusibi.mobi',
  //   name: '古思乱讲'
  // },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      titleTemplate: '%s - 古思乱讲',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'description',
          content: '古思乱讲 - 一个关于技术、生活和思考的博客 一个简洁、现代的博客系统，灵感来源于 Path 应用的用户界面。它使用 GitHub Issues 作为 CMS，通过 Cloudflare Workers 提供 API 服务，并使用 Cloudflare Pages 进行静态网站托管。特点包括时间线式博客展示、Markdown 渲染、标签分类、反应统计、夜间模式和响应式设计。'
        },
        // Open Graph
        { property: 'og:description', content: '古思乱讲 - 一个关于技术、生活和思考的博客 简洁现代的博客系统，使用 GitHub Issues 作为 CMS，提供时间线式展示、Markdown 渲染、标签分类等功能。灵感源自 Path 应用，通过 Cloudflare 技术实现高效托管。' },
        { property: 'og:type', content: 'website' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:description', content: '古思乱讲 - 一个关于技术、生活和思考的博客 简洁现代的博客系统，使用 GitHub Issues 作为 CMS，提供时间线式展示、Markdown 渲染、标签分类等功能。灵感源自 Path 应用，通过 Cloudflare 技术实现高效托管。' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ]
    }
  },
  ssr: false,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@stefanobartoletti/nuxt-social-share', '@nuxtjs/sitemap', '@nuxtjs/supabase', 'nuxt-gtag', 'nuxt-clarity-analytics'],

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
      repoOwner: process.env.REPO_OWNER || 'gusibi',
      repoName: process.env.REPO_NAME || 'path-meme-db',
      perPageSize: process.env.PER_PAGE_SIZE || '10',
      siteTitle: '古思乱讲',
      siteDescription: '古思乱讲 - 一个关于技术、生活和思考的博客',
      siteUrl: process.env.SITE_URL || 'https://momo.gusibi.mobi',
      twitterHandle: '@yourtwitterhandle'
    },
    private: {
      githubToken: process.env.GITHUB_TOKEN
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