<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-2xl font-bold mb-6">Login</h2>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
      <p>{{ error }}</p>
    </div>
    <div class="space-y-4">
      <button @click="handleGitHubLogin" class="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd" />
        </svg> Login with GitHub </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabaseUser, useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()
const router = useRouter()
const error = ref<string | null>(null)
const user = useSupabaseUser()

const handleGitHubLogin = async () => {
  try {
    error.value = null
    const { data, error: loginError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/confirm`
      }
    })
    if (loginError) throw loginError
  } catch (e) {
    console.error('Login error:', e)
    error.value = e.message || 'An error occurred during login'
  }
}

onMounted(() => {
  // 如果用户已登录，重定向到主页
  if (user.value) {
    router.push('/')
  }
})
</script>
