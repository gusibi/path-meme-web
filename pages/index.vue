<template>
  <div class="min-h-screen">
    <!-- Profile/Hero Section -->
    <div class="relative text-center py-12 px-4">
      <div class="animate-bounce-soft">
        <div class="w-24 h-24 mx-auto rounded-full p-1 bg-white dark:bg-gray-800 shadow-xl mb-6 relative z-10">
          <img 
            src="https://avatars.githubusercontent.com/u/1282277?v=4" 
            alt="User Avatar" 
            class="w-full h-full rounded-full object-cover border-4 border-gray-50 dark:border-gray-700"
          />
        </div>
        <h1 class="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">古思乱讲</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm tracking-wide font-medium">Collecting moments.</p>
      </div>
    </div>

    <!-- Timeline Content -->
    <RepoTimeline 
      :repo-owner="config.public.repoOwner" 
      :repo-name="config.public.repoName"
      data-key="indexPosts"
    />

    <!-- Floating Action Button -->
    <PathFab />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
</script>
