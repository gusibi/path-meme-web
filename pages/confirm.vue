<template>
    <div class="container mx-auto px-4 py-8">
        <h2 class="text-2xl font-bold mb-6">Authorizing...</h2>
        <p v-if="error" class="text-red-500">{{ error }}</p>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()

const error = ref<string | null>(null)

onMounted(async () => {
    try {
        // 检查当前会话状态
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        if (session) {
            // 用户已认证，重定向到 next 参数指定的页面或个人资料页面
            const next = (route.query.next as string) || '/profile'
            await router.push(next)
        } else {
            // 如果没有会话，可能是因为用户刚刚完成 OAuth 流程
            // 尝试交换会话令牌
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(String(route.query.code))
            if (exchangeError) throw exchangeError

            if (data.session) {
                // 成功获取会话，重定向到 next 参数指定的页面或个人资料页面
                const next = (route.query.next as string) || '/profile'
                await router.push(next)
            } else {
                // 如果仍然没有会话，可能是出现了问题
                throw new Error('Failed to authenticate')
            }
        }
    } catch (e) {
        console.error('Authorization error:', e)
        error.value = e.message || 'An error occurred during authorization'
        // 可以选择在一段时间后重定向到登录页面
        setTimeout(() => {
            router.push('/login')
        }, 3000)
    }
})
</script>