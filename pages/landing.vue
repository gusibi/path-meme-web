<template>
  <div class="min-h-screen bg-path-bg dark:bg-path-dark text-gray-800 dark:text-gray-100 font-sans overflow-y-auto">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full bg-white/80 dark:bg-path-cardDark/80 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-800">
      <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="font-serif font-bold text-xl text-path-red">Path Meme</div>
        <NuxtLink 
          to="/"
          class="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-path-red dark:hover:text-path-red transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to App
        </NuxtLink>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="pt-32 pb-20 px-6 text-center">
      <div class="max-w-3xl mx-auto">
        <div class="w-20 h-20 bg-path-red rounded-[2rem] mx-auto mb-8 shadow-xl shadow-red-200 dark:shadow-none flex items-center justify-center text-white">
          <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <h1 class="text-4xl md:text-6xl font-serif font-bold mb-6 text-gray-900 dark:text-white leading-tight">
          Your Digital Life, <br/>
          <span class="text-path-red">Archived on GitHub.</span>
        </h1>
        <p class="text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-10">
          A personal timeline application that revives the beautiful design of Path, 
          using GitHub Issues as a serverless CMS for your memories, diaries, and thoughts.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/" class="px-8 py-4 bg-path-red text-white rounded-full font-bold text-lg shadow-lg hover:bg-red-600 transition-all active:scale-95 w-full sm:w-auto text-center">
            Launch App
          </NuxtLink>
          <a 
            href="https://github.com/gusibi/path-meme-web" 
            target="_blank" 
            class="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full font-bold text-lg hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Star on GitHub
          </a>
        </div>
      </div>
    </header>

    <!-- Feature Grid -->
    <section class="py-20 bg-white dark:bg-path-cardDark">
      <div class="max-w-5xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Feature 1 -->
          <div class="flex flex-col gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-path-red flex items-center justify-center">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold font-serif">Classic Design</h3>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">A pixel-perfect recreation of the beloved Path UI/UX, focusing on simplicity, warmth, and personal connection.</p>
          </div>
          <!-- Feature 2 -->
          <div class="flex flex-col gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-path-red flex items-center justify-center">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold font-serif">GitHub Backend</h3>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">No database required. Every post, comment, and tag is stored securely as an Issue in your GitHub Repository.</p>
          </div>
          <!-- Feature 3 -->
          <div class="flex flex-col gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-path-red flex items-center justify-center">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold font-serif">Private Diaries</h3>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">Write personal thoughts with confidence. Diary entries are locked behind a password, keeping your secrets safe.</p>
          </div>
          <!-- Feature 4 -->
          <div class="flex flex-col gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-path-red flex items-center justify-center">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold font-serif">Markdown Editor</h3>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">Write articles with full Markdown support. Add lists, quotes, code blocks, and images easily.</p>
          </div>
          <!-- Feature 5 -->
          <div class="flex flex-col gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-path-red flex items-center justify-center">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold font-serif">Serverless</h3>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">Runs entirely in the browser. Uses the GitHub API for all data operations. Zero infrastructure to maintain.</p>
          </div>
          <!-- Feature 6 -->
          <div class="flex flex-col gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-path-red flex items-center justify-center">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold font-serif">Open Source</h3>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">The code is fully open source. Fork it, customize it, and deploy your own personal timeline in minutes.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-20 px-6 border-t border-gray-100 dark:border-gray-800">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-serif font-bold text-center mb-12">How it works</h2>
        <div class="space-y-8">
          <!-- Step 1 -->
          <div class="flex gap-6 items-start">
            <span class="text-4xl font-black text-gray-200 dark:text-gray-800 font-serif leading-none mt-1">01</span>
            <div>
              <h4 class="text-xl font-bold mb-2">Connect GitHub</h4>
              <p class="text-gray-500 dark:text-gray-400">Log in with your GitHub Token. The app connects directly to your specified repository.</p>
            </div>
          </div>
          <!-- Step 2 -->
          <div class="flex gap-6 items-start">
            <span class="text-4xl font-black text-gray-200 dark:text-gray-800 font-serif leading-none mt-1">02</span>
            <div>
              <h4 class="text-xl font-bold mb-2">Create Issues</h4>
              <p class="text-gray-500 dark:text-gray-400">When you post, the app creates a new Issue. Labels are used for tags, and the body is stored as Markdown.</p>
            </div>
          </div>
          <!-- Step 3 -->
          <div class="flex gap-6 items-start">
            <span class="text-4xl font-black text-gray-200 dark:text-gray-800 font-serif leading-none mt-1">03</span>
            <div>
              <h4 class="text-xl font-bold mb-2">Comments & Interaction</h4>
              <p class="text-gray-500 dark:text-gray-400">GitHub Issue comments are used for the discussion thread on each post.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 text-center bg-gray-50 dark:bg-black/20">
      <div class="font-serif font-bold text-gray-300 dark:text-gray-600 text-2xl mb-4">Path Meme</div>
      <p class="text-gray-400 text-sm">
        Designed & Built with ❤️ for the memory of Path.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

useHead({
  title: 'Path Meme - Your Digital Life, Archived on GitHub',
  meta: [
    { name: 'description', content: 'A personal timeline application that revives the beautiful design of Path, using GitHub Issues as a serverless CMS for your memories, diaries, and thoughts.' },
    { name: 'keywords', content: 'path, meme, blog, github, issues, cms, serverless, timeline, diary, markdown' },
    { property: 'og:title', content: 'Path Meme - Your Digital Life, Archived on GitHub' },
    { property: 'og:description', content: 'A personal timeline application using GitHub Issues as a serverless CMS for your memories, diaries, and thoughts.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: 'https://momo.gusibi.site/og-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Path Meme - Your Digital Life, Archived on GitHub' },
    { name: 'twitter:description', content: 'A personal timeline application using GitHub Issues as a serverless CMS.' },
  ],
})
</script>
