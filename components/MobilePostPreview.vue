<template>
    <div ref="mobilePreview" class="mobile-preview w-[390px] min-h-[400px] font-sans bg-gradient-to-br from-blue-200 to-purple-300 flex flex-col items-center p-4">
        <div class="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-4">
            <div class="p-6">
                <h2 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{{ post.title || 'No Title' }}</h2>
                <div class="flex justify-between items-center">
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {{ formatDate(post.created_at) }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <PostLabels :labels="post.labels" />
                    </div>
                </div>
                <!-- <div class="prose dark:prose-invert max-w-none" v-html="$md(post.body)" /> -->
                <div class="prose dark:prose-invert max-w-none mb-4" v-html="$md(post.body || 'No Content')"></div>
                <div class="flex justify-between items-center">
                    <!-- <div class="flex flex-wrap gap-2">
                        <PostReactions :reactions="post.reactions" />
                    </div> -->
                    <div class="text-sm text-gray-600 dark:text-gray-400"> 💬 {{ post.comments || 0 }}
                    </div>
                </div>
            </div>
        </div>
        <div class="justify-center pb-6 text-sm text-gray-600 dark:text-gray-400 shadow-md">古思乱讲: https://momo.gusibi.mobi </div>
    </div>
</template>
<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from 'vue'

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
})

const mobilePreview = ref(null)

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

const getContrastColor = (hexcolor: string) => {
    if (!hexcolor) return 'black'
    const r = parseInt(hexcolor.substr(0, 2), 16)
    const g = parseInt(hexcolor.substr(2, 2), 16)
    const b = parseInt(hexcolor.substr(4, 2), 16)
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
    return (yiq >= 128) ? 'black' : 'white'
}

defineExpose({ $el: mobilePreview })
</script>
<style scoped>
.mobile-preview {
    width: 390px;
}
</style>