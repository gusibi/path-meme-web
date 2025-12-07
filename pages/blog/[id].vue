<template>
  <main class="max-w-content mx-auto px-4 py-8">
    <!-- Article Card -->
    <article v-if="post" class="bg-white dark:bg-path-cardDark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden animate-bounce-soft">
      <div class="p-6 sm:p-8">
        <!-- Labels -->
        <div class="flex flex-wrap items-center gap-2 mb-4">
          <PostLabels :labels="post.labels" />
        </div>

        <!-- Title -->
        <h1 class="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {{ post.title }}
        </h1>

        <!-- Author & Date -->
        <div class="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <img 
            :src="post.avatar_url || 'https://avatars.githubusercontent.com/u/1282277?v=4'" 
            :alt="post.author" 
            class="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
          />
          <div>
            <div class="font-medium text-gray-800 dark:text-gray-200 text-sm">{{ post.author || 'gusibi' }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-500">{{ formatDate(post.created_at) }}</div>
          </div>
        </div>

        <!-- Body -->
        <div class="prose prose-lg dark:prose-invert prose-red max-w-none text-gray-700 dark:text-gray-300 font-serif leading-relaxed" v-html="$md(post.body || '')" />

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <a 
              :href="post.html_url" 
              target="_blank"
              class="text-gray-400 hover:text-path-red transition-colors"
              title="View on GitHub"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <PostReactions :reactions="post.reactions" />
          </div>
          <div class="flex items-center gap-3">
            <CommentButton :post-number="post.number" :comment-count="getCommentCount(post.comments)" />
            <ShareButton :post="post" :card-selector="`[data-post-id='${post.number}']`" />
          </div>
        </div>
      </div>
    </article>

    <!-- Comments Section -->
    <div v-if="post" class="mt-8 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">
          Comments ({{ getCommentCount(post.comments) }})
        </h3>
        <a 
          :href="post.html_url" 
          target="_blank" 
          class="inline-flex items-center gap-2 px-4 py-2 bg-path-red hover:bg-red-600 text-white font-medium rounded-full text-sm transition-colors shadow-md"
        >
          Comment on GitHub
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </a>
      </div>
      
      <CommentBox @comment-submitted="handleCommentSubmission" />
      
      <div v-if="post.comments && post.comments.length > 0" class="space-y-4 mt-6">
        <PostComment v-for="comment in post.comments" :key="comment.id" :comment="comment" />
      </div>
      
      <div v-else class="text-center py-8 text-gray-400 dark:text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
        <p class="text-sm">No comments yet. Be the first to comment!</p>
      </div>
    </div>

    <!-- Floating Action Button -->
    <PathFab />
  </main>
</template>

<script setup lang="ts">
import { useAsyncData } from '#app'
import { useRoute } from 'vue-router'

const route = useRoute()

const { data: postData } = await useAsyncData('post', () =>
  $fetch(`/api/blog-posts/${route.params.id}`)
)
const post = ref(postData.value)

const truncatedBody = (text: string, length: number) => {
  if (!text) return ""
  const maxLength = length > 0 ? length : 400
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

useHead(() => ({
  title: post.value?.title,
  meta: [
    { name: 'description', content: truncatedBody(post.value?.body, 160) },
    { name: 'keywords', content: post.value?.labels?.map(label => label.name).join(', ') },
    { property: 'og:title', content: post.value?.title },
    { property: 'og:description', content: truncatedBody(post.value?.body, 160) },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `https://momo.gusibi.site/blog/${route.params.id}` },
    { name: 'twitter:title', content: post.value?.title },
    { name: 'twitter:description', content: truncatedBody(post.value?.body, 160) },
  ],
  link: [
    { rel: 'canonical', href: `https://momo.gusibi.site/blog/${route.params.id}` }
  ],
}))

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const getCommentCount = (comments: any[] | undefined): number => {
  return comments?.length || 0
}

const handleCommentSubmission = async (newComment: any) => {
  if (post.value && post.value.comments) {
    post.value.comments.push(newComment)
  }
}
</script>
