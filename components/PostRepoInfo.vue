<template>
  <div class="text-center text-white">
    <div class="mb-2">
      <a :href="repoUrl" class="underline decoration-sky-500 text-base font-semibold hover:underline">
        {{ repoOwner }}/{{ repoName }} </a>
    </div>
    <h1 class="text-3xl font-extrabold mb-4">{{ title }}</h1>
    <div class="flex items-center justify-center">
      <img :src="avatarUrl" :alt="author" class="w-10 h-10 rounded-full mr-3">
      <div class="text-left">
        <div class="font-medium">{{ author }}</div>
        <div class="text-sm opacity-75">{{ formattedDate }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  repoOwner: string
  repoName: string
  title: string
  avatarUrl: string
  author: string
  createdAt: string
}>()

const repoUrl = computed(() => `/repo/${props.repoOwner}/${props.repoName}`)

const formattedDate = computed(() => {
  const date = new Date(props.createdAt)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
})
</script>