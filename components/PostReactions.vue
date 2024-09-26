<template>
    <div class="flex flex-wrap">
        <button v-for="(count, type) in reactions" :key="type" v-show="count > 0" class="inline-flex items-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
            <span class="mr-1">{{ reactionEmojis[type] }}</span>
            <span>{{ count }}</span>
        </button>
    </div>
</template>
<script setup lang="ts">
const props = defineProps<{
    reactions: Record<string, number>
}>()

const reactionEmojis: Record<string, string> = {
    '+1': '👍', '-1': '👎', 'laugh': '😄', 'hooray': '🎉',
    'confused': '😕', 'heart': '❤️', 'rocket': '🚀', 'eyes': '👀'
}
</script>