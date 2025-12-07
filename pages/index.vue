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
import { ref } from 'vue'

const config = useRuntimeConfig()

const blogPosts = ref([])
const currentPage = ref(1)
const totalItems = ref(0)
const perPage = ref(parseInt(config.public.perPageSize) || 20)
const loading = ref(false)

const fetchBlogPosts = async (page = 1) => {
  loading.value = true
  try {
    const { data: fetchedData } = await useAsyncData('blogPosts', () =>
      $fetch(`/api/repo/${config.public.repoOwner}/${config.public.repoName}/blog-posts`, {
        params: { page, perPage: perPage.value }
      })
    )

    blogPosts.value = fetchedData.value?.blogPosts || []
    totalItems.value = fetchedData.value?.pagination.totalItems || 0
    perPage.value = fetchedData.value?.pagination.perPage || 20
    currentPage.value = fetchedData.value?.pagination.currentPage || 1
  } finally {
    loading.value = false
  }
}

// Fetch initial data
await fetchBlogPosts()

// Handle page changes
const onPageChange = async (page: number) => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  await fetchBlogPosts(page)
}
</script>
