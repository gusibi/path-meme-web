<template>
  <div>
    <!-- <NuxtRouteAnnouncer />
    <NuxtWelcome /> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useNuxtApp } from '#app'

onMounted(() => {
  const { $auth0 } = useNuxtApp()
  console.log('Auth0 instance in app.vue:', $auth0)
})
</script>