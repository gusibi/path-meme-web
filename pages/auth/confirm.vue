<script setup lang="ts">
import { watch } from 'vue'
import { useSupabaseUser, useSupabaseClient, useCookie } from '#imports'

const user = useSupabaseUser()
const supabase = useSupabaseClient()

const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value

watch(user, async () => {
  if (user.value) {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error

      const providerToken = data.session?.provider_token
      if (providerToken) {
        useCookie('github_token', { maxAge: 60 * 60 * 24 * 7 }).value = providerToken
        localStorage.setItem('github_token', providerToken)
        const githubUsername = user.value.user_metadata.user_name
        useCookie('github_username', { maxAge: 60 * 60 * 24 * 7 }).value = githubUsername
      }
    } catch (error) {
      console.error('Error getting session or setting cookies:', error)
    }

    useCookie(`${cookieName}-redirect-path`).value = null
    navigateTo(redirectPath || '/')
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="text-center">
      <!-- Loading spinner -->
      <div class="w-16 h-16 mx-auto mb-6 relative">
        <div class="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        <div class="absolute inset-0 rounded-full border-4 border-path-red border-t-transparent animate-spin"></div>
      </div>
      <h2 class="text-xl font-medium text-gray-800 dark:text-white mb-2">正在确认登录...</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">请稍候，即将跳转</p>
    </div>
  </div>
</template>
