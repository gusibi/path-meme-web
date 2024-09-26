<template>
    <main class="container max-w-content mx-auto px-4 py-8">
        <article v-if="post" class="bg-card-light dark:bg-card-dark rounded-lg shadow-xl overflow-hidden">
            <div class="px-6 py-8">
                <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{{ post.title }}</h1>
                <div class="mb-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span class="mr-4">{{ formatDate(post.created_at, true) }}</span>
                    <PostLabels :labels="post.labels" />
                </div>
                <div class="prose dark:prose-invert max-w-none" v-html="$md(post.body)" />
                <PostReactions :reactions="post.reactions" class="mt-6" />
            </div>
        </article>
        <div v-if="post" class="mt-8">
            <h3 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Comments</h3>
            <div v-if="post.comments && post.comments.length > 0">
                <PostComment v-for="comment in post.comments" :key="comment.id" :comment="comment" />
            </div>
            <p v-else class="text-gray-600 dark:text-gray-400">No comments yet.</p>
        </div>
        <NuxtLink v-if="post" :to="post.html_url" target="_blank" class="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"> Comment on GitHub </NuxtLink>
    </main>
</template>
<script setup lang="ts">
import { useAsyncData } from '#app'
import { useRoute } from 'vue-router'
import { useBannerContent } from '~/composables/useBannerContent'

const route = useRoute()
const { setBannerContent } = useBannerContent()

const { data: post } = await useAsyncData('post', () =>
    $fetch(`/api/blog-posts/${route.params.id}`)
)

const formatDate = (dateString: string, showYear = false) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
        year: showYear ? 'numeric' : undefined,
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }
    return new Intl.DateTimeFormat('en-US', options).format(date)
}

if (post.value) {
    setBannerContent(`<h1 class="text-4xl font-extrabold text-center text-white mb-6">${post.value.title}</h1>`)
}
</script>