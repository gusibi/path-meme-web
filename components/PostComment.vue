<template>
  <div class="mb-6 bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden">
    <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 flex justify-between items-center">
      <span class="font-semibold text-gray-900 dark:text-white">{{ comment.user.login }}</span>
      <span class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(comment.created_at, true) }}</span>
    </div>
    <div class="px-4 py-3 prose dark:prose-invert max-w-none" v-html="$md(comment.body)" />
  </div>
</template>
<script setup lang="ts">
import { formatDate } from '~/utils/date'

defineProps<{
  comment: {
    id: number
    user: { login: string }
    created_at: string
    body: string
  }
}>()
</script>