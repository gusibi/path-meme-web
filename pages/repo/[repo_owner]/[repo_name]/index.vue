<template>
    <div>
        <RepoInfo v-if="fetchedBlogPosts && fetchedBlogPosts.repo" :repo="fetchedBlogPosts.repo" :repo-owner="route.params.repo_owner" :repo-name="route.params.repo_name" />
        <RepoTimeline :blogPosts="blogPosts" />
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useBannerContent } from '~/composables/useBannerContent'
import { useRoute } from 'vue-router'

const route = useRoute()

const blogPosts = ref([])
const { setBannerContent } = useBannerContent()

console.log("path: ", `/api/repo/${route.params.repo_owner}/${route.params.repo_name}/blog-posts`)

// 使用 useAsyncData 来获取数据
const { data: fetchedBlogPosts } = await useAsyncData('blogPosts', () =>
    $fetch(`/api/repo/${route.params.repo_owner}/${route.params.repo_name}/blog-posts`)
)
// 当数据获取完成后，更新 blogPosts
blogPosts.value = fetchedBlogPosts.value?.blogPosts || []

// 设置 banner 内容
setBannerContent('<h1 class="text-4xl font-extrabold text-center text-white mb-6">Welcome to My Blog</h1>')
</script>