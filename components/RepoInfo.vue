<template>
  <div class="container max-w-content mx-auto px-4">
    <div class="space-y-8">
      <div v-if="repo" class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 w-full">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ repo.name }}</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">{{ repo.description }}</p>
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span class="text-gray-700 dark:text-gray-300">{{ repo.stars }}</span>
            </div>
            <div class="flex items-center">
              <svg class="w-5 h-5 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700 dark:text-gray-300">{{ repo.forks }}</span>
            </div>
          </div>
          <a :href="`https://github.com/${repoOwner}/${repoName}`" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"> View on GitHub </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  repo: {
    type: Object,
    required: true
  },
  repoOwner: {
    type: String,
    required: true
  },
  repoName: {
    type: String,
    required: true
  }
})
</script>