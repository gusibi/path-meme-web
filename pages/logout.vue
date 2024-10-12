<template>
    <div>
        <!-- 其他内容 -->
        <button @click="handleLogout" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"> Logout </button>
    </div>
</template>
<script setup>
import { useSupabaseClient } from '#imports'
import { useRouter } from 'vue-router'

const supabase = useSupabaseClient()
const router = useRouter()

const handleLogout = async () => {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        //  删除 GitHub 相关的 cookie
        const githubTokenCookie = useCookie('github_token')
        const githubUsernameCookie = useCookie('github_username')

        githubTokenCookie.value = null
        githubUsernameCookie.value = null

        // 登出成功后重定向到首页或登录页
        await router.push('/')
    } catch (error) {
        console.error('Error signing out:', error.message)
        // 可以在这里添加错误处理逻辑，比如显示一个错误消息给用户
    }
}
</script>