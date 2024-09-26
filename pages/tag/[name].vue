<template>
    <div class="container mx-auto px-4">
        <Timeline :blogPosts="blogPosts" />
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBannerContent } from '~/composables/useBannerContent'

interface BlogPost {
    id: number
    title: string
    body: string
    created_at: string
    reactions: Record<string, number>
    comments: number
    html_url: string
    labels: Array<{ color: string; name: string }>
}

const route = useRoute()
const blogPosts = ref<BlogPost[]>([])
const { setBannerContent } = useBannerContent()

onMounted(async () => {
    const config = useRuntimeConfig()
    try {
        blogPosts.value = await $fetch(`${config.public.apiBaseUrl}/api/blog-posts`, {
            params: { tag: route.params.name }
        })
        setBannerContent(`<h1 class="text-4xl font-extrabold text-center text-white mb-6">Posts tagged with "${route.params.name}"</h1>`)
    } catch (error) {
        console.error('Error:', error)
        blogPosts.value = []
    }
})
</script>