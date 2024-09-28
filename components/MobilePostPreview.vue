<template>
    <div ref="mobilePreview" class="mobile-preview w-[390px] min-h-[400px] font-sans bg-gradient-to-br from-red-200 to-purple-300 flex flex-col items-center p-4">
        <!-- <div class="justify-center text-center p-2 text-2xl text-gray-600 dark:text-gray-400">古思乱讲</div> -->
        <div class="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-4">
            <div class="p-6">
                <h2 v-if="!isMemePost(post.labels)" class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{{ post.title || 'No Title' }}</h2>
                <div class="flex justify-between items-center">
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {{ formatDate(post.created_at) }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <PostLabels :labels="post.labels" />
                    </div>
                </div>
                <div class="prose dark:prose-invert max-w-none mb-4" v-html="$md(post.body || 'No Content')"></div>
                <div class="flex justify-between items-center">
                    <PostReactions :reactions="post.reactions" class="" />
                    <CommentButton :post-number="post.number" :comment-count="post.comments || 0" />
                </div>
            </div>
        </div>
        <div class="flex flex-col items-center p-2">
            <QRCode :value="postUrl" :size="60" level="M" render-as="svg" :margin="0" class="rounded-md overflow-hidden" />
        </div>
        <div class="justify-center text-center text-xs text-slate-400 dark:text-gray-400">古思乱讲：{{ postUrl }} </div>
    </div>
</template>
<script setup lang="ts">
import { defineProps, ref, onMounted, watch, computed } from 'vue'
import QRCode from 'qrcode.vue'
import { useRuntimeConfig } from '#app'
const config = useRuntimeConfig()

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
})

const mobilePreview = ref(null)

const postUrl = computed(() => {
    return `${config.public.siteUrl}/blog/${props.post.number}`
})

const isMemePost = (labels: Array<{ name: string }>): boolean => {
    return labels.some(label => label.name.toLowerCase() === 'meme')
}

onMounted(() => {
    console.log('MobilePostPreview mounted, post data:', props.post)
})

watch(() => props.post, (newValue) => {
    console.log('Post data changed:', newValue)
}, { deep: true })

const formatDate = (dateString: string) => {
    if (!dateString) return 'No Date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

defineExpose({ mobilePreview })
</script>
<style scoped>
.mobile-preview {
    width: 390px;
}
</style>