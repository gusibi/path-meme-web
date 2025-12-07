<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="relative text-center py-12 px-4">
      <div class="animate-bounce-soft">
        <div class="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 shadow-inner border border-gray-200 dark:border-gray-700">
          <svg class="w-8 h-8 text-path-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">All Tags</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">{{ tags?.length || 0 }} tags available</p>
      </div>
    </div>

    <!-- Tags Grid -->
    <div class="max-w-4xl mx-auto pb-8 px-4">
      <div v-if="pending" class="flex justify-center py-12">
        <div class="w-8 h-8 border-2 border-path-red border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <NuxtLink
          v-for="tag in tags"
          :key="tag.id"
          :to="`/tag/${tag.name}`"
          class="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-path-cardDark border border-gray-100 dark:border-gray-800 hover:border-path-red dark:hover:border-path-red hover:shadow-md transition-all group text-left"
        >
          <div class="flex items-center gap-3">
            <span 
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: `#${tag.color}` }"
            ></span>
            <span class="font-bold text-gray-700 dark:text-gray-200 text-lg capitalize">
              {{ tag.name }}
            </span>
          </div>
          <svg class="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </NuxtLink>
      </div>
    </div>

    <!-- Floating Action Button -->
    <PathFab />
  </div>
</template>

<script setup lang="ts">
interface Tag {
  id: number
  name: string
  description: string | null
  color: string
}

const { data: tags, pending } = await useAsyncData<Tag[]>('allTags', () =>
  $fetch('/api/tags')
)
</script>
