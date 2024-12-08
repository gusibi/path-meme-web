<template>
    <main class="container max-w-content mx-auto px-4 ">
        <article v-if="post" class="bg-card-light dark:bg-card-dark rounded-lg shadow-xl overflow-hidden">
            <div class="px-6 py-6">
                <!-- <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{{ post.title }}</h1> -->
                <div class="mb-4 flex justify-center items-center text-sm text-gray-600 dark:text-gray-400">
                    <PostLabels :labels="post.labels" :repo-url="post.repo_url" />
                </div>
                <div class="prose dark:prose-invert max-w-none" v-html="$md(post.body || '')" />
                <!-- 底部信息栏 -->
                <div class=" pt-3 flex justify-between items-center text-sm">
                    <!-- 左下角 GitHub 链接 -->
                    <div class="flex items-center space-x-4">
                        <a class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" :href="post.github_url" target="_blank">🔗</a>
                        <PostReactions :reactions="post.reactions" />
                        <span class="text-gray-500 dark:text-gray-400">{{ formatDate(post.created_at, false) }}</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <CommentButton :post-number="post.number" :repo-url="post.repo_url" :comment-count="getCommentCount(post.comments)" />
                        <ShareButton :post="post" :card-selector="`[data-post-id='${post.number}']`" />
                    </div>
                </div>
            </div>
        </article>
        <div v-if="post" class="mt-8">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Comments</h3>
                <NuxtLink v-if="post" :to="post.html_url" target="_blank" class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium rounded-lg text-sm transition duration-300 ease-in-out"> Comment on GitHub <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                </NuxtLink>
            </div>
            <!-- 使用 CommentBox 组件 -->
            <CommentBox @comment-submitted="handleCommentSubmission" />
            <div v-if="post.comments && post.comments.length > 0">
                <PostComment v-for="comment in post.comments" :key="comment.id" :comment="comment" />
            </div>
        </div>
    </main>
</template>
<script setup lang="ts">
import { h, render, createApp } from 'vue'
import { useAsyncData } from '#app'
import { useRoute } from 'vue-router'
import { useSupabaseUser } from '#imports'
import { useBannerContentInjection } from '~/composables/useBannerContent'
const { setBannerContent, setBannerImage, setShowBanner } = useBannerContentInjection()
import PostRepoInfo from '~/components/PostRepoInfo.vue'

const user = useSupabaseUser()

const route = useRoute()

const { data: postData } = await useAsyncData('post', () =>
    $fetch(`/api/repo/${route.params.repo_owner}/${route.params.repo_name}/issues/${route.params.id}`)
)
const post = ref(postData.value)

const truncatedBody = (post: string, length: number) => {
    if (!post) {
        return ""
    }
    let maxLength = 400;
    if (length > 0) {
        maxLength = length
    }
    if (post.length <= maxLength) {
        return post;
    }
    return post.slice(0, maxLength).trim() + '...';
}


// console.log("post", post.value)
// console.log("reactions", post.value.reactions)
// console.log("comment: ", post.value.comments)
// SEO优化
useHead(() => ({
    title: post.value?.title,
    meta: [
        { name: 'description', content: truncatedBody(post.value?.body, 160) },
        { name: 'keywords', content: post.value?.labels.map(label => label.name).join(', ') },
        // Open Graph
        { property: 'og:title', content: post.value?.title },
        { property: 'og:description', content: truncatedBody(post.value?.body, 160) },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: `https://momo.gusibi.mobi/blog/${route.params.id}` },
        // Twitter Card
        { name: 'twitter:title', content: post.value?.title },
        { name: 'twitter:description', content: truncatedBody(post.value?.body, 160) },
    ],
    link: [
        { rel: 'canonical', href: `https://momo.gusibi.mobi/blog/${route.params.id}` }
    ],
}))


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
const handleCommentSubmission = async (newComment: any) => {
    if (post.value && post.value.comments) {
        // 添加新评论到评论列表
        post.value.comments.push(newComment)
        // 更新评论计数
        post.value.comments_count = (post.value.comments_count || 0) + 1
    }
}

if (post.value) {
    const app = createApp({
        render() {
            return h(PostRepoInfo, {
                repoOwner: route.params.repo_owner,
                repoName: route.params.repo_name,
                title: post.value.title,
                avatarUrl: post.value.avatar_url,
                author: post.value.author,
                createdAt: post.value.created_at
            })
        }
    })
    const container = document.createElement('div')
    app.mount(container)
    // 使用 nextTick 确保组件已经渲染
    nextTick(() => {
        setBannerContent(container.innerHTML)
        app.unmount()
    })
    setBannerImage('/banner3.jpeg')
    setShowBanner(true)
}
</script>
