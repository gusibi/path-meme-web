<template>
  <main class="max-w-content mx-auto px-4 py-8">
    <!-- Profile Header -->
    <div class="text-center mb-8">
      <div class="w-20 h-20 mx-auto rounded-full p-1 bg-white dark:bg-gray-800 shadow-xl mb-4">
        <img 
          v-if="post"
          :src="post.avatar_url" 
          :alt="post.author" 
          class="w-full h-full rounded-full object-cover border-4 border-gray-50 dark:border-gray-700"
        />
      </div>
      <h1 v-if="post" class="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-1">{{ post.title }}</h1>
    </div>

    <!-- Content Card -->
    <article v-if="post" class="bg-white dark:bg-path-cardDark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div class="p-6">
        <!-- Labels -->
        <div class="mb-6 flex justify-center">
          <PostLabels :labels="post.labels" :repo-url="post.repo_url" />
        </div>
        
        <!-- Body -->
        <div class="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 font-serif leading-relaxed" v-html="$md(post.body || '')" />
        
        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm">
          <div class="flex items-center gap-4">
            <a 
              :href="post.github_url" 
              target="_blank"
              class="text-gray-400 hover:text-path-red transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <PostReactions :reactions="post.reactions" />
            <span class="text-gray-400 dark:text-gray-500 text-xs">{{ formatDate(post.created_at) }}</span>
          </div>
          <div class="flex items-center gap-3">
            <CommentButton :post-number="post.number" :repo-url="post.repo_url" :comment-count="getCommentCount(post.comments)" />
            <ShareButton :post="post" :card-selector="`[data-post-id='${post.number}']`" />
          </div>
        </div>
      </div>
    </article>

    <!-- Comments Section -->
    <div v-if="post" class="mt-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Comments ({{ getCommentCount(post.comments) }})</h3>
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
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAsyncData } from '#app'
import { useRoute } from 'vue-router'

const route = useRoute()

const { data: postData } = await useAsyncData('post', () =>
  $fetch(`/api/repo/gusibi/path-meme-db/issues/30`)
)
const post = ref(postData.value)

const truncatedBody = (post: string, length: number) => {
  if (!post) return ""
  const maxLength = length > 0 ? length : 400
  if (post.length <= maxLength) return post
  return post.slice(0, maxLength).trim() + '...'
}

useHead(() => ({
  title: post.value?.title,
  meta: [
    { name: 'description', content: truncatedBody(post.value?.body, 160) },
    { name: 'keywords', content: post.value?.labels.map(label => label.name).join(', ') },
    { property: 'og:title', content: post.value?.title },
    { property: 'og:description', content: truncatedBody(post.value?.body, 160) },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `https://momo.gusibi.site/about` },
    { name: 'twitter:title', content: post.value?.title },
    { name: 'twitter:description', content: truncatedBody(post.value?.body, 160) },
  ],
  link: [
    { rel: 'canonical', href: `https://momo.gusibi.site/about` }
  ],
}))

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
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
