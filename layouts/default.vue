<template>
  <div class="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
    <header class="bg-primary dark:bg-secondary">
      <nav class="max-w-content mx-auto px-4 py-2 flex justify-between items-center">
        <div class="flex items-center cursor-pointer" @click="navigateToHome">
          <img class="w-8 h-8 rounded-full mr-2" src="https://avatars.githubusercontent.com/u/1282277?v=4" alt="Avatar" />
          <div class="text-white dark:text-white text-xl font-bold">古思乱讲</div>
        </div>
        <button class="text-primary dark:text-white text-2xl" @click="toggleNightMode">{{ nightModeIcon }}</button>
      </nav>
    </header>
    <div class="relative h-64 overflow-hidden">
      <img class="w-full h-full object-cover" src="/banner2.jpeg" alt="Banner" />
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
          <a href="/rss.xml" class="hover:underline">RSS</a>
        </div>
        <div class="text-sm text-gray-500">Design by gusibi@path-meme</div>
      </div>
    </footer>
    <div ref="floatingTimeLabel" class="fixed top-5 right-5 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm opacity-0 transition-opacity duration-300"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { bannerContent } = useBannerContent()

const nightModeIcon = ref('🌙')
const floatingTimeLabel = ref<HTMLElement | null>(null)

const toggleNightMode = () => {
  document.documentElement.classList.toggle('dark')
  nightModeIcon.value = document.documentElement.classList.contains('dark') ? '☀️' : '🌙'
  localStorage.setItem('nightMode', document.documentElement.classList.contains('dark').toString())
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

onMounted(() => {
  initializeNightMode()
  addScrollEventListener()
})
</script>