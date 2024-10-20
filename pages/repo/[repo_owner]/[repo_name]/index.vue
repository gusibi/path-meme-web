<template>
    <div>
        <!-- <RepoInfo v-if="repoInfo" :repo="repoInfo" :repo-owner="route.params.repo_owner" :repo-name="route.params.repo_name" /> -->
        <RepoTimeline :blogPosts="blogPosts" :current-page="currentPage" :total-items="totalItems" :per-page="perPage" @page-change="onPageChange" />
    </div>
</template>
<script setup lang="ts">
import { h, render, createApp } from 'vue'
import { useBannerContentInjection } from '~/composables/useBannerContent'
import RepoInfo from '~/components/RepoInfoHtml.vue'
const { setShowBanner, setBannerContent } = useBannerContentInjection()
import { useRoute, useRouter, RouterLink } from 'vue-router'

const route = useRoute()
const router = useRouter()


const config = useRuntimeConfig()
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

// Create a wrapper component that includes RouterLink
const WrappedRepoInfo = defineComponent({
    components: { RepoInfo },
    render() {
        return h(RepoInfo, {
            repo: repoInfo.value,
            repoOwner: route.params.repo_owner,
            repoName: route.params.repo_name
        })
    }
})

const app = createApp(WrappedRepoInfo)

// Add the router to the app
app.use(router)

const container = document.createElement('div')
app.mount(container)
// 使用 nextTick 确保组件已经渲染
nextTick(() => {
    setBannerContent(container.innerHTML)
    app.unmount()
})
// Handle page changes
const onPageChange = async (page: number) => {
    await fetchBlogPosts(page)
}
// Set banner content
setShowBanner(true)
</script>