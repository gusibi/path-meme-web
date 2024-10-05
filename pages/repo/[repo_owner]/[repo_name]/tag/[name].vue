<template>
    <div class="container mx-auto px-4">
        <RepoTimeline :blogPosts="blogPosts" :current-page="currentPage" :total-items="totalItems" :per-page="perPage" @page-change="onPageChange" />
    </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useBannerContentInjection } from '~/composables/useBannerContent'
const { setBannerContent, setBannerImage } = useBannerContentInjection()

const route = useRoute()
const config = useRuntimeConfig()

const blogPosts = ref([])
const currentPage = ref(1)
const totalItems = ref(0)
const perPage = ref(parseInt(config.public.perPageSize) || 20)

const fetchBlogPosts = async (page = 1) => {
    const { data: fetchedData } = await useAsyncData('blogPosts', () =>
        $fetch(`/api/repo/${config.public.repoOwner}/${config.public.repoName}/blog-posts`, {
            params: { page, perPage: perPage.value, tag: route.params.name }
        })
    )

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

setBannerContent(`<h1 class="text-4xl font-extrabold text-center text-white mb-6">Posts tagged with "${route.params.name}"</h1>`)
setBannerImage("/banner3.jpeg")

</script>