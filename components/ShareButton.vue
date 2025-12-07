<template>
  <div>
    <button 
      @click="openModal" 
      class="text-gray-400 dark:text-gray-500 hover:text-path-red dark:hover:text-path-red transition-colors"
      title="Share"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
      </svg>
    </button>
    <ShareModal v-if="isModalOpen" :post="post" @close="closeModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Post {
  number: number
  title?: string
  body?: string
  author?: string
  author_avatar?: string
  created_at?: string
  labels?: Array<{ name: string; color: string }>
}

const props = defineProps<{
  post: Post
}>()

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>
