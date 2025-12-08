<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseUser, useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()
const router = useRouter()
const error = ref<string | null>(null)
const loading = ref(false)
const user = useSupabaseUser()

const handleGitHubLogin = async () => {
  try {
    loading.value = true
    error.value = null
    const { data, error: loginError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/confirm`
      }
    })
    if (loginError) throw loginError
  } catch (e: any) {
    console.error('Login error:', e)
    error.value = e.message || '登录时发生错误'
    loading.value = false
  }
}

onMounted(() => {
  watch(user, (newUser) => {
    if (newUser) {
      router.push('/')
    }
  }, { immediate: true })
})
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 mx-auto bg-gradient-to-br from-path-red to-[#D91E18] rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <span class="text-white text-4xl font-bold italic font-serif">P</span>
        </div>
        <h1 class="text-2xl font-serif font-bold text-gray-800 dark:text-white">登录 Path Meme</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">使用 GitHub 账号登录</p>
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

      <!-- Login button -->
      <button 
        @click="handleGitHubLogin" 
        :disabled="loading"
        class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg v-if="!loading" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <div v-else class="w-6 h-6 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin"></div>
        <span>{{ loading ? '正在跳转...' : '使用 GitHub 登录' }}</span>
      </button>

      <!-- Footer -->
      <p class="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
        登录即表示您同意我们的服务条款
      </p>
    </div>
  </div>
</template>
