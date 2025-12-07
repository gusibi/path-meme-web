<template>
  <div class="min-h-screen">
    <!-- Tag Header -->
    <div class="relative text-center py-12 px-4">
      <div class="animate-bounce-soft">
        <div class="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 shadow-inner border border-gray-200 dark:border-gray-700">
          <svg class="w-8 h-8 text-path-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">#{{ route.params.name }}</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">{{ blogPosts?.length || 0 }} posts tagged</p>
      </div>
    </div>

    <!-- Timeline Content -->
    <div class="max-w-content mx-auto pb-8 px-4 relative">
      <!-- The Vertical Line (Desktop only) -->
      <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-path-line dark:bg-path-lineDark -z-10 hidden sm:block"></div>

      <!-- Posts -->
      <div class="space-y-6">
        <article 
          v-for="(post, index) in blogPosts" 
          :key="post.id"
          class="relative pl-0 sm:pl-12 group transition-transform hover:-translate-y-1 duration-200"
        >
          <!-- Timeline Dot (Desktop only) -->
          <div 
            class="absolute left-[27px] top-6 w-3 h-3 rounded-full border-2 border-path-bg dark:border-path-dark shadow-sm z-10 hidden sm:block"
            :style="{ backgroundColor: getLabelColor(post.labels) }"
          ></div>

          <!-- Card -->
          <div class="bg-white dark:bg-path-cardDark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <!-- Mobile Header (Date) -->
            <div class="sm:hidden px-4 pt-3 flex items-center text-xs text-path-subtle font-bold uppercase tracking-wider">
              {{ formatDateMobile(post.created_at) }}
            </div>

            <NuxtLink :to="post.html_url" class="block cursor-pointer">
              <div class="p-5">
                <div class="flex flex-wrap items-center gap-2 mb-3">
                  <PostLabels :labels="post.labels" :repo-url="post.repo_url" />
                </div>
                <h2 
                  v-if="!isMemePost(post.labels)" 
                  class="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight hover:text-path-red transition-colors"
                >
                  {{ post.title }}
                </h2>
                <div class="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 line-clamp-3" v-html="$md(truncatedBody(post.body))" />
              </div>
            </NuxtLink>

            <div class="bg-gray-50 dark:bg-black/20 px-5 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
              <div class="flex items-center gap-4 text-gray-400 text-xs font-medium">
                <PostReactions :reactions="post.reactions" />
              </div>
              <div class="flex items-center gap-3">
                <CommentButton :post-number="post.number" :repo-url="post.repo_url" :comment-count="post.comments || 0" />
                <ShareButton :post="post" :repo-url="post.repo_url" />
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Floating Action Button -->
    <PathFab />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const { data: blogPosts } = await useAsyncData('taggedPosts', () =>
  $fetch('/api/tag-posts', {
    params: { tag: route.params.name }
  })
)

const formatDateMobile = (dateString: string) => {
  const date = new Date(dateString)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${months[date.getMonth()]} ${date.getDate()} • ${hour12}:${minutes} ${ampm}`
}

const truncatedBody = (post: string) => {
  if (!post) return ""
  const maxLength = 300
  if (post.length <= maxLength) return post
  return post.slice(0, maxLength).trim() + '...'
}

const getLabelColor = (labels: Array<{ color: string }>) => {
  return labels.length > 0 ? `#${labels[0].color}` : '#3b82f6'
}

const isMemePost = (labels: Array<{ name: string }>): boolean => {
  return labels.some(label => label.name.toLowerCase() === 'meme')
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
