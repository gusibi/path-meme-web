<template>
  <NuxtLink 
    :to="getBlogUrl(postNumber)" 
    class="inline-flex items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-path-red dark:hover:text-path-red transition-colors"
  >
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
    </svg>
    <span class="text-xs font-medium">{{ commentCount }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps({
  postNumber: {
    type: Number,
    required: true
  },
  commentCount: {
    type: Number,
    default: 0
  },
  repoUrl: {
    type: String,
    default: ''
  }
})

const getBlogUrl = (postNumber: number) => {
  if (props.repoUrl) {
    return `${props.repoUrl}/blog/${postNumber}`
  }
  return `/blog/${postNumber}`
}
</script>
