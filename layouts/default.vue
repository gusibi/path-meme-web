<template>
  <div class="min-h-screen bg-path-bg dark:bg-path-dark text-gray-800 dark:text-gray-100 transition-colors duration-300">
    <!-- Fixed Red Glass Header -->
    <header class="fixed top-0 left-0 right-0 h-12 sm:h-14 bg-path-red/90 dark:bg-path-red/80 backdrop-blur-md z-50 shadow-sm border-b border-white/10 px-4 flex items-center justify-between text-white transition-all">
      <div class="flex items-center w-12">
        <!-- Mobile menu button -->
        <button class="md:hidden p-2 -ml-2 hover:bg-white/20 rounded-full transition-colors" @click="toggleMobileMenu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      
      <div 
        class="font-serif font-bold text-xl tracking-wider cursor-pointer select-none flex items-center gap-2" 
        @click="navigateToHome"
      >
        <!-- <img class="w-8 h-8 rounded-full border-2 border-white/30" src="https://avatars.githubusercontent.com/u/1282277?v=4" alt="Avatar" />
        <span class="hidden sm:inline">古思乱讲</span> -->
        <span>Path Meme</span>
      </div>

      <div class="flex justify-end items-center gap-1 w-12 md:w-auto">
        <!-- Desktop nav links -->
        <div class="hidden md:flex items-center gap-1">
          <a href="/repo" class="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Explore" title="Explore">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
            </svg>
          </a>
          <a href="/api/rss.xml" class="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="RSS" title="RSS">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
            </svg>
          </a>
          <a href="/about" class="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="About" title="About">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </a>
        </div>
        <!-- Tags button -->
        <NuxtLink 
          to="/tag"
          class="p-2 rounded-full hover:bg-white/20 transition-colors"
          aria-label="All Tags"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
          </svg>
        </NuxtLink>
        <!-- Dark mode toggle -->
        <button 
          @click="toggleNightMode"
          class="p-2 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Toggle Dark Mode"
        >
          <svg v-if="isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        </button>
      </div>
    </header>

    <!-- Mobile sidebar -->
    <Transition name="fade">
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" @click="toggleMobileMenu"></div>
    </Transition>
    <Transition name="slide">
      <div v-if="mobileMenuOpen" class="fixed top-0 left-0 w-72 h-full bg-white dark:bg-path-cardDark shadow-2xl z-50 transform transition-transform duration-300">
        <div class="p-6">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-3">
              <img class="w-10 h-10 rounded-full" src="https://avatars.githubusercontent.com/u/1282277?v=4" alt="Avatar" />
              <span class="font-serif font-bold text-lg text-gray-800 dark:text-white">古思乱讲</span>
            </div>
            <button class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" @click="toggleMobileMenu">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <nav class="space-y-2">
            <a href="/" class="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span class="font-medium">Home</span>
            </a>
            <a href="/tag" class="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
              </svg>
              <span class="font-medium">Tags</span>
            </a>
            <a href="/repo" class="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
              </svg>
              <span class="font-medium">Explore</span>
            </a>
            <a href="/api/rss.xml" class="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
              </svg>
              <span class="font-medium">RSS</span>
            </a>
            <a href="/about" class="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span class="font-medium">About</span>
            </a>
          </nav>
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">友情链接</p>
            <div class="space-y-2">
              <a href="https://blog.gusibi.site" class="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-path-red dark:hover:text-path-red transition-colors">古思乱想</a>
              <a href="https://onlinestool.com" class="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-path-red dark:hover:text-path-red transition-colors">OnlinesTool</a>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <main class="pt-12 sm:pt-14 pb-32">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 pt-8 pb-12 mt-8 bg-white dark:bg-path-cardDark">
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
          <NuxtLink to="/about" class="flex items-center gap-1.5 hover:text-path-red transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            About
          </NuxtLink>
          <NuxtLink to="/landing" class="flex items-center gap-1.5 hover:text-path-red transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Landing
          </NuxtLink>
          <a href="https://github.com/gusibi/path-meme-web" target="_blank" class="flex items-center gap-1.5 hover:text-path-red transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub Project
          </a>
        </div>
        <p class="text-xs text-gray-400 dark:text-gray-600">© {{ new Date().getFullYear() }} Path Meme.</p>
      </div>
    </footer>

    <!-- Scroll to top button -->
    <Transition name="fade">
      <button 
        v-if="showScrollTop"
        @click="scrollToTop" 
        class="fixed bottom-24 right-6 w-10 h-10 rounded-full bg-white dark:bg-path-cardDark shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-path-red dark:hover:text-path-red flex items-center justify-center transition-all hover:scale-110"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from '#imports'
import { useRouter } from 'vue-router'

const router = useRouter()
const config = useRuntimeConfig()

const isDarkMode = ref(false)
const mobileMenuOpen = ref(false)
const showScrollTop = ref(false)

const toggleNightMode = () => {
  document.documentElement.classList.toggle('dark')
  isDarkMode.value = document.documentElement.classList.contains('dark')
  localStorage.setItem('nightMode', isDarkMode.value.toString())
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const navigateToHome = () => {
  router.push('/')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const checkScroll = () => {
  showScrollTop.value = window.pageYOffset > 300
}

const initializeNightMode = () => {
  const savedNightMode = localStorage.getItem('nightMode')
  if (savedNightMode === 'true') {
    document.documentElement.classList.add('dark')
    isDarkMode.value = true
  }
}

onMounted(() => {
  initializeNightMode()
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})

// SEO优化
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${config.public.siteTitle}` : config.public.siteTitle
  },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' },
    { property: 'og:site_name', content: config.public.siteTitle },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:site', content: config.public.twitterHandle },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: config.public.siteUrl },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap' }
  ],
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
