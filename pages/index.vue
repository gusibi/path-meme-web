<template>
  <div>
    <Timeline :blogPosts="blogPosts" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBannerContent } from '~/composables/useBannerContent'

const blogPosts = ref([])
const { setBannerContent } = useBannerContent()

onMounted(async () => {
  const config = useRuntimeConfig()
  try {
    blogPosts.value = await $fetch(`${config.public.apiBaseUrl}/api/blog-posts`)
    setBannerContent('<h1 class="text-4xl font-extrabold text-center text-white mb-6">Welcome to My Blog</h1>')
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    blogPosts.value = []
  }
})
</script>