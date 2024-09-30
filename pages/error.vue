<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-4">An Error Occurred</h1>
    <p class="mb-4">{{ error || 'We apologize, but something went wrong.' }}</p>
    <button @click="goHome" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> Go Home </button>
  </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const error = route.query.message || null

const goHome = () => {
  router.push('/')
}
</script>