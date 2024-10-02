<template>
  <div>
    <NuxtLink :to="getBlogUrl(postNumber)" class="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
      </svg>
      <span>{{ commentCount }}</span>
      <span class="sr-only">Comments</span>
    </NuxtLink>
  </div>
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