<template>
    <div class="container mx-auto px-4 py-8">
        <h2 class="text-2xl font-bold mb-6">User Profile</h2>
        <div v-if="user">
            <div v-if="loading" class="text-gray-600">Loading...</div>
            <div v-else class="bg-white shadow-md rounded-lg p-6">
                <div class="flex items-center mb-4">
                    <img :src="user.user_metadata.avatar_url" :alt="user.user_metadata.name" class="w-20 h-20 rounded-full mr-4">
                    <div>
                        <h3 class="text-xl font-semibold">{{ user.user_metadata.name }}</h3>
                        <!-- <p class="text-gray-600">{{ user.email }}</p> -->
                    </div>
                </div>
                <div class="mb-4">
                    <h4 class="text-lg font-semibold mb-2">About</h4>
                    <p class="text-gray-700">{{ user.user_metadata.full_name }}</p>
                </div>
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <h4 class="text-sm font-semibold text-gray-600">Registered</h4>
                        <p>{{ formatDate(user.created_at) }}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold text-gray-600">Last Login</h4>
                        <p>{{ formatDate(user.last_sign_in_at) }}</p>
                    </div>
                </div>
                <button @click="handleLogout" class="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"> Log out </button>
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

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>