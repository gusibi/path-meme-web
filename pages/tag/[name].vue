<template>
  <div class="min-h-screen">
    <!-- Tag Header -->
    <div class="relative text-center py-12 px-4">
      <div class="animate-bounce-soft">
        <div class="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 shadow-inner border border-gray-200 dark:border-gray-700">
          <svg class="w-8 h-8 text-path-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">#{{ route.params.name }}</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">{{ timeline?.totalItems || 0 }} posts tagged</p>
      </div>
    </div>

    <!-- Timeline Content -->
    <RepoTimeline 
      ref="timeline"
      :repo-owner="config.public.repoOwner" 
      :repo-name="config.public.repoName"
      :tag="route.params.name as string"
      data-key="tagPosts"
    />

    <!-- Floating Action Button -->
    <PathFab />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const config = useRuntimeConfig()
const timeline = ref<{ totalItems: number } | null>(null)
</script>
