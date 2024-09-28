<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md h-full flex flex-col">
      <div class="flex-grow overflow-y-auto p-4">
        <img :src="previewImage" alt="Preview" class="w-full rounded-lg" />
      </div>
      <div class="p-4 border-t">
        <div class="flex flex-wrap justify-between items-center">
          <div class="space-x-2 mb-2">
            <button @click="shareToTwitter" class="bg-blue-400 text-white px-4 py-2 rounded">Twitter</button>
            <button @click="shareToFacebook" class="bg-blue-600 text-white px-4 py-2 rounded">Facebook</button>
            <button @click="shareToLinkedIn" class="bg-blue-700 text-white px-4 py-2 rounded">LinkedIn</button>
          </div>
          <div class="space-x-2">
            <button @click="downloadImage" class="bg-green-500 text-white px-4 py-2 rounded">Download</button>
            <button @click="$emit('close')" class="bg-red-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
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