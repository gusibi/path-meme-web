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
// import { onMounted } from 'vue'
// import { useSupabaseClient, useSupabaseUser } from '#imports'

// const supabase = useSupabaseClient()
// const user = useSupabaseUser()

onMounted(async () => {
  // console.log('Supabase client:', supabase)
  // console.log('Initial user state:', user.value)

  // const { data, error } = await supabase.auth.getSession()
  // console.log('Session data:', data)
  // console.log('Session error:', error)
})
</script>