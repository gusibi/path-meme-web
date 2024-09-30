<template>
  <div class="mb-6">
    <div v-if="user" class="flex items-start space-x-4">
      <img :src="user.user_metadata.avatar_url" :alt="user.user_metadata.full_name" class="w-10 h-10 rounded-full">
      <div class="flex-grow">
        <p class="font-semibold text-gray-700 dark:text-gray-300">{{ user.user_metadata.full_name }}</p>
        <textarea v-model="commentText" class="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows="3" placeholder="Write your comment here..."></textarea>
        <button @click="submitComment" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"> Submit Comment </button>
      </div>
    </div>
    <div v-else class="relative">
      <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
        <p class="text-gray-500 dark:text-gray-400">Login to comment</p>
      </div>
      <button @click="login" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"> Login with GitHub to Comment </button>
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

const emit = defineEmits(['comment-submitted'])

const submitComment = () => {
  if (commentText.value.trim()) {
    emit('comment-submitted', commentText.value)
    commentText.value = '' // Clear the input after submission
  }
}

const login = async () => {
  // 保存当前路径到 cookie
  const cookieName = useRuntimeConfig().public.supabase.cookieName
  console.log("cookieName", cookieName)
  useCookie(`${cookieName}-redirect-path`).value = route.fullPath

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/confirm`
    }
  })
  if (error) {
    console.error('Login error:', error)
  }
}
</script>