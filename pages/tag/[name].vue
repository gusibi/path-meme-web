<template>
  <div class="container mx-auto px-4">
    <Timeline :blogPosts="blogPosts" />
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useBannerContentInjection } from '~/composables/useBannerContent'
const { setBannerContent } = useBannerContentInjection()
const route = useRoute()
const { data: blogPosts } = await useAsyncData('taggedPosts', () =>
  $fetch('/api/tag-posts', {
    params: { tag: route.params.name }
  })
)

setBannerContent(`<h1 class="text-4xl font-extrabold text-center text-white mb-6">Posts tagged with "${route.params.name}"</h1>`)
</script>