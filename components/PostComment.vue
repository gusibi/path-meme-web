<template>
  <div class="mb-6 flex items-start space-x-3">
    <img :src="comment.user.avatar_url" :alt="comment.user.login" class="w-10 h-10 rounded-full mt-1">
    <div class="flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 flex justify-between items-center">
        <span class="font-semibold text-gray-900 dark:text-white">{{ comment.user.login }}</span>
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(comment.created_at, true) }}</span>
      </div>
      <div class="px-4 py-3 prose dark:prose-invert max-w-none" v-html="$md(comment.body)" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { formatDate } from '~/utils/date'

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
</script>