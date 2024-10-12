<template>
  <div class="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 ">
    <div v-if="isLoggedIn.value" class="p-3">
      <div class="flex items-start space-x-3">
        <img :src="user.user_metadata.avatar_url" :alt="user.user_metadata.full_name" class="w-8 h-8 rounded-full">
        <div class="flex-grow">
          <textarea v-model="commentText" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" rows="3" placeholder="Leave a comment"></textarea>
          <div class="flex justify-end mt-2">
            <button @click="submitComment" class="px-4 py-2 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white font-medium rounded-md text-sm transition duration-300 ease-in-out"> Comment </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="p-3 bg-gray-50 dark:bg-gray-800 text-center">
      <p class="text-gray-600 dark:text-gray-400 mb-2 text-sm">Sign in to comment</p>
      <button @click="login" class="px-4 py-2 bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 text-white font-medium rounded-md text-sm transition duration-300 ease-in-out"> Sign in With Github </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useSupabaseUser, useSupabaseClient } from '#imports'
import { useRoute } from 'vue-router'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const route = useRoute()

const commentText = ref('')
const isLoggedIn = ref(false)

const emit = defineEmits(['comment-submitted'])

// 新增：检查登录状态的函数
const checkLoginStatus = () => {
  const githubToken = useCookie('github_token').value
  const githubUser = useCookie('github_username').value
  isLoggedIn.value = !!githubToken && !!githubUser
}

// console.log("user: ", user, "is_login", isLoggedIn.value, "<<<")

// 在组件挂载时检查登录状态
onMounted(() => {
  checkLoginStatus()
})


const submitComment = async () => {
  if (commentText.value.trim()) {
    try {
      const response = await $fetch('/api/github/create-comment', {
        method: 'POST',
        body: {
          issueNumber: route.params.id,
          commentText: commentText.value
        }
      })
      console.log(response)
      emit('comment-submitted', response) // 发出包含新评论数据的事件
      commentText.value = '' // 清空输入框
    } catch (error) {
      console.error('Error submitting comment:', error)
      // 处理错误，可能需要显示错误消息给用户
    }
  }
}

const login = async () => {
  // 保存当前路径到 cookie
  const cookieName = useRuntimeConfig().public.supabase.cookieName
  useCookie(`${cookieName}-redirect-path`).value = route.fullPath

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/confirm`,
      scopes: "public_repo"
    }
  })
  if (error) {
    console.error('Login error:', error)
  }
}
</script>