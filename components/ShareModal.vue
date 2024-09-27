<template>
</template>
<!-- <template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div class="p-6">
                <h2 class="text-2xl font-bold mb-4">Share Post</h2>
                <div ref="shareImageContainer" class="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg mb-4">
                    <h3 class="text-xl font-bold text-white mb-2">{{ post.title }}</h3>
                    <p class="text-white mb-4">{{ truncateBody(post.body, 100) }}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-white">{{ formatDate(post.created_at) }}</span>
                        <span class="text-sm text-white">{{ post.html_url }}</span>
                    </div>
                </div>
                <div class="flex flex-wrap justify-center gap-2 mb-4">
                    <button @click="generateAndDownloadImage" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"> Save Image </button>
                </div>
                <div class="flex flex-wrap justify-center gap-2">
                    <SocialShare :url="post.html_url" :title="post.title" :description="truncateBody(post.body, 100)" :quote="post.title" :hashtags="getHashtags(post.labels)" class="flex gap-2">
                        <template #default="{ url }">
                            <a :href="url.facebook" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> Facebook </a>
                            <a :href="url.twitter" target="_blank" class="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"> Twitter </a>
                            <a :href="url.linkedin" target="_blank" class="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"> LinkedIn </a>
                            <a :href="url.whatsapp" target="_blank" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"> WhatsApp </a>
                        </template>
                    </SocialShare>
                </div>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                <button @click="$emit('close')" class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"> Close </button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { toPng } from 'html-to-image'

const props = defineProps({
    post: {
        type: Object,
        required: true
    },
    isOpen: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['close'])

const shareImageContainer = ref(null)

const truncateBody = (body: string, maxLength: number) => {
    if (body.length <= maxLength) return body
    return body.slice(0, maxLength) + '...'
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
}

const getHashtags = (labels: Array<{ name: string }>) => {
    return labels.map(label => label.name).join(',')
}

const generateImage = async () => {
    if (shareImageContainer.value) {
        return await toPng(shareImageContainer.value, { quality: 0.95 })
    }
    return null
}

const generateAndDownloadImage = async () => {
    const dataUrl = await generateImage()
    if (dataUrl) {
        const link = document.createElement('a')
        link.download = 'shared-post.png'
        link.href = dataUrl
        link.click()
    }
}

const generateAndShareImage = async () => {
    const dataUrl = await generateImage()
    if (dataUrl) {
        if (navigator.share) {
            const blob = await (await fetch(dataUrl)).blob()
            const file = new File([blob], 'shared-post.png', { type: 'image/png' })
            navigator.share({
                title: props.post.title,
                text: truncateBody(props.post.body, 100),
                url: props.post.html_url,
                files: [file]
            }).catch(console.error)
        } else {
            // Fallback for browsers that don't support Web Share API
            window.open(dataUrl)
        }
    }
}
</script> -->