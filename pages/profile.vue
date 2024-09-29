<template>
    <div class="container mx-auto px-4 py-8">
        <h2 class="text-2xl font-bold mb-6">User Profile</h2>
        <div v-if="isClient">
            <div v-if="isLoading" class="text-gray-600">Loading ... ({{ loadingDuration }} seconds)</div>
            <template v-else>
                <button @click="handleLogin" v-if="!isAuthenticated" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> Log in </button>
                <pre v-else class="bg-gray-100 p-4 rounded">
            <code>{{ JSON.stringify(user, null, 2) }}</code>
          </pre>
            </template>
            <div class="mt-8 bg-gray-100 p-4 rounded">
                <h3 class="font-bold mb-2">Debug Info:</h3>
                <p>isClient: {{ isClient }}</p>
                <p>isLoading: {{ isLoading }}</p>
                <p>isAuthenticated: {{ isAuthenticated }}</p>
                <p>Error: {{ error }}</p>
                <p>Auth0 Initialized: {{ auth0Initialized }}</p>
                <p>Auth0 Instance Available: {{ !!$auth0 }}</p>
                <p>loginWithRedirect Available: {{ !!$auth0?.loginWithRedirect }}</p>
            </div>
        </div>
        <div v-else class="text-gray-600">Initializing...</div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'

const isClient = ref(false)
const isLoading = ref(true)
const isAuthenticated = ref(false)
const user = ref(null)
const error = ref(null)
const loadingStartTime = ref(0)
const loadingDuration = ref(0)
const auth0Initialized = ref(false)

const { $auth0 } = useNuxtApp()

onMounted(async () => {
    isClient.value = true
    loadingStartTime.value = Date.now()

    try {
        if (!$auth0) {
            throw new Error('Auth0 instance is undefined')
        }

        auth0Initialized.value = true
        const { user: auth0User, isAuthenticated: auth0IsAuthenticated, isLoading: auth0IsLoading } = $auth0

        watch(auth0IsLoading, (newValue) => {
            isLoading.value = newValue
            if (!newValue) {
                loadingDuration.value = (Date.now() - loadingStartTime.value) / 1000
            }
        })

        watch(auth0IsAuthenticated, (newValue) => {
            isAuthenticated.value = newValue
        })

        watch(auth0User, (newValue) => {
            user.value = newValue
        })

        // 立即更新状态
        isLoading.value = auth0IsLoading.value
        isAuthenticated.value = auth0IsAuthenticated.value
        user.value = auth0User.value
    } catch (e) {
        error.value = e.message
        isLoading.value = false
    }
})

const handleLogin = () => {
    console.log('Login button clicked')
    console.log('Auth0 instance:', $auth0)
    console.log('loginWithRedirect method:', $auth0?.loginWithRedirect)

    if ($auth0 && $auth0.loginWithRedirect) {
        $auth0.loginWithRedirect()
    } else {
        console.error('Auth0 instance or loginWithRedirect method is not available')
        error.value = 'Login method not available'
    }
}
</script>