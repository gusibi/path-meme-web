<template>
    <main class="container max-w-content mx-auto px-4 ">
        <article v-if="post" class="bg-card-light dark:bg-card-dark rounded-lg shadow-xl overflow-hidden">
            <div class="px-6 py-6">
                <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{{ post.title }}</h1>
                <div class="mb-4 flex justify-center items-center text-sm text-gray-600 dark:text-gray-400">
                    <PostLabels :labels="post.labels" />
                </div>
                <div class="prose dark:prose-invert max-w-none" v-html="$md(post.body)" />
                <!-- 底部信息栏 -->
                <div class=" pt-3 flex justify-between items-center text-sm">
                    <!-- 左下角 GitHub 链接 -->
                    <div class="flex items-center space-x-4">
                        <a class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" :href="post.html_url" target="_blank">🔗</a>
                        <PostReactions :reactions="post.reactions" />
                        <span class="text-gray-500 dark:text-gray-400">{{ formatDate(post.created_at, false) }}</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <CommentButton :post-number="post.number" :comment-count="getCommentCount(post.comments)" />
                        <ShareButton :post="post" :card-selector="`[data-post-id='${post.number}']`" />
                    </div>
                </div>
            </div>
        </article>
        <div v-if="post" class="mt-8">
            <h3 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Comments</h3>
            <!-- 使用 CommentBox 组件 -->
            <CommentBox @comment-submitted="handleCommentSubmission" />
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
import { useSupabaseUser } from '#imports'

const user = useSupabaseUser()

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

const getCommentCount = (comments: Array<{
    id: number
    user: { login: string }
    created_at: string
    body: string
}> | undefined): number => {
    if (comments && comments.length > 0) {
        return comments.length
    }
    return 0
}
const handleCommentSubmission = async (commentText: string) => {
    // 实现提交评论的逻辑
    console.log('Submitting comment:', commentText)
    // 这里应该调用 API 来保存评论
    // 保存成功后，可能需要刷新评论列表
}

if (post.value) {
    setBannerContent(`<h1 class="text-4xl font-extrabold text-center text-white mb-6">${post.value.title}</h1>`)
}
</script>