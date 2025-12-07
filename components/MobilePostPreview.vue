<template>
  <div 
    ref="mobilePreview" 
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
      v-html="$md(truncatedBody(post.body))"
    />

    <!-- Footer -->
    <div class="border-t border-gray-200 pt-3 flex justify-between items-center mt-auto">
      <span class="font-sans font-bold text-gray-400 text-xs tracking-widest">PATH MEME</span>
      <div class="w-4 h-4 rounded-full bg-path-red"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const mobilePreview = ref<HTMLElement | null>(null)

const postUrl = computed(() => {
  return `${config.public.siteUrl}/blog/${props.post.number}`
})

const isMemePost = (labels: Array<{ name: string }>): boolean => {
  if (!labels) return false
  return labels.some(label => label.name.toLowerCase() === 'meme')
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

const truncatedBody = (body: string) => {
  if (!body) return ''
  const maxLength = 500
  if (body.length <= maxLength) return body
  return body.slice(0, maxLength).trim() + '...'
}

defineExpose({ mobilePreview })
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
