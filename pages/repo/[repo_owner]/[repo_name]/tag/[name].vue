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
        <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {{ totalItems }} posts in {{ route.params.repo_owner }}/{{ route.params.repo_name }}
        </p>
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
const currentPage = ref(1)
const totalItems = ref(0)
const perPage = ref(parseInt(config.public.perPageSize) || 20)
const loading = ref(false)

const fetchBlogPosts = async (page = 1) => {
  loading.value = true
  try {
    const { data: fetchedData } = await useAsyncData('blogPosts', () =>
      $fetch(`/api/repo/${route.params.repo_owner}/${route.params.repo_name}/blog-posts`, {
        params: { page, perPage: perPage.value, tag: route.params.name }
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

await fetchBlogPosts()

const onPageChange = async (page: number) => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  await fetchBlogPosts(page)
}
</script>
