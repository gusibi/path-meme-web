<template>
  <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
    <!-- Previous Button -->
    <button 
      @click="onPageChange(currentPage - 1)" 
      :disabled="currentPage === 1"
      class="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>

    <!-- Page Numbers -->
    <div class="flex items-center gap-1">
      <button
        v-for="page in displayedPages"
        :key="page"
        @click="onPageChange(page)"
        class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all"
        :class="page === currentPage 
          ? 'bg-path-red text-white shadow-md' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >
        {{ page }}
      </button>
    </div>

    <!-- Next Button -->
    <button 
      @click="onPageChange(currentPage + 1)" 
      :disabled="currentPage === totalPages"
      class="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
  </div>

  <!-- Page Info (Mobile) -->
  <div v-if="totalPages > 1" class="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
    Page {{ currentPage }} of {{ totalPages }} · {{ totalItems }} posts
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  perPage: { type: Number, required: true },
})

const emit = defineEmits(['pageChange'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.perPage))

const displayedPages = computed(() => {
  const range = 2
  const pages = []
  for (let i = Math.max(1, props.currentPage - range); i <= Math.min(totalPages.value, props.currentPage + range); i++) {
    pages.push(i)
  }
  return pages
})

const onPageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('pageChange', page)
  }
}
</script>
