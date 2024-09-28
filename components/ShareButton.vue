<template>
    <div>
        <button @click="generatePreview" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            <span class="sr-only">Share</span>
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

onMounted(() => {
    console.log('ShareButton mounted, post data:', props.post)
})

const generatePreview = async () => {
    console.log('Generating preview...')
    if (!mobilePreviewRef.value) {
        console.error("Mobile preview component not found")
        return
    }

    try {
        // Wait for the next DOM update cycle
        await nextTick()

        const mobilePreviewElement = mobilePreviewRef.value.mobilePreview

        if (!mobilePreviewElement) {
            console.error("Mobile preview element is null")
            return
        }

        // Force the mobile preview to be visible for html-to-image
        mobilePreviewElement.style.display = 'block'
        mobilePreviewElement.style.position = 'fixed'
        mobilePreviewElement.style.top = '0'
        mobilePreviewElement.style.left = '0'
        mobilePreviewElement.style.zIndex = '-1000'

        // Wait for any images to load and for the component to be fully rendered
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

        // Hide the mobile preview again
        mobilePreviewElement.style.display = 'none'
        mobilePreviewElement.style.position = 'static'
        mobilePreviewElement.style.zIndex = 'auto'

        isPreviewOpen.value = true
        console.log('Preview generated successfully')
    } catch (error) {
        console.error("Error during image generation:", error)
    }
}
const closePreview = () => {
    isPreviewOpen.value = false
}
</script>