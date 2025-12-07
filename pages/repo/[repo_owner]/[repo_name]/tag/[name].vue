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
        <h1 class="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">#{{ tagName }}</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {{ repoTimeline?.totalItems || 0 }} posts in {{ repoOwner }}/{{ repoName }}
        </p>
      </div>
    </div>

    <!-- Timeline Content -->
    <RepoTimeline 
      ref="repoTimeline"
      :repo-owner="repoOwner"
      :repo-name="repoName"
      :tag="tagName"
      :data-key="`repo-tag-${repoOwner}-${repoName}-${tagName}`"
    />

    <!-- Floating Action Button -->
    <PathFab />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const repoOwner = computed(() => route.params.repo_owner as string)
const repoName = computed(() => route.params.repo_name as string)
const tagName = computed(() => route.params.name as string)

const repoTimeline = ref<{ totalItems: number } | null>(null)
</script>
