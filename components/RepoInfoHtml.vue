<template>
  <div class="w-full pt-16">
    <!-- Labels row -->
    <div class="flex items-center justify-center relative">
      <button @click="scrollLabels('left')" class="absolute left-0 bg-white dark:bg-gray-800 bg-opacity-75 p-1 rounded-full shadow-md z-10" v-show="showLeftArrow">
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
        </svg>
      </button>
      <div class="overflow-hidden mx-8" style="max-width: calc(100% - 4rem);">
        <div class="flex space-x-2 overflow-x-auto scrollbar-hide" ref="labelContainer" @scroll="checkArrows">
          <NuxtLink v-for="label in repo.labels" :key="label.name" :to="`/repo/${repo.owner_name}/${repo.name}/tag/${encodeURIComponent(label.name)}`" class="text-l rounded-full px-3 py-1 whitespace-nowrap cursor-pointer transition-opacity hover:opacity-80" :style="{ backgroundColor: `#${label.color}`, color: getContrastColor(label.color) }">
            {{ label.name }}
          </NuxtLink>
        </div>
      </div>
      <button @click="scrollLabels('right')" class="absolute right-0 bg-white dark:bg-gray-800 bg-opacity-75 p-1 rounded-full shadow-md z-10" v-show="showRightArrow">
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <!-- Repo name -->
    <h2 class="text-4xl pt-8 text-center font-bold mb-2">
      <a :href="repo.repo_url" class="hover:underline">
        {{ repoOwner }}/{{ repoName }} </a>
    </h2>
    <!-- Stars and Issues count -->
    <div class="flex items-center justify-center space-x-4 text-m text-gray-600 py-2 dark:text-gray-400 mb-2">
      <span class="flex items-center">
        <svg class="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ repo.stars }} stars </span>
      <span class="flex items-center">
        <svg class="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 8V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ repo.issues }} issues </span>
    </div>
    <!-- Repo description -->
    <div class="flex items-center justify-center space-x-4 text-m text-gray-600 py-2 dark:text-gray-400 mb-2">
      <p class="justify-center text-gray-600 text-m pb-4 dark:text-gray-300">{{ repo.description }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { NuxtLink } from '#components'
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  repo: {
    type: Object,
    required: true
  },
  repoOwner: {
    type: String,
    required: true
  },
  repoName: {
    type: String,
    required: true
  }
})


const getContrastColor = (hexColor: string) => {
  // 将十六进制颜色转换为RGB
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);

  // 计算亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // 如果亮度大于 128，返回黑色，否则返回白色
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

const labelContainer = ref(null)
const showLeftArrow = ref(false)
const showRightArrow = ref(false)

const checkArrows = () => {
  if (labelContainer.value) {
    showLeftArrow.value = labelContainer.value.scrollLeft > 0
    showRightArrow.value = labelContainer.value.scrollWidth > labelContainer.value.clientWidth &&
      labelContainer.value.scrollLeft < labelContainer.value.scrollWidth - labelContainer.value.clientWidth
  }
}

const scrollLabels = (direction: 'left' | 'right') => {
  if (labelContainer.value) {
    const scrollAmount = labelContainer.value.clientWidth / 2
    labelContainer.value.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
    nextTick(() => {
      checkArrows()
    })
  }
}

onMounted(() => {
  nextTick(() => {
    checkArrows()
  })
  window.addEventListener('resize', checkArrows)
})

watch(() => props.repo, () => {
  nextTick(() => {
    checkArrows()
  })
})

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener('resize', checkArrows)
})
</script>
<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>