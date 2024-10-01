<script setup lang="ts">
import { watch } from 'vue'
import { useSupabaseUser, useSupabaseClient, useCookie } from '#imports'

const user = useSupabaseUser()
const supabase = useSupabaseClient()

const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value

watch(user, async () => {
    if (user.value) {
        try {
            const { data, error } = await supabase.auth.getSession()
            if (error) throw error

            const providerToken = data.session?.provider_token
            if (providerToken) {
                // 将 token 存储在 cookie 中
                useCookie('github_token', { maxAge: 60 * 60 * 24 * 7 }).value = providerToken

                // 将 token 存储在 localStorage 中
                localStorage.setItem('github_token', providerToken)

                // 从用户元数据中获取 GitHub 用户名
                const githubUsername = user.value.user_metadata.user_name

                // 将 GitHub 用户名存储在 cookie 中
                useCookie('github_username', { maxAge: 60 * 60 * 24 * 7 }).value = githubUsername

                // 不需要更新 Supabase 用户元数据，因为它已经包含了 GitHub 用户名
            }
        } catch (error) {
            console.error('Error getting session or setting cookies:', error)
        }

        // 清除重定向 cookie 并重定向
        useCookie(`${cookieName}-redirect-path`).value = null
        navigateTo(redirectPath || '/')
    }
}, { immediate: true })
</script>
<template>
    <div>Confirming login...</div>
</template>