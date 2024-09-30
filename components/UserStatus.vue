<template>
  <div>
    <p v-if="user">Welcome, {{ user.user_metadata.full_name }}</p>
    <button v-if="user" @click="logout">Logout</button>
    <LoginButton v-else />
  </div>
</template>
<script setup>
import { useSupabaseUser } from '#imports'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Error:', error.message)
  }
}
</script>