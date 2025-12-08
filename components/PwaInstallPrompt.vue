<template>
  <!-- Android/Desktop 安装提示 -->
  <Transition name="slide-up">
    <div
      v-if="showInstallPrompt"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg safe-area-bottom"
    >
      <div class="flex items-center justify-between max-w-lg mx-auto">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gradient-to-br from-path-red to-[#D91E18] rounded-xl flex items-center justify-center shadow-md">
            <span class="text-white text-2xl font-bold italic font-serif">P</span>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">安装 Path Meme</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">添加到主屏幕，获得更好体验</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="dismissPrompt"
            class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            稍后
          </button>
          <button
            @click="installPwa"
            class="px-4 py-2 text-sm font-medium text-white bg-path-red rounded-lg hover:bg-[#D91E18] transition-colors"
          >
            安装
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- iOS Safari 安装引导 -->
  <Transition name="slide-up">
    <div
      v-if="showIosPrompt"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg safe-area-bottom"
    >
      <div class="max-w-lg mx-auto">
        <div class="flex items-start space-x-3">
          <div class="w-12 h-12 bg-gradient-to-br from-path-red to-[#D91E18] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <span class="text-white text-2xl font-bold italic font-serif">P</span>
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-900 dark:text-white">安装 Path Meme</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              点击 Safari 底部的
              <svg class="inline w-5 h-5 mx-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              然后选择「添加到主屏幕」
            </p>
          </div>
          <button
            @click="dismissIosPrompt"
            class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const showInstallPrompt = ref(false)
const showIosPrompt = ref(false)
let deferredPrompt: any = null

// 检测是否是 iOS Safari
const isIosSafari = () => {
  const ua = window.navigator.userAgent
  const isIos = /iPad|iPhone|iPod/.test(ua)
  const isWebkit = /WebKit/.test(ua)
  const isNotChrome = !/CriOS/.test(ua)
  const isNotFirefox = !/FxiOS/.test(ua)
  return isIos && isWebkit && isNotChrome && isNotFirefox
}

// 检测是否已经是 standalone 模式
const isStandalone = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
}

onMounted(() => {
  // 已经安装则不显示
  if (isStandalone()) {
    return
  }

  // 检查是否已经拒绝过
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  if (dismissed) {
    const dismissedTime = parseInt(dismissed)
    // 7天后再次提示
    if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
      return
    }
  }

  // iOS Safari 显示引导提示
  if (isIosSafari()) {
    // 延迟显示，让用户先浏览一下
    setTimeout(() => {
      showIosPrompt.value = true
    }, 3000)
    return
  }

  // Android/Desktop 监听安装事件
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showInstallPrompt.value = true
  })
})

const installPwa = async () => {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice

  if (outcome === 'accepted') {
    showInstallPrompt.value = false
  }

  deferredPrompt = null
}

const dismissPrompt = () => {
  showInstallPrompt.value = false
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
}

const dismissIosPrompt = () => {
  showIosPrompt.value = false
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
}
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
