<template>
  <div class="flex items-center gap-2">
    <span 
      v-for="(count, type) in filteredReactions" 
      :key="type" 
      class="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500"
    >
      <span>{{ reactionEmojis[type] }}</span>
      <span>{{ count }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  reactions: Record<string, number>
}>()

const reactionEmojis: Record<string, string> = {
  '+1': '👍', '-1': '👎', 'laugh': '😄', 'hooray': '🎉',
  'confused': '😕', 'heart': '❤️', 'rocket': '🚀', 'eyes': '👀'
}

const filteredReactions = computed(() => {
  return Object.entries(props.reactions)
    .filter(([type, count]) => count > 0 && type !== 'total_count' && type !== 'url')
    .reduce((acc, [type, count]) => {
      acc[type] = count
      return acc
    }, {} as Record<string, number>)
})
</script>
