<template>
  <div v-if="canPublish" class="fixed bottom-8 right-6 z-40">
    <!-- Menu Items - 圆形扩散布局 -->
    <div class="absolute bottom-0 right-0 w-14 h-14">
      <!-- Write Article (上方 270度) -->
      <button 
        @click="openEditor('article')"
        class="fab-item bg-green-500"
        :class="{ 'fab-item-open': isOpen }"
        :style="getItemStyle(0)"
        title="Write Article"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
      </button>

      <!-- Post Text (左上 225度) -->
      <button 
        @click="openEditor('text')"
        class="fab-item bg-blue-500"
        :class="{ 'fab-item-open': isOpen }"
        :style="getItemStyle(1)"
        title="Post Text"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>

      <!-- Write Diary (左侧 180度) -->
      <button 
        @click="openEditor('diary')"
        class="fab-item bg-purple-500"
        :class="{ 'fab-item-open': isOpen }"
        :style="getItemStyle(2)"
        title="Write Diary"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
      </button>
    </div>

    <!-- Main Trigger Button -->
    <button
      @click="toggleMenu"
      class="w-14 h-14 bg-path-red rounded-full shadow-2xl flex items-center justify-center text-white z-50 relative focus:outline-none hover:bg-red-600 transition-all active:scale-95"
      :class="{ 'rotate-45': isOpen }"
    >
      <svg class="w-7 h-7 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path>
      </svg>
    </button>

    <!-- Editor Modal -->
    <PostEditor 
      :is-visible="editorVisible" 
      :type="editorType" 
      @close="closeEditor"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSupabaseUser } from '#imports'

type PostType = 'article' | 'text' | 'diary'

const user = useSupabaseUser()
const isOpen = ref(false)
const editorVisible = ref(false)
const editorType = ref<PostType>('text')
const isAuthorizedPublisher = ref(false)

// 检测是否已登录（参考 CommentBox.vue）
const isLoggedIn = computed(() => {
  const githubToken = useCookie('github_token').value
  const githubUser = useCookie('github_username').value
  return !!githubToken && !!githubUser && !!user.value
})

// 检查用户是否有发布权限
const checkPublishPermission = async () => {
  if (!isLoggedIn.value) {
    isAuthorizedPublisher.value = false
    return
  }
  try {
    const { data } = await useFetch('/api/auth/check-publisher')
    isAuthorizedPublisher.value = data.value?.canPublish ?? false
  } catch (error) {
    console.error('Failed to check publish permission:', error)
    isAuthorizedPublisher.value = false
  }
}

// 监听登录状态变化
watch(isLoggedIn, () => {
  checkPublishPermission()
}, { immediate: true })

// 最终是否可以发布：已登录 + 是授权用户
const canPublish = computed(() => isLoggedIn.value && isAuthorizedPublisher.value)

// 扩散半径
const radius = 80
// 角度配置: 270度(上), 225度(左上), 180度(左)
const angles = [270, 225, 180]

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const openEditor = (type: PostType) => {
  editorType.value = type
  editorVisible.value = true
  isOpen.value = false
}

const closeEditor = () => {
  editorVisible.value = false
}

const handleSave = (data: { title: string | null; body: string; tags: string[] }) => {
  console.log('Post saved:', data)
  // TODO: 实际保存逻辑，可以调用 API 创建 GitHub Issue
}

// 计算每个按钮的位置样式
const getItemStyle = (index: number) => {
  const angle = angles[index] * (Math.PI / 180)
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  
  return {
    '--target-x': `${x}px`,
    '--target-y': `${y}px`,
    '--delay': `${index * 50}ms`
  }
}
</script>

<style scoped>
.fab-item {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.5) translate(0, 0);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transition-delay: var(--delay);
  pointer-events: none;
}

.fab-item:hover {
  filter: brightness(1.1);
}

.fab-item:active {
  transform: scale(0.9) translate(var(--target-x), var(--target-y)) !important;
}

.fab-item-open {
  opacity: 1;
  transform: scale(1) translate(var(--target-x), var(--target-y));
  pointer-events: auto;
}

.rotate-45 {
  transform: rotate(45deg);
}
</style>
