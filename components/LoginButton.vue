<template>
  <button @click="login" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> Login </button>
</template>
<script setup>
import { useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()

const login = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/confirm`
    }
  })
  if (error) {
    console.error('Login error:', error)
  }
}
</script>