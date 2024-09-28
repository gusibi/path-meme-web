<template>
    <div class="py-0 mt-0">
        <button v-for="(count, type) in filteredReactions" :key="type" class="inline-flex items-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-2 py-1 mx-1 text-sm font-semibold ">
            <span class="mr-1">{{ reactionEmojis[type] }}</span>
            <span>{{ count }}</span>
        </button>
    </div>
</template>
<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = defineProps<{
    reactions: Record<string, number>
}>()

const emit = defineEmits(['update:reactions'])
const slots = useSlots()

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