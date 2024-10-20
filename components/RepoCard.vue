<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4">
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-2">
        <NuxtLink :to="`/repo/${repo.owner_name}/${repo.name}`" class="text-blue-600 hover:underline">
          {{ repo.owner_name }}/{{ repo.name }}
        </NuxtLink>
      </h2>
      <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">{{ repo.description }}</p>
      <div class="flex justify-between items-center text-sm">
        <div class="flex space-x-4">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            {{ repo.stars }}
          </span>
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clip-rule="evenodd"></path>
            </svg>
            {{ repo.forks }}
          </span>
        </div>
        <span class="text-gray-500">{{ formatDate(repo.updated_at) }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue'

interface Repo {
  name: string
  description: string
  stars: number
  forks: number
  owner_name: string
  updated_at: string
}

const props = defineProps({
  repo: {
    type: Object as PropType<Repo>,
    required: true
  }
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>