<template>
  <div class="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
    <header class="fixed top-0 left-0 right-0 z-50 bg-primary dark:bg-secondary">
      <nav class="max-w-content mx-auto px-4 py-2 flex justify-between items-center">
        <div class="flex items-center cursor-pointer" @click="navigateToHome">
          <img class="w-8 h-8 rounded-full mr-2" src="https://avatars.githubusercontent.com/u/1282277?v=4" alt="古思乱讲 Avatar" />
          <div class="text-white dark:text-white text-xl font-bold">古思乱讲</div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="hidden md:flex items-center space-x-4">
            <a href="/repo" class="text-white hover:text-gray-200 hover:scale-110 flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
              </svg> Explore </a>
            <a href="/api/rss.xml" class="text-white hover:text-gray-200 hover:scale-110 flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
              </svg> RSS </a>
            <a href="/about" class="text-white hover:text-gray-200 hover:scale-110 flex items-center">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg> About </a>
            <div class="relative group">
              <button class="text-white hover:text-gray-200 hover:scale-110 flex items-center">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg> 友情链接 <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div class="absolute right-0 mt-2 w-48 bg-white bg-opacity-80 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <a href="https://blog.gusibi.mobi" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">古思乱想</a>
                <a href="https://imageguardai.gusibi.mobi" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ImageGuardAI</a>
                <a href="https://watermark.gusibi.mobi" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">watermark</a>
              </div>
            </div>
          </div>
          <button class="text-white dark:text-white text-2xl" @click="toggleNightMode" aria-label="Toggle night mode">{{ nightModeIcon }}</button>
          <button class="md:hidden text-white" @click="toggleMobileMenu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </nav>
    </header>
    <!-- Mobile sidebar -->
    <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 bg-black bg-opacity-50" @click="toggleMobileMenu"></div>
    <div :class="['fixed top-0 right-0 w-64 h-full bg-primary dark:bg-secondary bg-opacity-50 transform transition-transform duration-300 ease-in-out z-50', mobileMenuOpen ? 'translate-x-0' : 'translate-x-full']">
      <div class="p-4">
        <button class="text-white mb-4" @click="toggleMobileMenu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <a href="/api/rss.xml" class="block text-white py-2 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </svg> RSS </a>
        <a href="/repo" class="block text-white py-2 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
          </svg> Explore </a>
        <a href="/about" class="block text-white py-2 flex items-center">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg> About </a>
        <div class="py-2">
          <button class="text-white flex items-center" @click="toggleMobileFriendLinks">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg> 友情链接 <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div v-if="mobileFriendLinksOpen" class="ml-7 mt-2">
            <a href="https://blog.gusibi.mobi" class="block text-white py-1">古思乱想</a>
            <a href="https://imageguardai.gusibi.mobi" class="block text-white py-1">ImageGuardAI</a>
            <a href="https://watermark.gusibi.mobi" class="block text-white py-1">watermark</a>
          </div>
        </div>
      </div>
    </div>
    <div class="relative h-64 overflow-hidden">
      <img class="w-full h-full object-cover blur-sm" :src="bannerImageUrl" alt="Site Banner" />
      <div class="absolute inset-0 flex items-center justify-center dark:bg-black dark:bg-opacity-50">
        <div v-html="bannerContent"></div>
      </div>
    </div>
    <main class="flex-grow my-8">
      <slot />
    </main>
    <footer class="bg-card-light dark:bg-card-dark py-4">
      <div class="max-w-content mx-auto px-4 text-center">
        <div class="mb-2">
          <a href="https://momo.gusibi.mobi" class="mr-4 hover:underline">本站地址</a>
          <a href="/sitemap.xml" class="mr-4 hover:underline">SiteMap</a>
        </div>
        <div class="text-sm text-gray-500">Design by <a href="https://github.com/gusibi/path-meme-web">gusibi@path-meme</a></div>
      </div>
    </footer>
    <div ref="floatingTimeLabel" class="fixed top-5 right-5 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm opacity-0 transition-opacity duration-300"></div>
    <button @click="scrollToTop" class="fixed bottom-8 right-8 p-2 rounded-full bg-indigo-600 bg-opacity-50 text-white hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-opacity duration-300" :class="{ 'opacity-0': !showScrollTop, 'opacity-100': showScrollTop }">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
      </svg>
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, useHead } from '#imports'
import { useRouter } from 'vue-router'

const router = useRouter()
const { bannerContent, bannerImageUrl } = useBannerContent()
const nightModeIcon = ref('🌙')
const mobileMenuOpen = ref(false)
const mobileFriendLinksOpen = ref(false)
const floatingTimeLabel = ref<HTMLElement | null>(null)
const config = useRuntimeConfig()

const toggleNightMode = () => {
  document.documentElement.classList.toggle('dark')
  nightModeIcon.value = document.documentElement.classList.contains('dark') ? '☀️' : '🌙'
  localStorage.setItem('nightMode', document.documentElement.classList.contains('dark').toString())
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleMobileFriendLinks = () => {
  mobileFriendLinksOpen.value = !mobileFriendLinksOpen.value
}


const navigateToHome = (event: Event) => {
  event.preventDefault()
  router.push('/')
}

const initializeNightMode = () => {
  const savedNightMode = localStorage.getItem('nightMode')
  if (savedNightMode === 'true') {
    document.documentElement.classList.add('dark')
    nightModeIcon.value = '☀️'
  }
}

const addScrollEventListener = () => {
  let isScrolling: NodeJS.Timeout
  window.addEventListener('scroll', () => {
    clearTimeout(isScrolling)
    if (floatingTimeLabel.value) floatingTimeLabel.value.style.opacity = '1'

    const cards = document.querySelectorAll('.card')
    let visibleCard: Element | null = null

    cards.forEach(card => {
      const rect = card.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        visibleCard = card
      }
    })

    if (visibleCard) {
      const dateTime = visibleCard.querySelector('.card-datetime')?.textContent
      if (floatingTimeLabel.value && dateTime) floatingTimeLabel.value.textContent = dateTime
    }

    isScrolling = setTimeout(() => {
      if (floatingTimeLabel.value) floatingTimeLabel.value.style.opacity = '0'
    }, 1500)
  })
}
const showScrollTop = ref(false);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const checkScroll = () => {
  showScrollTop.value = window.pageYOffset > 300;
};

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
onMounted(() => {
  initializeNightMode()
  addScrollEventListener()
})

// SEO优化
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${config.public.siteTitle}` : config.public.siteTitle
  },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    // { name: 'description', content: config.public.siteDescription },
    { name: 'format-detection', content: 'telephone=no' },
    { property: 'og:site_name', content: config.public.siteTitle },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:site', content: config.public.twitterHandle },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: config.public.siteUrl }
  ],
})
</script>