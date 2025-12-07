<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="relative text-center py-12 px-4">
      <div class="animate-bounce-soft">
        <div class="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 shadow-inner border border-gray-200 dark:border-gray-700">
          <svg class="w-8 h-8 text-path-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">Explore</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">Discover interesting repositories</p>
      </div>
    </div>

    <!-- Repo Grid -->
    <div class="max-w-4xl mx-auto px-4 pb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="repo in repos" :key="repo.id" class="group">
          <RepoCard :repo="repo" />
        </div>
      </div>

      <!-- Search Input -->
      <div class="mt-12 max-w-md mx-auto">
        <div class="bg-white dark:bg-path-cardDark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <label for="repo-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Enter Repository
          </label>
          <div class="flex gap-2">
            <input 
              type="text" 
              id="repo-input" 
              v-model="repoInput" 
              class="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:border-path-red focus:ring-path-red text-sm"
              placeholder="owner/repo"
              @keyup.enter="navigateToRepo"
            />
            <button 
              @click="navigateToRepo" 
              class="px-6 py-3 bg-path-red hover:bg-red-600 text-white font-medium rounded-xl text-sm transition-colors shadow-md"
            >
              Go
            </button>
          </div>
          <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">e.g. gusibi/momo</p>
        </div>
      </div>
    </div>

    <!-- Floating Action Button -->
    <PathFab />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const repos = ref([])
const router = useRouter()
const repoInput = ref('')

const navigateToRepo = () => {
  const [owner, repo] = repoInput.value.split('/')
  if (owner && repo) {
    router.push(`/repo/${owner}/${repo}`)
  } else {
    alert('Please enter a valid repository in the format "owner/repo"')
  }
}

const { data: reposData } = await useAsyncData('reposData', () =>
  $fetch('/api/repo/list')
)

repos.value = reposData.value?.repos || []
</script>
