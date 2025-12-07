<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-bounce-soft">
    <div class="w-full max-w-sm bg-white dark:bg-path-cardDark rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
      
      <!-- Header -->
      <div class="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-2 text-path-red font-bold font-serif">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
          </svg>
          Share Moment
        </div>
        <button @click="$emit('close')" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Scrollable Preview Area -->
      <div class="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-black/40 flex justify-center">
        <!-- The Capture Target -->
        <div 
          ref="cardRef" 
          class="bg-[#FBF8F5] p-6 shadow-xl rounded-sm w-full relative"
          style="min-height: 300px;"
        >
          <!-- Paper Texture/Style Header -->
          <div class="flex items-center gap-3 mb-4">
            <img 
              :src="post.author_avatar || 'https://github.com/github.png'" 
              class="w-12 h-12 rounded-full border-2 border-white shadow-sm" 
              crossorigin="anonymous" 
              alt="Avatar"
            />
            <div>
              <div class="font-bold text-gray-800 text-lg font-serif">{{ post.author || 'Anonymous' }}</div>
              <div class="text-xs text-gray-500 uppercase tracking-widest font-bold">
                {{ formatDate(post.created_at) }}
              </div>
            </div>
          </div>

          <!-- Title -->
          <h2 
            v-if="post.title && !isMemePost(post.labels)" 
            class="text-2xl font-serif font-bold text-path-red mb-3 leading-tight"
          >
            {{ post.title }}
          </h2>

          <!-- Body Content -->
          <div 
            class="prose prose-sm prose-p:text-gray-700 prose-headings:text-gray-800 font-serif mb-8 line-clamp-10" 
            v-html="renderedBody"
          />

          <!-- Footer -->
          <div class="border-t border-gray-200 pt-3 flex justify-between items-center mt-auto">
            <span class="font-sans font-bold text-gray-400 text-xs tracking-widest">PATH MEME</span>
            <div class="w-4 h-4 rounded-full bg-path-red"></div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-6 bg-white dark:bg-path-cardDark border-t border-gray-100 dark:border-gray-700 space-y-3">
        <button 
          @click="handleDownload"
          :disabled="loading"
          class="w-full py-3 bg-path-red hover:bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-70"
        >
          <template v-if="loading">Generating...</template>
          <template v-else>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Save Image
          </template>
        </button>
        
        <div class="flex gap-3">
          <button 
            @click="handleTwitterShare"
            class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Twitter
          </button>
          <button 
            @click="handleFacebookShare"
            class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import html2canvas from 'html2canvas'

interface Post {
  number: number
  title?: string
  body?: string
  author?: string
  author_avatar?: string
  created_at?: string
  labels?: Array<{ name: string; color: string }>
}

const props = defineProps<{
  post: Post
}>()

defineEmits(['close'])

const cardRef = ref<HTMLDivElement | null>(null)
const loading = ref(false)

const { $md } = useNuxtApp()

const renderedBody = computed(() => {
  const body = props.post?.body || ''
  const maxLength = 500
  const truncated = body.length <= maxLength ? body : body.slice(0, maxLength).trim() + '...'
  return $md ? $md(truncated) : truncated
})

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

const isMemePost = (labels?: Array<{ name: string }>): boolean => {
  if (!labels) return false
  return labels.some(label => label.name.toLowerCase() === 'meme')
}

const handleDownload = async () => {
  if (!cardRef.value) return
  loading.value = true
  try {
    const canvas = await html2canvas(cardRef.value, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: false
    })
    const link = document.createElement('a')
    link.download = `path-moment-${props.post.number}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (err) {
    console.error('Failed to generate image', err)
  } finally {
    loading.value = false
  }
}

const shareText = computed(() => `Check out this moment on Path Meme: ${props.post?.title || 'My Post'} #PathMeme`)
const shareUrl = computed(() => typeof window !== 'undefined' ? window.location.href : '')

const handleTwitterShare = () => {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText.value)}&url=${encodeURIComponent(shareUrl.value)}`, '_blank')
}

const handleFacebookShare = () => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`, '_blank')
}
</script>

<style scoped>
.line-clamp-10 {
  display: -webkit-box;
  -webkit-line-clamp: 10;
  line-clamp: 10;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
