<template>
  <div class="max-w-content mx-auto pb-8 px-4 relative">
    <!-- The Vertical Line (Desktop only) -->
    <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-path-line dark:bg-path-lineDark -z-10 hidden sm:block"></div>

    <!-- Posts -->
    <div class="space-y-6">
      <article 
        v-for="post in blogPosts" 
        :key="post.id"
        class="relative pl-0 sm:pl-12 group transition-transform hover:-translate-y-1 duration-200"
      >
        <!-- Timeline Dot (Desktop only) -->
        <div 
          class="absolute left-[27px] top-6 w-3 h-3 rounded-full border-2 border-path-bg dark:border-path-dark shadow-sm z-10 hidden sm:block"
          :style="{ backgroundColor: getLabelColor(post.labels) }"
        ></div>

        <!-- Timestamp Floating (Desktop only) -->
        <div class="absolute -left-20 top-5 w-24 text-right pr-4 hidden sm:block">
          <span class="text-xs font-bold text-path-subtle font-sans">
            {{ formatDateShort(post.created_at) }}
          </span>
          <div class="text-[10px] text-gray-400 dark:text-gray-600">
            {{ formatTime(post.created_at) }}
          </div>
        </div>

        <!-- Card -->
        <div class="bg-white dark:bg-path-cardDark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden relative">
          
          <!-- Mobile Header (Date) -->
          <div class="sm:hidden px-4 pt-3 flex items-center text-xs text-path-subtle font-bold uppercase tracking-wider">
            {{ formatDateMobile(post.created_at) }}
          </div>

          <!-- Clickable Area for Detail -->
          <NuxtLink :to="post.html_url" class="block cursor-pointer">
            <div class="p-5">
              <!-- Labels / Tags -->
              <div class="flex flex-wrap items-center gap-2 mb-3">
                <PostLabels :labels="post.labels" :repo-url="post.repo_url" />
              </div>

              <!-- Title -->
              <h2 
                v-if="!isMemePost(post.labels)" 
                class="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight hover:text-path-red transition-colors"
              >
                {{ post.title }}
              </h2>

              <!-- Body Preview -->
              <div class="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 line-clamp-3" v-html="$md(truncatedBody(post.body))" />
            </div>
          </NuxtLink>

          <!-- Footer -->
          <div class="bg-gray-50 dark:bg-black/20 px-5 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
            <div class="flex items-center gap-4 text-gray-400 text-xs font-medium">
              <PostReactions :reactions="post.reactions" />
            </div>
            <div class="flex items-center gap-3">
              <CommentButton :post-number="post.number" :repo-url="post.repo_url" :comment-count="post.comments || 0" />
              <ShareButton :post="post" :repo-url="post.repo_url" :card-selector="`[data-post-id='${post.number}']`" />
              <a 
                :href="post.github_url" 
                target="_blank"
                class="text-gray-400 hover:text-path-red transition-colors"
                title="View on GitHub"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </article>

      <!-- Loading / Load More / End State -->
      <div class="py-12 flex flex-col items-center justify-center gap-4">
        <!-- Loading -->
        <div v-if="loading" class="w-8 h-8 border-2 border-path-red border-t-transparent rounded-full animate-spin"></div>
        
        <!-- Load More Button -->
        <button 
          v-else-if="hasMore"
          @click="loadMore"
          class="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-path-cardDark border border-gray-200 dark:border-gray-700 rounded-full text-gray-500 dark:text-gray-400 text-sm font-bold shadow-sm hover:shadow-md hover:border-path-red dark:hover:border-path-red hover:text-path-red dark:hover:text-path-red transition-all active:scale-95"
        >
          <svg class="w-4 h-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
          <span>加载更多</span>
        </button>
        
        <!-- End of Content -->
        <div v-else-if="blogPosts.length > 0" class="flex items-center gap-2 text-gray-300 dark:text-gray-600 opacity-60">
          <div class="w-1 h-1 rounded-full bg-current"></div>
          <span class="font-serif italic text-sm">End of path</span>
          <div class="w-1 h-1 rounded-full bg-current"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface BlogPost {
  id: number
  number: number
  title: string
  body: string
  created_at: string
  reactions: Record<string, number>
  comments: number
  html_url: string
  github_url: string
  repo_url: string
  labels: Array<{ color: string; name: string }>
}

const props = defineProps({
  repoOwner: { type: String, required: true },
  repoName: { type: String, required: true },
  tag: { type: String, default: '' },
  dataKey: { type: String, default: 'blogPosts' }
})

const config = useRuntimeConfig()
const perPage = parseInt(config.public.perPageSize as string) || 20

const blogPosts = ref<BlogPost[]>([])
const currentPage = ref(1)
const totalItems = ref(0)
const loading = ref(false)

const hasMore = computed(() => blogPosts.value.length < totalItems.value)

const fetchBlogPosts = async (page = 1, append = false) => {
  loading.value = true
  try {
    const params: Record<string, any> = { page, perPage }
    if (props.tag) params.tag = props.tag

    let fetchedData: any
    if (!append) {
      const { data } = await useAsyncData(`${props.dataKey}-${props.tag || 'all'}-${page}`, () =>
        $fetch(`/api/repo/${props.repoOwner}/${props.repoName}/blog-posts`, { params })
      )
      fetchedData = data.value
    } else {
      fetchedData = await $fetch(`/api/repo/${props.repoOwner}/${props.repoName}/blog-posts`, { params })
    }

    if (append) {
      blogPosts.value = [...blogPosts.value, ...(fetchedData?.blogPosts || [])]
    } else {
      blogPosts.value = fetchedData?.blogPosts || []
    }
    totalItems.value = fetchedData?.pagination?.totalItems || 0
    currentPage.value = page
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  await fetchBlogPosts(currentPage.value + 1, true)
}

// 初始加载
await fetchBlogPosts()

// 暴露数据给父组件
defineExpose({ blogPosts, totalItems, loading })

const formatDateShort = (dateString: string) => {
  const date = new Date(dateString)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getDate()}`
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

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
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
