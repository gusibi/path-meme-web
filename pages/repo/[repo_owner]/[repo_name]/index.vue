<template>
    <div>
        <RepoInfo v-if="repoInfo" :repo="repoInfo" :repo-owner="route.params.repo_owner" :repo-name="route.params.repo_name" />
        <RepoTimeline :blogPosts="blogPosts" :current-page="currentPage" :total-items="totalItems" :per-page="perPage" @page-change="onPageChange" />
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBannerContentInjection } from '~/composables/useBannerContent'
const { setBannerContent } = useBannerContentInjection()
const config = useRuntimeConfig()
import { useRoute } from 'vue-router'

const route = useRoute()


const blogPosts = ref([])
const repoInfo = ref({})
const currentPage = ref(1)
const totalItems = ref(0)
const perPage = ref(parseInt(config.public.perPageSize) || 20)

const fetchBlogPosts = async (page = 1) => {
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
}

// Fetch initial data
await fetchBlogPosts()

// console.log(totalItems.value, perPage.value, currentPage.value)

// Handle page changes
const onPageChange = async (page: number) => {
    await fetchBlogPosts(page)
}
// 设置 banner 内容
setBannerContent('')
</script>