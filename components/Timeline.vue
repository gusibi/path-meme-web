<template>
  <div class="container max-w-content mx-auto px-4">
    <div class="space-y-8">
      <article v-for="post in blogPosts" class="bg-card-light dark:bg-card-dark rounded-lg shadow-xl overflow-hidden">
        <div class="px-6">
          <div class="pt-4 flex justify-between items-center text-sm">
            <div class="flex items-center space-x-4">
              <PostLabels :labels="post.labels" :repo-url="post.repo_url" />
            </div>
            <div class="flex items-center space-x-4">
              <PostReactions :reactions="post.reactions" class="" />
            </div>
          </div>
          <div class="py-3">
            <h1 v-if="!isMemePost(post.labels)" class="text-xl font-medium">
              <NuxtLink :to="`${post.html_url}`" class="hover:underline">{{ post.title }}</NuxtLink>
            </h1>
            <div class="prose dark:prose-invert max-w-none" v-html="$md(truncatedBody(post.body))" />
          </div>
          <!-- 底部信息栏 -->
          <div class="pb-6 pt-3 flex justify-between items-center text-sm">
            <!-- 左下角 GitHub 链接 -->
            <div class="flex items-center space-x-4">
              <a class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" :href="post.github_url" target="_blank">🔗</a>
              <span class="text-gray-500 dark:text-gray-400">{{ formatDate(post.created_at, false) }}</span>
            </div>
            <div class="flex items-center space-x-4">
              <CommentButton :post-number="post.number" :repo-url="post.repo_url" :comment-count="post.comments || 0" />
              <ShareButton :post="post" :repo-url="post.repo_url" :card-selector="`[data-post-id='${post.number}']`" />
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import ShareModal from '~/components/ShareButton.vue'

interface BlogPost {
  id: number
  number: number
  title: string
  body: string
  created_at: string
  reactions: Record<string, number>
  comments: number
  html_url: string
  labels: Array<{ color: string; name: string }>
}

const props = defineProps({
  blogPosts: {
    type: Array as PropType<BlogPost[]>,
    required: true,
    default: () => []  // 添加默认值
  }
})

const selectedPost = ref<BlogPost | null>(null)
const isShareModalOpen = ref(false)

const openShareModal = (post: BlogPost) => {
  selectedPost.value = post
  isShareModalOpen.value = true
}

const closeShareModal = () => {
  isShareModalOpen.value = false
  selectedPost.value = null
}

const formatDate = (dateString: string, showYear = false) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  if (showYear) {
    return `${year}-${month}-${day} ${hours}:${minutes}`
  } else {
    return `${month}-${day} ${hours}:${minutes}`
  }
}

const truncatedBody = (post: string) => {
  const maxLength = 400;
  if (post.length <= maxLength) {
    return post;
  }
  return post.slice(0, maxLength).trim() + '...';
}

const renderLabels = (labels: Array<{ color: string; name: string }>) => {
  return labels.map(label => ({
    color: `#${label.color}`,
    name: label.name,
    displayName: label.name.length > 10 ? label.name.substring(0, 10) + '...' : label.name
  }))
}

const getLabelColor = (labels: Array<{ color: string }>) => {
  return labels.length > 0 ? `#${labels[0].color}` : '#ccc'
}

const getFirstLabelChar = (labels: Array<{ name: string }>) => {
  return labels.length > 0 ? labels[0].name.charAt(0) : '•'
}

const isMemePost = (labels: Array<{ name: string }>): boolean => {
  return labels.some(label => label.name.toLowerCase() === 'meme')
}


</script>