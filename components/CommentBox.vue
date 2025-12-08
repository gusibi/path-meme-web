<template>
  <div class="mb-6">
    <div v-if="isLoggedIn" class="relative">
      <div class="flex items-start gap-3">
        <img 
          :src="user.user_metadata.avatar_url" 
          :alt="user.user_metadata.full_name" 
          class="w-8 h-8 rounded-full border border-white dark:border-gray-700 shadow-sm flex-shrink-0"
        />
        <div class="flex-1 relative">
          <textarea 
            v-model="commentText" 
            class="w-full pl-4 pr-12 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-path-red focus:ring-path-red shadow-sm resize-none text-sm"
            rows="2"
            placeholder="Write a comment..."
          ></textarea>
          <button 
            @click="submitComment"
            :disabled="!commentText.trim()"
            class="absolute right-3 bottom-3 w-8 h-8 bg-path-red text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-red-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-800">
      <svg class="w-10 h-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      <p class="text-gray-500 dark:text-gray-400 mb-4 text-sm">Sign in with GitHub to comment</p>
      <button 
        @click="login" 
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full text-sm transition-colors shadow-md"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        Sign in with GitHub
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSupabaseUser, useSupabaseClient } from '#imports'
import { useRoute } from 'vue-router'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const route = useRoute()

const commentText = ref('')

const emit = defineEmits(['comment-submitted'])

const isLoggedIn = computed(() => {
  const githubToken = useCookie('github_token').value
  const githubUser = useCookie('github_username').value
  return !!githubToken && !!githubUser && !!user.value
})

const submitComment = async () => {
  if (commentText.value.trim()) {
    try {
      const response = await $fetch('/api/github/create-comment', {
        method: 'POST',
        body: {
          issueNumber: route.params.id,
          repoOwner: route.params.repo_owner,
          repoName: route.params.repo_name,
          commentText: commentText.value
        }
      })
      emit('comment-submitted', response)
      commentText.value = ''
    } catch (error) {
      console.error('Error submitting comment:', error)
    }
  }
}

const login = async () => {
  const cookieName = useRuntimeConfig().public.supabase.cookieName
  useCookie(`${cookieName}-redirect-path`).value = route.fullPath

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/confirm`,
      scopes: 'repo'
    }
  })
  if (error) {
    console.error('Login error:', error)
  }
}
</script>
