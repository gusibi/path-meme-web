<template>
  <div>
    <Timeline :blogPosts="blogPosts" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useBannerContent } from '~/composables/useBannerContent'

const blogPosts = ref([])
const { setBannerContent } = useBannerContent()

// 使用 useAsyncData 来获取数据
const { data: fetchedBlogPosts } = await useAsyncData('blogPosts', () => $fetch('/api/blog-posts'))

// 当数据获取完成后，更新 blogPosts
blogPosts.value = fetchedBlogPosts.value || []

// 设置 banner 内容
setBannerContent('<h1 class="text-4xl font-extrabold text-center text-white mb-6">Welcome to My Blog</h1>')
</script>