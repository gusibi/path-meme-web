<template>
  <div class="min-h-screen">
    <!-- Repo Header -->
    <div class="relative text-center py-12 px-4">
      <div class="animate-bounce-soft">
        <div class="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 shadow-inner border border-gray-200 dark:border-gray-700">
          <svg class="w-8 h-8 text-path-red" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
          {{ route.params.repo_owner }}/{{ route.params.repo_name }}
        </h1>
        <p v-if="repoInfo.description" class="text-gray-500 dark:text-gray-400 text-sm font-medium max-w-md mx-auto">
          {{ repoInfo.description }}
        </p>
        
        <!-- Repo Stats -->
        <div v-if="repoInfo.stars !== undefined" class="flex items-center justify-center gap-6 mt-4 text-sm text-gray-400 dark:text-gray-500">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            {{ repoInfo.stars }}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
            </svg>
            {{ repoInfo.forks }}
          </span>
          <a 
            :href="`https://github.com/${route.params.repo_owner}/${route.params.repo_name}`"
            target="_blank"
            class="flex items-center gap-1 hover:text-path-red transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </div>

    <!-- Timeline Content -->
    <RepoTimeline 
      :blog-posts="blogPosts" 
      :current-page="currentPage" 
      :total-items="totalItems" 
      :per-page="perPage" 
      :loading="loading"
      @page-change="onPageChange" 
    />

    <!-- Floating Action Button -->
    <PathFab />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const config = useRuntimeConfig()

const blogPosts = ref([])
const repoInfo = ref<any>({})
const currentPage = ref(1)
const totalItems = ref(0)
const perPage = ref(parseInt(config.public.perPageSize) || 20)
const loading = ref(false)

const fetchBlogPosts = async (page = 1) => {
  loading.value = true
  try {
    const { data: fetchedData } = await useAsyncData('blogPosts', () =>
      $fetch(`/api/repo/${route.params.repo_owner}/${route.params.repo_name}/blog-posts`, {
        params: { page, perPage: perPage.value }
      })
    )

    repoInfo.value = fetchedData.value?.repo || {}
    blogPosts.value = fetchedData.value?.blogPosts || []
    totalItems.value = fetchedData.value?.pagination.totalItems || 0
    perPage.value = fetchedData.value?.pagination.perPage || 20
    currentPage.value = fetchedData.value?.pagination.currentPage || 1
  } finally {
    loading.value = false
  }
}

await fetchBlogPosts()

const onPageChange = async (page: number) => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  await fetchBlogPosts(page)
}
</script>
