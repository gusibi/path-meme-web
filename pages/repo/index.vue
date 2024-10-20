<template>
  <div class="container mx-auto px-4 py-8">
    <!-- <h1 class="text-3xl font-bold mb-8 text-center">Repositories</h1> -->
    <div class="columns-1 sm:columns-1 md:columns-2 lg:columns-3 gap-2">
      <div v-for="repo in repos" :key="repo.id" class="break-inside-avoid mb-4">
        <RepoCard :repo="repo" />
      </div>
    </div>
    <!-- 新增的输入框和按钮 -->
    <div class="mt-12">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="p-4">
          <label for="repo-input" class="block text-sm font-medium text-gray-700 mb-2"> Enter Repository (e.g. gusibi/momo) </label>
          <div class="mt-1 flex rounded-md shadow-sm">
            <input type="text" name="repo-input" id="repo-input" v-model="repoInput" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300" placeholder="owner/repo">
            <button @click="navigateToRepo" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"> Go </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBannerContentInjection } from '~/composables/useBannerContent'

const { setBannerContent, setBannerImage, setShowBanner } = useBannerContentInjection()
const repos = ref([])
const router = useRouter()
const repoInput = ref('')

const navigateToRepo = () => {
  const [owner, repo] = repoInput.value.split('/')
  if (owner && repo) {
    router.push(`/repo/${owner}/${repo}`)
  } else {
    alert('Please enter a valid repository in the format "owner/repo"')
  }
}
// 使用 useAsyncData 来获取仓库数据
const { data: reposData } = await useAsyncData('reposData', () =>
  $fetch('/api/repo/list')  // 假设你有一个 API 端点来获取仓库列表
)

// 当数据获取完成后，更新 repos
repos.value = reposData.value.repos || []

// 设置 banner 内容
setBannerContent('<h1 class="text-4xl font-extrabold text-center text-white mb-6">Explore, Learn, and Engage</h1>')
setBannerImage("/repo-banner.jpeg")
setShowBanner(true)
</script>