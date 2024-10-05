<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-center">Repositories</h1>
    <div class="columns-1 sm:columns-1 md:columns-2 lg:columns-3 gap-2">
      <div v-for="repo in repos" :key="repo.id" class="break-inside-avoid mb-4">
        <RepoCard :repo="repo" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useBannerContentInjection } from '~/composables/useBannerContent'
const { setBannerContent, setBannerImage } = useBannerContentInjection()
const repos = ref([])

// 使用 useAsyncData 来获取仓库数据
const { data: reposData } = await useAsyncData('reposData', () =>
  $fetch('/api/repo/list')  // 假设你有一个 API 端点来获取仓库列表
)

// 当数据获取完成后，更新 repos
repos.value = reposData.value.repos || []

// 设置 banner 内容
setBannerContent('<h1 class="text-4xl font-extrabold text-center text-white mb-6">My Repositories</h1>')
setBannerImage("/repo-banner.jpeg")
</script>