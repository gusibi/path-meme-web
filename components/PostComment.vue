<template>
  <div class="flex gap-3">
    <img 
      :src="comment.user.avatar_url" 
      :alt="comment.user.login" 
      class="w-8 h-8 rounded-full mt-1 border border-white dark:border-gray-700 shadow-sm flex-shrink-0"
    />
    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700 flex-1">
      <div class="flex items-center justify-between mb-2">
        <span class="font-bold text-gray-800 dark:text-gray-200 text-sm">{{ comment.user.login }}</span>
        <span class="text-gray-300 dark:text-gray-600 text-xs">{{ formatDate(comment.created_at) }}</span>
      </div>
      <div class="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-400" v-html="$md(comment.body)" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  comment: {
    id: number
    user: {
      login: string
      avatar_url: string
    }
    created_at: string
    body: string
  }
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}
</script>
