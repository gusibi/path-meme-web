<template>
  <div>
    <button 
      @click="generatePreview" 
      class="text-gray-400 dark:text-gray-500 hover:text-path-red dark:hover:text-path-red transition-colors"
      title="Share"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
      </svg>
    </button>
    <SharePreviewModal v-if="isPreviewOpen" :preview-image="previewImage" :post-number="post.number" @close="closePreview" />
    <MobilePostPreview ref="mobilePreviewRef" :post="post" v-show="false" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, nextTick, onMounted } from 'vue'
import { toPng } from 'html-to-image'
import SharePreviewModal from './SharePreviewModal.vue'
import MobilePostPreview from './MobilePostPreview.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const isPreviewOpen = ref(false)
const previewImage = ref('')
const mobilePreviewRef = ref(null)

const generatePreview = async () => {
  if (!mobilePreviewRef.value) {
    console.error("Mobile preview component not found")
    return
  }

  try {
    await nextTick()

    const mobilePreviewElement = mobilePreviewRef.value.mobilePreview

    if (!mobilePreviewElement) {
      console.error("Mobile preview element is null")
      return
    }

    mobilePreviewElement.style.display = 'block'
    mobilePreviewElement.style.position = 'fixed'
    mobilePreviewElement.style.top = '0'
    mobilePreviewElement.style.left = '0'
    mobilePreviewElement.style.zIndex = '-1000'

    await new Promise(resolve => setTimeout(resolve, 1000))

    const dataUrl = await toPng(mobilePreviewElement, {
      backgroundColor: '#ffffff',
      width: 390,
      height: mobilePreviewElement.scrollHeight,
      pixelRatio: 2,
      quality: 1,
      cacheBust: true,
    })

    previewImage.value = dataUrl

    mobilePreviewElement.style.display = 'none'
    mobilePreviewElement.style.position = 'static'
    mobilePreviewElement.style.zIndex = 'auto'

    isPreviewOpen.value = true
  } catch (error) {
    console.error("Error during image generation:", error)
  }
}

const closePreview = () => {
  isPreviewOpen.value = false
}
</script>
