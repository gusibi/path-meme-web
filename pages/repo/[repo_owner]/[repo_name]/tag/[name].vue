<template>
    <div class="container mx-auto px-4">
        <RepoTimeline :blogPosts="blogPosts" />
    </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useBannerContent } from '~/composables/useBannerContent'

const route = useRoute()
const { setBannerContent } = useBannerContent()


const { data: fetchedBlogPosts } = await useAsyncData('taggedPosts', () =>
    $fetch(`/api/repo/${route.params.repo_owner}/${route.params.repo_name}/blog-posts`, {
        params: { tag: route.params.name }
    })
)
const blogPosts = ref([])
// 当数据获取完成后，更新 blogPosts
blogPosts.value = fetchedBlogPosts.value?.blogPosts || []

console.log(blogPosts.value)

setBannerContent(`<h1 class="text-4xl font-extrabold text-center text-white mb-6">Posts tagged with "${route.params.name}"</h1>`)
</script>