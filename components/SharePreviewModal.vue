<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md h-full flex flex-col">
      <div class="flex-grow overflow-y-auto p-4">
        <img :src="previewImage" alt="Preview" class="w-full rounded-lg shadow-lg" />
      </div>
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share or Download</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Share to:</h4>
            <div class="flex space-x-2">
              <SocialShare v-for="network in ['facebook', 'twitter', 'linkedin', 'email']" :key="network" :network="network" :styled="true" :label="false" class="p-2 rounded" />
            </div>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Download:</h4>
            <button @click="downloadImage" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300"> Download Image </button>
          </div>
        </div>
        <button @click="$emit('close')" class="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-300"> Close </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  previewImage: String,
  postNumber: Number,
})

defineEmits(['close'])

const downloadImage = () => {
  const link = document.createElement('a')
  link.href = props.previewImage
  link.download = `shared-post-${props.postNumber}.png`
  link.click()
}

const shareToTwitter = () => {
  const text = 'Check out this post!'
  const url = 'https://yourdomain.com/blog/' + props.postNumber
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
}

const shareToFacebook = () => {
  const url = 'https://yourdomain.com/blog/' + props.postNumber
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
}

const shareToLinkedIn = () => {
  const url = 'https://yourdomain.com/blog/' + props.postNumber
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
}
</script>