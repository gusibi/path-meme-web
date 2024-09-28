<template>
    <div class="flex flex-wrap text-sm font-medium ">
        <NuxtLink v-for="label in labels" :key="label.name" :to="`/tag/${encodeURIComponent(label.name)}`" class="card-label inline-block text-white dark:text-slate-800  transition-all duration-300 hover:scale-110" :style="{ color: `#${label.color}` }"> #{{ label.name }} </NuxtLink>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    labels: Array<{ color: string; name: string }>
}>()
</script>