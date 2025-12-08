<template>
  <div>
    <!-- PWA 启动画面 -->
    <Transition name="splash-fade">
      <div 
        v-if="showSplash" 
        class="fixed inset-0 z-[99999] bg-path-red flex flex-col items-center justify-center"
      >
        <div class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl mb-4 animate-pulse">
          <span class="text-path-red text-4xl font-bold italic font-serif">P</span>
        </div>
        <p class="text-white/80 text-sm mt-2">加载中...</p>
      </div>
    </Transition>

    <!-- PWA 更新提示 -->
    <PwaUpdatePrompt />
    <!-- 离线状态指示器 -->
    <OfflineIndicator />
    <!-- <NuxtRouteAnnouncer />
    <NuxtWelcome /> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- PWA 安装提示 -->
    <PwaInstallPrompt />
  </div>
</template>
<script setup lang="ts">
const showSplash = ref(true)

onMounted(async () => {
  // 检测是否是 PWA standalone 模式
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  
  if (isStandalone) {
    // PWA 模式下显示启动画面，等待页面完全加载
    await nextTick()
    // 给一点时间让页面渲染
    setTimeout(() => {
      showSplash.value = false
    }, 800)
  } else {
    // 普通浏览器模式下快速隐藏
    showSplash.value = false
  }
})
</script>

<style>
.splash-fade-leave-active {
  transition: opacity 0.3s ease;
}
.splash-fade-leave-to {
  opacity: 0;
}
</style>