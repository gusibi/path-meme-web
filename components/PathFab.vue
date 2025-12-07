<template>
  <div class="fixed bottom-8 right-6 z-40">
    <!-- Menu Items -->
    <Transition name="fab-menu">
      <div v-if="isOpen" class="absolute bottom-20 right-2 flex flex-col gap-3">
        <!-- Write Article -->
        <a 
          href="https://github.com/gusibi/momo/issues/new"
          target="_blank"
          class="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer hover:brightness-110 active:scale-95 transition-all bg-green-500 animate-bounce-soft"
          title="Write Article"
          style="animation-delay: 0ms"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </a>

        <!-- Post Text -->
        <a 
          href="https://github.com/gusibi/momo/issues/new"
          target="_blank"
          class="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer hover:brightness-110 active:scale-95 transition-all bg-blue-500 animate-bounce-soft"
          title="Post Text"
          style="animation-delay: 50ms"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </a>

        <!-- GitHub Repo -->
        <a 
          href="https://github.com/gusibi/momo"
          target="_blank"
          class="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer hover:brightness-110 active:scale-95 transition-all bg-gray-700 animate-bounce-soft"
          title="GitHub Repo"
          style="animation-delay: 100ms"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </div>
    </Transition>

    <!-- Main Trigger Button -->
    <button
      @click="toggleMenu"
      class="w-14 h-14 bg-path-red rounded-full shadow-2xl flex items-center justify-center text-white z-50 relative focus:outline-none hover:bg-red-600 transition-all active:scale-95"
      :class="{ 'rotate-45': isOpen }"
    >
      <svg class="w-7 h-7 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.fab-menu-enter-active,
.fab-menu-leave-active {
  transition: all 0.2s ease;
}

.fab-menu-enter-from,
.fab-menu-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.rotate-45 {
  transform: rotate(45deg);
}
</style>
