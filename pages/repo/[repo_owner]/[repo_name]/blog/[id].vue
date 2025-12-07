<template>
  <div class="min-h-screen bg-path-bg dark:bg-path-dark">
    <!-- Nav Bar -->
    <div class="sticky top-12 sm:top-14 z-40 h-12 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 bg-white/90 dark:bg-path-cardDark/90 backdrop-blur-md">
      <div class="flex items-center">
        <button @click="goBack" class="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
        <div v-if="post" class="ml-4 flex items-center gap-3">
          <img 
            :src="post.avatar_url || 'https://avatars.githubusercontent.com/u/1282277?v=4'" 
            :alt="post.author"
            class="w-8 h-8 rounded-full border border-white dark:border-gray-700 shadow-sm"
          />
          <div class="flex flex-col">
            <span class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ post.author || route.params.repo_owner }}</span>
            <span class="text-[10px] text-gray-400 dark:text-gray-500">{{ formatDate(post.created_at) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Share Button -->
      <ShareButton v-if="post" :post="post as any" :card-selector="`[data-post-id='${post.number}']`" />
    </div>

    <!-- Body -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-2xl mx-auto px-4 py-8" v-if="post">
        <!-- Post Type Badge -->
        <div v-if="isDiary" class="flex items-center gap-2 text-purple-500 mb-6 font-bold text-sm tracking-wide uppercase">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Diary Entry
        </div>

        <!-- Title -->
        <h1 v-if="post.title" class="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {{ post.title }}
        </h1>

        <!-- Body Content -->
        <div 
          class="prose prose-base dark:prose-invert prose-red max-w-none text-gray-700 dark:text-gray-300 font-serif leading-relaxed"
          v-html="renderedBody"
        />

        <!-- Tags -->
        <div v-if="post.labels && post.labels.length > 0" class="mt-8 flex gap-2 flex-wrap">
          <NuxtLink
            v-for="label in normalizedLabels"
            :key="label.name"
            :to="`/repo/${route.params.repo_owner}/${route.params.repo_name}/tag/${label.name}`"
            class="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-medium hover:bg-path-red hover:text-white dark:hover:bg-path-red dark:hover:text-white transition-colors"
          >
            #{{ label.name }}
          </NuxtLink>
        </div>

        <!-- Reactions & Actions -->
        <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <a 
              :href="post.github_url" 
              target="_blank"
              class="text-gray-400 hover:text-path-red transition-colors"
              title="View on GitHub"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <PostReactions v-if="post.reactions" :reactions="normalizedReactions" />
          </div>
          <CommentButton :post-number="post.number" :repo-url="repoUrl" :comment-count="commentCount" />
        </div>
      </div>

      <!-- Comments Section -->
      <div v-if="post" class="bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-gray-800 min-h-[40vh] py-8 px-4">
        <div class="max-w-2xl mx-auto">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
            Comments ({{ commentCount }})
          </h3>
          
          <!-- Comment List -->
          <div v-if="post.comments && post.comments.length > 0" class="space-y-6 mb-8">
            <div v-for="comment in post.comments" :key="comment.id" class="flex gap-3">
              <img 
                :src="comment.user?.avatar_url || 'https://avatars.githubusercontent.com/u/0'" 
                class="w-8 h-8 rounded-full mt-1 border border-white dark:border-gray-700 shadow-sm"
              />
              <div class="bg-white dark:bg-gray-800 p-3 rounded-xl rounded-tl-none shadow-sm text-sm border border-gray-100 dark:border-gray-700 flex-1">
                <div class="font-bold text-gray-800 dark:text-gray-200 mb-1 flex justify-between">
                  {{ comment.user?.login || 'Anonymous' }}
                  <span class="text-gray-300 font-normal text-xs">{{ formatTime(comment.created_at) }}</span>
                </div>
                <p class="text-gray-600 dark:text-gray-400">{{ comment.body }}</p>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-400 dark:text-gray-500 mb-8">
            <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <p class="text-sm">No comments yet. Be the first to comment!</p>
          </div>

          <!-- Comment Input -->
          <CommentBox @comment-submitted="handleCommentSubmission" />
          
          <!-- GitHub Link -->
          <div class="mt-6 text-center">
            <a 
              :href="post.github_url" 
              target="_blank" 
              class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-path-red transition-colors"
            >
              Or comment on GitHub
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Button -->
    <PathFab />
  </div>
</template>

<script setup lang="ts">
import { useAsyncData } from '#app'
import { useRoute, useRouter } from 'vue-router'
import { useNuxtApp } from '#imports'

const route = useRoute()
const router = useRouter()
const { $md } = useNuxtApp()

const { data: postData } = await useAsyncData('post', () =>
  $fetch(`/api/repo/${route.params.repo_owner}/${route.params.repo_name}/issues/${route.params.id}`)
)
const post = ref(postData.value)

const repoUrl = computed(() => `/repo/${route.params.repo_owner}/${route.params.repo_name}`)

const isDiary = computed(() => {
  if (!post.value?.labels) return false
  return post.value.labels.some((l: any) => {
    const name = typeof l === 'string' ? l : l.name
    return name?.toLowerCase() === 'diary'
  })
})

const normalizedLabels = computed(() => {
  if (!post.value?.labels) return []
  return post.value.labels.map((l: any) => {
    if (typeof l === 'string') return { name: l, color: '888888' }
    return { name: l.name || '', color: l.color || '888888' }
  })
})

const normalizedReactions = computed(() => {
  if (!post.value?.reactions) return {}
  const { url, total_count, ...rest } = post.value.reactions as any
  return rest
})

const commentCount = computed(() => post.value?.comments?.length || 0)

const renderedBody = computed(() => {
  if (!post.value?.body) return ''
  return ($md as (text: string) => string)(post.value.body)
})

const truncatedBody = (text: string | null | undefined, length: number) => {
  if (!text) return ""
  const maxLength = length > 0 ? length : 400
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

useHead(() => ({
  title: post.value?.title || 'Post',
  meta: [
    { name: 'description', content: truncatedBody(post.value?.body, 160) },
    { name: 'keywords', content: normalizedLabels.value.map((l: any) => l.name).join(', ') },
    { property: 'og:title', content: post.value?.title || 'Post' },
    { property: 'og:description', content: truncatedBody(post.value?.body, 160) },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `https://momo.gusibi.site/repo/${route.params.repo_owner}/${route.params.repo_name}/blog/${route.params.id}` },
    { name: 'twitter:title', content: post.value?.title || 'Post' },
    { name: 'twitter:description', content: truncatedBody(post.value?.body, 160) },
  ],
  link: [
    { rel: 'canonical', href: `https://momo.gusibi.site/repo/${route.params.repo_owner}/${route.params.repo_name}/blog/${route.params.id}` }
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

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

const goBack = () => {
  router.back()
}

const handleCommentSubmission = async (newComment: any) => {
  if (post.value && post.value.comments) {
    post.value.comments.push(newComment)
  }
}
</script>
