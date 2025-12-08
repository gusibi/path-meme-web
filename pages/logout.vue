<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useRouter } from 'vue-router'

const supabase = useSupabaseClient()
const router = useRouter()
const user = useSupabaseUser()
const loading = ref(false)
const error = ref<string | null>(null)

const handleLogout = async () => {
  try {
    loading.value = true
    error.value = null
    
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) throw signOutError
    
    // 删除 GitHub 相关的 cookie
    useCookie('github_token').value = null
    useCookie('github_username').value = null
    
    // 清除 localStorage
    localStorage.removeItem('github_token')
    
    await router.push('/')
  } catch (e: any) {
    console.error('Error signing out:', e.message)
    error.value = e.message || '退出登录时发生错误'
    loading.value = false
  }
}

// 如果用户未登录，直接跳转首页
onMounted(() => {
  if (!user.value) {
    router.push('/')
  }
})
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <!-- User info -->
      <div class="text-center mb-8">
        <img 
          v-if="user?.user_metadata?.avatar_url"
          :src="user.user_metadata.avatar_url" 
          :alt="user.user_metadata.user_name"
          class="w-20 h-20 mx-auto rounded-full border-4 border-gray-200 dark:border-gray-700 mb-4"
        />
        <div v-else class="w-20 h-20 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h1 class="text-xl font-medium text-gray-800 dark:text-white">
          {{ user?.user_metadata?.user_name || '用户' }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ user?.email }}</p>
      </div>

      <!-- Error message -->
      <div 
        v-if="error" 
        class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
      >
        <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-sm">{{ error }}</p>
        </div>
      </div>

      <!-- Logout confirmation -->
      <div class="bg-white dark:bg-path-cardDark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 class="text-lg font-medium text-gray-800 dark:text-white mb-2">确认退出登录？</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">退出后需要重新登录才能发布内容</p>
        
        <div class="flex gap-3">
          <NuxtLink 
            to="/"
            class="flex-1 px-4 py-3 text-center text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            取消
          </NuxtLink>
          <button 
            @click="handleLogout"
            :disabled="loading"
            class="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <div v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{{ loading ? '退出中...' : '退出登录' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
