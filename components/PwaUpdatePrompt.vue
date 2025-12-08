<template>
  <Transition name="slide-down">
    <div
      v-if="needRefresh"
      class="fixed top-0 left-0 right-0 z-[9999] bg-path-red text-white text-center py-3 px-4 safe-area-top"
    >
      <div class="flex items-center justify-center space-x-4 max-w-lg mx-auto">
        <span class="text-sm">发现新版本</span>
        <button
          @click="updateServiceWorker"
          class="px-3 py-1 text-sm font-medium bg-white text-path-red rounded-lg hover:bg-gray-100 transition-colors"
        >
          立即更新
        </button>
        <button
          @click="close"
          class="p-1 hover:bg-white/20 rounded"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const needRefresh = ref(false)
let updateSW: (() => Promise<void>) | null = null

onMounted(async () => {
  // 动态导入 PWA 模块
  try {
    const { useRegisterSW } = await import('virtual:pwa-register/vue')
    const { needRefresh: nr, updateServiceWorker: usw } = useRegisterSW({
      onRegistered(r) {
        // 每小时检查一次更新
        r && setInterval(() => {
          r.update()
        }, 60 * 60 * 1000)
      },
      onRegisterError(error) {
        console.error('SW registration error', error)
      },
    })
    
    watch(nr, (val) => {
      needRefresh.value = val
    }, { immediate: true })
    
    updateSW = usw
  } catch (e) {
    // PWA 模块不可用（开发环境）
    console.log('PWA not available')
  }
})

const updateServiceWorker = async () => {
  if (updateSW) {
    await updateSW()
  }
}

const close = () => {
  needRefresh.value = false
}
</script>

<style scoped>
.safe-area-top {
  padding-top: max(0.75rem, env(safe-area-inset-top));
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
