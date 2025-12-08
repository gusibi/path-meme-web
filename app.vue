<template>
  <div>
    <!-- PWA 更新提示 -->
    <PwaUpdatePrompt />
    <!-- 离线状态指示器 -->
    <OfflineIndicator />
    <!-- <NuxtRouteAnnouncer />
    <NuxtWelcome /> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- PWA 安装提示 -->
    <PwaInstallPrompt />
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