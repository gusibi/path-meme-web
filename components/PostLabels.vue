<template>
    <div class="flex flex-wrap">
        <NuxtLink v-for="label in labels" :key="label.name" :to="`/tag/${encodeURIComponent(label.name)}`" class="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 mb-2 hover:underline" :style="{ backgroundColor: `#${label.color}` }">
            {{ label.name }}
        </NuxtLink>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    labels: Array<{ color: string; name: string }>
}>()
</script>