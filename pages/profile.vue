<template>
    <div class="container mx-auto px-4 py-8">
        <h2 class="text-2xl font-bold mb-6">User Profile</h2>
        <div v-if="user">
            <div v-if="loading" class="text-gray-600">Loading...</div>
            <div v-else>
                <pre class="bg-gray-100 p-4 rounded">
            <code>{{ JSON.stringify(user, null, 2) }}</code>
          </pre>
                <button @click="handleLogout" class="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"> Log out </button>
            </div>
        </div>
        <div v-else class="text-gray-600">Please log in to view your profile.</div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseUser, useSupabaseClient } from '#imports'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const loading = ref(true)

onMounted(async () => {
    loading.value = true
    try {
        const { data, error } = await supabase.from('profiles').select('*').single()
        if (error) throw error
        if (data) {
            // Merge profile data with user data
            Object.assign(user.value, data)
        }
    } catch (error) {
        console.error('Error fetching profile:', error)
    } finally {
        loading.value = false
    }
})

const handleLogout = async () => {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        // Redirect to home page after logout
        navigateTo('/')
    } catch (error) {
        console.error('Error during logout:', error)
    }
}
</script>